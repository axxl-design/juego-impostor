// Lógica de cartas de acción especial + No Gracias + pagos + juicio popular + espionaje.
//
// SIMPLIFICACIONES DOCUMENTADAS:
// - "No, Gracias" solo aplica a acciones dirigidas a UN jugador (rentaUniversal,
//   impuestoImperial, roboSelectivo, intercambioForzado, asaltoMonopolio, espionaje,
//   auditoriaFiscal). Para acciones multi-jugador (cumpleaños, rentaBicolor) la
//   acción procede inmediatamente sin ventana NG, tal como se indicó en el prompt
//   cuando tuvimos que recortar complejidad.
// - Las cascadas NG funcionan así: cadena par = ataque procede, cadena impar = ataque cancelado.
//   El servidor valida que el jugador que ofrece NG sea el objetivo correcto en cada nivel.

import type {
  AccionTipo,
  Color,
  Pago,
  NoGraciasContexto,
  SalaVannyDeal,
  JuicioPopular,
} from "./types";
import { COLORES, cantidadEnSet } from "./colores";
import {
  CARTAS_POR_TURNO,
  chequearVictoria,
  ESPIONAJE_MS,
  esTurno,
  jugador,
  log,
  propiedadesNoEnSetCompleto,
  setsCompletosId,
  turnoActual,
  VENTANA_NO_GRACIAS_MS,
  VOTACION_JUICIO_MS,
} from "./motor";
import {
  compactarMesa,
  encontrarSetCon,
  generarId,
  obtenerOSetColor,
  rentaSet,
  setEstaCompleto,
} from "./utils";

const ACCIONES_NG_SIMPLE = new Set<AccionTipo>([
  "rentaUniversal",
  "impuestoImperial",
  "roboSelectivo",
  "intercambioForzado",
  "asaltoMonopolio",
  "espionaje",
  "auditoriaFiscal",
]);

const ACCIONES_MULTI = new Set<AccionTipo>(["cumpleanios", "rentaBicolor"]);

// ─── Entrada: jugar carta de acción ────────────────────────────────

export interface PayloadAccion {
  objetivoJugadorId?: string;
  objetivoCartaId?: string;
  ofrecidaCartaId?: string;
  setColor?: Color; // para asaltoMonopolio
  veredictoJuicio?: "robarPropiedad" | "cobrar3M";
  setColorRenta?: Color; // para rentaUniversal (color elegido), rentaBicolor (cual de los dos)
  agregarACartaId?: string; // para casa/torre: a qué set (id de una carta del set)
}

