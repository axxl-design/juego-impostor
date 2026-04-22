import { NextResponse } from "next/server";
import {
  adivinar,
  configurar,
  continuarHost,
  iniciar,
  jugarOtraVez,
  marcarPalabraVista,
  obtenerSala,
  salir,
  terminarPartida,
  unirse,
  vistaPublica,
  volverALobby,
} from "@/lib/sala-store-quien-soy";
import { normalizarCodigo } from "@/lib/sala-storage";
import { broadcast } from "@/lib/pusher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Accion =
  | { tipo: "unirse"; nombre: string }
  | { tipo: "salir"; jugadorId: string }
  | { tipo: "configurar"; jugadorId: string; config: Record<string, unknown> }
  | { tipo: "iniciar"; jugadorId: string }
  | { tipo: "marcarVisto"; jugadorId: string }
  | { tipo: "continuar"; jugadorId: string }
  | { tipo: "adivinar"; jugadorId: string; aId: string; intento: string }
  | { tipo: "terminarPartida"; jugadorId: string }
  | { tipo: "jugarOtraVez"; jugadorId: string }
  | { tipo: "volverALobby"; jugadorId: string };

export async function POST(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const body = (await req.json().catch(() => null)) as Accion | null;
  if (!body || !body.tipo) {
    return NextResponse.json({ error: "Falta acción" }, { status: 400 });
  }

  const salaPre = await obtenerSala(codigo);
  if (!salaPre && body.tipo !== "unirse") {
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }

  let extra: Record<string, unknown> = {};
  let palabrasReasignadas = false;

  switch (body.tipo) {
    case "unirse": {
      const r = await unirse(codigo, body.nombre);
      if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
      extra = { jugadorId: r.jugadorId };
      break;
    }
    case "salir":
      await salir(codigo, body.jugadorId);
      break;
    case "configurar":
      await configurar(codigo, body.jugadorId, body.config as never);
      break;
    case "iniciar": {
      const r = await iniciar(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      palabrasReasignadas = true;
      break;
    }
    case "marcarVisto":
      await marcarPalabraVista(codigo, body.jugadorId);
      break;
    case "continuar":
      await continuarHost(codigo, body.jugadorId);
      break;
    case "adivinar": {
      const r = await adivinar(codigo, body.jugadorId, body.aId, body.intento);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      extra = { acerto: r.acerto, fin: r.fin };
      if (r.acerto) palabrasReasignadas = true;
      break;
    }
    case "terminarPartida": {
      const r = await terminarPartida(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "jugarOtraVez": {
      const r = await jugarOtraVez(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      palabrasReasignadas = true;
      break;
    }
    case "volverALobby":
      await volverALobby(codigo, body.jugadorId);
      break;
    default:
      return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  }

  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ ok: true, ...extra });
  const publica = vistaPublica(sala);
  await broadcast(`quien-soy-${codigo}`, "estado-actualizado", publica);
  if (palabrasReasignadas) {
    await broadcast(`quien-soy-${codigo}`, "palabras-asignadas", { ts: Date.now() });
  }
  return NextResponse.json({ sala: publica, ...extra });
}
