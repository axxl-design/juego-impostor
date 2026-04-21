import type { ConfigPartida, RondaDatos, SalaOnline } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { elegirAleatorio, generarCodigoSala, generarId, seleccionarImpostorAleatorio } from "./utils";

declare global {
  // eslint-disable-next-line no-var
  var __salasImpostor: Map<string, SalaOnline> | undefined;
}

const SALAS: Map<string, SalaOnline> =
  globalThis.__salasImpostor ?? new Map<string, SalaOnline>();
globalThis.__salasImpostor = SALAS;

const TTL_MS = 1000 * 60 * 60 * 4; // 4 horas

function limpiarSalas() {
  const ahora = Date.now();
  for (const [codigo, sala] of SALAS) {
    if (ahora - sala.creadaEn > TTL_MS) SALAS.delete(codigo);
  }
}

const CONFIG_DEFAULT: ConfigPartida = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  impostorCiego: false,
};

export function crearSala(nombreHost: string): { sala: SalaOnline; jugadorId: string } {
  limpiarSalas();
  let codigo = generarCodigoSala();
  while (SALAS.has(codigo)) codigo = generarCodigoSala();
  const jugadorId = generarId();
  const sala: SalaOnline = {
    codigo,
    hostId: jugadorId,
    jugadores: [{ id: jugadorId, nombre: nombreHost.trim().slice(0, 20) || "Anfitrión" }],
    config: { ...CONFIG_DEFAULT },
    ronda: null,
    fase: "lobby",
    finEn: null,
    votos: {},
    resultado: null,
    creadaEn: Date.now(),
  };
  SALAS.set(codigo, sala);
  return { sala, jugadorId };
}

export function obtenerSala(codigo: string): SalaOnline | null {
  return SALAS.get(codigo.toUpperCase()) ?? null;
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
  };
}

export function vistaPrivada(sala: SalaOnline, jugadorId: string) {
  if (!sala.ronda) return null;
  const esImpostor = sala.ronda.impostorId === jugadorId;
  return {
    esImpostor,
    palabra: esImpostor ? null : sala.ronda.palabra,
    categoriaNombre: sala.ronda.impostorCiego && esImpostor ? null : sala.ronda.categoriaNombre,
    impostorCiego: sala.ronda.impostorCiego,
  };
}

export function unirse(codigo: string, nombre: string): { jugadorId: string } | { error: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "lobby") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 10) return { error: "Sala llena" };
  const limpio = nombre.trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const id = generarId();
  sala.jugadores.push({ id, nombre: limpio });
  return { jugadorId: id };
}

export function salir(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala) return;
  sala.jugadores = sala.jugadores.filter((j) => j.id !== jugadorId);
  if (sala.jugadores.length === 0) {
    SALAS.delete(sala.codigo);
    return;
  }
  if (sala.hostId === jugadorId) sala.hostId = sala.jugadores[0].id;
}

export function configurar(codigo: string, jugadorId: string, parcial: Partial<ConfigPartida>) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  sala.config = { ...sala.config, ...parcial };
}

export function iniciar(codigo: string, jugadorId: string): { error?: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede empezar" };
  if (sala.jugadores.length < 3) return { error: "Necesitan al menos 3 jugadores" };
  const cat = buscarCategoria(sala.config.categoriaId);
  if (!cat) return { error: "Categoría inválida" };
  const palabra = elegirAleatorio(cat.palabras[sala.config.dificultad]);
  const impostor = sala.jugadores[seleccionarImpostorAleatorio(sala.jugadores.length)];
  const ronda: RondaDatos = {
    categoriaId: cat.id,
    categoriaNombre: cat.nombre,
    palabra,
    impostorId: impostor.id,
    impostorCiego: sala.config.impostorCiego,
  };
  sala.ronda = ronda;
  sala.fase = "discusion";
  sala.finEn = Date.now() + sala.config.duracionSeg * 1000;
  sala.votos = {};
  sala.resultado = null;
  return {};
}

export function pasarAVotacion(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "discusion") return;
  sala.fase = "votacion";
  sala.finEn = null;
}

export function votar(codigo: string, jugadorId: string, votadoId: string) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.fase !== "votacion") return;
  if (!sala.jugadores.some((j) => j.id === jugadorId)) return;
  if (!sala.jugadores.some((j) => j.id === votadoId)) return;
  sala.votos[jugadorId] = votadoId;
  if (Object.keys(sala.votos).length >= sala.jugadores.length) {
    cerrarVotacion(sala);
  }
}

export function forzarCierre(codigo: string, jugadorId: string) {
  const sala = obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "votacion") return;
  cerrarVotacion(sala);
}

function cerrarVotacion(sala: SalaOnline) {
  if (!sala.ronda) return;
  const conteo: Record<string, number> = {};
  for (const v of Object.values(sala.votos)) conteo[v] = (conteo[v] || 0) + 1;
  let masVotado = "";
  let max = -1;
  for (const [id, n] of Object.entries(conteo)) {
    if (n > max) {
      max = n;
      masVotado = id;
    }
  }
  const impostor = sala.jugadores.find((j) => j.id === sala.ronda!.impostorId);
  const civilesGanan = masVotado === sala.ronda.impostorId;
  sala.fase = "resultado";
  sala.resultado = {
    ganaImpostor: !civilesGanan,
    impostorId: sala.ronda.impostorId,
    impostorNombre: impostor?.nombre ?? "?",
  };
}

export function nuevaRonda(codigo: string, jugadorId: string): { error?: string } {
  const sala = obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede iniciar" };
  if (sala.fase !== "resultado") return { error: "Ronda en curso" };
  sala.fase = "lobby";
  sala.ronda = null;
  sala.votos = {};
  sala.resultado = null;
  sala.finEn = null;
  return {};
}

export function todasLasSalas() {
  return SALAS;
}
