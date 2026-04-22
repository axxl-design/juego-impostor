import { NextResponse } from "next/server";
import { guardarTrasAccion, obtenerSala, vistaPublica } from "@/lib/sala-store-vidas";
import { normalizarCodigo } from "@/lib/sala-storage";
import { generarCartaConIA, iaConfigurada } from "@/lib/vidas/ia";
import { broadcast } from "@/lib/pusher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_GENERACIONES = 5;

export async function POST(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const body = await req.json().catch(() => ({}));
  const jugadorId = body.jugadorId as string | undefined;
  if (!jugadorId) return NextResponse.json({ error: "Falta jugadorId" }, { status: 400 });

  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  if (sala.fase !== "juego") return NextResponse.json({ error: "No es momento" }, { status: 400 });
  if (sala.turnoDe !== jugadorId) return NextResponse.json({ error: "No es tu turno" }, { status: 400 });
  if (sala.usosIAGeneracion >= MAX_GENERACIONES)
    return NextResponse.json({ error: "Ya usaste todas las generaciones" }, { status: 400 });
  if (!iaConfigurada()) {
    return NextResponse.json(
      { error: "Modo offline activo — el admin tiene que configurar ANTHROPIC_API_KEY" },
      { status: 503 },
    );
  }

  const jugador = sala.jugadores.find((j) => j.id === jugadorId);
  if (!jugador) return NextResponse.json({ error: "Jugador inválido" }, { status: 400 });
  const otro = sala.jugadores.find((j) => j.id !== jugadorId) ?? null;

  const resultado = await generarCartaConIA({
    mundo: sala.mundo ?? "medieval",
    jugador,
    otroJugador: otro,
    tipoRelacion: sala.tipoRelacion,
    vinculo: sala.vinculo,
  });

  if ("error" in resultado) {
    return NextResponse.json({ error: resultado.error }, { status: 502 });
  }

  sala.cartaActualId = resultado.id;
  sala.cartaActualExtra = resultado;
  sala.usosIAGeneracion += 1;
  await guardarTrasAccion(sala);
  const publica = vistaPublica(sala);
  await broadcast(`vidas-${codigo}`, "estado-actualizado", publica);

  return NextResponse.json({ carta: resultado, sala: publica });
}
