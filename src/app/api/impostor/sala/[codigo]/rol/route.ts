import { NextResponse } from "next/server";
import { obtenerSala, vistaPrivada } from "@/lib/sala-store-impostor";
import { normalizarCodigo } from "@/lib/sala-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const url = new URL(req.url);
  const jugadorId = url.searchParams.get("jugadorId");
  if (!jugadorId) return NextResponse.json({ error: "Falta jugadorId" }, { status: 400 });
  const sala = await obtenerSala(codigo);
  if (!sala) {
    console.log(`[api/impostor/sala/rol GET] 404 codigoRaw="${codigoRaw}" normalizado="${codigo}"`);
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }
  if (!sala.jugadores.some((j) => j.id === jugadorId)) {
    return NextResponse.json({ error: "Jugador no está en la sala" }, { status: 403 });
  }
  return NextResponse.json({ rol: vistaPrivada(sala, jugadorId) });
}