export function jugarCartaAccion(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartaId: string,
  payload: PayloadAccion,
): { error?: string } {
  if (sala.fase !== "jugando") return { error: "No es momento" };
  if (!esTurno(sala, jugadorId)) return { error: "No es tu turno" };
  if (sala.cartasJugadasEnTurno >= CARTAS_POR_TURNO)
    return { error: "Ya jugaste 3 cartas" };
  const j = jugador(sala, jugadorId)!;
  if (!j.mano.includes(cartaId)) return { error: "Carta no está en tu mano" };
  const carta = sala.cartas[cartaId];
  if (!carta) return { error: "Carta inválida" };
  if (carta.tipo !== "accion" && carta.tipo !== "casa" && carta.tipo !== "torre")
    return { error: "No es carta de acción" };

  const tipo: AccionTipo | null = carta.tipo === "casa"
    ? "casa"
    : carta.tipo === "torre"
      ? "torre"
      : carta.accion;

  if (!tipo) return { error: "Tipo inválido" };

  // Consumir carta de la mano y contar jugada
  const consumir = () => {
    const i = j.mano.indexOf(cartaId);
    if (i !== -1) j.mano.splice(i, 1);
    sala.descarte.unshift(cartaId);
    sala.cartasJugadasEnTurno += 1;
    j.cartasJugadas += 1;
    sala.estadisticas[j.id].cartasJugadas += 1;
  };

  // Multiplicador por Megáfono Viral (para acciones de renta/cobro)
  const multiplicador = sala.megafonoActivo ? 2 : 1;
  const consumirMegafono = () => {
    if (sala.megafonoActivo) sala.megafonoActivo = false;
  };

  // ─── Acciones sin objetivo / no atacables ─────────────────────────
  if (tipo === "pasaConmigo") {
    consumir();
    // robar 2 cartas extras
    for (let i = 0; i < 2; i++) {
      const id = sala.mazo.shift();
      if (id) j.mano.push(id);
    }
    log(sala, `${j.nombre} jugó ¡Pasá Conmigo!`);
    return {};
  }

  if (tipo === "casa") {
    // agregar a un set propio COMPLETO
    const setObjetivo = j.mesa.find(
      (s) =>
        setEstaCompleto(s, sala.cartas) &&
        !s.casa &&
        // excluye sets que no admiten casa/torre: servicios y marrón (por convención MonopolyDeal)
        s.color !== "servicio",
    );
    if (payload.agregarACartaId) {
      const u = encontrarSetCon(j, payload.agregarACartaId);
      if (!u || !setEstaCompleto(u.set, sala.cartas))
        return { error: "Elegí un set completo" };
      if (u.set.casa) return { error: "Ese set ya tiene casa" };
      if (u.set.color === "servicio") return { error: "Servicios no admiten casa" };
      consumir();
      u.set.casa = true;
      log(sala, `${j.nombre} puso una Casa`);
      chequearVictoria(sala);
      return {};
    }
    if (!setObjetivo) return { error: "Necesitás un set completo sin casa" };
    consumir();
    setObjetivo.casa = true;
    log(sala, `${j.nombre} puso una Casa`);
    chequearVictoria(sala);
    return {};
  }

  if (tipo === "torre") {
    if (!payload.agregarACartaId) return { error: "Elegí un set completo con casa" };
    const u = encontrarSetCon(j, payload.agregarACartaId);
    if (!u || !setEstaCompleto(u.set, sala.cartas))
      return { error: "Elegí un set completo" };
    if (!u.set.casa) return { error: "Necesita Casa primero" };
    if (u.set.torre) return { error: "Ese set ya tiene torre" };
    if (u.set.color === "servicio") return { error: "Servicios no admiten torre" };
    consumir();
    u.set.torre = true;
    log(sala, `${j.nombre} puso una Torre`);
    chequearVictoria(sala);
    return {};
  }

  if (tipo === "megafonoViral") {
    consumir();
    sala.megafonoActivo = true;
    log(sala, `${j.nombre} activó Megáfono Viral — la próxima acción vale doble`);
    return {};
  }

  // ─── Acciones multi-jugador (cumpleaños, rentaBicolor) ────────────
  if (tipo === "cumpleanios") {
    consumir();
    consumirMegafono();
    const monto = 2 * multiplicador;
    iniciarPago(sala, {
      acreedorId: j.id,
      monto,
      deudores: sala.jugadores.filter((x) => x.id !== j.id).map((x) => x.id),
      motivo: `Cumpleaños VANNY${multiplicador > 1 ? " (x2)" : ""}`,
    });
    j.ataquesHechos += 1;
    sala.estadisticas[j.id].ataques += 1;
    log(sala, `${j.nombre} jugó Cumpleaños VANNY — todos le pagan $${monto}M`);
    return {};
  }

  if (tipo === "rentaBicolor") {
    if (!payload.setColorRenta) return { error: "Elegí uno de los dos colores" };
    const cRenta = carta.tipo === "accion" ? carta.coloresRenta : undefined;
    if (!cRenta || !cRenta.includes(payload.setColorRenta))
      return { error: "Color inválido" };
    const color = payload.setColorRenta;
    const set = j.mesa.find((s) => s.color === color);
    if (!set || set.cartaIds.length === 0)
      return { error: `No tenés propiedades de ${COLORES[color].nombre}` };
    const monto = rentaSet(set, sala.cartas) * multiplicador;
    if (monto <= 0) return { error: "Renta cero" };
    consumir();
    consumirMegafono();
    iniciarPago(sala, {
      acreedorId: j.id,
      monto,
      deudores: sala.jugadores.filter((x) => x.id !== j.id).map((x) => x.id),
      motivo: `Renta Bicolor ${COLORES[color].nombre}${multiplicador > 1 ? " (x2)" : ""}`,
    });
    j.ataquesHechos += 1;
    sala.estadisticas[j.id].ataques += 1;
    log(sala, `${j.nombre} cobró Renta ${COLORES[color].nombre}: $${monto}M a todos`);
    return {};
  }

  // ─── Acciones con NG simple (1 objetivo) ──────────────────────────
  if (ACCIONES_NG_SIMPLE.has(tipo)) {
    const obj = sala.jugadores.find((x) => x.id === payload.objetivoJugadorId);
    if (!obj || obj.id === j.id) return { error: "Elegí un oponente" };

    // Validaciones específicas por tipo antes de abrir ventana:
    if (tipo === "rentaUniversal") {
      if (!payload.setColorRenta) return { error: "Elegí un color tuyo" };
      const s = j.mesa.find((x) => x.color === payload.setColorRenta);
      if (!s || s.cartaIds.length === 0) return { error: "No tenés esas propiedades" };
    }
    if (tipo === "roboSelectivo") {
      if (!payload.objetivoCartaId) return { error: "Elegí la propiedad a robar" };
      const disponibles = propiedadesNoEnSetCompleto(obj, sala);
      if (!disponibles.includes(payload.objetivoCartaId))
        return { error: "No podés robar esa propiedad" };
    }
    if (tipo === "intercambioForzado") {
      if (!payload.objetivoCartaId || !payload.ofrecidaCartaId)
        return { error: "Elegí propiedades a intercambiar" };
      const disponiblesObj = propiedadesNoEnSetCompleto(obj, sala);
      const disponiblesMio = propiedadesNoEnSetCompleto(j, sala);
      if (!disponiblesObj.includes(payload.objetivoCartaId))
        return { error: "Esa propiedad está en set completo" };
      if (!disponiblesMio.includes(payload.ofrecidaCartaId))
        return { error: "Tu propiedad está en set completo" };
    }
    if (tipo === "asaltoMonopolio") {
      if (!payload.setColor) return { error: "Elegí el color del set a robar" };
      const s = obj.mesa.find((x) => x.color === payload.setColor);
      if (!s || !setEstaCompleto(s, sala.cartas))
        return { error: "Ese oponente no tiene ese set completo" };
    }

    // Abrir ventana NG
    consumir();
    consumirMegafono();
    const pend = {
      tipo,
      origenJugadorId: j.id,
      cartaId,
      objetivoJugadorId: obj.id,
      objetivoCartaId: payload.objetivoCartaId,
      ofrecidaCartaId: payload.ofrecidaCartaId,
      setColor: payload.setColor ?? payload.setColorRenta,
      multiplicador,
    };
    sala.noGracias = {
      accionOriginal: pend,
      cadenaNoGracias: [],
      expira: Date.now() + VENTANA_NO_GRACIAS_MS,
      cancelable: true,
      esperandoRespuestaDe: [obj.id],
    };
    sala.fase = "noGraciasVentana";
    j.ataquesHechos += 1;
    sala.estadisticas[j.id].ataques += 1;
    log(sala, `${j.nombre} atacó a ${obj.nombre} con ${nombreAccion(tipo)}`);
    return {};
  }

  if (tipo === "juicioPopular") {
    const obj = sala.jugadores.find((x) => x.id === payload.objetivoJugadorId);
    if (!obj || obj.id === j.id) return { error: "Elegí un oponente" };
    if (!payload.veredictoJuicio) return { error: "Proponé un veredicto" };
    consumir();
    consumirMegafono();
    sala.juicio = {
      origenJugadorId: j.id,
      objetivoJugadorId: obj.id,
      veredicto: payload.veredictoJuicio,
      cartaId,
      votos: {},
      expira: Date.now() + VOTACION_JUICIO_MS,
    };
    sala.fase = "juicioPopular";
    log(
      sala,
      `${j.nombre} abrió un Juicio Popular contra ${obj.nombre}: ${
        payload.veredictoJuicio === "robarPropiedad" ? "robar 1 propiedad" : "cobrar $3M"
      }`,
    );
    return {};
  }

  return { error: "Acción no manejada" };
}

