import type { AccionTipo, Carta, CartasIndex, Color } from "./types";
import { COLORES } from "./colores";

let _seq = 0;
function nuevoId(prefijo: string): string {
  _seq += 1;
  return `${prefijo}-${_seq.toString(36)}`;
}

export interface AccionDef {
  accion: AccionTipo;
  nombre: string;
  descripcion: string;
  cantidad: number;
  valor: number; // valor cuando se juega como dinero
  emoji: string;
  // para rentaBicolor: lista de pares de colores
  variantes?: [Color, Color][];
}

// 15 cartas de acción (sin Modo Caos) — 33 cartas totales
export const ACCIONES_DEF: AccionDef[] = [
  {
    accion: "rentaUniversal",
    nombre: "Renta Universal",
    descripcion: "Cobrás renta de cualquier color tuyo a UN jugador.",
    cantidad: 2,
    valor: 3,
    emoji: "💰",
  },
  {
    accion: "rentaBicolor",
    nombre: "Renta Bicolor",
    descripcion: "Cobrás renta de uno de 2 colores específicos a TODOS los jugadores.",
    cantidad: 1, // se multiplica por las variantes (3 pares)
    valor: 1,
    emoji: "🎯",
    variantes: [
      ["morado", "azulOscuro"],
      ["rosa", "naranja"],
      ["verde", "azulClaro"],
    ],
  },
  {
    accion: "cumpleanios",
    nombre: "Cumpleaños VANNY",
    descripcion: "Cada jugador te da $2M.",
    cantidad: 2,
    valor: 2,
    emoji: "🎂",
  },
  {
    accion: "impuestoImperial",
    nombre: "Impuesto Imperial",
    descripcion: "Un jugador elegido te paga $5M.",
    cantidad: 2,
    valor: 5,
    emoji: "👑",
  },
  {
    accion: "pasaConmigo",
    nombre: "¡Pasá Conmigo!",
    descripcion: "Robás 2 cartas extra.",
    cantidad: 3,
    valor: 1,
    emoji: "🃏",
  },
  {
    accion: "roboSelectivo",
    nombre: "Robo Selectivo",
    descripcion: "Tomás 1 propiedad de otro jugador (no de set completo).",
    cantidad: 2,
    valor: 3,
    emoji: "🦹",
  },
  {
    accion: "intercambioForzado",
    nombre: "Intercambio Forzado",
    descripcion: "Intercambiás 1 propiedad tuya por 1 ajena (ninguna de set completo).",
    cantidad: 2,
    valor: 3,
    emoji: "🔄",
  },
  {
    accion: "asaltoMonopolio",
    nombre: "Asalto al Monopolio",
    descripcion: "Robás UN set COMPLETO de otro jugador.",
    cantidad: 2,
    valor: 5,
    emoji: "💣",
  },
  {
    accion: "noGracias",
    nombre: "No, Gracias",
    descripcion: "Anulá una acción usada contra vos. No cuenta como carta jugada.",
    cantidad: 3,
    valor: 4,
    emoji: "🛡️",
  },
  {
    accion: "casa",
    nombre: "Casa",
    descripcion: "+$3M de renta al agregarse a un set completo.",
    cantidad: 3,
    valor: 3,
    emoji: "🏠",
  },
  {
    accion: "torre",
    nombre: "Torre",
    descripcion: "+$4M de renta al agregarse a un set completo con Casa.",
    cantidad: 2,
    valor: 4,
    emoji: "🏢",
  },
  {
    accion: "espionaje",
    nombre: "Espionaje",
    descripcion: "Ves la mano de otro jugador durante 10 segundos.",
    cantidad: 2,
    valor: 2,
    emoji: "🕵️",
  },
  {
    accion: "auditoriaFiscal",
    nombre: "Auditoría Fiscal",
    descripcion: "Un jugador elegido te paga $1M por cada propiedad que tenga.",
    cantidad: 2,
    valor: 4,
    emoji: "💼",
  },
  {
    accion: "megafonoViral",
    nombre: "Megáfono Viral",
    descripcion: "Duplica el efecto de la PRÓXIMA carta especial que juegues.",
    cantidad: 1,
    valor: 3,
    emoji: "📢",
  },
  {
    accion: "juicioPopular",
    nombre: "Juicio Popular",
    descripcion: "Veredicto contra un jugador (robar propiedad o cobrar $3M). Vota la mayoría.",
    cantidad: 1,
    valor: 4,
    emoji: "⚖️",
  },
];

export interface AccionInfo {
  accion: AccionTipo;
  nombre: string;
  descripcion: string;
  emoji: string;
  valor: number;
}

const ACCION_INFO: Record<AccionTipo, AccionInfo> = ACCIONES_DEF.reduce((acc, def) => {
  acc[def.accion] = {
    accion: def.accion,
    nombre: def.nombre,
    descripcion: def.descripcion,
    emoji: def.emoji,
    valor: def.valor,
  };
  return acc;
}, {} as Record<AccionTipo, AccionInfo>);

export function infoAccion(tipo: AccionTipo): AccionInfo {
  return ACCION_INFO[tipo];
}

