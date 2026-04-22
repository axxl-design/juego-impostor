import { NextResponse } from "next/server";
import { obtenerSala, vistaPublica } from "@/lib/sala-store-impostor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await ctx.params;
  const sala = await obtenerSala(codigo);
  if (!sala) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  return NextResponse.json({ sala: vistaPublica(sala) });
}
