import type { Carta, MundoId } from "./types";
import { CARTAS_MEDIEVAL } from "./cartas-medieval";
import { CARTAS_ACTUAL } from "./cartas-actual";
import { CARTAS_PODERES } from "./cartas-poderes";
import { CARTAS_PAREJA } from "./cartas-pareja";

export const CARTAS_CORE: Carta[] = [
  ...CARTAS_MEDIEVAL,
  ...CARTAS_ACTUAL,
  ...CARTAS_PODERES,
];

export const CARTAS_EXTRA_PAREJA: Carta[] = [...CARTAS_PAREJA];

export const TODAS_LAS_CARTAS: Carta[] = [...CARTAS_CORE, ...CARTAS_EXTRA_PAREJA];

export function cartasDelMundo(mundo: MundoId): Carta[] {
  return TODAS_LAS_CARTAS.filter((c) => c.mundo === mundo);
}

export function buscarCarta(id: string): Carta | undefined {
  return TODAS_LAS_CARTAS.find((c) => c.id === id);
}

export function contarPorMundoEtapa(mundo: MundoId) {
  const base = cartasDelMundo(mundo);
  const aplica = (etapa: "juventud" | "madurez" | "vejez") =>
    base.filter((c) => {
      const orden = ["juventud", "madurez", "vejez"] as const;
      const idx = orden.indexOf(etapa);
      const minOk = !c.etapaMin || orden.indexOf(c.etapaMin) <= idx;
      const maxOk = !c.etapaMax || orden.indexOf(c.etapaMax) >= idx;
      return minOk && maxOk;
    });
  return {
    total: base.length,
    juventud: aplica("juventud").length,
    madurez: aplica("madurez").length,
    vejez: aplica("vejez").length,
  };
}