// 20 cartas de dinero ≈ $65M total
const DINERO_DEF: { valor: number; cantidad: number }[] = [
  { valor: 1, cantidad: 6 },
  { valor: 2, cantidad: 5 },
  { valor: 3, cantidad: 3 },
  { valor: 4, cantidad: 3 },
  { valor: 5, cantidad: 2 },
  { valor: 10, cantidad: 1 },
];

// 10 comodines: 8 bicolor + 2 arcoíris
interface BicolorDef {
  colores: [Color, Color];
  nombre: string;
}
const BICOLOR_DEF: BicolorDef[] = [
  { colores: ["rosa", "naranja"], nombre: "Centro Rosado-Mandarina" },
  { colores: ["azulClaro", "azulOscuro"], nombre: "Bahía Azul Doble" },
  { colores: ["amarillo", "verde"], nombre: "Avenida Solar" },
  { colores: ["rojo", "amarillo"], nombre: "Distrito Atardecer" },
  { colores: ["azulOscuro", "verde"], nombre: "Mirador Profundo" },
  { colores: ["servicio", "morado"], nombre: "Plaza de los Servicios" },
  { colores: ["verde", "marron"], nombre: "Bosque de la Tierra" },
  { colores: ["naranja", "rojo"], nombre: "Calle del Fuego" },
];

const ARCOIRIS_DEF = [
  { nombre: "Comodín Arcoíris VANNY" },
  { nombre: "Comodín Multicolor" },
];

export interface MazoConstruido {
  cartas: CartasIndex;
  ids: string[];
}

// Reset interno del seq para tests / determinismo
export function reiniciarSeq(seed = 0): void {
  _seq = seed;
}

export function construirMazo(): MazoConstruido {
  reiniciarSeq();
  const cartas: CartasIndex = {};
  const ids: string[] = [];

  // Propiedades (28)
  for (const info of Object.values(COLORES)) {
    for (const nombre of info.propiedades) {
      const id = nuevoId(`prop-${info.id}`);
      const carta: Carta = {
        id,
        tipo: "propiedad",
        color: info.id,
        nombre,
        valor: info.valorPropiedad,
      };
      cartas[id] = carta;
      ids.push(id);
    }
  }

  // Dinero (20)
  for (const def of DINERO_DEF) {
    for (let i = 0; i < def.cantidad; i++) {
      const id = nuevoId(`m${def.valor}`);
      cartas[id] = { id, tipo: "dinero", valor: def.valor };
      ids.push(id);
    }
  }

  // Acciones (33)
  for (const def of ACCIONES_DEF) {
    if (def.accion === "rentaBicolor" && def.variantes) {
      for (const variante of def.variantes) {
        const id = nuevoId(`acc-${def.accion}`);
        cartas[id] = {
          id,
          tipo: "accion",
          accion: def.accion,
          valor: def.valor,
          coloresRenta: variante,
        };
        ids.push(id);
      }
    } else {
      for (let i = 0; i < def.cantidad; i++) {
        const id = nuevoId(`acc-${def.accion}`);
        if (def.accion === "casa") {
          cartas[id] = { id, tipo: "casa", valor: def.valor };
        } else if (def.accion === "torre") {
          cartas[id] = { id, tipo: "torre", valor: def.valor };
        } else {
          cartas[id] = {
            id,
            tipo: "accion",
            accion: def.accion,
            valor: def.valor,
          };
        }
        ids.push(id);
      }
    }
  }

  // Bicolor (8)
  for (const def of BICOLOR_DEF) {
    const id = nuevoId(`bic`);
    cartas[id] = {
      id,
      tipo: "bicolor",
      colores: def.colores,
      nombre: def.nombre,
      valor: 2,
    };
    ids.push(id);
  }

  // Arcoíris (2)
  for (const def of ARCOIRIS_DEF) {
    const id = nuevoId(`arc`);
    cartas[id] = { id, tipo: "arcoiris", nombre: def.nombre, valor: 0 };
    ids.push(id);
  }

  return { cartas, ids };
}

// Conteo del mazo final, para verificar
export function conteoMazoTotal(): {
  propiedades: number;
  dinero: number;
  acciones: number;
  casas: number;
  torres: number;
  bicolor: number;
  arcoiris: number;
  total: number;
} {
  const propiedades = Object.values(COLORES).reduce(
    (s, c) => s + c.propiedades.length,
    0,
  );
  const dinero = DINERO_DEF.reduce((s, d) => s + d.cantidad, 0);
  let acciones = 0;
  let casas = 0;
  let torres = 0;
  for (const def of ACCIONES_DEF) {
    if (def.accion === "casa") casas += def.cantidad;
    else if (def.accion === "torre") torres += def.cantidad;
    else if (def.accion === "rentaBicolor")
      acciones += def.variantes?.length ?? 0;
    else acciones += def.cantidad;
  }
  const bicolor = BICOLOR_DEF.length;
  const arcoiris = ARCOIRIS_DEF.length;
  const total = propiedades + dinero + acciones + casas + torres + bicolor + arcoiris;
  return { propiedades, dinero, acciones, casas, torres, bicolor, arcoiris, total };
}
