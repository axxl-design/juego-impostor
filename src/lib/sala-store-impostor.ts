import type {
  ConfigPartida,
  PistaImpostor,
  PoderJugador,
  PoderTipo,
  ReglasExtraImpostor,
  RondaDatos,
  SalaOnline,
} from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import {
  elegirAleatorio,
  esMismaPalabra,
  generarCodigoSala,
  generarId,
  mezclar,
  seleccionarImpostorAleatorio,
} from "./utils";
import { generarContextoCivil, generarPista } from "./pistas";
import {
  normalizarCodigo,
  storageDelete,
  storageExists,
  storageGet,
  storageSet,
} from "./sala-storage";

const NS = "impostor";

const PUNTOS = {
  civilCorrecto: 3,
  impostorSobrevive: 5,
  impostorAdivina: 7,
  victima: 1,
};

const PODERES_DISPONIBLES: PoderTipo[] = ["vidente", "escudo", "dobleAgente", "traductor"];

const REGLAS_DEFAULT: ReglasExtraImpostor = {
  pistasActivas: false,
  puntajePersistente: false,
  roboPuntos: false,
  poderesAleatorios: false,
  preguntasSugeridas: false,
  jefeFinal: false,
};

const CONFIG_DEFAULT: ConfigPartida = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  reglasExtra: { ...REGLAS_DEFAULT },
};

async function cargar(codigo: string): Promise<SalaOnline | null> {
  const sala = await storageGet<SalaOnline>(NS, codigo);
  if (!sala) return null;
  // Migración: salas viejas sin campos nuevos
  if (!sala.config.reglasExtra) sala.config.reglasExtra = { ...REGLAS_DEFAULT };
  if (sala.rondasJugadas == null) sala.rondasJugadas = 0;
  if (!sala.pistasUsadas) sala.pistasUsadas = {};
  if (sala.jugadores.some((j) => (j as { puntos?: number }).puntos == null)) {
    sala.jugadores = sala.jugadores.map((j) => ({ ...j, puntos: (j as { puntos?: number }).puntos ?? 0 }));
  }
  return sala;
}

async function guardar(sala: SalaOnline): Promise<void> {
  await storageSet(NS, sala.codigo, sala);
}

export async function crearSala(
  nombreHost: string,
): Promise<{ sala: SalaOnline; jugadorId: string }> {
  let codigo = generarCodigoSala();
  while (await storageExists(NS, codigo)) codigo = generarCodigoSala();
  const jugadorId = generarId();
  const sala: SalaOnline = {
    codigo,
    hostId: jugadorId,
    jugadores: [{ id: jugadorId, nombre: nombreHost.trim().slice(0, 20) || "Anfitrión", puntos: 0 }],
    config: { ...CONFIG_DEFAULT, reglasExtra: { ...REGLAS_DEFAULT } },
    ronda: null,
    fase: "lobby",
    finEn: null,
    votos: {},
    resultado: null,
    rondasJugadas: 0,
    pistasUsadas: {},
    creadaEn: Date.now(),
  };
  await guardar(sala);
  return { sala, jugadorId };
}

export async function obtenerSala(codigo: string): Promise<SalaOnline | null> {
  return cargar(normalizarCodigo(codigo));
}

export function vistaPublica(sala: SalaOnline) {
  return {
    codigo: sala.codigo,
    hostId: sala.hostId,
    jugadores: sala.jugadores,
    config: sala.config,
    fase: sala.fase,
    finEn: sala.finEn,
    votosCount: Object.keys(sala.votos).length,
    votosPor: sala.fase === "votacion" ? sala.votos : {},
    resultado: sala.resultado,
    categoriaNombre: sala.ronda?.categoriaNombre ?? null,
    rondasJugadas: sala.rondasJugadas,
    contextoCivilUsado: sala.ronda?.contextoCivilUsado ?? false,
    contextoCivilTexto: sala.ronda?.contextoCivilUsado ? sala.ronda?.contextoCivilTexto ?? null : null,
    acusacionDobleAgente:
      sala.ronda?.poderes
        ?.filter((p) => p.tipo === "dobleAgente" && p.datos?.acusadoId)
        .map((p) => ({
          deId: p.jugadorId,
          deNombre: sala.jugadores.find((j) => j.id === p.jugadorId)?.nombre ?? "?",
          aId: p.datos!.acusadoId!,
          aNombre: sala.jugadores.find((j) => j.id === p.datos!.acusadoId)?.nombre ?? "?",
        })) ?? [],
    esJefeFinal: sala.ronda?.esJefeFinal ?? false,
  };
}

