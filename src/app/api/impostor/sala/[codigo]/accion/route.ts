import { NextResponse } from "next/server";
import {
  configurar,
  forzarCierre,
  impostorAdivina,
  iniciar,
  nuevaRonda,
  obtenerSala,
  pasarAVotacion,
  salir,
  unirse,
  vistaPublica,
  votar,
} from "@/lib/sala-store-impostor";
import { normalizarCodigo } from "@/lib/sala-storage";
import { broadcast } from "@/lib/pusher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Accion =
  | { tipo: "unirse"; nombre: string }
  | { tipo: "salir"; jugadorId: string }
  | { tipo: "configurar"; jugadorId: string; config: Record<string, unknown> }
  | { tipo: "iniciar"; jugadorId: string }
  | { tipo: "pasarVotacion"; jugadorId: string }
  | { tipo: "votar"; jugadorId: string; votadoId: string }
  | { tipo: "cerrarVotacion"; jugadorId: string }
  | { tipo: "impostorAdivina"; jugadorId: string; intento: string }
  | { tipo: "nuevaRonda"; jugadorId: string };

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
      break;
    }
    case "pasarVotacion":
      await pasarAVotacion(codigo, body.jugadorId);
      break;
    case "votar":
      await votar(codigo, body.jugadorId, body.votadoId);
      break;
    case "cerrarVotacion":
      await forzarCierre(codigo, body.jugadorId);
      break;
    case "impostorAdivina": {
      const r = await impostorAdivina(codigo, body.jugadorId, body.intento);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      extra = { acerto: r.acerto };
      break;
    }
    case "nuevaRonda": {
      const r = await nuevaRonda(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    default:
      return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  }

  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ ok: true, ...extra });
  const publica = vistaPublica(sala);
  await broadcast(`impostor-${codigo}`, "estado-actualizado", publica);
  return NextResponse.json({ sala: publica, ...extra });
}
