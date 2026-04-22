import { COLORES_LISTA } from "./colores";
import { construirMazo } from "./mazo";
import type {
  Carta,
  Color,
  ConfigVannyDeal,
  CondicionVictoria,
  EventoLog,
  Fase,
  Jugador,
  ModoJuego,
  PendienteAccion,
  SalaVannyDeal,
  SetMesa,
  VistaPublica,
  VistaPrivada,
} from "./types";
import {
  avatarRandom,
  clamp,
  compactarMesa,
  encontrarSetCon,
  generarCodigoSala,
  generarId,
  generarSeed,
  mezclarSeed,
  nuevoIdCarta,
  obtenerOSetColor,
  rentaSet,
  setEstaCompleto,
  setsCompletosDe,
  setsCompletosDeColoresDistintos,
  valorTotal,
} from "./utils";

export const MAX_CARTAS_MANO = 7;
export const CARTAS_POR_TURNO = 3;
export const CARTAS_AL_ROBAR = 2;
export const CARTAS_INICIALES = 5;
export const CARTAS_MANO_VACIA = 5;
export const VENTANA_NO_GRACIAS_MS = 5_000;
export const ESPIONAJE_MS = 10_000;
export const VOTACION_JUICIO_MS = 15_000;

// ─── Inicialización ────────────────────────────────────────────────

export function crearSala(nombreHost: string): {
  sala: SalaVannyDeal;
  jugadorId: string;
} {
  const codigo = generarCodigoSala();
  const jugadorId = generarId();
  const avatar = avatarRandom();
  const sala: SalaVannyDeal = {
    codigo,
    hostId: jugadorId,
    fase: "lobby",
    jugadores: [crearJugador(jugadorId, nombreHost, avatar)],
    config: {
      modo: "clasico",
      victoria: { tipo: "sets", cantidad: 3 },
      limiteTurnoSeg: 60,
    },
    mazo: [],
    descarte: [],
    cartas: {},
    turnoIdx: 0,
    cartasJugadasEnTurno: 0,
    cartasRobadasEnTurno: 0,
    inicioTurno: 0,
    megafonoActivo: false,
    pago: null,
    noGracias: null,
    espionaje: null,
    juicio: null,
    log: [],
    accionesAplicadas: {},
    ganador: null,
    creadaEn: Date.now(),
    partidaInicio: null,
    estadisticas: {
      [jugadorId]: { ataques: 0, defensas: 0, cartasJugadas: 0, vecesAtacado: 0 },
    },
  };
  return { sala, jugadorId };
}

function crearJugador(id: string, nombre: string, avatar: string): Jugador {
  return {
    id,
    nombre: (nombre || "Jugador").trim().slice(0, 20),
    avatar,
    conectado: true,
    ultimoVisto: Date.now(),
    mano: [],
    banco: [],
    mesa: [],
    cartasJugadas: 0,
    ataquesHechos: 0,
    defensasHechas: 0,
  };
}

export function unirseSala(
  sala: SalaVannyDeal,
  nombre: string,
): { jugadorId: string } | { error: string } {
  if (sala.fase !== "lobby") return { error: "La partida ya empezó" };
  if (sala.jugadores.length >= 5) return { error: "Sala llena (máx 5)" };
  const limpio = (nombre || "").trim().slice(0, 20);
  if (!limpio) return { error: "Nombre inválido" };
  const usados = sala.jugadores.map((j) => j.avatar);
  const id = generarId();
  sala.jugadores.push(crearJugador(id, limpio, avatarRandom(usados)));
  sala.estadisticas[id] = { ataques: 0, defensas: 0, cartasJugadas: 0, vecesAtacado: 0 };
  log(sala, `${limpio} se unió a la sala`);
  return { jugadorId: id };
}

export function salirSala(sala: SalaVannyDeal, jugadorId: string): void {
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return;
  if (sala.fase === "lobby") {
    sala.jugadores = sala.jugadores.filter((x) => x.id !== jugadorId);
    if (sala.hostId === jugadorId && sala.jugadores.length > 0) {
      sala.hostId = sala.jugadores[0].id;
    }
    log(sala, `${j.nombre} salió de la sala`);
  } else {
    j.conectado = false;
    log(sala, `${j.nombre} se desconectó`);
  }
}

