import type { ConfigQuienSoy, ReglasExtraQuienSoy, SalaQuienSoy } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { esMismaPalabra, generarCodigoSala, generarId, mezclar } from "./utils";
import { generarPista } from "./pistas";
import {
  normalizarCodigo,
  storageDelete,
  storageExists,
  storageGet,
  storageSet,
} from "./sala-storage";

const NS = "quien-soy";

const REGLAS_DEFAULT: ReglasExtraQuienSoy = {
  pistasActivas: false,
  escudoComprable: false,
};

const CONFIG_DEFAULT: ConfigQuienSoy & { reglasExtra: ReglasExtraQuienSoy } = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  modoVictoria: "puntos",
  objetivo: 5,
  reglasExtra: { ...REGLAS_DEFAULT },
};

async function cargar(codigo: string): Promise<SalaQuienSoy | null> {
  const sala = await storageGet<SalaQuienSoy>(NS, codigo);
  if (!sala) return null;
  if (!sala.config.reglasExtra) sala.config.reglasExtra = { ...REGLAS_DEFAULT };
  if (!sala.pistasUsadas) sala.pistasUsadas = {};
  return sala;
}

async function guardar(sala: SalaQuienSoy): Promise<void> {
  await storageSet(NS, sala.codigo, sala);
}

export async function crearSala(
  nombreHost: string,
): Promise<{ sala: SalaQuienSoy; jugadorId: string }> {
  let codigo = generarCodigoSala();
  while (await storageExists(NS, codigo)) codigo = generarCodigoSala();
  const jugadorId = generarId();
  const sala: SalaQuienSoy = {
    codigo,
    hostId: jugadorId,
    jugadores: [
      { id: jugadorId, nombre: nombreHost.trim().slice(0, 20) || "Anfitrión", puntos: 0, haVisto: false, escudo: false },
    ],
    palabras: {},
    config: { ...CONFIG_DEFAULT, reglasExtra: { ...REGLAS_DEFAULT } },
    fase: "lobby",
    rondaActual: 0,
    pistasUsadas: {},
    ultimaAdivinanza: null,
    ganador: null,
    creadaEn: Date.now(),
  };
  await guardar(sala);
  return { sala, jugadorId };
}

export async function obtenerSala(codigo: string): Promise<SalaQuienSoy | null> {
  return cargar(normalizarCodigo(codigo));
}

export function vistaPublica(sala: SalaQuienSoy) {
  return {
    codigo: sala.codigo,
    hostId: sala.hostId,
    jugadores: sala.jugadores,
    config: sala.config,
    fase: sala.fase,
    rondaActual: sala.rondaActual,
    pistasUsadas: sala.pistasUsadas,
    ultimaAdivinanza: sala.ultimaAdivinanza,
    ganador: sala.ganador,
    ganadorPendiente: sala.ganadorPendiente ?? null,
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

export async function unirse(
  codigo: string,
  nombre: string,
): Promise<{ jugadorId: string } | { error: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "lobby") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 6) return { error: "Sala llena (máx 6)" };
  const limpio = nombre.trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const id = generarId();
  sala.jugadores.push({ id, nombre: limpio, puntos: 0, haVisto: false, escudo: false });
  await guardar(sala);
  return { jugadorId: id };
}

export async function salir(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala) return;
  sala.jugadores = sala.jugadores.filter((j) => j.id !== jugadorId);
  delete sala.palabras[jugadorId];
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
  parcial: Partial<ConfigQuienSoy & { reglasExtra: Partial<ReglasExtraQuienSoy> }>,
): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  const reglasExtra = parcial.reglasExtra
    ? { ...sala.config.reglasExtra, ...parcial.reglasExtra }
    : sala.config.reglasExtra;
  sala.config = { ...sala.config, ...parcial, reglasExtra };
  await guardar(sala);
}

export async function pedirPistaQuienSoy(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string; texto?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "juego") return { error: "Solo durante el juego" };
  if (!sala.config.reglasExtra.pistasActivas) return { error: "Pistas desactivadas" };
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return { error: "Jugador inválido" };
  const usadas = sala.pistasUsadas[jugadorId] ?? 0;
  if (usadas >= 3) return { error: "Ya pediste las 3 pistas" };
  if ((j.puntos ?? 0) <= 0) return { error: "Necesitás al menos 1 punto" };
  const palabra = sala.palabras[jugadorId];
  if (!palabra) return { error: "Sin palabra asignada" };
  const cat = buscarCategoria(sala.config.categoriaId);
  const nivel = (usadas + 1) as 1 | 2 | 3;
  const pista = generarPista(palabra, cat?.nombre ?? "", nivel);
  j.puntos -= 1;
  sala.pistasUsadas[jugadorId] = usadas + 1;
  await guardar(sala);
  return { texto: pista.texto };
}

export async function comprarEscudoQuienSoy(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "juego") return { error: "Solo durante el juego" };
  if (!sala.config.reglasExtra.escudoComprable) return { error: "Escudo desactivado" };
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return { error: "Jugador inválido" };
  if (j.escudo) return { error: "Ya tenés un escudo" };
  if ((j.puntos ?? 0) < 5) return { error: "Necesitás al menos 5 puntos" };
  j.puntos -= 2;
  j.escudo = true;
  await guardar(sala);
  return {};
}

