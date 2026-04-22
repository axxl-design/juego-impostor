/**
 * Preguntas neutras que funcionan para cualquier categoría.
 * Usadas por la feature "Preguntas sugeridas" en la discusión.
 */

export const PREGUNTAS_IMPOSTOR: string[] = [
  "¿Te gusta?",
  "¿Es más grande que una pelota de fútbol?",
  "¿Lo usarías todos los días?",
  "¿Existe hace más de 100 años?",
  "¿Podrías describirlo en una palabra?",
  "¿Es caro?",
  "¿Se puede comer?",
  "¿Es famoso mundialmente?",
  "¿Lo tenés en tu casa?",
  "¿Lo viste hoy?",
  "¿Es de color claro?",
  "¿Pesa más de 1 kilo?",
  "¿Se mueve?",
  "¿Hace ruido?",
  "¿Se lo regalarías a un amigo?",
  "¿Te da miedo?",
  "¿Es peligroso?",
  "¿Tiene batería?",
  "¿Lo viste en películas?",
  "¿Lo usa tu familia?",
  "¿Está en la calle?",
  "¿Se usa con las manos?",
  "¿Es algo argentino?",
  "¿Es algo antiguo?",
  "¿Es de los 2000 para acá?",
  "¿Lo asociás con el verano?",
  "¿Lo asociás con la noche?",
  "¿Cabe en un bolsillo?",
  "¿Lo podés comprar en un kiosco?",
  "¿Es una persona?",
  "¿Es de un solo color?",
  "¿Huele a algo?",
  "¿Te levanta el ánimo?",
  "¿Es ruidoso?",
  "¿Se puede llevar en un avión?",
  "¿Sirve para trabajar?",
  "¿Lo conocen los niños?",
  "¿Hay uno cerca tuyo ahora?",
  "¿Es más útil que decorativo?",
  "¿Lo mencionarías en una canción?",
  "¿Lo asociás con un deporte?",
  "¿Se lo regalarías a tu abuela?",
  "¿Tiene pantalla?",
  "¿Es más dulce que salado?",
];

export function preguntasAleatorias(cantidad = 5): string[] {
  const copia = [...PREGUNTAS_IMPOSTOR];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, cantidad);
}
