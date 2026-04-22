import { NextResponse } from "next/server";
import { obtenerSala, vistaPublica } from "@/lib/sala-store-quien-soy";
import { normalizarCodigo } from "@/lib/sala-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const sala = await obtenerSala(codigo);
  if (!sala) {
    console.log(`[api/quien-soy/sala GET] 404 codigoRaw="${codigoRaw}" normalizado="${codigo}"`);
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ sala: vistaPublica(sala) });
}
