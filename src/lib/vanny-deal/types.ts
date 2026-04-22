// VANNY Deal — tipos del juego (basado en Monopoly Deal)

export type Color =
  | "morado"
  | "azulClaro"
  | "rosa"
  | "naranja"
  | "rojo"
  | "amarillo"
  | "verde"
  | "azulOscuro"
  | "marron"
  | "turquesa"
  | "servicio";

export type AccionTipo =
  | "rentaUniversal"
  | "rentaBicolor"
  | "cumpleanios"
  | "impuestoImperial"
  | "pasaConmigo"
  | "roboSelectivo"
  | "intercambioForzado"
  | "asaltoMonopolio"
  | "noGracias"
  | "casa"
  | "torre"
  | "espionaje"
  | "auditoriaFiscal"
  | "megafonoViral"
  | "juicioPopular";

export type Carta =
  | { id: string; tipo: "propiedad"; color: Color; nombre: string; valor: number }
  | { id: string; tipo: "dinero"; valor: number }
  | {
      id: string;
      tipo: "accion";
      accion: AccionTipo;
      valor: number;
      coloresRenta?: [Color, Color]; // solo rentaBicolor
    }
  | { id: string; tipo: "casa"; valor: number }
  | { id: string; tipo: "torre"; valor: number }
  | {
      id: string;
      tipo: "bicolor";
      colores: [Color, Color];
      nombre: string;
      valor: number;
    }
  | { id: string; tipo: "arcoiris"; nombre: string; valor: number };

export type CartasIndex = Record<string, Carta>;

// Una "pila" de propiedades en la mesa de un jugador, asignada a un color
export interface SetMesa {
  color: Color;
  cartaIds: string[]; // propiedades + bicolor (asignadas a este color) + arcoiris
  casa: boolean;
  torre: boolean;
}

export interface Jugador {
  id: string;
  nombre: string;
  avatar: string; // emoji
  conectado: boolean;
  ultimoVisto: number; // ts ms
  // privado: solo se le envía al dueño
  mano: string[];
  banco: string[]; // ids de cartas dinero
  mesa: SetMesa[];
  // contadores para estadísticas
  cartasJugadas: number;
  ataquesHechos: number;
  defensasHechas: number;
}

export type ModoJuego = "clasico" | "rapido";

export type CondicionVictoria =
  | { tipo: "sets"; cantidad: number }
  | { tipo: "tiempo"; minutos: number }
  | { tipo: "valor"; millones: number };

export type LimiteTurno = 30 | 60 | 90 | null;

export interface ConfigVannyDeal {
  modo: ModoJuego;
  victoria: CondicionVictoria;
  limiteTurnoSeg: LimiteTurno;
}

export type Fase =
  | "lobby"
  | "jugando"
  | "pago" // alguien debe pagar deuda
  | "noGraciasVentana" // ventana de 5s para usar No Gracias
  | "espionajeAbierto" // un jugador está viendo la mano de otro
  | "juicioPopular" // votación abierta
  | "fin";

// Algo que se está cobrando — puede ir contra 1 o N jugadores
export interface Pago {
  id: string;
  acreedorId: string;
  monto: number;
  deudores: string[]; // jugadores que aún deben pagar
  motivo: string; // texto descriptivo
  pagados: Record<string, { dineroIds: string[]; propiedadIds: string[] }>;
}

// "No Gracias" se ofrece al objetivo de una acción atacante
export interface NoGraciasContexto {
  // Una acción se está aplicando; los objetivos pueden cancelarla con No Gracias.
  // Se mantiene una cadena: no-gracias sobre no-gracias = el ataque sigue.
  accionOriginal: PendienteAccion;
  cadenaNoGracias: { jugadorId: string; cartaId: string }[]; // pares (atacante, no-gracias usado)
  expira: number; // ts ms
  cancelable: boolean; // false cuando ya hay un nivel impar (ataque cancelado), true cuando hay nivel par (no gracias sobre no gracias)
  // jugadores que aún pueden reaccionar
  esperandoRespuestaDe: string[];
}

export interface PendienteAccion {
  // descripción serializable de qué hacer si la acción procede
  tipo: AccionTipo;
  origenJugadorId: string;
  cartaId: string; // la carta de acción jugada
  // payload específico
  objetivoJugadorId?: string;
  objetivoCartaId?: string; // para robo selectivo, intercambio
  ofrecidaCartaId?: string; // para intercambio (la que el jugador da)
  setColor?: Color; // para asalto monopolio
  // valores derivados
  monto?: number;
  multiplicador?: number; // para Megáfono
}

export interface JuicioPopular {
  origenJugadorId: string;
  objetivoJugadorId: string;
  veredicto: "robarPropiedad" | "cobrar3M";
  cartaId: string; // el juicio popular jugado
  votos: Record<string, "si" | "no">; // jugadorId -> voto
  expira: number;
  // si veredicto = robarPropiedad, qué propiedad: el atacante elige al ejecutar
  propiedadId?: string;
}

export interface EventoLog {
  id: string;
  ts: number;
  texto: string; // log del juego (acciones, no chat)
}

export interface SalaVannyDeal {
  codigo: string;
  hostId: string;
  fase: Fase;
  jugadores: Jugador[];
  config: ConfigVannyDeal;
  // mazo / descarte / cartas
  mazo: string[]; // top -> [0]
  descarte: string[];
  cartas: CartasIndex;
  // turno actual
  turnoIdx: number; // índice en jugadores
  cartasJugadasEnTurno: number;
  cartasRobadasEnTurno: number;
  inicioTurno: number; // ts ms
  // efectos del turno
  megafonoActivo: boolean; // duplicar próxima acción
  // estado de fases especiales
  pago: Pago | null;
  noGracias: NoGraciasContexto | null;
  espionaje: { miradorId: string; objetivoId: string; expira: number } | null;
  juicio: JuicioPopular | null;
  // log de eventos del juego (sistema)
  log: EventoLog[];
  // idempotencia
  accionesAplicadas: Record<string, number>; // actionId -> ts (para purga)
  // ganador
  ganador: { jugadorIds: string[]; motivo: string } | null;
  // tiempo
  creadaEn: number;
  partidaInicio: number | null;
  // estadísticas para el final
  estadisticas: Record<string, { ataques: number; defensas: number; cartasJugadas: number; vecesAtacado: number }>;
}

export interface VistaPublica {
  codigo: string;
  hostId: string;
  fase: Fase;
  config: ConfigVannyDeal;
  jugadores: Array<{
    id: string;
    nombre: string;
    avatar: string;
    conectado: boolean;
    cantidadMano: number;
    banco: { valorTotal: number; cartas: { valor: number; id: string }[] };
    mesa: SetMesa[];
    setsCompletos: number;
  }>;
  turnoIdx: number;
  cartasJugadasEnTurno: number;
  cartasRobadasEnTurno: number;
  inicioTurno: number;
  limiteTurnoSeg: LimiteTurno;
  cantidadMazo: number;
  cantidadDescarte: number;
  pago: Pago | null;
  noGracias: NoGraciasContexto | null;
  espionaje: { miradorId: string; objetivoId: string; expira: number } | null;
  juicio: JuicioPopular | null;
  log: EventoLog[];
  ganador: { jugadorIds: string[]; motivo: string } | null;
  estadisticas: SalaVannyDeal["estadisticas"];
  // tope del descarte (para mostrar última jugada)
  topeDescarte: Carta | null;
}

export interface VistaPrivada {
  jugadorId: string;
  mano: Carta[];
  // si está mirando una mano por espionaje, también la incluyo
  manoEspiada: Carta[] | null;
}