export function vistaPrivada(sala: SalaOnline, jugadorId: string) {
  if (!sala.ronda) return null;
  const impostores = [sala.ronda.impostorId, ...(sala.ronda.impostoresExtra ?? [])];
  const esImpostor = impostores.includes(jugadorId);
  const poder = sala.ronda.poderes?.find((p) => p.jugadorId === jugadorId) ?? null;
  const pistasDeEste = sala.ronda.pistasPedidas ?? [];
  return {
    esImpostor,
    palabra: esImpostor ? null : sala.ronda.palabra,
    categoriaNombre: sala.ronda.categoriaNombre,
    pistasPedidas: esImpostor ? pistasDeEste : [],
    poder,
    palabraFalsa: poder?.tipo === "traductor" ? poder.datos?.palabraFalsa ?? null : null,
    videObservadoDe: null as null | { nombre: string; votadoNombre: string | null },
    esJefeFinal: sala.ronda.esJefeFinal ?? false,
    // Al impostor le mostramos si hay otro impostor (sin revelar quién)
    haySegundoImpostor: esImpostor && (sala.ronda.impostoresExtra?.length ?? 0) > 0,
  };
}

export async function unirse(
  codigo: string,
  nombre: string,
): Promise<{ jugadorId: string } | { error: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "lobby") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 10) return { error: "Sala llena" };
  const limpio = nombre.trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const id = generarId();
  sala.jugadores.push({ id, nombre: limpio, puntos: 0 });
  await guardar(sala);
  return { jugadorId: id };
}

export async function salir(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala) return;
  sala.jugadores = sala.jugadores.filter((j) => j.id !== jugadorId);
  if (sala.jugadores.length === 0) {
    await storageDelete(NS, sala.codigo);
    return;
  }
  if (sala.hostId === jugadorId) sala.hostId = sala.jugadores[0].id;
  await guardar(sala);
}

export async function configurar(
  codigo: string,
  jugadorId: string,
  parcial: Partial<ConfigPartida>,
): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  const reglasExtra = parcial.reglasExtra
    ? { ...sala.config.reglasExtra, ...parcial.reglasExtra }
    : sala.config.reglasExtra;
  if (!reglasExtra.puntajePersistente) {
    reglasExtra.roboPuntos = false;
    reglasExtra.jefeFinal = false;
  }
  sala.config = { ...sala.config, ...parcial, reglasExtra };
  await guardar(sala);
}

function repartirPoderes(
  jugadoresIds: string[],
  palabraReal: string,
  poolPalabrasFalsas: string[],
): PoderJugador[] {
  if (jugadoresIds.length < 3) return [];
  const cuantos = Math.random() < 0.5 ? 1 : 2;
  const candidatos = mezclar(jugadoresIds);
  const elegidos = candidatos.slice(0, Math.min(cuantos, candidatos.length));
  const poderesMezclados = mezclar([...PODERES_DISPONIBLES]);
  const lista: PoderJugador[] = [];
  elegidos.forEach((id, i) => {
    const tipo = poderesMezclados[i % poderesMezclados.length];
    const poder: PoderJugador = { jugadorId: id, tipo };
    if (tipo === "vidente") {
      const otros = jugadoresIds.filter((x) => x !== id);
      poder.datos = { observadoId: elegirAleatorio(otros) };
    } else if (tipo === "traductor") {
      const opcionesFalsas = poolPalabrasFalsas.filter((p) => p !== palabraReal);
      poder.datos = { palabraFalsa: opcionesFalsas.length > 0 ? elegirAleatorio(opcionesFalsas) : palabraReal };
    }
    lista.push(poder);
  });
  return lista;
}

