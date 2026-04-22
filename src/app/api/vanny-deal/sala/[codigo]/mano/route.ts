import { NextResponse } from "next/server";
import { obtenerSala, vistaPrivada } from "@/lib/sala-store-vanny-deal";
import { normalizarCodigo } from "@/lib/sala-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const url = new URL(req.url);
  const jugadorId = url.searchParams.get("jugadorId") ?? "";
  if (!jugadorId) return NextResponse.json({ error: "Falta jugadorId" }, { status: 400 });
  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  return NextResponse.json({ mano: vistaPrivada(sala, jugadorId) });
}
