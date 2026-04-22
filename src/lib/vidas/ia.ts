import type { Carta, EstadoJugador, MundoId, TipoRelacion } from "./types";
import { buscarMundo, buscarRol, nivelPoderDesdeNumero } from "./mundos";

export const MODELO_IA = "claude-haiku-4-5-20251001";

export function iaConfigurada(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim());
}

type ContextoGeneracion = {
  mundo: MundoId;
  jugador: EstadoJugador;
  otroJugador?: EstadoJugador | null;
  tipoRelacion?: TipoRelacion | null;
  vinculo?: number;
};

function armarPrompt(ctx: ContextoGeneracion): string {
  const mundoDef = buscarMundo(ctx.mundo);
  const rolDef = buscarRol(ctx.mundo, ctx.jugador.rol);
  const nivel = nivelPoderDesdeNumero(ctx.jugador.stats.nivelPoder);
  const ultimas = ctx.jugador.historial.slice(-3);
  const contextoPareja =
    ctx.otroJugador && ctx.tipoRelacion
      ? `\nTU COMPAÑERO/A (relación: ${ctx.tipoRelacion}): ${ctx.otroJugador.nombre}, ${buscarRol(ctx.otroJugador.mundo, ctx.otroJugador.rol)?.nombre ?? ctx.otroJugador.rol}, ${ctx.otroJugador.edad} años. Vínculo actual: ${ctx.vinculo ?? 50}/100.`
      : "";
  const poderTexto =
    ctx.mundo === "poderes"
      ? `\nPODER: ${rolDef?.nombre ?? ctx.jugador.rol} · nivel ${nivel} (${ctx.jugador.stats.nivelPoder}/100)${ctx.jugador.poderSubtipo ? ` · subtipo: ${ctx.jugador.poderSubtipo}` : ""}. Las opciones que usen el poder deben respetar el nivel (torpes si Latente, precisas si Maestro).`
      : "";
  const historialTexto =
    ultimas.length > 0
      ? ultimas
          .map(
            (h) =>
              `- A los ${h.edad}: "${h.tituloCarta}" → eligió: ${h.opcionTexto}. (${h.consecuenciaTexto})`,
          )
          .join("\n")
      : "Sin decisiones previas.";

  return `Sos un generador de situaciones narrativas para un juego de vida tipo RPG. Devolvés SOLO JSON válido, sin markdown ni explicaciones.

MUNDO: ${mundoDef?.nombre ?? ctx.mundo} (${mundoDef?.tono ?? ""}).
ROL: ${rolDef?.nombre ?? ctx.jugador.rol} — ${rolDef?.descripcion ?? ""}
PERSONAJE: ${ctx.jugador.nombre}, ${ctx.jugador.edad} años (etapa: ${ctx.jugador.etapa}), rango: ${ctx.jugador.rango}.
STATS: karma ${ctx.jugador.stats.karma}/+-100, influencia ${ctx.jugador.stats.influencia}/100, riqueza ${ctx.jugador.stats.riqueza}/100, salud ${ctx.jugador.stats.salud}/100.${poderTexto}${contextoPareja}

ÚLTIMAS DECISIONES:
${historialTexto}

REGLAS CRÍTICAS:
1. Mundo "medieval": sin mención de magia, brujería, hechizos, conjuros, alquimia mágica, pergaminos encantados. Solo tecnología medieval real.
2. Mundo "actual": presente realista, sin poderes ni elementos fantásticos.
3. Mundo "poderes": los poderes son biológicos/tecnológicos/entrenamiento, NUNCA magia.
4. Tono coherente con el mundo. Argentinismo neutro en español. Sin emojis en los textos.
5. 4 opciones morales grises con trade-offs reales. Nada obviamente bueno/malo.
6. Consecuencias narrativas de 1-2 oraciones, con peso emocional.

FORMATO JSON ESTRICTO (sin envoltorio, sin markdown):
{
  "titulo": "string corta (max 60 chars)",
  "descripcion": "2-4 oraciones narrativas",
  "icono": "un emoji",
  "tags": ["array", "de", "1-3", "tags"],
  "opciones": [
    {
      "texto": "lo que hace el personaje",
      "efectos": { "karma": 0, "influencia": 0, "riqueza": 0, "salud": 0, "nivelPoder": 0, "vinculo": 0 },
      "consecuenciaTexto": "1-2 oraciones de consecuencia"
    },
    ... 3 más
  ]
}

Los efectos son deltas; enteros entre -25 y +25 típicamente. Los que no aplican pueden ser 0 o omitidos. Devolvé SOLO el JSON.`;
}

type RespuestaIA = {
  titulo: string;
  descripcion: string;
  icono: string;
  tags?: string[];
  opciones: {
    texto: string;
    efectos: Record<string, number>;
    consecuenciaTexto: string;
  }[];
};

export async function generarCartaConIA(ctx: ContextoGeneracion): Promise<Carta | { error: string }> {
  if (!iaConfigurada()) {
    return { error: "API key de IA no configurada" };
  }
  const prompt = armarPrompt(ctx);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODELO_IA,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return { error: `IA falló (${r.status}): ${txt.slice(0, 200)}` };
    }
    const body = await r.json();
    const contenido = body?.content?.[0]?.text as string | undefined;
    if (!contenido) return { error: "IA no devolvió contenido" };

    let parsed: RespuestaIA;
    try {
      const jsonTxt = contenido.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      parsed = JSON.parse(jsonTxt);
    } catch {
      return { error: "IA devolvió JSON inválido" };
    }
    if (!parsed.opciones || !Array.isArray(parsed.opciones) || parsed.opciones.length !== 4) {
      return { error: "IA devolvió número incorrecto de opciones" };
    }

    const carta: Carta = {
      id: `ia-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      mundo: ctx.mundo,
      rolesRelevantes: [],
      titulo: String(parsed.titulo ?? "Sin título").slice(0, 80),
      descripcion: String(parsed.descripcion ?? "").slice(0, 600),
      icono: String(parsed.icono ?? "🎴").slice(0, 4),
      tags: Array.isArray(parsed.tags) ? (parsed.tags.slice(0, 3) as Carta["tags"]) : ["dramatica"],
      opciones: parsed.opciones.slice(0, 4).map((op) => {
        const efc = op.efectos ?? {};
        return {
          texto: String(op.texto ?? "Continuar").slice(0, 200),
          efectos: {
            karma: clamp(Number(efc.karma) || 0, -30, 30),
            influencia: clamp(Number(efc.influencia) || 0, -30, 30),
            riqueza: clamp(Number(efc.riqueza) || 0, -30, 30),
            salud: clamp(Number(efc.salud) || 0, -30, 30),
            nivelPoder: ctx.mundo === "poderes" ? clamp(Number(efc.nivelPoder) || 0, -20, 20) : 0,
            vinculo: ctx.tipoRelacion ? clamp(Number(efc.vinculo) || 0, -20, 20) : 0,
          },
          consecuenciaTexto: String(op.consecuenciaTexto ?? "").slice(0, 400),
        };
      }),
    };
    return carta;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error IA" };
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