// ─── Aplicar acción (después de NG o directo) ──────────────────────

export function aplicarPendiente(sala: SalaVannyDeal): void {
  const ng = sala.noGracias;
  if (!ng) return;
  const cadena = ng.cadenaNoGracias.length;
  const procede = cadena % 2 === 0; // 0 = ataque procede, 1 = cancelado, 2 = procede...
  sala.noGracias = null;
  sala.fase = "jugando";
  if (!procede) {
    log(sala, "La acción fue anulada por No, Gracias");
    return;
  }
  aplicarAccionConcreta(sala, ng.accionOriginal);
}

function aplicarAccionConcreta(sala: SalaVannyDeal, pend: import("./types").PendienteAccion): void {
  const origen = jugador(sala, pend.origenJugadorId);
  if (!origen) return;
  const obj = pend.objetivoJugadorId ? jugador(sala, pend.objetivoJugadorId) : undefined;
  const mult = pend.multiplicador ?? 1;

  switch (pend.tipo) {
    case "rentaUniversal": {
      if (!obj || !pend.setColor) return;
      const s = origen.mesa.find((x) => x.color === pend.setColor);
      if (!s) return;
      const monto = rentaSet(s, sala.cartas) * mult;
      iniciarPago(sala, {
        acreedorId: origen.id,
        monto,
        deudores: [obj.id],
        motivo: `Renta ${COLORES[pend.setColor].nombre}${mult > 1 ? " (x2)" : ""}`,
      });
      log(sala, `${origen.nombre} cobró $${monto}M de renta a ${obj.nombre}`);
      break;
    }
    case "impuestoImperial": {
      if (!obj) return;
      const monto = 5 * mult;
      iniciarPago(sala, {
        acreedorId: origen.id,
        monto,
        deudores: [obj.id],
        motivo: `Impuesto Imperial${mult > 1 ? " (x2)" : ""}`,
      });
      log(sala, `${origen.nombre} le cobró $${monto}M a ${obj.nombre}`);
      break;
    }
    case "roboSelectivo": {
      if (!obj || !pend.objetivoCartaId) return;
      robarPropiedadIndividual(sala, origen.id, obj.id, pend.objetivoCartaId);
      break;
    }
    case "intercambioForzado": {
      if (!obj || !pend.objetivoCartaId || !pend.ofrecidaCartaId) return;
      intercambiarPropiedades(
        sala,
        origen.id,
        obj.id,
        pend.ofrecidaCartaId,
        pend.objetivoCartaId,
      );
      break;
    }
    case "asaltoMonopolio": {
      if (!obj || !pend.setColor) return;
      asaltarSet(sala, origen.id, obj.id, pend.setColor);
      break;
    }
    case "espionaje": {
      if (!obj) return;
      sala.espionaje = {
        miradorId: origen.id,
        objetivoId: obj.id,
        expira: Date.now() + ESPIONAJE_MS,
      };
      sala.fase = "espionajeAbierto";
      log(sala, `${origen.nombre} espía la mano de ${obj.nombre}`);
      break;
    }
    case "auditoriaFiscal": {
      if (!obj) return;
      const propCount = obj.mesa.reduce((s, x) => s + x.cartaIds.length, 0);
      const monto = propCount * mult;
      if (monto <= 0) {
        log(sala, `${obj.nombre} no tenía propiedades: Auditoría sin efecto`);
        break;
      }
      iniciarPago(sala, {
        acreedorId: origen.id,
        monto,
        deudores: [obj.id],
        motivo: `Auditoría Fiscal ($${monto}M)${mult > 1 ? " (x2)" : ""}`,
      });
      log(sala, `Auditoría: ${obj.nombre} le paga $${monto}M a ${origen.nombre}`);
      break;
    }
    default:
      break;
  }
  chequearVictoria(sala);
}

