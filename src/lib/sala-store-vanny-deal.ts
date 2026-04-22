import type { SalaVannyDeal } from "./vanny-deal/types";
import {
  crearSala as crearSalaEnMemoria,
  unirseSala,
  salirSala,
  configurarSala,
  iniciarPartida,
  jugarPropiedad,
  jugarComoDinero,
  moverComodinColor,
  terminarTurno,
  pagarDeuda,
  pagarConNada,
  tickVictoria,
  tocarConexion,
  migrarHostSiNecesario,
  saltarTurnoSiDesconectado,
  vistaPublica,
  vistaPrivada,
  jugador,
  yaAplicada,
  marcarAplicada,
  chequearVictoria,
  jugarOtraVez,
  volverALobby,
} from "./vanny-deal/motor";
import {
  aplicarPendiente,
  cerrarEspionaje,
  jugarCartaAccion,
  pasarNoGracias,
  tickEspionaje,
  tickJuicio,
  tickNoGracias,
  usarNoGracias,
  votarJuicio,
} from "./vanny-deal/acciones";
import type { PayloadAccion } from "./vanny-deal/acciones";
import {
  normalizarCodigo,
  storageDelete,
  storageExists,
  storageGet,
  storageSet,
} from "./sala-storage";

const NS = "vanny-deal";

async function cargar(codigo: string): Promise<SalaVannyDeal | null> {
  const sala = await storageGet<SalaVannyDeal>(NS, codigo);
  if (!sala) return null;
  return sala;
}

async function guardar(sala: SalaVannyDeal): Promise<void> {
  await storageSet(NS, sala.codigo, sala);
}

// Correr ticks de tiempo antes de devolver estado (victoria por tiempo, NG, etc.)
function correrTicks(sala: SalaVannyDeal): void {
  tickNoGracias(sala);
  tickEspionaje(sala);
  tickJuicio(sala);
  saltarTurnoSiDesconectado(sala);
  tickVictoria(sala);
}

export async function crearSala(
  nombreHost: string,
): Promise<{ sala: SalaVannyDeal; jugadorId: string }> {
  let { sala, jugadorId } = crearSalaEnMemoria(nombreHost);
  // codigo único
  let intentos = 0;
  while (await storageExists(NS, sala.codigo)) {
    if (intentos++ > 20) break;
    const nuevo = crearSalaEnMemoria(nombreHost);
    sala = nuevo.sala;
    jugadorId = nuevo.jugadorId;
  }
  await guardar(sala);
  return { sala, jugadorId };
}

export async function obtenerSala(codigo: string): Promise<SalaVannyDeal | null> {
  const s = await cargar(normalizarCodigo(codigo));
  if (s) {
    correrTicks(s);
    await guardar(s);
  }
  return s;
}

export { vistaPublica, vistaPrivada };

// ─── Acción del cliente: dispatch ──────────────────────────────────

export type AccionCliente =
  | { tipo: "unirse"; nombre: string }
  | { tipo: "salir"; jugadorId: string }
  | {
      tipo: "configurar";
      jugadorId: string;
      cambios: Partial<SalaVannyDeal["config"]>;
    }
  | { tipo: "iniciarPartida"; jugadorId: string }
  | {
      tipo: "jugarPropiedad";
      jugadorId: string;
      cartaId: string;
      colorElegido?: import("./vanny-deal/types").Color;
    }
  | { tipo: "jugarDinero"; jugadorId: string; cartaId: string }
  | {
      tipo: "jugarAccion";
      jugadorId: string;
      cartaId: string;
      payload: PayloadAccion;
    }
  | {
      tipo: "moverComodin";
      jugadorId: string;
      cartaId: string;
      nuevoColor: import("./vanny-deal/types").Color;
    }
  | { tipo: "usarNoGracias"; jugadorId: string; cartaId: string }
  | { tipo: "pasarNoGracias"; jugadorId: string }
  | { tipo: "pagar"; jugadorId: string; cartas: string[] }
  | { tipo: "pagarConNada"; jugadorId: string }
  | { tipo: "votarJuicio"; jugadorId: string; voto: "si" | "no" }
  | { tipo: "cerrarEspionaje"; jugadorId: string }
  | {
      tipo: "terminarTurno";
      jugadorId: string;
      descartarIds?: string[];
    }
  | { tipo: "tocar"; jugadorId: string }
  | { tipo: "jugarOtraVez"; jugadorId: string }
  | { tipo: "volverALobby"; jugadorId: string };