export async function iniciar(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede empezar" };
  if (sala.jugadores.length < 3) return { error: "Necesitan al menos 3 jugadores" };
  const reglas = sala.config.reglasExtra;
  const esJefeFinal = reglas.jefeFinal && reglas.puntajePersistente && sala.rondasJugadas > 0 && sala.rondasJugadas % 5 === 0;
  const categoriaId = esJefeFinal ? "mezcla" : sala.config.categoriaId;
  const cat = buscarCategoria(categoriaId);
  if (!cat) return { error: "Categoría inválida" };
  const palabra = elegirAleatorio(cat.palabras[sala.config.dificultad]);
  const impostor = sala.jugadores[seleccionarImpostorAleatorio(sala.jugadores.length)];
  let impostoresExtra: string[] = [];
  if (esJefeFinal && sala.jugadores.length >= 4) {
    const otros = sala.jugadores.filter((j) => j.id !== impostor.id);
    const segundo = otros[seleccionarImpostorAleatorio(otros.length)];
    impostoresExtra = [segundo.id];
  }
  const idsJugadores = sala.jugadores.map((j) => j.id);
  const poderes = reglas.poderesAleatorios
    ? repartirPoderes(idsJugadores, palabra, cat.palabras[sala.config.dificultad])
    : [];
  const contextoCivilTexto = reglas.pistasActivas
    ? generarContextoCivil(palabra, cat.nombre, sala.config.dificultad)
    : undefined;

  const ronda: RondaDatos = {
    categoriaId: cat.id,
    categoriaNombre: cat.nombre,
    palabra,
    impostorId: impostor.id,
    impostoresExtra: impostoresExtra.length > 0 ? impostoresExtra : undefined,
    esJefeFinal: esJefeFinal || undefined,
    pistasPedidas: [],
    contextoCivilUsado: false,
    contextoCivilTexto,
    poderes: poderes.length > 0 ? poderes : undefined,
  };
  sala.ronda = ronda;
  sala.fase = "discusion";
  sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
  sala.votos = {};
  sala.resultado = null;
  // Pistas son por-ronda en online
  sala.pistasUsadas = {};
  await guardar(sala);
  return {};
}

export async function pasarAVotacion(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "discusion") return;
  sala.fase = "votacion";
  sala.finEn = null;
  await guardar(sala);
}

export async function votar(
  codigo: string,
  jugadorId: string,
  votadoId: string,
): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.fase !== "votacion") return;
  if (!sala.jugadores.some((j) => j.id === jugadorId)) return;
  if (!sala.jugadores.some((j) => j.id === votadoId)) return;
  sala.votos[jugadorId] = votadoId;
  if (Object.keys(sala.votos).length >= sala.jugadores.length) {
    cerrarVotacion(sala);
  }
  await guardar(sala);
}

export async function forzarCierre(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "votacion") return;
  cerrarVotacion(sala);
  await guardar(sala);
}