function nombreAccion(tipo: AccionTipo): string {
  const m: Record<AccionTipo, string> = {
    rentaUniversal: "Renta Universal",
    rentaBicolor: "Renta Bicolor",
    cumpleanios: "Cumpleaños VANNY",
    impuestoImperial: "Impuesto Imperial",
    pasaConmigo: "¡Pasá Conmigo!",
    roboSelectivo: "Robo Selectivo",
    intercambioForzado: "Intercambio Forzado",
    asaltoMonopolio: "Asalto al Monopolio",
    noGracias: "No, Gracias",
    casa: "Casa",
    torre: "Torre",
    espionaje: "Espionaje",
    auditoriaFiscal: "Auditoría Fiscal",
    megafonoViral: "Megáfono Viral",
    juicioPopular: "Juicio Popular",
  };
  return m[tipo];
}

// ─── Robo / intercambio / asalto ─────────────────────────────────

function robarPropiedadIndividual(
  sala: SalaVannyDeal,
  origenId: string,
  objetivoId: string,
  cartaId: string,
): void {
  const origen = jugador(sala, origenId);
  const obj = jugador(sala, objetivoId);
  if (!origen || !obj) return;
  const disponibles = propiedadesNoEnSetCompleto(obj, sala);
  if (!disponibles.includes(cartaId)) return;
  // Quitar de la mesa del objetivo
  for (const set of obj.mesa) {
    const i = set.cartaIds.indexOf(cartaId);
    if (i !== -1) {
      set.cartaIds.splice(i, 1);
      // Casa/torre no deberían estar en sets incompletos, pero por seguridad:
      if (set.cartaIds.length === 0 && (set.casa || set.torre)) {
        if (set.casa) sala.descarte.unshift("casa_perdida");
        if (set.torre) sala.descarte.unshift("torre_perdida");
      }
      break;
    }
  }
  compactarMesa(obj);
  // Asignar al set del color correspondiente en el origen
  const c = sala.cartas[cartaId];
  if (!c) return;
  let colorDestino: Color;
  if (c.tipo === "propiedad") colorDestino = c.color;
  else if (c.tipo === "bicolor") colorDestino = c.colores[0];
  else colorDestino = "morado";
  const destino = obtenerOSetColor(origen, colorDestino);
  destino.cartaIds.push(cartaId);
  log(sala, `${origen.nombre} robó una propiedad de ${obj.nombre}`);
}