function asignar(sala: SalaQuienSoy) {
  const cat = buscarCategoria(sala.config.categoriaId);
  if (!cat) return;
  const pool = mezclar([...cat.palabras[sala.config.dificultad]]);
  sala.palabras = {};
  sala.jugadores.forEach((j, i) => {
    sala.palabras[j.id] = pool[i % pool.length];
    j.haVisto = false;
    j.escudo = false;
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

export async function iniciar(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede empezar" };
  if (sala.jugadores.length < 2) return { error: "Necesitan al menos 2 jugadores" };
  if (sala.jugadores.length > 6) return { error: "Máximo 6 jugadores" };
  sala.jugadores.forEach((j) => {
    j.puntos = 0;
    j.escudo = false;
  });
  asignar(sala);
  sala.fase = "reparto";
  sala.rondaActual = 1;
  sala.pistasUsadas = {};
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  await guardar(sala);
  return {};
}

export async function adivinar(
  codigo: string,
  deId: string,
  aId: string,
  intento: string,
): Promise<{ error?: string; acerto?: boolean; fin?: boolean }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "juego") return { error: "No es momento de adivinar" };
  const de = sala.jugadores.find((j) => j.id === deId);
  const a = sala.jugadores.find((j) => j.id === aId);
  if (!de || !a) return { error: "Jugador inválido" };
  if (de.id === a.id) return { error: "No podés adivinarte a vos" };
  const palabraReal = sala.palabras[a.id] ?? "";
  const acerto = esMismaPalabra(intento, palabraReal);

  const escudoActivo = !acerto && de.escudo === true;

  sala.ultimaAdivinanza = {
    deId,
    deNombre: de.nombre,
    aId,
    aNombre: a.nombre,
    intento: intento.slice(0, 60),
    palabraReal,
    acerto,
    escudoUsado: escudoActivo,
    ts: Date.now(),
  };

  if (acerto) {
    de.puntos += 1;
    nuevaPalabraPara(sala, a.id);
    nuevaPalabraPara(sala, de.id);

    if (sala.config.modoVictoria === "puntos" && de.puntos >= sala.config.objetivo) {
      sala.ganadorPendiente = { tipo: "puntos", ids: [de.id] };
      await guardar(sala);
      return { acerto: true, fin: true };
    }

    if (sala.config.modoVictoria === "rondas" && sala.rondaActual >= sala.config.objetivo) {
      const max = Math.max(...sala.jugadores.map((j) => j.puntos));
      const ganadores = sala.jugadores.filter((j) => j.puntos === max).map((j) => j.id);
      sala.ganadorPendiente = { tipo: "rondas", ids: ganadores };
      await guardar(sala);
      return { acerto: true, fin: true };
    }
    await guardar(sala);
    return { acerto: true };
  } else {
    if (escudoActivo) {
      de.escudo = false;
    } else {
      de.puntos = Math.max(0, de.puntos - 1);
    }
    await guardar(sala);
    return { acerto: false };
  }
}

export async function siguienteRondaQuienSoy(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string; fin?: boolean }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede avanzar" };
  if (sala.fase !== "juego") return { error: "No es momento de avanzar" };
  if (!sala.ultimaAdivinanza) return { error: "No hay jugada que confirmar" };

  if (sala.ganadorPendiente) {
    sala.fase = "fin";
    sala.ganador = sala.ganadorPendiente;
    sala.ganadorPendiente = null;
    sala.ultimaAdivinanza = null;
    await guardar(sala);
    return { fin: true };
  }
  if (sala.ultimaAdivinanza.acerto) {
    sala.rondaActual += 1;
  }
  sala.ultimaAdivinanza = null;
  await guardar(sala);
  return {};
}

export async function terminarPartida(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede terminar" };
  if (sala.fase !== "juego" && sala.fase !== "reparto") return { error: "No hay partida en curso" };
  const max = Math.max(0, ...sala.jugadores.map((j) => j.puntos));
  const ganadores = sala.jugadores.filter((j) => j.puntos === max).map((j) => j.id);
  sala.fase = "fin";
  sala.ganador = { tipo: "terminada", ids: ganadores };
  await guardar(sala);
  return {};
}

export async function marcarPalabraVista(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala) return;
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return;
  j.haVisto = true;
  if (sala.fase === "reparto" && sala.jugadores.every((x) => x.haVisto)) {
    sala.fase = "juego";
  }
  await guardar(sala);
}

export async function continuarHost(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  if (sala.fase !== "reparto") return;
  sala.fase = "juego";
  await guardar(sala);
}

export async function jugarOtraVez(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  if (sala.fase !== "fin") return { error: "Partida en curso" };
  sala.jugadores.forEach((j) => {
    j.puntos = 0;
    j.haVisto = false;
    j.escudo = false;
  });
  asignar(sala);
  sala.fase = "reparto";
  sala.rondaActual = 1;
  sala.pistasUsadas = {};
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  await guardar(sala);
  return {};
}

export async function volverALobby(codigo: string, jugadorId: string): Promise<void> {
  const sala = await obtenerSala(codigo);
  if (!sala || sala.hostId !== jugadorId) return;
  sala.fase = "lobby";
  sala.rondaActual = 0;
  sala.palabras = {};
  sala.pistasUsadas = {};
  sala.ultimaAdivinanza = null;
  sala.ganador = null;
  sala.jugadores.forEach((j) => {
    j.puntos = 0;
    j.haVisto = false;
    j.escudo = false;
  });
  await guardar(sala);
}
