export type Dificultad = "facil" | "medio" | "dificil";

export type Categoria = {
  id: string;
  nombre: string;
  emoji: string;
  palabras: Record<Dificultad, string[]>;
};

export type Jugador = {
  id: string;
  nombre: string;
  esImpostor?: boolean;
  haVisto?: boolean;
};

export type EstadoJuegoLocal =
  | { fase: "config" }
  | { fase: "reparto"; indice: number }
  | { fase: "discusion"; finEn: number }
  | { fase: "votacion" }
  | { fase: "resultado"; ganaImpostor: boolean; impostorId: string };

export type ConfigPartida = {
  categoriaId: string;
  dificultad: Dificultad;
  duracionSeg: number;
  impostorCiego: boolean;
};

export type RondaDatos = {
  categoriaId: string;
  categoriaNombre: string;
  palabra: string;
  impostorId: string;
  impostorCiego: boolean;
};

export type SalaOnline = {
  codigo: string;
  hostId: string;
  jugadores: { id: string; nombre: string }[];
  config: ConfigPartida;
  ronda: RondaDatos | null;
  fase: "lobby" | "reparto" | "discusion" | "votacion" | "resultado";
  finEn: number | null;
  votos: Record<string, string>;
  resultado: { ganaImpostor: boolean; impostorId: string; impostorNombre: string } | null;
  creadaEn: number;
};