function intercambiarPropiedades(
  sala: SalaVannyDeal,
  origenId: string,
  objetivoId: string,
  miaId: string,
  ajenaId: string,
): void {
  const origen = jugador(sala, origenId);
  const obj = jugador(sala, objetivoId);
  if (!origen || !obj) return;
  // Validar que ambas son intercambiables
  const dispO = propiedadesNoEnSetCompleto(obj, sala);
  const dispM = propiedadesNoEnSetCompleto(origen, sala);
  if (!dispO.includes(ajenaId) || !dispM.includes(miaId)) return;

  // Guardar colores de origen
  let colorMia: Color = "morado";
  for (const set of origen.mesa) {
    if (set.cartaIds.includes(miaId)) {
      colorMia = set.color;
      set.cartaIds = set.cartaIds.filter((id) => id !== miaId);
      break;
    }
  }
  let colorAjena: Color = "morado";
  for (const set of obj.mesa) {
    if (set.cartaIds.includes(ajenaId)) {
      colorAjena = set.color;
      set.cartaIds = set.cartaIds.filter((id) => id !== ajenaId);
      break;
    }
  }
  compactarMesa(origen);
  compactarMesa(obj);
  // Re-asignar
  obtenerOSetColor(obj, colorMia).cartaIds.push(miaId);
  obtenerOSetColor(origen, colorAjena).cartaIds.push(ajenaId);
  log(sala, `${origen.nombre} intercambió propiedades con ${obj.nombre}`);
}

