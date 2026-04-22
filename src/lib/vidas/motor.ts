import type {
  Carta,
  Efectos,
  EntradaHistorial,
  EstadoJugador,
  EtapaVida,
  MundoId,
  OpcionCarta,
  RespuestaFinal,
  TipoRelacion,
} from "./types";
import { nivelPoderDesdeNumero } from "./mundos";

export const EDAD_MIN_JUVENTUD = 18;
export const EDAD_LIMITE_JUVENTUD = 35;
export const EDAD_LIMITE_MADUREZ = 60;
export const EDAD_LIMITE_VEJEZ_MAX = 95;
export const EDAD_MORTALIDAD_INICIO = 70;

export function etapaPorEdad(edad: number): EtapaVida {
  if (edad < EDAD_LIMITE_JUVENTUD) return "juventud";
  if (edad < EDAD_LIMITE_MADUREZ) return "madurez";
  return "vejez";
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function aplicarEfectos(
  jugador: EstadoJugador,
  efectos: Efectos,
): { jugador: EstadoJugador; cambios: Efectos } {
  const cambios: Efectos = {};
  const next: EstadoJugador = {
    ...jugador,
    stats: { ...jugador.stats },
  };
  if (typeof efectos.karma === "number") {
    const antes = next.stats.karma;
    next.stats.karma = clamp(next.stats.karma + efectos.karma, -100, 100);
    cambios.karma = next.stats.karma - antes;
  }
  if (typeof efectos.influencia === "number") {
    const antes = next.stats.influencia;
    next.stats.influencia = clamp(next.stats.influencia + efectos.influencia, 0, 100);
    cambios.influencia = next.stats.influencia - antes;
  }
  if (typeof efectos.riqueza === "number") {
    const antes = next.stats.riqueza;
    next.stats.riqueza = clamp(next.stats.riqueza + efectos.riqueza, 0, 100);
    cambios.riqueza = next.stats.riqueza - antes;
  }
  if (typeof efectos.salud === "number") {
    const antes = next.stats.salud;
    next.stats.salud = clamp(next.stats.salud + efectos.salud, 0, 100);
    cambios.salud = next.stats.salud - antes;
  }
  if (typeof efectos.nivelPoder === "number") {
    const antes = next.stats.nivelPoder;
    next.stats.nivelPoder = clamp(next.stats.nivelPoder + efectos.nivelPoder, 0, 100);
    cambios.nivelPoder = next.stats.nivelPoder - antes;
  }
  if (efectos.rango) {
    next.rango = efectos.rango;
    cambios.rango = efectos.rango;
  }
  const avance = typeof efectos.edad === "number" ? efectos.edad : 2;
  next.edad = next.edad + avance;
  cambios.edad = avance;
  next.etapa = etapaPorEdad(next.edad);
  if (next.stats.salud <= 0) {
    next.vivo = false;
    next.causaMuerte = "complicaciones graves por sus decisiones";
  }
  return { jugador: next, cambios };
}

export function opcionPermitida(opcion: OpcionCarta, jugador: EstadoJugador): boolean {
  if (opcion.requiereInfluenciaMin && jugador.stats.influencia < opcion.requiereInfluenciaMin) return false;
  if (opcion.requiereRiquezaMin && jugador.stats.riqueza < opcion.requiereRiquezaMin) return false;
  if (opcion.requiereNivelPoder) {
    const nivelActual = nivelPoderDesdeNumero(jugador.stats.nivelPoder);
    const orden = ["latente", "despierto", "experto", "maestro"] as const;
    const idxReq = orden.indexOf(opcion.requiereNivelPoder);
    const idxAct = orden.indexOf(nivelActual);
    if (idxAct < idxReq) return false;
  }
  return true;
}

export function cartaAplicable(
  carta: Carta,
  jugador: EstadoJugador,
  mundo: MundoId,
  contexto: { tipoRelacion?: TipoRelacion | null } = {},
): boolean {
  if (carta.mundo !== mundo) return false;
  if (carta.rolesRelevantes.length > 0 && !carta.rolesRelevantes.includes(jugador.rol)) return false;
  if (carta.soloRelacion && contexto.tipoRelacion && carta.soloRelacion !== contexto.tipoRelacion) return false;
  if (carta.soloRelacion && !contexto.tipoRelacion) return false;
  const orden: EtapaVida[] = ["juventud", "madurez", "vejez"];
  const idxEt = orden.indexOf(jugador.etapa);
  if (carta.etapaMin && idxEt < orden.indexOf(carta.etapaMin)) return false;
  if (carta.etapaMax && idxEt > orden.indexOf(carta.etapaMax)) return false;
  if (typeof carta.requiereKarmaMin === "number" && jugador.stats.karma < carta.requiereKarmaMin) return false;
  if (typeof carta.requiereKarmaMax === "number" && jugador.stats.karma > carta.requiereKarmaMax) return false;
  if (typeof carta.requiereInfluenciaMin === "number" && jugador.stats.influencia < carta.requiereInfluenciaMin) return false;
  if (typeof carta.requiereRiquezaMin === "number" && jugador.stats.riqueza < carta.requiereRiquezaMin) return false;
  if (typeof carta.requiereSaludMin === "number" && jugador.stats.salud < carta.requiereSaludMin) return false;
  if (carta.requiereNivelPoder) {
    const nivelActual = nivelPoderDesdeNumero(jugador.stats.nivelPoder);
    const orden2 = ["latente", "despierto", "experto", "maestro"] as const;
    if (orden2.indexOf(nivelActual) < orden2.indexOf(carta.requiereNivelPoder)) return false;
  }
  if (jugador.cartasUsadas.includes(carta.id)) return false;
  return true;
}

export function seleccionarCarta(
  pool: Carta[],
  jugador: EstadoJugador,
  mundo: MundoId,
  contexto: { tipoRelacion?: TipoRelacion | null; desbloqueadas: string[] } = { desbloqueadas: [] },
): Carta | null {
  const lista = pool.filter((c) => cartaAplicable(c, jugador, mundo, contexto));

  const desbloqueadasEnLista = lista.filter((c) => contexto.desbloqueadas.includes(c.id));
  if (desbloqueadasEnLista.length > 0) {
    return elegirPonderado(desbloqueadasEnLista, jugador);
  }

  if (lista.length === 0) {
    const poolLaxo = pool.filter(
      (c) =>
        c.mundo === mundo &&
        !jugador.cartasUsadas.includes(c.id) &&
        (!c.soloRelacion || c.soloRelacion === contexto.tipoRelacion),
    );
    if (poolLaxo.length === 0) return null;
    return elegirPonderado(poolLaxo, jugador);
  }

  return elegirPonderado(lista, jugador);
}

function elegirPonderado(lista: Carta[], jugador: EstadoJugador): Carta {
  const ultimasIds = new Set(jugador.historial.slice(-3).map((h) => h.cartaId));
  const candidatos = lista.filter((c) => !ultimasIds.has(c.id));
  const fuente = candidatos.length > 0 ? candidatos : lista;
  const ultimasTemas = new Map<string, number>();
  for (const h of jugador.historial.slice(-3)) {
    const carta = lista.find((c) => c.id === h.cartaId);
    if (carta) {
      for (const t of carta.tags) {
        ultimasTemas.set(t, (ultimasTemas.get(t) ?? 0) + 1);
      }
    }
  }
  const pesos = fuente.map((c) => {
    let peso = 10;
    for (const t of c.tags) {
      const repetido = ultimasTemas.get(t) ?? 0;
      peso -= repetido * 2;
    }
    return Math.max(1, peso);
  });
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < fuente.length; i++) {
    r -= pesos[i];
    if (r <= 0) return fuente[i];
  }
  return fuente[fuente.length - 1];
}

