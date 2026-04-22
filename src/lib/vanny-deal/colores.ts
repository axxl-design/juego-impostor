import type { Color } from "./types";

export interface InfoColor {
  id: Color;
  nombre: string;
  emoji: string;
  // colores CSS — fondo principal y texto contrastante
  bg: string;
  fg: string;
  borde: string;
  cantidadSet: number;
  rentas: number[]; // índice 0 = 1 carta, índice 1 = 2 cartas, etc.
  // valor de venta de cada propiedad de este color (≈ renta del set completo)
  valorPropiedad: number;
  propiedades: string[];
}

export const COLORES: Record<Color, InfoColor> = {
  morado: {
    id: "morado",
    nombre: "Morado profundo",
    emoji: "🟣",
    bg: "#5b21b6",
    fg: "#fff",
    borde: "#2e1065",
    cantidadSet: 2,
    rentas: [1, 2],
    valorPropiedad: 1,
    propiedades: ["La Cripta de los Secretos", "El Barrio del Impostor"],
  },
  azulClaro: {
    id: "azulClaro",
    nombre: "Azul claro",
    emoji: "🔷",
    bg: "#38bdf8",
    fg: "#062e44",
    borde: "#0369a1",
    cantidadSet: 3,
    rentas: [1, 2, 3],
    valorPropiedad: 1,
    propiedades: ["Costanera Neón", "Bahía del Sopapeo", "Laguna Espejo"],
  },
  rosa: {
    id: "rosa",
    nombre: "Rosa/Magenta",
    emoji: "🌸",
    bg: "#ec4899",
    fg: "#fff",
    borde: "#9d174d",
    cantidadSet: 3,
    rentas: [1, 2, 4],
    valorPropiedad: 2,
    propiedades: ["Pasaje del Chisme", "Callejón de los Memes", "Avenida Draga"],
  },
  naranja: {
    id: "naranja",
    nombre: "Naranja",
    emoji: "🟧",
    bg: "#f97316",
    fg: "#fff",
    borde: "#9a3412",
    cantidadSet: 3,
    rentas: [1, 3, 5],
    valorPropiedad: 2,
    propiedades: ["Plaza del Karaoke", "Mercado Pirata", "Rotonda del Caos"],
  },
  rojo: {
    id: "rojo",
    nombre: "Rojo",
    emoji: "🟥",
    bg: "#dc2626",
    fg: "#fff",
    borde: "#7f1d1d",
    cantidadSet: 3,
    rentas: [2, 3, 6],
    valorPropiedad: 3,
    propiedades: ["Coliseo Beef", "Estadio FantaClub", "Arena Retro"],
  },
  amarillo: {
    id: "amarillo",
    nombre: "Amarillo",
    emoji: "🟨",
    bg: "#facc15",
    fg: "#3a2a01",
    borde: "#78350f",
    cantidadSet: 3,
    rentas: [2, 4, 6],
    valorPropiedad: 3,
    propiedades: ["Isla del Trasnoche", "Ruta del Diseñador", "Club Nocturno Vault"],
  },
  verde: {
    id: "verde",
    nombre: "Verde",
    emoji: "🟩",
    bg: "#16a34a",
    fg: "#fff",
    borde: "#14532d",
    cantidadSet: 3,
    rentas: [2, 4, 7],
    valorPropiedad: 4,
    propiedades: ["Selva Pixel", "Bosque de la Nostalgia", "Parque Arcade"],
  },
  azulOscuro: {
    id: "azulOscuro",
    nombre: "Azul oscuro",
    emoji: "🟦",
    bg: "#1e3a8a",
    fg: "#fff",
    borde: "#0c1d4a",
    cantidadSet: 2,
    rentas: [3, 8],
    valorPropiedad: 4,
    propiedades: ["Torre del Rey Supremo", "Penthouse VIP"],
  },
  marron: {
    id: "marron",
    nombre: "Marrón",
    emoji: "🟫",
    bg: "#78350f",
    fg: "#fff",
    borde: "#3a1c08",
    cantidadSet: 2,
    rentas: [1, 2],
    valorPropiedad: 1,
    propiedades: ["Tierra de Nadie", "Zona Gris"],
  },
  turquesa: {
    id: "turquesa",
    nombre: "Turquesa",
    emoji: "💠",
    bg: "#06b6d4",
    fg: "#fff",
    borde: "#155e75",
    cantidadSet: 2,
    rentas: [1, 2],
    valorPropiedad: 1,
    propiedades: ["Puerto Holográfico", "Estación Sincronía"],
  },
  servicio: {
    id: "servicio",
    nombre: "Servicios",
    emoji: "⚙️",
    bg: "#475569",
    fg: "#fff",
    borde: "#0f172a",
    cantidadSet: 2,
    rentas: [1, 2],
    valorPropiedad: 1,
    propiedades: ["Compañía de Memes VANNY", "Servicio de Chisme Premium"],
  },
};

export const COLORES_LISTA: Color[] = [
  "morado",
  "azulClaro",
  "rosa",
  "naranja",
  "rojo",
  "amarillo",
  "verde",
  "azulOscuro",
  "marron",
  "turquesa",
  "servicio",
];

// ¿Cuántas cartas hay en juego de cada color (sin contar comodines)? = cantidadSet
export function cantidadEnSet(color: Color): number {
  return COLORES[color].cantidadSet;
}

// renta para N cartas de un color (sin contar casa/torre)
export function rentaBase(color: Color, cantidadCartas: number): number {
  if (cantidadCartas <= 0) return 0;
  const r = COLORES[color].rentas;
  const idx = Math.min(cantidadCartas, r.length) - 1;
  return r[idx];
}