function asaltarSet(
  sala: SalaVannyDeal,
  origenId: string,
  objetivoId: string,
  color: Color,
): void {
  const origen = jugador(sala, origenId);
  const obj = jugador(sala, objetivoId);
  if (!origen || !obj) return;
  const i = obj.mesa.findIndex((s) => s.color === color);
  if (i === -1) return;
  const set = obj.mesa[i];
  if (!setEstaCompleto(set, sala.cartas)) return;
  // Construir set nuevo en el origen con TODO (incluyendo casa/torre)
  const destino = obtenerOSetColor(origen, color);
  destino.cartaIds.push(...set.cartaIds);
  if (set.casa) destino.casa = true;
  if (set.torre) destino.torre = true;
  obj.mesa.splice(i, 1);
  log(sala, `${origen.nombre} ASALTÓ el set ${COLORES[color].nombre} de ${obj.nombre}`);
}

// ─── Iniciar pago ──────────────────────────────────────────────────

export function iniciarPago(
  sala: SalaVannyDeal,
  opts: { acreedorId: string; monto: number; deudores: string[]; motivo: string },
): void {
  const pago: Pago = {
    id: generarId(),
    acreedorId: opts.acreedorId,
    monto: opts.monto,
    deudores: opts.deudores,
    motivo: opts.motivo,
    pagados: {},
  };
  sala.pago = pago;
  sala.fase = "pago";
}

// ─── No Gracias ───────────────────────────────────────────────────

export function usarNoGracias(
  sala: SalaVannyDeal,
  jugadorId: string,
  cartaId: string,
): { error?: string } {
  const ng = sala.noGracias;
  if (!ng || sala.fase !== "noGraciasVentana") return { error: "No hay ventana abierta" };
  if (!ng.esperandoRespuestaDe.includes(jugadorId))
    return { error: "No te toca responder" };
  const j = jugador(sala, jugadorId);
  if (!j) return { error: "Jugador inválido" };
  if (!j.mano.includes(cartaId)) return { error: "No tenés esa carta" };
  const c = sala.cartas[cartaId];
  if (!c || c.tipo !== "accion" || c.accion !== "noGracias")
    return { error: "Esa carta no es No, Gracias" };

  // Consumir carta (al descarte, no cuenta como jugada)
  const idx = j.mano.indexOf(cartaId);
  if (idx !== -1) j.mano.splice(idx, 1);
  sala.descarte.unshift(cartaId);
  j.defensasHechas += 1;
  sala.estadisticas[j.id].defensas += 1;

  ng.cadenaNoGracias.push({ jugadorId, cartaId });

  // Alternar: ahora le toca al otro (origen ↔ objetivo)
  const origenId = ng.accionOriginal.origenJugadorId;
  const objetivoId = ng.accionOriginal.objetivoJugadorId!;
  const proximo = jugadorId === objetivoId ? origenId : objetivoId;
  ng.esperandoRespuestaDe = [proximo];
  ng.expira = Date.now() + VENTANA_NO_GRACIAS_MS;
  log(sala, `${j.nombre} jugó No, Gracias`);
  return {};
}

export function pasarNoGracias(
  sala: SalaVannyDeal,
  jugadorId: string,
): { error?: string } {
  const ng = sala.noGracias;
  if (!ng) return { error: "No hay ventana" };
  if (!ng.esperandoRespuestaDe.includes(jugadorId))
    return { error: "No te toca responder" };
  ng.esperandoRespuestaDe = ng.esperandoRespuestaDe.filter((x) => x !== jugadorId);
  if (ng.esperandoRespuestaDe.length === 0) {
    aplicarPendiente(sala);
  }
  return {};
}

// Tick — si expira la ventana NG sin respuesta
export function tickNoGracias(sala: SalaVannyDeal): void {
  const ng = sala.noGracias;
  if (!ng) return;
  if (Date.now() >= ng.expira) {
    aplicarPendiente(sala);
  }
}