export function construirHistorial(
  cartaId: string,
  tituloCarta: string,
  jugadorAntes: EstadoJugador,
  opcion: OpcionCarta,
  cambios: Efectos,
): EntradaHistorial {
  return {
    cartaId,
    tituloCarta,
    edad: jugadorAntes.edad,
    etapa: jugadorAntes.etapa,
    opcionTexto: opcion.texto,
    consecuenciaTexto: opcion.consecuenciaTexto,
    efectosAplicados: cambios,
    ts: Date.now(),
  };
}

export function chequearMuertePorEdad(jugador: EstadoJugador): EstadoJugador {
  if (!jugador.vivo) return jugador;
  if (jugador.edad < EDAD_MORTALIDAD_INICIO) return jugador;
  const rangoMuerte = jugador.edad - EDAD_MORTALIDAD_INICIO;
  const factorSalud = 1 - jugador.stats.salud / 120;
  const probabilidad = clamp(rangoMuerte * 0.025 + factorSalud * 0.1, 0, 0.95);
  if (jugador.edad >= EDAD_LIMITE_VEJEZ_MAX) {
    return {
      ...jugador,
      vivo: false,
      causaMuerte: "muere de vejez, rodeado de lo que supo construir",
    };
  }
  if (Math.random() < probabilidad) {
    return {
      ...jugador,
      vivo: false,
      causaMuerte:
        jugador.stats.salud < 30
          ? "muere después de una larga enfermedad"
          : "cierra los ojos en paz, tras una vida larga",
    };
  }
  return jugador;
}