function cerrarVotacion(sala: SalaOnline) {
  if (!sala.ronda) return;
  const conteoAjustado: Record<string, number> = {};
  for (const [, votadoId] of Object.entries(sala.votos)) {
    const tieneEscudo = sala.ronda.poderes?.some(
      (p) => p.jugadorId === votadoId && p.tipo === "escudo",
    );
    const peso = tieneEscudo ? 0.5 : 1;
    conteoAjustado[votadoId] = (conteoAjustado[votadoId] || 0) + peso;
  }
  let masVotado = "";
  let max = -1;
  for (const [id, n] of Object.entries(conteoAjustado)) {
    if (n > max) {
      max = n;
      masVotado = id;
    }
  }
  const impostores = [sala.ronda.impostorId, ...(sala.ronda.impostoresExtra ?? [])];
  const civilesGanan = impostores.includes(masVotado);
  const impostorPrincipal = sala.jugadores.find((j) => j.id === sala.ronda!.impostorId);

  // Puntajes
  const cambios: { id: string; nombre: string; delta: number; total: number }[] = [];
  if (sala.config.reglasExtra.puntajePersistente) {
    const multiplicador = sala.ronda.esJefeFinal ? 2 : 1;
    const deltas: Record<string, number> = {};
    if (civilesGanan) {
      for (const [votanteId, votadoId] of Object.entries(sala.votos)) {
        if (impostores.includes(votadoId) && !impostores.includes(votanteId)) {
          deltas[votanteId] = (deltas[votanteId] || 0) + PUNTOS.civilCorrecto * multiplicador;
          if (sala.config.reglasExtra.roboPuntos) {
            deltas[votadoId] = (deltas[votadoId] || 0) - 2 * multiplicador;
            deltas[votanteId] = (deltas[votanteId] || 0) + 2 * multiplicador;
          }
        }
      }
    } else {
      for (const impId of impostores) {
        deltas[impId] = (deltas[impId] || 0) + PUNTOS.impostorSobrevive * multiplicador;
      }
      if (masVotado && !impostores.includes(masVotado)) {
        deltas[masVotado] = (deltas[masVotado] || 0) + PUNTOS.victima * multiplicador;
      }
    }
    sala.jugadores = sala.jugadores.map((j) => ({ ...j, puntos: (j.puntos ?? 0) + (deltas[j.id] || 0) }));
    for (const j of sala.jugadores) {
      const delta = deltas[j.id] || 0;
      if (delta !== 0) cambios.push({ id: j.id, nombre: j.nombre, delta, total: j.puntos });
    }
  }

  const impostoresExtraInfo = (sala.ronda.impostoresExtra ?? [])
    .map((id) => sala.jugadores.find((j) => j.id === id))
    .filter((j): j is { id: string; nombre: string; puntos: number } => !!j)
    .map((j) => ({ id: j.id, nombre: j.nombre }));

  sala.fase = "resultado";
  sala.rondasJugadas += 1;
  sala.resultado = {
    ganaImpostor: !civilesGanan,
    impostorId: sala.ronda.impostorId,
    impostorNombre: impostorPrincipal?.nombre ?? "?",
    impostoresExtra: impostoresExtraInfo.length > 0 ? impostoresExtraInfo : undefined,
    esJefeFinal: sala.ronda.esJefeFinal,
    cambiosPuntaje: cambios.length > 0 ? cambios : undefined,
  };
}

export async function impostorAdivina(
  codigo: string,
  jugadorId: string,
  intento: string,
): Promise<{ error?: string; acerto?: boolean }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "discusion") return { error: "Solo se puede adivinar durante la discusión" };
  if (!sala.ronda) return { error: "No hay ronda activa" };
  const impostores = [sala.ronda.impostorId, ...(sala.ronda.impostoresExtra ?? [])];
  if (!impostores.includes(jugadorId)) return { error: "Solo el impostor puede adivinar" };
  const impostor = sala.jugadores.find((j) => j.id === sala.ronda!.impostorId);
  const acerto = esMismaPalabra(intento, sala.ronda.palabra);

  const cambios: { id: string; nombre: string; delta: number; total: number }[] = [];
  if (sala.config.reglasExtra.puntajePersistente && acerto) {
    const multiplicador = sala.ronda.esJefeFinal ? 2 : 1;
    sala.jugadores = sala.jugadores.map((j) =>
      impostores.includes(j.id)
        ? { ...j, puntos: (j.puntos ?? 0) + PUNTOS.impostorAdivina * multiplicador }
        : j,
    );
    for (const j of sala.jugadores) {
      if (impostores.includes(j.id))
        cambios.push({ id: j.id, nombre: j.nombre, delta: PUNTOS.impostorAdivina * multiplicador, total: j.puntos });
    }
  }

  const impostoresExtraInfo = (sala.ronda.impostoresExtra ?? [])
    .map((id) => sala.jugadores.find((j) => j.id === id))
    .filter((j): j is { id: string; nombre: string; puntos: number } => !!j)
    .map((j) => ({ id: j.id, nombre: j.nombre }));

  sala.fase = "resultado";
  sala.finEn = null;
  sala.rondasJugadas += 1;
  sala.resultado = {
    ganaImpostor: acerto,
    impostorId: sala.ronda.impostorId,
    impostorNombre: impostor?.nombre ?? "?",
    porAdivinanza: true,
    palabraIntento: intento.slice(0, 60),
    palabraReal: sala.ronda.palabra,
    impostoresExtra: impostoresExtraInfo.length > 0 ? impostoresExtraInfo : undefined,
    esJefeFinal: sala.ronda.esJefeFinal,
    cambiosPuntaje: cambios.length > 0 ? cambios : undefined,
  };
  await guardar(sala);
  return { acerto };
}

