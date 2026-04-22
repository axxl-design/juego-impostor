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

export type ModoVictoria = "puntos" | "rondas";

export type ConfigQuienSoy = {
  categoriaId: string;
  dificultad: Dificultad;
  modoVictoria: ModoVictoria;
  objetivo: number;
};

export type JugadorQuienSoy = {
  id: string;
  nombre: string;
  palabra: string;
  puntos: number;
  haVisto: boolean;
};

export type SalaQuienSoy = {
  codigo: string;
  hostId: string;
  jugadores: { id: string; nombre: string; puntos: number; haVisto: boolean }[];
  palabras: Record<string, string>;
  config: ConfigQuienSoy;
  fase: "lobby" | "reparto" | "juego" | "fin";
  rondaActual: number;
  ultimaAdivinanza: {
    deId: string;
    deNombre: string;
    aId: string;
    aNombre: string;
    intento: string;
    palabraReal: string;
    acerto: boolean;
    ts: number;
  } | null;
  ganador: { tipo: "puntos" | "rondas" | "terminada"; ids: string[] } | null;
  creadaEn: number;
};

export type ResultadoImpostor = {
  ganaImpostor: boolean;
  impostorId: string;
  impostorNombre: string;
  porAdivinanza?: boolean;
  palabraIntento?: string;
  palabraReal?: string;
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
  resultado: ResultadoImpostor | null;
  creadaEn: number;
};
