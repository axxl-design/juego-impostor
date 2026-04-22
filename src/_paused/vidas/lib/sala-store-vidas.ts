import type { EstadoSalaOnline, EstadoJugador, MundoId, TipoRelacion } from "./vidas/types";
import { generarCodigoSala, generarId } from "./utils";
import {
  normalizarCodigo,
  storageDelete,
  storageExists,
  storageGet,
  storageSet,
} from "./sala-storage";

const NS = "vidas";

async function cargar(codigo: string): Promise<EstadoSalaOnline | null> {
  return storageGet<EstadoSalaOnline>(NS, codigo);
}

async function guardar(sala: EstadoSalaOnline): Promise<void> {
  sala.actualizadaEn = Date.now();
  await storageSet(NS, sala.codigo, sala);
}

export async function crearSala(
  nombreHost: string,
): Promise<{ sala: EstadoSalaOnline; jugadorId: string }> {
  let codigo = generarCodigoSala();
  while (await storageExists(NS, codigo)) codigo = generarCodigoSala();
  const jugadorId = generarId();
  const ahora = Date.now();
  const sala: EstadoSalaOnline = {
    codigo,
    version: 1,
    creadaEn: ahora,
    actualizadaEn: ahora,
    hostId: jugadorId,
    tipoRelacion: null,
    mundo: null,
    jugadores: [
      {
        id: jugadorId,
        nombre: nombreHost.trim().slice(0, 20) || "Anfitrión",
        mundo: "medieval",
        rol: "campesino",
        edad: 18,
        etapa: "juventud",
        stats: {
          karma: 0,
          influencia: 0,
          riqueza: 0,
          salud: 80,
          nivelPoder: 0,
        },
        rango: "—",
        historial: [],
        cartasUsadas: [],
        desbloqueadas: [],
        vivo: true,
      },
    ],
    vinculo: 50,
    fase: "lobby",
    turnoDe: null,
    cartaActualId: null,
    cartaActualExtra: null,
    ultimaConsecuencia: null,
    usosIAGeneracion: 0,
  };
  await guardar(sala);
  return { sala, jugadorId };
}

export async function obtenerSala(codigo: string): Promise<EstadoSalaOnline | null> {
  return cargar(normalizarCodigo(codigo));
}

export function vistaPublica(sala: EstadoSalaOnline): EstadoSalaOnline {
  return sala;
}

export async function unirse(
  codigo: string,
  nombre: string,
): Promise<{ jugadorId: string } | { error: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.fase !== "lobby" && sala.fase !== "setup-invitado") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 2) return { error: "Sala llena (máx 2)" };
  const limpio = nombre.trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const id = generarId();
  sala.jugadores.push({
    id,
    nombre: limpio,
    mundo: sala.mundo ?? "medieval",
    rol: "campesino",
    edad: 18,
    etapa: "juventud",
    stats: {
      karma: 0,
      influencia: 0,
      riqueza: 0,
      salud: 80,
      nivelPoder: 0,
    },
    rango: "—",
    historial: [],
    cartasUsadas: [],
    desbloqueadas: [],
    vivo: true,
  });
  sala.fase = "setup-invitado";
  await guardar(sala);
  return { jugadorId: id };
}

export async function configurarRelacion(
  codigo: string,
  jugadorId: string,
  tipo: TipoRelacion,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  sala.tipoRelacion = tipo;
  await guardar(sala);
  return {};
}

export async function configurarMundoHost(
  codigo: string,
  jugadorId: string,
  mundo: MundoId,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión elige mundo" };
  sala.mundo = mundo;
  for (const j of sala.jugadores) {
    j.mundo = mundo;
  }
  await guardar(sala);
  return {};
}

export async function configurarJugador(
  codigo: string,
  jugadorId: string,
  data: {
    nombre?: string;
    rol?: string;
    poderSubtipo?: EstadoJugador["poderSubtipo"];
    statsIniciales?: EstadoJugador["stats"];
    rangoInicial?: string;
  },
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return { error: "Jugador inválido" };
  if (data.nombre) j.nombre = data.nombre.trim().slice(0, 20) || j.nombre;
  if (data.rol) j.rol = data.rol;
  if (data.poderSubtipo) j.poderSubtipo = data.poderSubtipo;
  if (data.statsIniciales) j.stats = { ...j.stats, ...data.statsIniciales, nivelPoder: sala.mundo === "poderes" ? 10 : 0 };
  if (data.rangoInicial) j.rango = data.rangoInicial;
  await guardar(sala);
  return {};
}

export async function iniciarPartida(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede empezar" };
  if (sala.jugadores.length !== 2) return { error: "Necesitan los dos jugadores" };
  if (!sala.mundo || !sala.tipoRelacion) return { error: "Falta configuración" };
  sala.fase = "juego";
  sala.turnoDe = sala.jugadores[0].id;
  await guardar(sala);
  return {};
}

export async function setCartaActual(
  codigo: string,
  cartaId: string | null,
  extra: EstadoSalaOnline["cartaActualExtra"] = null,
): Promise<EstadoSalaOnline | null> {
  const sala = await obtenerSala(codigo);
  if (!sala) return null;
  sala.cartaActualId = cartaId;
  sala.cartaActualExtra = extra;
  await guardar(sala);
  return sala;
}

export async function guardarTrasAccion(sala: EstadoSalaOnline): Promise<void> {
  await guardar(sala);
}

export async function volverALobby(
  codigo: string,
  jugadorId: string,
): Promise<{ error?: string }> {
  const sala = await obtenerSala(codigo);
  if (!sala) return { error: "Sala no encontrada" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  sala.fase = "lobby";
  sala.cartaActualId = null;
  sala.cartaActualExtra = null;
  sala.ultimaConsecuencia = null;
  sala.vinculo = 50;
  sala.mundo = null;
  sala.tipoRelacion = null;
  sala.usosIAGeneracion = 0;
  for (const j of sala.jugadores) {
    j.edad = 18;
    j.etapa = "juventud";
    j.historial = [];
    j.cartasUsadas = [];
    j.desbloqueadas = [];
    j.vivo = true;
    j.causaMuerte = undefined;
    j.rango = "—";
    j.stats = { karma: 0, influencia: 0, riqueza: 0, salud: 80, nivelPoder: 0 };
  }
  await guardar(sala);
  return {};
}

export async function borrarSala(codigo: string): Promise<void> {
  await storageDelete(NS, normalizarCodigo(codigo));
}
