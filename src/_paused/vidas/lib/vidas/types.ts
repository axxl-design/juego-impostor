export type MundoId = "medieval" | "actual" | "poderes";

export type EtapaVida = "juventud" | "madurez" | "vejez";

export type TipoRelacion = "amigos" | "pareja";

export type PoderSubtipo =
  | "fuego"
  | "agua"
  | "tierra"
  | "aire"
  | "rayo"
  | "hielo";

export type NivelPoder = "latente" | "despierto" | "experto" | "maestro";

export type Efectos = {
  karma?: number;
  influencia?: number;
  riqueza?: number;
  salud?: number;
  rango?: string;
  vinculo?: number;
  nivelPoder?: number;
  edad?: number;
};

export type OpcionCarta = {
  id?: string;
  texto: string;
  efectos: Efectos;
  consecuenciaTexto: string;
  desbloqueaCarta?: string;
  requiereNivelPoder?: NivelPoder;
  requiereInfluenciaMin?: number;
  requiereRiquezaMin?: number;
};

export type TagCarta =
  | "cotidiana"
  | "dramatica"
  | "amor"
  | "guerra"
  | "poder"
  | "traicion"
  | "familia"
  | "muerte"
  | "legado"
  | "etica"
  | "descubrimiento";

export type Carta = {
  id: string;
  mundo: MundoId;
  rolesRelevantes: string[];
  etapaMin?: EtapaVida;
  etapaMax?: EtapaVida;
  titulo: string;
  descripcion: string;
  icono: string;
  tags: TagCarta[];
  opciones: OpcionCarta[];
  requiereKarmaMin?: number;
  requiereKarmaMax?: number;
  requiereInfluenciaMin?: number;
  requiereRiquezaMin?: number;
  requiereSaludMin?: number;
  requiereNivelPoder?: NivelPoder;
  soloRelacion?: TipoRelacion;
};

export type EstadoJugador = {
  id: string;
  nombre: string;
  mundo: MundoId;
  rol: string;
  poderSubtipo?: PoderSubtipo;
  edad: number;
  etapa: EtapaVida;
  stats: {
    karma: number;
    influencia: number;
    riqueza: number;
    salud: number;
    nivelPoder: number;
  };
  rango: string;
  historial: EntradaHistorial[];
  cartasUsadas: string[];
  desbloqueadas: string[];
  vivo: boolean;
  causaMuerte?: string;
};

export type EntradaHistorial = {
  cartaId: string;
  tituloCarta: string;
  edad: number;
  etapa: EtapaVida;
  opcionTexto: string;
  consecuenciaTexto: string;
  efectosAplicados: Efectos;
  ts: number;
};

export type EstadoPartidaLocal = {
  saveId: string;
  version: 1;
  creadoEn: number;
  actualizadoEn: number;
  jugador: EstadoJugador;
  mundo: MundoId;
  fase: "setup" | "juego" | "fin";
  cartaActualId: string | null;
  usosIAGeneracion: number;
};

export type EstadoSalaOnline = {
  codigo: string;
  version: 1;
  creadaEn: number;
  actualizadaEn: number;
  hostId: string;
  tipoRelacion: TipoRelacion | null;
  mundo: MundoId | null;
  jugadores: EstadoJugador[];
  vinculo: number;
  fase: "lobby" | "setup-invitado" | "juego" | "fin";
  turnoDe: string | null;
  cartaActualId: string | null;
  cartaActualExtra?: Carta | null;
  ultimaConsecuencia: {
    jugadorId: string;
    jugadorNombre: string;
    cartaTitulo: string;
    opcionTexto: string;
    consecuenciaTexto: string;
    efectos: Efectos;
    ts: number;
  } | null;
  usosIAGeneracion: number;
};

export type VistaPublicaSala = EstadoSalaOnline;

export type RespuestaFinal = {
  resumen: string;
  frase: string;
  highlights: EntradaHistorial[];
  epilogoRelacion?: string;
};
