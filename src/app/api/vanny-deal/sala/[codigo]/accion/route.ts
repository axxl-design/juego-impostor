import { NextResponse } from "next/server";
import {
  aplicarAccionCliente,
  obtenerSala,
  vistaPublica,
} from "@/lib/sala-store-vanny-deal";
import { normalizarCodigo } from "@/lib/sala-storage";
import type { AccionCliente } from "@/lib/sala-store-vanny-deal";
import { broadcast } from "@/lib/pusher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const body = await req.json().catch(() => ({}));
  const actionId = typeof body.actionId === "string" ? body.actionId : "";
  const accion = body.accion as AccionCliente | undefined;
  if (!accion) return NextResponse.json({ error: "Falta acción" }, { status: 400 });

  const r = await aplicarAccionCliente(codigo, actionId, accion);
  if (!r.ok) return NextResponse.json({ error: r.error ?? "Error" }, { status: 400 });

  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ error: "Sala perdida" }, { status: 500 });

  // Broadcast + evento específico por tipo
  const canal = `vanny-deal-${codigo}`;
  const eventoPorTipo: Record<string, string> = {
    unirse: "deal:jugador-entra",
    salir: "deal:jugador-sale",
    iniciarPartida: "deal:partida-empieza",
    jugarPropiedad: "deal:carta-jugada",
    jugarDinero: "deal:carta-jugada",
    jugarAccion: "deal:carta-especial-usada",
    moverComodin: "deal:propiedad-movida",
    usarNoGracias: "deal:no-gracias-ofrecida",
    pasarNoGracias: "deal:cambio",
    pagar: "deal:pago-completado",
    pagarConNada: "deal:pago-completado",
    votarJuicio: "deal:voto-emitido",
    cerrarEspionaje: "deal:cambio",
    terminarTurno: "deal:turno-cambia",
    jugarOtraVez: "deal:partida-empieza",
    volverALobby: "deal:cambio",
    configurar: "deal:cambio",
    tocar: "deal:cambio",
  };
  const evento = eventoPorTipo[accion.tipo] ?? "deal:cambio";
  try {
    await broadcast(canal, evento, { sala: vistaPublica(sala), ts: Date.now() });
    if (sala.ganador) {
      await broadcast(canal, "deal:partida-termina", { sala: vistaPublica(sala), ts: Date.now() });
    }
  } catch (e) {
    console.error("[vanny-deal broadcast]", e);
  }

  return NextResponse.json({
    ok: true,
    datos: r.datos ?? null,
    sala: vistaPublica(sala),
  });
}