export async function nuevaRonda(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede iniciar" };
  if (sala.fase !== "resultado") return { error: "Ronda en curso" };
  sala.fase = "lobby";
  sala.ronda = null;
  sala.votos = {};
  sala.resultado = null;
  sala.finEn = null;
  await guardar(sala);
  return {};
}

export async function pedirPistaImpostor(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string; pista?: PistaImpostor }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (!sala.ronda) return { error: "No hay ronda activa" };
  if (sala.fase !== "discusion") return { error: "Solo durante la discusión" };
  if (!sala.config.reglasExtra.pistasActivas) return { error: "Las pistas están desactivadas" };
  const impostores = [sala.ronda.impostorId, ...(sala.ronda.impostoresExtra ?? [])];
  if (!impostores.includes(jugadorId)) return { error: "Solo el impostor puede pedir pistas" };
  const pistas = sala.ronda.pistasPedidas ?? [];
  if (pistas.length >= 3) return { error: "Ya pediste todas las pistas" };
  const nivel = (pistas.length + 1) as 1 | 2 | 3;
  const nueva = generarPista(sala.ronda.palabra, sala.ronda.categoriaNombre, nivel);
  sala.ronda.pistasPedidas = [...pistas, nueva];
  if (sala.config.reglasExtra.puntajePersistente) {
    sala.jugadores = sala.jugadores.map((j) =>
      j.id === jugadorId ? { ...j, puntos: (j.puntos ?? 0) - 1 } : j,
    );
  }
  await guardar(sala);
  return { pista: nueva };
}

export async function pedirContextoCivil(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string; texto?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (!sala.ronda) return { error: "No hay ronda activa" };
  if (sala.fase !== "discusion") return { error: "Solo durante la discusión" };
  if (!sala.config.reglasExtra.pistasActivas) return { error: "Las pistas están desactivadas" };
  const impostores = [sala.ronda.impostorId, ...(sala.ronda.impostoresExtra ?? [])];
  if (impostores.includes(jugadorId)) return { error: "El impostor no puede pedir contexto" };
  if (sala.ronda.contextoCivilUsado) return { texto: sala.ronda.contextoCivilTexto ?? "" };
  const texto =
    sala.ronda.contextoCivilTexto ?? generarContextoCivil(sala.ronda.palabra, sala.ronda.categoriaNombre, sala.config.dificultad);
  sala.ronda.contextoCivilUsado = true;
  sala.ronda.contextoCivilTexto = texto;
  await guardar(sala);
  return { texto };
}

export async function activarDobleAgente(
  codigo: string,
  jugadorId: string,
  acusadoId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (!sala.ronda?.poderes) return { error: "Sin poderes en esta ronda" };
  const poder = sala.ronda.poderes.find((p) => p.jugadorId === jugadorId && p.tipo === "dobleAgente");
  if (!poder) return { error: "No tenés el poder Doble Agente" };
  if (poder.usado) return { error: "Ya usaste este poder" };
  poder.datos = { ...poder.datos, acusadoId };
  poder.usado = true;
  await guardar(sala);
  return {};
}
