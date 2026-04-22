import type { ConfigPartida, RondaDatos, SalaOnline } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { elegirAleatorio, esMismaPalabra, generarCodigoSala, generarId, seleccionarImpostorAleatorio } from "./utils";
import {
  normalizarCodigo,
  storageDelete,
  storageExists,
  storageGet,
  storageSet,
} from "./sala-storage";

const NS = "impostor";

const CONFIG_DEFAULT: ConfigPartida = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  impostorCiego: false,
};

async function cargar(codigo: string): Promise<SalaOnline | null> {
  return storageGet<SalaOnline>(NS, codigo);
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
    jugadores: [{ id: jugadorId, nombre: nombreHost.trim().slice(0, 20) || "Anfitrión" }],
    config: { ...CONFIG_DEFAULT },
    ronda: null,
    fase: "lobby",
    finEn: null,
    votos: {},
    resultado: null,
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
  sala.jugadores.push({ id, nombre: limpio });
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
  sala.config = { ...sala.config, ...parcial };
  await guardar(sala);
}

export async function iniciar(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
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

export async function impostorAdivina(
  codigo: string,
  jugadorId: string,
  intento: string,
): Promise<{ error?: string; acerto?: boolean }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "discusion") return { error: "Solo se puede adivinar durante la discusión" };
  if (!sala.ronda) return { error: "No hay ronda activa" };
  if (sala.ronda.impostorId !== jugadorId) return { error: "Solo el impostor puede adivinar" };
  const impostor = sala.jugadores.find((j) => j.id === jugadorId);
  const acerto = esMismaPalabra(intento, sala.ronda.palabra);
  sala.fase = "resultado";
  sala.finEn = null;
  sala.resultado = {
    ganaImpostor: acerto,
    impostorId: sala.ronda.impostorId,
    impostorNombre: impostor?.nombre ?? "?",
    porAdivinanza: true,
    palabraIntento: intento.slice(0, 60),
    palabraReal: sala.ronda.palabra,
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
