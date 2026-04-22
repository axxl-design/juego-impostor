import type { PistaImpostor } from "./types";
import { obtenerMeta } from "./palabras-meta";

/**
 * Genera la pista de un nivel dado para una palabra.
 *  - Nivel 1: primera letra.
 *  - Nivel 2: cantidad de letras.
 *  - Nivel 3: palabra relacionada (si existe meta) o "Es de la categoría X".
 */
export function generarPista(
  palabra: string,
  categoriaNombre: string,
  nivel: 1 | 2 | 3,
): PistaImpostor {
  if (nivel === 1) {
    const limpia = palabra.trim();
    const primera = limpia.charAt(0).toUpperCase();
    return { nivel: 1, texto: `Empieza con la letra "${primera}"` };
  }
  if (nivel === 2) {
    const sinEspacios = palabra.replace(/\s+/g, "");
    return { nivel: 2, texto: `Tiene ${sinEspacios.length} letras` };
  }
  const meta = obtenerMeta(palabra);
  if (meta?.relacionada) {
    return { nivel: 3, texto: `Palabra relacionada: ${meta.relacionada}` };
  }
  return { nivel: 3, texto: `Es de la categoría "${categoriaNombre}"` };
}

/**
 * Texto de contexto para los civiles (una vez por partida). Si la palabra tiene
 * contextoCivil, lo usa; si no, genera un fallback basado en categoría + dificultad.
 */
export function generarContextoCivil(
  palabra: string,
  categoriaNombre: string,
  dificultad: string,
): string {
  const meta = obtenerMeta(palabra);
  if (meta?.contextoCivil) return meta.contextoCivil;
  return `Es un elemento de la categoría "${categoriaNombre}", nivel ${dificultad}.`;
}
