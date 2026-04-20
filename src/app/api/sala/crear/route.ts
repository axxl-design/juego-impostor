import { NextResponse } from "next/server";
import { crearSala, vistaPublica } from "@/lib/sala-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const nombre = (body.nombre as string | undefined) ?? "";
  if (!nombre.trim()) {
    return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
  }
  const { sala, jugadorId } = crearSala(nombre);
  return NextResponse.json({
    codigo: sala.codigo,
    jugadorId,
    sala: vistaPublica(sala),
  });
}
