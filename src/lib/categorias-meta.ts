export type CategoriaMeta = { id: string; nombre: string; emoji: string };

export const CATEGORIAS_META: CategoriaMeta[] = [
  { id: "lugares", nombre: "Lugares", emoji: "📍" },
  { id: "objetos", nombre: "Objetos", emoji: "🧰" },
  { id: "profesiones", nombre: "Profesiones", emoji: "👔" },
  { id: "cine", nombre: "Películas y series", emoji: "🎬" },
  { id: "animales", nombre: "Animales", emoji: "🐾" },
  { id: "famosos", nombre: "Famosos", emoji: "🌟" },
  { id: "comidas", nombre: "Comidas y bebidas", emoji: "🍕" },
  { id: "deportes", nombre: "Deportes", emoji: "⚽" },
  { id: "superheroes", nombre: "Superhéroes y villanos", emoji: "🦸" },
  { id: "culturapop", nombre: "Cultura pop", emoji: "🎤" },
  { id: "historia", nombre: "Personajes de la historia", emoji: "📜" },
  { id: "streamers", nombre: "Streamers", emoji: "🎥" },
  { id: "videojuegos", nombre: "Videojuegos", emoji: "🎮" },
  { id: "paises", nombre: "Países", emoji: "🌎" },
  { id: "mezcla", nombre: "Mezcla total", emoji: "🎲" },
];

export function buscarCategoriaMeta(id: string): CategoriaMeta | undefined {
  return CATEGORIAS_META.find((c) => c.id === id);
}
