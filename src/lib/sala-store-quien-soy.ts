import type { ConfigQuienSoy, SalaQuienSoy } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { esMismaPalabra, generarCodigoSala, generarId, mezclar } from "./utils";

declare global {
  // eslint-disable-next-line no-var
  var __salasQuienSoy: Map<string, SalaQuienSoy> | undefined;
}

const SALAS: Map<string, SalaQuienSoy> =
  globalThis.__salasQuienSoy ?? new Map<string, SalaQuienSoy>();
globalThis.__salasQuienSoy = SALAS;

const TTL_MS = 1000 * 60 * 60 * 4;

function limpiarSalas() {
  const ahora = Date.now();
  for (const [codigo, sala] of SALAS) {
    if (ahora - sala.creadaEn > TTL_MS) SALAS.delete(codigo);
  }
}

const CONFIG_DEFAULT: ConfigQuienSoy = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  modoVictoria: "puntos",
  objetivo: 5,
};

export function crearSala(nombreHost: string): { sala: SalaQuienSoy; jugadorId: string } {
  limpiarSalas();
  let codigo = generarCodigoSala();
  while (SALAS.has(codigo)) codigo = generarCodigoSala();
  const jugadorId = generarId();
  const sala: SalaQuienSoy = {
    codigo,
    hostId: jugadorId,
    jugadores: [{ id: jugadorId, nombre: nombreHost.trim().slice(0, 20) || "Anfitrión", puntos: 0, haVisto: false }],
    palabras: {},
    config: { ...CONFIG_DEFAULT },
    fase: "lobby",
    rondaActual: 0,
    finEn: null,
    ultimaAdivinanza: null,
    ganador: null,
    creadaEn: Date.now(),
  };
  SALAS.set(codigo, sala);
  return { sala, jugadorId };
}

export function obtenerSala(codigo: string): SalaQuienSoy | null {
  return SALAS.get(codigo.toUpperCase()) ?? null;
}

export function vistaPublica(sala: SalaQuienSoy) {
  return {
    codigo: sala.codigo,
    hostId: sala.hostId,
    jugadores: sala.jugadores,
    config: sala.config,
    fase: sala.fase,
    rondaActual: sala.rondaActual,
    finEn: sala.finEn,
    ultimaAdivinanza: sala.ultimaAdivinanza,
    ganador: sala.ganador,
    categoriaNombre: buscarCategoria(sala.config.categoriaId)?.nombre ?? null,
  };
}

export function vistaPalabra(sala: SalaQuienSoy, jugadorId: string) {
  const palabra = sala.palabras[jugadorId] ?? null;
  return {
    palabra,
    categoriaNombre: buscarCategoria(sala.config.categoriaId)?.nombre ?? null,
  };
}

export function unirse(codigo: string, nombre: string): { jugadorId: string } | { error: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "lobby") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 6) return { error: "Sala llena (máx 6)" };
  const limpio = nombre.trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const id = generarId();
  sala.jugadores.push({ id, nombre: limpio, puntos: 0, haVisto: false });
  return { jugadorId: id };
}

export function salir(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala) return;
  sala.jugadores = sala.jugadores.filter((j) => j.id !== jugadorId);
  delete sala.palabras[jugadorId];
  if (sala.jugadores.length === 0) {
    SALAS.delete(sala.codigo);
    return;
  }
  if (sala.hostId === jugadorId) sala.hostId = sala.jugadores[0].id;
}

export function configurar(codigo: string, jugadorId: string, parcial: Partial<ConfigQuienSoy>) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  sala.config = { ...sala.config, ...parcial };
}

function asignar(sala: SalaQuienSoy) {
  const cat = buscarCategoria(sala.config.categoriaId);
  if (!cat) return;
  const pool = mezclar([...cat.palabras[sala.config.dificultad]]);
  sala.palabras = {};
  sala.jugadores.forEach((j, i) => {
    sala.palabras[j.id] = pool[i % pool.length];
    j.haVisto = false;
  });
}