export function generarFinal(
  jugador: EstadoJugador,
  mundoNombre: string,
  extras: { tipoRelacion?: TipoRelacion; vinculo?: number; parejaNombre?: string } = {},
): RespuestaFinal {
  const { karma, influencia, riqueza, salud } = jugador.stats;
  const trozos: string[] = [];
  const nombre = jugador.nombre;
  const causa = jugador.causaMuerte ?? "llega al final de sus días";

  trozos.push(`${nombre} ${causa} a los ${jugador.edad} años.`);

  if (karma >= 50) {
    trozos.push(
      "Su nombre se repite con respeto: los que quedaron aprendieron a ser mejores cerca de él.",
    );
  } else if (karma <= -50) {
    trozos.push(
      "Su nombre se pronuncia con miedo. Dejó deudas morales que otros van a tener que pagar.",
    );
  } else {
    trozos.push(
      "Su nombre no es ni santo ni maldito — es simplemente humano, con sus luces y sus sombras.",
    );
  }

  if (influencia >= 70) {
    trozos.push(`Llegó a ser ${jugador.rango.toLowerCase()} y pocos pueden decir lo mismo.`);
  } else if (influencia <= 20) {
    trozos.push("Nunca buscó los reflectores, y la historia no lo guardó para sí.");
  } else {
    trozos.push(`Su rango final fue ${jugador.rango.toLowerCase()} — ni más, ni menos.`);
  }

  if (riqueza >= 70) {
    trozos.push("Dejó una fortuna que pocos de sus herederos sabrán sostener.");
  } else if (riqueza <= 20) {
    trozos.push("Murió con lo justo. Lo que tenía, lo usó.");
  }

  if (salud <= 10 && salud > 0) {
    trozos.push("Su cuerpo, desgastado, ya no daba para más.");
  }

  let frase = "Una vida no se mide por lo que uno acumuló, sino por lo que otros siguen contando.";
  if (karma > 50 && influencia > 50) {
    frase = `En el ${mundoNombre}, lo justo y lo poderoso rara vez se cruzan. ${nombre} los cruzó.`;
  } else if (karma < -40 && riqueza > 50) {
    frase = "Se puede tener todo menos paz. Él aprendió eso tarde.";
  } else if (karma > 50 && riqueza < 20) {
    frase = "Murió pobre y, quizás por eso, libre.";
  } else if (karma < -40 && influencia < 20) {
    frase = "No alcanzó la cima ni la bondad. Pero alcanzó el final, que es más de lo que muchos pueden decir.";
  } else if (influencia > 70 && karma < -20) {
    frase = "Construyó un imperio con los huesos de los que quisieron confiar en él.";
  }

  const highlights = [...jugador.historial]
    .sort((a, b) => impactoEfectos(b.efectosAplicados) - impactoEfectos(a.efectosAplicados))
    .slice(0, 5);

  let epilogoRelacion: string | undefined;
  if (extras.tipoRelacion && typeof extras.vinculo === "number") {
    const v = extras.vinculo;
    const otro = extras.parejaNombre ?? "su compañero/a";
    if (v >= 75) {
      epilogoRelacion =
        extras.tipoRelacion === "pareja"
          ? `${nombre} y ${otro} llegaron juntos al final. Eligieron al otro, una y otra vez.`
          : `${nombre} y ${otro} siguieron siendo amigos hasta el último día. Esa clase de amistad que no se explica.`;
    } else if (v >= 45) {
      epilogoRelacion =
        extras.tipoRelacion === "pareja"
          ? `${nombre} y ${otro} se quisieron con imperfección, como se quiere casi todo lo real.`
          : `${nombre} y ${otro} tuvieron sus años buenos y sus distancias. La amistad resistió, aunque con cicatrices.`;
    } else {
      epilogoRelacion =
        extras.tipoRelacion === "pareja"
          ? `${nombre} y ${otro} se distanciaron en los últimos años. Pero recordarán cuando eran jóvenes, y eso a veces basta.`
          : `${nombre} y ${otro} se hablaron cada vez menos. Al final, solo quedó el recuerdo — menor, pero firme.`;
    }
  }

  return {
    resumen: trozos.join(" "),
    frase,
    highlights,
    epilogoRelacion,
  };
}

function impactoEfectos(e: Efectos): number {
  return (
    Math.abs(e.karma ?? 0) +
    Math.abs(e.influencia ?? 0) +
    Math.abs(e.riqueza ?? 0) +
    Math.abs(e.salud ?? 0) * 1.5 +
    (e.rango ? 25 : 0) +
    Math.abs(e.nivelPoder ?? 0) * 0.5 +
    Math.abs(e.vinculo ?? 0) * 0.5
  );
}

export function calcularEfectoVinculoPareja(
  efectosA: Efectos,
  efectosB: Efectos,
): number {
  const karmaA = efectosA.karma ?? 0;
  const karmaB = efectosB.karma ?? 0;
  const influyenteA = efectosA.influencia ?? 0;
  const influyenteB = efectosB.influencia ?? 0;
  let delta = 0;
  if ((karmaA > 0 && karmaB > 0) || (karmaA < 0 && karmaB < 0)) {
    delta += 3;
  } else if (Math.sign(karmaA) !== 0 && Math.sign(karmaB) !== 0 && Math.sign(karmaA) !== Math.sign(karmaB)) {
    delta -= 4;
  }
  if (karmaA + karmaB > 10) delta += 2;
  if ((efectosA.riqueza ?? 0) < -5 && (efectosB.riqueza ?? 0) < -5) delta -= 2;
  if (influyenteA > 5 && influyenteB > 5) delta += 1;
  return clamp(delta, -6, 6);
}