// Tick — si expira espionaje
export function tickEspionaje(sala: SalaVannyDeal): void {
  if (sala.fase !== "espionajeAbierto") return;
  if (!sala.espionaje) return;
  if (Date.now() >= sala.espionaje.expira) {
    sala.espionaje = null;
    sala.fase = "jugando";
  }
}

// Cerrar espionaje manualmente
export function cerrarEspionaje(sala: SalaVannyDeal, jugadorId: string): { error?: string } {
  if (sala.fase !== "espionajeAbierto") return { error: "No hay espionaje" };
  if (!sala.espionaje || sala.espionaje.miradorId !== jugadorId)
    return { error: "No sos el espía" };
  sala.espionaje = null;
  sala.fase = "jugando";
  return {};
}

// ─── Juicio Popular ────────────────────────────────────────────────

export function votarJuicio(
  sala: SalaVannyDeal,
  jugadorId: string,
  voto: "si" | "no",
): { error?: string } {
  const j = sala.juicio;
  if (!j || sala.fase !== "juicioPopular") return { error: "No hay juicio" };
  if (jugadorId === j.origenJugadorId || jugadorId === j.objetivoJugadorId)
    return { error: "No podés votar vos" };
  if (j.votos[jugadorId]) return { error: "Ya votaste" };
  j.votos[jugadorId] = voto;
  // Cerrar si todos los elegibles votaron
  const elegibles = sala.jugadores.filter(
    (x) => x.id !== j.origenJugadorId && x.id !== j.objetivoJugadorId,
  ).length;
  if (Object.keys(j.votos).length >= elegibles) {
    resolverJuicio(sala);
  }
  return {};
}

export function tickJuicio(sala: SalaVannyDeal): void {
  const j = sala.juicio;
  if (!j) return;
  if (Date.now() >= j.expira) resolverJuicio(sala);
}

function resolverJuicio(sala: SalaVannyDeal): void {
  const j = sala.juicio;
  if (!j) return;
  const votos = Object.values(j.votos);
  const si = votos.filter((v) => v === "si").length;
  const no = votos.filter((v) => v === "no").length;
  sala.juicio = null;
  sala.fase = "jugando";
  if (si > no) {
    const origen = jugador(sala, j.origenJugadorId);
    const obj = jugador(sala, j.objetivoJugadorId);
    if (!origen || !obj) return;
    if (j.veredicto === "cobrar3M") {
      iniciarPago(sala, {
        acreedorId: origen.id,
        monto: 3,
        deudores: [obj.id],
        motivo: "Veredicto: cobrar $3M",
      });
      log(sala, `⚖️ El pueblo votó SÍ: ${obj.nombre} le paga $3M a ${origen.nombre}`);
    } else {
      // Robar propiedad: se toma la más valiosa NO en set completo
      const disponibles = propiedadesNoEnSetCompleto(obj, sala);
      if (disponibles.length === 0) {
        log(sala, `⚖️ Veredicto SÍ pero ${obj.nombre} no tiene propiedades robables`);
        return;
      }
      let best = disponibles[0];
      let bestV = sala.cartas[best]?.valor ?? 0;
      for (const id of disponibles) {
        const v = sala.cartas[id]?.valor ?? 0;
        if (v > bestV) {
          bestV = v;
          best = id;
        }
      }
      robarPropiedadIndividual(sala, origen.id, obj.id, best);
      log(sala, `⚖️ Veredicto SÍ: ${origen.nombre} robó una propiedad de ${obj.nombre}`);
    }
    chequearVictoria(sala);
  } else {
    log(sala, `⚖️ El pueblo votó NO. El juicio se descarta sin efecto.`);
  }
}

// ─── Utilidad: ofrecer a UN jugador usar una NG genéricamente (no usado, pero queda
// documentado aquí para acciones multi-jugador futuras) ──────────────

export { nombreAccion };