export function configurarSala(
  sala: SalaVannyDeal,
  jugadorId: string,
  parcial: Partial<ConfigVannyDeal>,
): { error?: string } {
  if (sala.fase !== "lobby") return { error: "Ya empezó" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  if (parcial.modo) sala.config.modo = parcial.modo;
  if (parcial.victoria) sala.config.victoria = parcial.victoria;
  if (parcial.limiteTurnoSeg !== undefined) sala.config.limiteTurnoSeg = parcial.limiteTurnoSeg;
  return {};
}

export function iniciarPartida(
  sala: SalaVannyDeal,
  jugadorId: string,
): { error?: string } {
  if (sala.fase !== "lobby") return { error: "Ya empezó" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión puede iniciar" };
  if (sala.jugadores.length < 2) return { error: "Mínimo 2 jugadores" };
  if (sala.jugadores.length > 5) return { error: "Máximo 5 jugadores" };

  const mazo = construirMazo();
  sala.cartas = mazo.cartas;
  sala.mazo = mezclarSeed(mazo.ids, generarSeed());
  sala.descarte = [];
  // Repartir 5 a cada uno
  for (const j of sala.jugadores) {
    j.mano = [];
    j.banco = [];
    j.mesa = [];
    j.cartasJugadas = 0;
    j.ataquesHechos = 0;
    j.defensasHechas = 0;
    for (let i = 0; i < CARTAS_INICIALES; i++) {
      const id = sala.mazo.shift();
      if (id) j.mano.push(id);
    }
  }
  sala.fase = "jugando";
  sala.turnoIdx = 0;
  sala.cartasJugadasEnTurno = 0;
  sala.cartasRobadasEnTurno = 0;
  sala.megafonoActivo = false;
  sala.pago = null;
  sala.noGracias = null;
  sala.espionaje = null;
  sala.juicio = null;
  sala.partidaInicio = Date.now();
  sala.inicioTurno = Date.now();
  sala.ganador = null;
  for (const j of sala.jugadores) {
    sala.estadisticas[j.id] = { ataques: 0, defensas: 0, cartasJugadas: 0, vecesAtacado: 0 };
  }
  // Auto-robar las 2 cartas del primer jugador
  robarInicio(sala);
  log(sala, `¡Empieza la partida! Modo ${nombreModo(sala.config.modo)}`);
  return {};
}

function nombreModo(m: ModoJuego): string {
  return m === "rapido" ? "Rápido" : "Clásico";
}

// ─── Robar / mazo ──────────────────────────────────────────────────

function robarUna(sala: SalaVannyDeal): string | null {
  if (sala.mazo.length === 0) {
    // re-mezclar descarte si no hay cartas
    if (sala.descarte.length === 0) return null;
    sala.mazo = mezclarSeed(sala.descarte, generarSeed());
    sala.descarte = [];
    log(sala, "Se rebarajó el descarte como nuevo mazo");
  }
  return sala.mazo.shift() ?? null;
}

function robarN(sala: SalaVannyDeal, jugadorId: string, n: number): number {
  const j = sala.jugadores.find((x) => x.id === jugadorId);
  if (!j) return 0;
  let r = 0;
  for (let i = 0; i < n; i++) {
    const id = robarUna(sala);
    if (!id) break;
    j.mano.push(id);
    r++;
  }
  return r;
}

function robarInicio(sala: SalaVannyDeal): void {
  const turno = sala.jugadores[sala.turnoIdx];
  if (!turno) return;
  const cantidad = turno.mano.length === 0 ? CARTAS_MANO_VACIA : CARTAS_AL_ROBAR;
  const r = robarN(sala, turno.id, cantidad);
  sala.cartasRobadasEnTurno = r;
}

// ─── Log ───────────────────────────────────────────────────────────

export function log(sala: SalaVannyDeal, texto: string): void {
  const e: EventoLog = { id: generarId(), ts: Date.now(), texto };
  sala.log.push(e);
  if (sala.log.length > 80) sala.log = sala.log.slice(-80);
}

// ─── Idempotencia ──────────────────────────────────────────────────

export function yaAplicada(sala: SalaVannyDeal, actionId: string): boolean {
  if (!actionId) return false;
  if (sala.accionesAplicadas[actionId]) return true;
  return false;
}

export function marcarAplicada(sala: SalaVannyDeal, actionId: string): void {
  if (!actionId) return;
  sala.accionesAplicadas[actionId] = Date.now();
  // purgar viejas (>1h)
  const corte = Date.now() - 60 * 60 * 1000;
  for (const k of Object.keys(sala.accionesAplicadas)) {
    if (sala.accionesAplicadas[k] < corte) delete sala.accionesAplicadas[k];
  }
}

// ─── Helpers de jugador / mesa ─────────────────────────────────────

export function jugador(sala: SalaVannyDeal, id: string): Jugador | undefined {
  return sala.jugadores.find((j) => j.id === id);
}

export function turnoActual(sala: SalaVannyDeal): Jugador | undefined {
  return sala.jugadores[sala.turnoIdx];
}

export function esTurno(sala: SalaVannyDeal, jugadorId: string): boolean {
  return turnoActual(sala)?.id === jugadorId;
}

function quitarDeMano(j: Jugador, cartaId: string): boolean {
  const i = j.mano.indexOf(cartaId);
  if (i === -1) return false;
  j.mano.splice(i, 1);
  return true;
}

function quitarDelDescarte(sala: SalaVannyDeal, cartaId: string): boolean {
  const i = sala.descarte.indexOf(cartaId);
  if (i === -1) return false;
  sala.descarte.splice(i, 1);
  return true;
}

function quitarDeBanco(j: Jugador, cartaId: string): boolean {
  const i = j.banco.indexOf(cartaId);
  if (i === -1) return false;
  j.banco.splice(i, 1);
  return true;
}

function quitarDeMesa(j: Jugador, cartaId: string): { color: Color; casa: boolean; torre: boolean } | null {
  for (const set of j.mesa) {
    const i = set.cartaIds.indexOf(cartaId);
    if (i !== -1) {
      set.cartaIds.splice(i, 1);
      const meta = { color: set.color, casa: set.casa, torre: set.torre };
      if (set.cartaIds.length === 0) {
        // si el set se vacía, casa/torre vuelven al descarte
        // (se manejará en quien llama)
        compactarMesa(j);
      }
      return meta;
    }
  }
  return null;
}

// Devuelve los ids de cartas en mesa que NO están en sets completos
export function propiedadesNoEnSetCompleto(j: Jugador, sala: SalaVannyDeal): string[] {
  const ids: string[] = [];
  for (const set of j.mesa) {
    if (!setEstaCompleto(set, sala.cartas)) {
      for (const id of set.cartaIds) ids.push(id);
    }
  }
  return ids;
}

// Devuelve los sets COMPLETOS de un jugador
export function setsCompletosId(j: Jugador, sala: SalaVannyDeal): SetMesa[] {
  return setsCompletosDe(j, sala.cartas);
}

// ─── Terminar turno ────────────────────────────────────────────────

export function terminarTurno(
  sala: SalaVannyDeal,
  jugadorId: string,
  descartarIds?: string[],
): { error?: string; descarteRequerido?: number } {
  if (sala.fase !== "jugando") return { error: "No es momento de terminar turno" };
  if (!esTurno(sala, jugadorId)) return { error: "No es tu turno" };
  const j = jugador(sala, jugadorId);
  if (!j) return { error: "Jugador inválido" };

  // Si hay deuda pendiente, NO se puede terminar
  if (sala.pago) return { error: "Hay un pago pendiente" };
  if (sala.noGracias) return { error: "Hay una ventana abierta" };

  // Descartar exceso si hay
  const exceso = j.mano.length - MAX_CARTAS_MANO;
  if (exceso > 0) {
    if (!descartarIds || descartarIds.length !== exceso) {
      return { error: `Tenés que descartar ${exceso} carta(s)`, descarteRequerido: exceso };
    }
    for (const id of descartarIds) {
      if (!j.mano.includes(id)) return { error: "Carta inválida en descarte" };
    }
    for (const id of descartarIds) {
      quitarDeMano(j, id);
      sala.descarte.unshift(id);
    }
  }

  // Avanzar turno
  sala.turnoIdx = (sala.turnoIdx + 1) % sala.jugadores.length;
  sala.cartasJugadasEnTurno = 0;
  sala.cartasRobadasEnTurno = 0;
  sala.megafonoActivo = false;
  sala.inicioTurno = Date.now();
  robarInicio(sala);
  log(sala, `Turno de ${turnoActual(sala)?.nombre ?? "?"}`);
  return {};
}

// ─── Jugar propiedad / dinero ─────────────────────────────────────

export function jugarPropiedad(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartaId: string,
  colorElegido?: Color,
): { error?: string } {
  if (sala.fase !== "jugando") return { error: "No es momento" };
  if (!esTurno(sala, jugadorId)) return { error: "No es tu turno" };
  if (sala.cartasJugadasEnTurno >= CARTAS_POR_TURNO) return { error: "Ya jugaste 3 cartas" };
  const j = jugador(sala, jugadorId)!;
  if (!j.mano.includes(cartaId)) return { error: "Esa carta no está en tu mano" };
  const c = sala.cartas[cartaId];
  if (!c) return { error: "Carta inválida" };

  let color: Color;
  if (c.tipo === "propiedad") {
    color = c.color;
  } else if (c.tipo === "bicolor") {
    if (!colorElegido || !c.colores.includes(colorElegido))
      return { error: "Elegí uno de los 2 colores" };
    color = colorElegido;
  } else if (c.tipo === "arcoiris") {
    if (!colorElegido) return { error: "Elegí color" };
    color = colorElegido;
  } else {
    return { error: "Esta carta no es propiedad" };
  }
  quitarDeMano(j, cartaId);
  const set = obtenerOSetColor(j, color);
  set.cartaIds.push(cartaId);
  sala.cartasJugadasEnTurno += 1;
  j.cartasJugadas += 1;
  sala.estadisticas[j.id].cartasJugadas += 1;
  log(sala, `${j.nombre} colocó propiedad`);
  chequearVictoria(sala);
  return {};
}

export function jugarComoDinero(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartaId: string,
): { error?: string } {
  if (sala.fase !== "jugando") return { error: "No es momento" };
  if (!esTurno(sala, jugadorId)) return { error: "No es tu turno" };
  if (sala.cartasJugadasEnTurno >= CARTAS_POR_TURNO) return { error: "Ya jugaste 3 cartas" };
  const j = jugador(sala, jugadorId)!;
  if (!j.mano.includes(cartaId)) return { error: "Esa carta no está en tu mano" };
  const c = sala.cartas[cartaId];
  if (!c) return { error: "Carta inválida" };
  if (c.tipo === "propiedad" || c.tipo === "bicolor" || c.tipo === "arcoiris")
    return { error: "Las propiedades no van al banco" };
  quitarDeMano(j, cartaId);
  j.banco.push(cartaId);
  sala.cartasJugadasEnTurno += 1;
  j.cartasJugadas += 1;
  sala.estadisticas[j.id].cartasJugadas += 1;
  log(sala, `${j.nombre} guardó $${c.valor}M en su banco`);
  return {};
}

// Mover comodín de color (solo en TU turno, no consume jugada)
export function moverComodinColor(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartaId: string,
  nuevoColor: Color,
): { error?: string } {
  if (!esTurno(sala, jugadorId)) return { error: "Solo en tu turno" };
  const j = jugador(sala, jugadorId)!;
  const ubic = encontrarSetCon(j, cartaId);
  if (!ubic) return { error: "Esa carta no está en tu mesa" };
  const c = sala.cartas[cartaId];
  if (!c) return { error: "Carta inválida" };
  if (c.tipo === "bicolor") {
    if (!c.colores.includes(nuevoColor)) return { error: "Color inválido para bicolor" };
  } else if (c.tipo !== "arcoiris") {
    return { error: "Solo se mueven comodines" };
  }
  // Si el set actual queda completo, ¿podés sacarle? Regla: NO podés mover una carta que rompería un set completo si era el único soporte.
  // Simplificación: permitido siempre, salvo que removerla deje el set como solo arcoíris (no completaba) — eso ya se manejará en chequear.
  ubic.set.cartaIds = ubic.set.cartaIds.filter((id) => id !== cartaId);
  if (ubic.set.cartaIds.length === 0) {
    if (ubic.set.casa || ubic.set.torre) {
      // casa/torre vuelven al banco como dinero al descarte
      if (ubic.set.casa) sala.descarte.unshift(buscarCartaTipo(sala, "casa"));
      if (ubic.set.torre) sala.descarte.unshift(buscarCartaTipo(sala, "torre"));
    }
    compactarMesa(j);
  }
  const destino = obtenerOSetColor(j, nuevoColor);
  destino.cartaIds.push(cartaId);
  log(sala, `${j.nombre} movió un comodín`);
  chequearVictoria(sala);
  return {};
}

// helper: id de carta de un tipo (no usado del todo, pero útil)
function buscarCartaTipo(sala: SalaVannyDeal, tipo: "casa" | "torre"): string {
  for (const id of Object.keys(sala.cartas)) {
    const c = sala.cartas[id];
    if (c.tipo === tipo) return id;
  }
  return "";
}

// ─── Pago de deudas ────────────────────────────────────────────────

export function calcularDeudaPagada(
  j: Jugador,
  sala: SalaVannyDeal,
  cartas: string[],
): number {
  let total = 0;
  for (const id of cartas) {
    const c = sala.cartas[id];
    if (!c) continue;
    if (j.banco.includes(id)) total += c.valor;
    else {
      // mesa
      for (const set of j.mesa) {
        if (set.cartaIds.includes(id)) {
          total += c.valor;
          break;
        }
      }
    }
  }
  return total;
}

export function pagarDeuda(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartas: string[],
): { error?: string } {
  if (sala.fase !== "pago") return { error: "No hay pago pendiente" };
  const pago = sala.pago;
  if (!pago) return { error: "No hay pago" };
  if (!pago.deudores.includes(jugadorId)) return { error: "No te toca pagar" };
  const deudor = jugador(sala, jugadorId)!;
  const acreedor = jugador(sala, pago.acreedorId);
  if (!acreedor) return { error: "Acreedor inválido" };

  // Validar pertenencia
  const dineroIds: string[] = [];
  const propiedadIds: string[] = [];
  for (const id of cartas) {
    if (deudor.banco.includes(id)) dineroIds.push(id);
    else {
      let enMesa = false;
      for (const set of deudor.mesa) {
        if (set.cartaIds.includes(id)) {
          enMesa = true;
          break;
        }
      }
      if (enMesa) propiedadIds.push(id);
      else return { error: "Carta no encontrada" };
    }
  }
  const total = calcularDeudaPagada(deudor, sala, cartas);

  // Si no llega, debe vaciarse
  const valorRestante = valorTotal(deudor, sala.cartas);
  if (total < pago.monto && total < valorRestante) {
    return { error: "Tenés más para pagar — debés dar todo lo que puedas" };
  }

  // Mover dinero
  for (const id of dineroIds) {
    quitarDeBanco(deudor, id);
    acreedor.banco.push(id);
  }
  // Mover propiedades
  for (const id of propiedadIds) {
    const meta = quitarDeMesa(deudor, id);
    if (!meta) continue;
    const c = sala.cartas[id];
    if (!c) continue;
    let colorDestino: Color = meta.color;
    if (c.tipo === "bicolor") {
      // mantenemos en el color que tenía
      colorDestino = meta.color;
    }
    const destino = obtenerOSetColor(acreedor, colorDestino);
    destino.cartaIds.push(id);
    // casa/torre del set original NO se transfieren con propiedad individual,
    // se quedan flotando: vuelven al descarte si el set quedó vacío (gestionado en quitarDeMesa)
  }
  pago.pagados[jugadorId] = { dineroIds, propiedadIds };
  pago.deudores = pago.deudores.filter((d) => d !== jugadorId);

  log(
    sala,
    `${deudor.nombre} pagó ${total < pago.monto ? "lo que podía" : `$${total}M`} a ${acreedor.nombre}`,
  );

  if (pago.deudores.length === 0) {
    sala.pago = null;
    sala.fase = "jugando";
  }
  chequearVictoria(sala);
  return {};
}

// Cuando un jugador no tiene NADA y debe pagar, "pago vacío"
export function pagarConNada(
  sala: SalaVannyDeal,
  jugadorId: string,
): { error?: string } {
  if (sala.fase !== "pago") return { error: "No hay pago pendiente" };
  const pago = sala.pago;
  if (!pago) return { error: "No hay pago" };
  if (!pago.deudores.includes(jugadorId)) return { error: "No te toca" };
  const deudor = jugador(sala, jugadorId)!;
  const v = valorTotal(deudor, sala.cartas);
  if (v > 0) return { error: "Tenés cosas para pagar" };
  pago.pagados[jugadorId] = { dineroIds: [], propiedadIds: [] };
  pago.deudores = pago.deudores.filter((d) => d !== jugadorId);
  log(sala, `${deudor.nombre} no tenía nada para pagar`);
  if (pago.deudores.length === 0) {
    sala.pago = null;
    sala.fase = "jugando";
  }
  return {};
}

// ─── Victoria ──────────────────────────────────────────────────────

export function chequearVictoria(sala: SalaVannyDeal): void {
  if (sala.fase === "fin") return;
  const victoria = sala.config.victoria;
  if (victoria.tipo === "sets") {
    for (const j of sala.jugadores) {
      if (setsCompletosDeColoresDistintos(j, sala.cartas) >= victoria.cantidad) {
        sala.fase = "fin";
        sala.ganador = {
          jugadorIds: [j.id],
          motivo: `${victoria.cantidad} sets completos`,
        };
        log(sala, `🎉 ${j.nombre} GANÓ con ${victoria.cantidad} sets completos`);
        return;
      }
    }
  } else if (victoria.tipo === "valor") {
    for (const j of sala.jugadores) {
      if (valorTotal(j, sala.cartas) >= victoria.millones) {
        sala.fase = "fin";
        sala.ganador = {
          jugadorIds: [j.id],
          motivo: `Llegó a $${victoria.millones}M`,
        };
        log(sala, `🎉 ${j.nombre} GANÓ por valor`);
        return;
      }
    }
  } else if (victoria.tipo === "tiempo") {
    if (!sala.partidaInicio) return;
    const elapsed = Date.now() - sala.partidaInicio;
    if (elapsed >= victoria.minutos * 60 * 1000) {
      const valores = sala.jugadores.map((j) => ({ id: j.id, v: valorTotal(j, sala.cartas) }));
      const max = Math.max(...valores.map((x) => x.v));
      const ganadores = valores.filter((x) => x.v === max).map((x) => x.id);
      sala.fase = "fin";
      sala.ganador = {
        jugadorIds: ganadores,
        motivo:
          ganadores.length === 1
            ? `Más valor en ${victoria.minutos} min ($${max}M)`
            : `Empate por valor ($${max}M)`,
      };
      log(sala, `🏁 Tiempo agotado. ${ganadores.length === 1 ? "Ganador" : "Empate"}.`);
    }
  }
}

// Llamar periódicamente al cargar la sala (para victorias por tiempo)
export function tickVictoria(sala: SalaVannyDeal): void {
  if (sala.fase === "fin" || sala.fase === "lobby") return;
  chequearVictoria(sala);
}

// ─── Vistas ────────────────────────────────────────────────────────

export function vistaPublica(sala: SalaVannyDeal): VistaPublica {
  const topeId = sala.descarte[0];
  const tope = topeId ? sala.cartas[topeId] : null;
  return {
    codigo: sala.codigo,
    hostId: sala.hostId,
    fase: sala.fase,
    config: sala.config,
    jugadores: sala.jugadores.map((j) => {
      const valorTotalBanco = j.banco.reduce((s, id) => s + (sala.cartas[id]?.valor ?? 0), 0);
      return {
        id: j.id,
        nombre: j.nombre,
        avatar: j.avatar,
        conectado: j.conectado,
        cantidadMano: j.mano.length,
        banco: {
          valorTotal: valorTotalBanco,
          cartas: j.banco.map((id) => ({ id, valor: sala.cartas[id]?.valor ?? 0 })),
        },
        mesa: j.mesa,
        setsCompletos: setsCompletosDeColoresDistintos(j, sala.cartas),
      };
    }),
    turnoIdx: sala.turnoIdx,
    cartasJugadasEnTurno: sala.cartasJugadasEnTurno,
    cartasRobadasEnTurno: sala.cartasRobadasEnTurno,
    inicioTurno: sala.inicioTurno,
    limiteTurnoSeg: sala.config.limiteTurnoSeg,
    cantidadMazo: sala.mazo.length,
    cantidadDescarte: sala.descarte.length,
    pago: sala.pago,
    noGracias: sala.noGracias,
    espionaje: sala.espionaje,
    juicio: sala.juicio,
    log: sala.log.slice(-20),
    ganador: sala.ganador,
    estadisticas: sala.estadisticas,
    topeDescarte: tope,
  };
}

export function vistaPrivada(sala: SalaVannyDeal, jugadorId: string): VistaPrivada {
  const j = jugador(sala, jugadorId);
  const mano = j ? j.mano.map((id) => sala.cartas[id]).filter((c): c is Carta => Boolean(c)) : [];
  let manoEspiada: Carta[] | null = null;
  if (sala.espionaje && sala.espionaje.miradorId === jugadorId) {
    const obj = jugador(sala, sala.espionaje.objetivoId);
    if (obj) {
      manoEspiada = obj.mano.map((id) => sala.cartas[id]).filter((c): c is Carta => Boolean(c));
    }
  }
  return { jugadorId, mano, manoEspiada };
}

// ─── Reconexión ────────────────────────────────────────────────────

export function tocarConexion(sala: SalaVannyDeal, jugadorId: string): void {
  const j = jugador(sala, jugadorId);
  if (!j) return;
  j.conectado = true;
  j.ultimoVisto = Date.now();
}

// El host migra al siguiente jugador conectado si el host se va
export function migrarHostSiNecesario(sala: SalaVannyDeal): void {
  const host = jugador(sala, sala.hostId);
  if (host && host.conectado) return;
  const sig = sala.jugadores.find((j) => j.conectado);
  if (sig) {
    sala.hostId = sig.id;
    log(sala, `${sig.nombre} es ahora el anfitrión`);
  }
}

// Dejar que el turno avance si el jugador en turno está desconectado >60s
export function saltarTurnoSiDesconectado(sala: SalaVannyDeal): boolean {
  if (sala.fase !== "jugando") return false;
  const t = turnoActual(sala);
  if (!t) return false;
  if (t.conectado) return false;
  if (Date.now() - t.ultimoVisto < 60_000) return false;
  log(sala, `${t.nombre} no volvió a tiempo, se salta su turno`);
  sala.turnoIdx = (sala.turnoIdx + 1) % sala.jugadores.length;
  sala.cartasJugadasEnTurno = 0;
  sala.megafonoActivo = false;
  sala.inicioTurno = Date.now();
  robarInicio(sala);
  return true;
}

// Re-empezar partida con los mismos jugadores
export function jugarOtraVez(sala: SalaVannyDeal, jugadorId: string): { error?: string } {
  if (sala.fase !== "fin") return { error: "Partida en curso" };
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  // Mantenemos jugadores y config; reiniciamos partida
  return iniciarPartida(sala, jugadorId);
}

export function volverALobby(sala: SalaVannyDeal, jugadorId: string): { error?: string } {
  if (sala.hostId !== jugadorId) return { error: "Solo el anfitrión" };
  sala.fase = "lobby";
  sala.cartas = {};
  sala.mazo = [];
  sala.descarte = [];
  sala.pago = null;
  sala.noGracias = null;
  sala.espionaje = null;
  sala.juicio = null;
  sala.megafonoActivo = false;
  sala.ganador = null;
  for (const j of sala.jugadores) {
    j.mano = [];
    j.banco = [];
    j.mesa = [];
  }
  return {};
}

// re-export interno por conveniencia
export { COLORES_LISTA, generarId };
export type { PendienteAccion };