function nuevaPalabraPara(sala: SalaQuienSoy, jugadorId: string) {
  const cat = buscarCategoria(sala.config.categoriaId);
  if (!cat) return;
  const usadas = Object.values(sala.palabras);
  const pool = cat.palabras[sala.config.dificultad].filter((p) => !usadas.includes(p));
  const fuente = pool.length > 0 ? pool : cat.palabras[sala.config.dificultad];
  sala.palabras[jugadorId] = fuente[Math.floor(Math.random() * fuente.length)];
}

export function iniciar(codigo: string, jugadorId: string): { error?: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede empezar" };
  if (sala.jugadores.length < 2) return { error: "Necesitan al menos 2 jugadores" };
  if (sala.jugadores.length > 6) return { error: "Máximo 6 jugadores" };
  sala.jugadores.forEach((j) => (j.puntos = 0));
  asignar(sala);
  sala.fase = "juego";
  sala.rondaActual = 1;
  sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  return {};
}

export function adivinar(
  codigo: string,
  deId: string,
  aId: string,
  intento: string,
): { error?: string; acerto?: boolean; fin?: boolean } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "juego") return { error: "No es momento de adivinar" };
  const de = sala.jugadores.find((j) => j.id === deId);
  const a = sala.jugadores.find((j) => j.id === aId);
  if (!de || !a) return { error: "Jugador inválido" };
  if (de.id === a.id) return { error: "No podés adivinarte a vos" };
  const palabraReal = sala.palabras[a.id] ?? "";
  const acerto = esMismaPalabra(intento, palabraReal);

  sala.ultimaAdivinanza = {
    deId,
    deNombre: de.nombre,
    aId,
    aNombre: a.nombre,
    intento: intento.slice(0, 60),
    palabraReal,
    acerto,
    ts: Date.now(),
  };

  if (acerto) {
    de.puntos += 1;
    nuevaPalabraPara(sala, a.id);
    nuevaPalabraPara(sala, de.id);
    if (sala.config.modoVictoria === "puntos" && de.puntos >= sala.config.objetivo) {
      sala.fase = "fin";
      sala.finEn = null;
      sala.ganador = { tipo: "puntos", ids: [de.id] };
      return { acerto: true, fin: true };
    }
    return { acerto: true };
  } else {
    de.puntos = Math.max(0, de.puntos - 1);
    return { acerto: false };
  }
}

export function timeoutRonda(codigo: string): { error?: string; fin?: boolean } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "juego") return {};
  if (sala.finEn && Date.now() < sala.finEn) return {};

  if (sala.config.modoVictoria === "rondas") {
    if (sala.rondaActual >= sala.config.objetivo) {
      const max = Math.max(...sala.jugadores.map((j) => j.puntos));
      const ganadores = sala.jugadores.filter((j) => j.puntos === max).map((j) => j.id);
      sala.fase = "fin";
      sala.finEn = null;
      sala.ganador = { tipo: "rondas", ids: ganadores };
      return { fin: true };
    }
  }
  asignar(sala);
  sala.rondaActual += 1;
  sala.fase = "reparto";
  sala.finEn = null;
  sala.ultimaAdivinanza = null;
  return {};
}

export function marcarPalabraVista(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala) return;
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return;
  j.haVisto = true;
  if (sala.fase === "reparto" && sala.jugadores.every((x) => x.haVisto)) {
    sala.fase = "juego";
    sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
  }
}

export function continuarHost(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "reparto") return;
  sala.fase = "juego";
  sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
}

export function jugarOtraVez(codigo: string, jugadorId: string): { error?: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  if (sala.fase !== "fin") return { error: "Partida en curso" };
  sala.jugadores.forEach((j) => {
    j.puntos = 0;
    j.haVisto = false;
  });
  asignar(sala);
  sala.fase = "juego";
  sala.rondaActual = 1;
  sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  return {};
}

export function volverALobby(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  sala.fase = "lobby";
  sala.rondaActual = 0;
  sala.finEn = null;
  sala.palabras = {};
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  sala.jugadores.forEach((j) => {
    j.puntos = 0;
    j.haVisto = false;
  });
}
