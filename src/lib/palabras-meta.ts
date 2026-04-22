/**
 * Metadatos opcionales por palabra para el sistema de pistas.
 *
 * Como son 2700+ palabras, estos metadatos son OPCIONALES — solo las palabras
 * enriquecidas manualmente aparecen acá. Si una palabra no tiene entrada, el
 * sistema usa fallbacks genéricos basados en la categoría.
 *
 * Campos:
 *   - `relacionada`: una palabra/frase corta que se muestra como pista nivel 3
 *     al impostor. Ejemplo: "Messi" → "Argentina".
 *   - `contextoCivil`: descripción corta sin revelar la palabra, visible a los
 *     civiles una vez por ronda. Ejemplo: "Deportista argentino, uno de los más
 *     destacados de la historia de su disciplina".
 *
 * La clave es la palabra EXACTA tal como aparece en `palabras.ts` (con mayúsculas,
 * tildes y espacios).
 */

export type MetaPalabra = {
  relacionada?: string;
  contextoCivil?: string;
};

export const METADATOS_PALABRAS: Record<string, MetaPalabra> = {
  // Ejemplo — el usuario va a completar estos con el tiempo:
  "Messi": { relacionada: "Argentina", contextoCivil: "Deportista argentino, uno de los más destacados de su disciplina." },
  "Volcán": { relacionada: "Lava", contextoCivil: "Formación geológica que puede erupcionar." },
  "Pizza": { relacionada: "Italia", contextoCivil: "Comida redonda muy popular, suele compartirse." },
  "Albahaca": { relacionada: "Pesto", contextoCivil: "Hierba aromática verde." },
};

export function obtenerMeta(palabra: string): MetaPalabra | undefined {
  return METADATOS_PALABRAS[palabra];
}