export interface ResultadoAccion {
  ok: boolean;
  error?: string;
  datos?: unknown;
}

export async function aplicarAccionCliente(
  codigo: string,
  actionId: string,
  accion: AccionCliente,
): Promise<ResultadoAccion> {
  const sala = await cargar(normalizarCodigo(codigo));
  if (!sala) return { ok: false, error: "Sala no encontrada" };

  if (yaAplicada(sala, actionId)) {
    return { ok: true, datos: { idempotente: true } };
  }

  correrTicks(sala);
  if (accion.tipo !== "tocar") {
    const jug = jugador(sala, (accion as { jugadorId?: string }).jugadorId ?? "");
    if (jug) tocarConexion(sala, jug.id);
  }

  let res: { error?: string } = {};
  switch (accion.tipo) {
    case "unirse": {
      const r = unirseSala(sala, accion.nombre);
      if ("error" in r) {
        res = { error: r.error };
      } else {
        marcarAplicada(sala, actionId);
        await guardar(sala);
        return { ok: true, datos: { jugadorId: r.jugadorId } };
      }
      break;
    }
    case "salir":
      salirSala(sala, accion.jugadorId);
      migrarHostSiNecesario(sala);
      break;
    case "configurar":
      res = configurarSala(sala, accion.jugadorId, accion.cambios);
      break;
    case "iniciarPartida":
      res = iniciarPartida(sala, accion.jugadorId);
      break;
    case "jugarPropiedad":
      res = jugarPropiedad(sala, accion.jugadorId, accion.cartaId, accion.colorElegido);
      break;
    case "jugarDinero":
      res = jugarComoDinero(sala, accion.jugadorId, accion.cartaId);
      break;
    case "jugarAccion":
      res = jugarCartaAccion(sala, accion.jugadorId, accion.cartaId, accion.payload);
      break;
    case "moverComodin":
      res = moverComodinColor(sala, accion.jugadorId, accion.cartaId, accion.nuevoColor);
      break;
    case "usarNoGracias":
      res = usarNoGracias(sala, accion.jugadorId, accion.cartaId);
      break;
    case "pasarNoGracias":
      res = pasarNoGracias(sala, accion.jugadorId);
      break;
    case "pagar":
      res = pagarDeuda(sala, accion.jugadorId, accion.cartas);
      break;
    case "pagarConNada":
      res = pagarConNada(sala, accion.jugadorId);
      break;
    case "votarJuicio":
      res = votarJuicio(sala, accion.jugadorId, accion.voto);
      break;
    case "cerrarEspionaje":
      res = cerrarEspionaje(sala, accion.jugadorId);
      break;
    case "terminarTurno":
      res = terminarTurno(sala, accion.jugadorId, accion.descartarIds);
      break;
    case "tocar":
      tocarConexion(sala, accion.jugadorId);
      break;
    case "jugarOtraVez":
      res = jugarOtraVez(sala, accion.jugadorId);
      break;
    case "volverALobby":
      res = volverALobby(sala, accion.jugadorId);
      break;
  }

  if (res.error) return { ok: false, error: res.error };

  chequearVictoria(sala);
  marcarAplicada(sala, actionId);
  await guardar(sala);
  return { ok: true };
}

export async function eliminarSala(codigo: string): Promise<void> {
  await storageDelete(NS, normalizarCodigo(codigo));
}
