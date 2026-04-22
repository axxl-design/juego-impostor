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

export type ReglasExtraImpostor = {
  pistasActivas: boolean;
  puntajePersistente: boolean;
  roboPuntos: boolean;
  poderesAleatorios: boolean;
  preguntasSugeridas: boolean;
  jefeFinal: boolean;
};

export type ConfigPartida = {
  categoriaId: string;
  dificultad: Dificultad;
  duracionSeg: number;
  reglasExtra: ReglasExtraImpostor;
};

export type PoderTipo = "vidente" | "escudo" | "dobleAgente" | "traductor";

export type PoderJugador = {
  jugadorId: string;
  tipo: PoderTipo;
  // vidente: id del jugador observado; traductor: palabra falsa extra; dobleAgente: id acusado
  datos?: { observadoId?: string; palabraFalsa?: string; acusadoId?: string };
  usado?: boolean;
};

export type PistaImpostor = { nivel: 1 | 2 | 3; texto: string };

export type RondaDatos = {
  categoriaId: string;
  categoriaNombre: string;
  palabra: string;
  impostorId: string;
  // Arreglo porque en "Jefe Final" hay 2 impostores
  impostoresExtra?: string[];
  esJefeFinal?: boolean;
  // Sistema de pistas
  pistasPedidas?: PistaImpostor[];
  contextoCivilUsado?: boolean;
  contextoCivilTexto?: string;
  // Poderes repartidos
  poderes?: PoderJugador[];
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
  escudo?: boolean;
};

export type SalaQuienSoy = {
  codigo: string;
  hostId: string;
  jugadores: { id: string; nombre: string; puntos: number; haVisto: boolean; escudo?: boolean }[];
  palabras: Record<string, string>;
  config: ConfigQuienSoy & { reglasExtra: ReglasExtraQuienSoy };
  fase: "lobby" | "reparto" | "juego" | "fin";
  rondaActual: number;
  // Pistas pedidas por cada jugador (id → cantidad)
  pistasUsadas: Record<string, number>;
  ultimaAdivinanza: {
    deId: string;
    deNombre: string;
    aId: string;
    aNombre: string;
    intento: string;
    palabraReal: string;
    acerto: boolean;
    escudoUsado?: boolean;
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
  impostoresExtra?: { id: string; nombre: string }[];
  esJefeFinal?: boolean;
  cambiosPuntaje?: { id: string; nombre: string; delta: number; total: number }[];
};

export type JugadorSalaImpostor = { id: string; nombre: string; puntos: number };

export type ReglasExtraQuienSoy = {
  pistasActivas: boolean;
  escudoComprable: boolean;
};

export type ConfigQuienSoyExt = ConfigQuienSoy & {
  reglasExtra: ReglasExtraQuienSoy;
};

export type SalaOnline = {
  codigo: string;
  hostId: string;
  jugadores: JugadorSalaImpostor[];
  config: ConfigPartida;
  ronda: RondaDatos | null;
  fase: "lobby" | "reparto" | "discusion" | "votacion" | "resultado";
  finEn: number | null;
  votos: Record<string, string>;
  resultado: ResultadoImpostor | null;
  creadaEn: number;
  rondasJugadas: number;
  // Pistas pedidas por cada jugador (impostor) persistentes a través de rondas cuando puntajePersistente está activo
  pistasUsadas: Record<string, number>;
};
