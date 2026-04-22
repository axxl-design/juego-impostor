import { NextResponse } from "next/server";
import type { EstadoJugador, MundoId, TipoRelacion } from "@/lib/vidas/types";
import { generarCartaConIA, iaConfigurada } from "@/lib/vidas/ia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  mundo: MundoId;
  jugador: EstadoJugador;
  otroJugador?: EstadoJugador | null;
  tipoRelacion?: TipoRelacion | null;
  vinculo?: number;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || !body.mundo || !body.jugador) {
    return NextResponse.json({ error: "Falta contexto" }, { status: 400 });
  }
  if (!iaConfigurada()) {
    return NextResponse.json(
      { error: "Modo offline activo — configurá ANTHROPIC_API_KEY" },
      { status: 503 },
    );
  }
  const resultado = await generarCartaConIA({
    mundo: body.mundo,
    jugador: body.jugador,
    otroJugador: body.otroJugador ?? null,
    tipoRelacion: body.tipoRelacion ?? null,
    vinculo: body.vinculo,
  });
  if ("error" in resultado) {
    return NextResponse.json({ error: resultado.error }, { status: 502 });
  }
  return NextResponse.json({ carta: resultado });
}
