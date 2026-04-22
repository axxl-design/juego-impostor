import type { Carta, CartasIndex, Color, Jugador, SetMesa } from "./types";
import { COLORES, cantidadEnSet, rentaBase } from "./colores";

// PRNG determinista (mulberry32)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mezclarSeed<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rnd = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function generarSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

const AVATARS = [
  "🦊", "🐱", "🐼", "🦄", "🐙", "🐯", "🦋", "🐧",
  "🦉", "🐲", "🦒", "🦁", "🐹", "🐢", "🐬", "🐶",
];

export function avatarRandom(usados: string[] = []): string {
  const libres = AVATARS.filter((a) => !usados.includes(a));
  const pool = libres.length ? libres : AVATARS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ¿Cuántas propiedades "reales" tiene este set? (para chequear si está completo)
// Las arcoíris cuentan, pero un set NO puede ser solo arcoíris (necesita ≥1 propiedad o bicolor).
export function setEstaCompleto(set: SetMesa, cartas: CartasIndex): boolean {
  const need = cantidadEnSet(set.color);
  if (set.cartaIds.length < need) return false;
  const cartasReales = set.cartaIds
    .map((id) => cartas[id])
    .filter((c): c is Carta => Boolean(c));
  // Necesita al menos 1 que NO sea arcoíris
  const tieneNoArcoiris = cartasReales.some((c) => c.tipo !== "arcoiris");
  return tieneNoArcoiris;
}

// ¿Cuántas cartas "cuentan" para la renta? Hasta cantidadSet del color.
export function cartasContandoParaRenta(set: SetMesa): number {
  const need = cantidadEnSet(set.color);
  return Math.min(set.cartaIds.length, need);
}

// Renta total de un set (incluyendo Casa y Torre)
export function rentaSet(set: SetMesa, cartas: CartasIndex): number {
  const cuenta = Math.min(
    set.cartaIds.length,
    cantidadEnSet(set.color),
  );
  let r = rentaBase(set.color, cuenta);
  if (setEstaCompleto(set, cartas)) {
    if (set.casa) r += 3;
    if (set.torre) r += 4;
  }
  return r;
}

export function setsCompletosDe(
  jugador: Jugador,
  cartas: CartasIndex,
): SetMesa[] {
  return jugador.mesa.filter((s) => setEstaCompleto(s, cartas));
}

export function setsCompletosDeColoresDistintos(
  jugador: Jugador,
  cartas: CartasIndex,
): number {
  const colores = new Set<Color>();
  for (const set of jugador.mesa) {
    if (setEstaCompleto(set, cartas)) colores.add(set.color);
  }
  return colores.size;
}

// Valor total del banco
export function valorBanco(jugador: Jugador, cartas: CartasIndex): number {
  return jugador.banco.reduce((s, id) => {
    const c = cartas[id];
    return s + (c ? c.valor : 0);
  }, 0);
}

// Valor total mesa+banco (para condición de victoria por valor / por tiempo)
export function valorTotal(jugador: Jugador, cartas: CartasIndex): number {
  let v = valorBanco(jugador, cartas);
  for (const set of jugador.mesa) {
    for (const id of set.cartaIds) {
      const c = cartas[id];
      if (c) v += c.valor;
    }
    if (set.casa) v += 3;
    if (set.torre) v += 4;
  }
  return v;
}

// Genera un id de carta corto pero único
let _runtimeSeq = 1;
export function nuevoIdCarta(prefijo = "rt"): string {
  _runtimeSeq += 1;
  return `${prefijo}-${Date.now().toString(36)}-${_runtimeSeq.toString(36)}`;
}

export function generarCodigoSala(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += letras[Math.floor(Math.random() * letras.length)];
  }
  return out;
}

export function generarId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// Determinar a qué color(es) puede ir una carta (para validar)
export function coloresPosibles(carta: Carta): Color[] | "cualquiera" {
  if (carta.tipo === "propiedad") return [carta.color];
  if (carta.tipo === "bicolor") return [...carta.colores];
  if (carta.tipo === "arcoiris") return "cualquiera";
  return [];
}

// Encontrar el SetMesa donde está una carta (busca en todos los sets de un jugador)
export function encontrarSetCon(
  jugador: Jugador,
  cartaId: string,
): { idx: number; set: SetMesa } | null {
  for (let i = 0; i < jugador.mesa.length; i++) {
    if (jugador.mesa[i].cartaIds.includes(cartaId)) {
      return { idx: i, set: jugador.mesa[i] };
    }
  }
  return null;
}

// Obtener o crear el set para un color en la mesa de un jugador
export function obtenerOSetColor(jugador: Jugador, color: Color): SetMesa {
  let set = jugador.mesa.find((s) => s.color === color);
  if (!set) {
    set = { color, cartaIds: [], casa: false, torre: false };
    jugador.mesa.push(set);
  }
  return set;
}

// Limpia sets vacíos (sin cartas → sacar)
export function compactarMesa(jugador: Jugador): void {
  jugador.mesa = jugador.mesa.filter((s) => s.cartaIds.length > 0);
}

export function clamp(v: number, mn: number, mx: number): number {
  return Math.max(mn, Math.min(mx, v));
}

export function colorInfo(c: Color) {
  return COLORES[c];
}
