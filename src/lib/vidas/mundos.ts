import type { MundoId, PoderSubtipo } from "./types";

export type DefinicionRol = {
  id: string;
  nombre: string;
  descripcion: string;
  rangoInicial: string;
  statsIniciales: {
    karma: number;
    influencia: number;
    riqueza: number;
    salud: number;
  };
};

export type DefinicionMundo = {
  id: MundoId;
  nombre: string;
  emoji: string;
  tagline: string;
  descripcion: string;
  tono: string;
  color: string;
  roles: DefinicionRol[];
};

export const MUNDOS: DefinicionMundo[] = [
  {
    id: "medieval",
    nombre: "Reino Medieval",
    emoji: "🏰",
    tagline: "Jura lealtades. Gana tierras. Sobreviví al invierno.",
    descripcion:
      "Un reino feudal atravesado por guerras, plagas y políticas de corte. Tu apellido puede ser tu tumba o tu escalera.",
    tono: "épico · drama político",
    color: "#9333ea",
    roles: [
      {
        id: "campesino",
        nombre: "Campesino/a",
        descripcion: "Naciste en una cabaña de tierra. Casi nada es tuyo. Todo por ganar.",
        rangoInicial: "Campesino sin tierra",
        statsIniciales: { karma: 0, influencia: 5, riqueza: 5, salud: 70 },
      },
      {
        id: "artesano",
        nombre: "Artesano/a",
        descripcion: "Tenés un oficio y un gremio. El comercio te respeta. La nobleza te mira de costado.",
        rangoInicial: "Aprendiz de gremio",
        statsIniciales: { karma: 0, influencia: 15, riqueza: 20, salud: 75 },
      },
      {
        id: "caballero",
        nombre: "Caballero/a",
        descripcion: "Juraste lealtad a un señor. Tu espada te sostiene. La obediencia también.",
        rangoInicial: "Caballero novato",
        statsIniciales: { karma: 0, influencia: 30, riqueza: 25, salud: 85 },
      },
      {
        id: "noble",
        nombre: "Noble menor",
        descripcion: "Un título pequeño, una deuda grande. Podés llegar alto si sabés con quién casarte.",
        rangoInicial: "Noble menor",
        statsIniciales: { karma: 0, influencia: 45, riqueza: 45, salud: 75 },
      },
      {
        id: "bardo",
        nombre: "Bardo/a",
        descripcion: "Cantás verdades que otros no se animan. La palabra es tu arma y tu condena.",
        rangoInicial: "Bardo errante",
        statsIniciales: { karma: 5, influencia: 20, riqueza: 10, salud: 70 },
      },
    ],
  },
  {
    id: "actual",
    nombre: "Mundo Actual",
    emoji: "🌆",
    tagline: "Escalá rápido o quedate atrás. Nadie regala nada.",
    descripcion:
      "Una metrópoli del siglo XXI. Ambición, pantallas, contratos, tribunales. La reputación es moneda y trampa.",
    tono: "contemporáneo · moral gris",
    color: "#06b6d4",
    roles: [
      {
        id: "empresario",
        nombre: "Empresario/a emergente",
        descripcion: "Arrancaste con un cuaderno y una idea. Todo lo demás lo tenés que ganar o robar.",
        rangoInicial: "Fundador/a sin ronda",
        statsIniciales: { karma: 0, influencia: 10, riqueza: 20, salud: 75 },
      },
      {
        id: "politico",
        nombre: "Político/a joven",
        descripcion: "Concejal del barrio hoy. ¿Presidente mañana? Depende de a cuántos pises.",
        rangoInicial: "Concejal/a de barrio",
        statsIniciales: { karma: 0, influencia: 30, riqueza: 15, salud: 75 },
      },
      {
        id: "artista",
        nombre: "Artista",
        descripcion: "Músico, actor, pintor. Vivís de lo que la gente sienta, y eso no siempre alcanza.",
        rangoInicial: "Artista emergente",
        statsIniciales: { karma: 5, influencia: 15, riqueza: 10, salud: 70 },
      },
      {
        id: "periodista",
        nombre: "Periodista",
        descripcion: "Cuarto poder, quinta columna, según quién te lee. Tus fuentes te cuidan mejor que tu sueldo.",
        rangoInicial: "Redactor/a junior",
        statsIniciales: { karma: 10, influencia: 20, riqueza: 10, salud: 70 },
      },
      {
        id: "medico",
        nombre: "Médico/a",
        descripcion: "Guardias de 36 horas, una residencia que aún no terminás. La vida ajena pesa.",
        rangoInicial: "Residente",
        statsIniciales: { karma: 15, influencia: 15, riqueza: 15, salud: 65 },
      },
    ],
  },
  {
    id: "poderes",
    nombre: "Mundo con Poderes",
    emoji: "⚡",
    tagline: "Naciste distinto. La ciudad todavía no sabe qué hacer con vos.",
    descripcion:
      "Humanos con habilidades sobrehumanas: mutaciones biológicas, tecnología implantada, entrenamientos extremos. Ni magia ni milagros — biología y circuitos.",
    tono: "heroico · antihéroe · moral compleja",
    color: "#ec4899",
    roles: [
      {
        id: "elemental",
        nombre: "Control elemental",
        descripcion: "Tu cuerpo fabrica y dirige un elemento: fuego, agua, tierra, aire, rayo o hielo. Empieza torpe.",
        rangoInicial: "Control elemental · Latente",
        statsIniciales: { karma: 0, influencia: 10, riqueza: 10, salud: 80 },
      },
      {
        id: "tecnologico",
        nombre: "Manipulación tecnológica",
        descripcion: "Un implante en el cráneo habla con máquinas. Hackeás con la mente. Atrae a las corporaciones.",
        rangoInicial: "Tecnoempatía · Latente",
        statsIniciales: { karma: 0, influencia: 15, riqueza: 15, salud: 70 },
      },
      {
        id: "fuerza",
        nombre: "Super fuerza",
        descripcion: "Músculos anclados a una red ósea reforzada. Romper cosas es fácil. No romper cosas es la tarea.",
        rangoInicial: "Hiperfuerza · Latente",
        statsIniciales: { karma: 0, influencia: 10, riqueza: 5, salud: 90 },
      },
      {
        id: "telepatia",
        nombre: "Telepatía",
        descripcion: "Leés pensamientos y proyectás imágenes. Escuchás demasiado. No todos quieren que sepas.",
        rangoInicial: "Telépata · Latente",
        statsIniciales: { karma: 0, influencia: 20, riqueza: 5, salud: 65 },
      },
      {
        id: "velocidad",
        nombre: "Super velocidad",
        descripcion: "Tu metabolismo corre distinto al resto del mundo. Comés mucho. Vivís rápido.",
        rangoInicial: "Velocista · Latente",
        statsIniciales: { karma: 0, influencia: 10, riqueza: 5, salud: 80 },
      },
    ],
  },
];

export function buscarMundo(id: string): DefinicionMundo | undefined {
  return MUNDOS.find((m) => m.id === id);
}

export function buscarRol(mundoId: string, rolId: string): DefinicionRol | undefined {
  return buscarMundo(mundoId)?.roles.find((r) => r.id === rolId);
}

export const SUBTIPOS_ELEMENTALES: { id: PoderSubtipo; nombre: string; emoji: string }[] = [
  { id: "fuego", nombre: "Fuego", emoji: "🔥" },
  { id: "agua", nombre: "Agua", emoji: "💧" },
  { id: "tierra", nombre: "Tierra", emoji: "🗿" },
  { id: "aire", nombre: "Aire", emoji: "🌬️" },
  { id: "rayo", nombre: "Rayo", emoji: "⚡" },
  { id: "hielo", nombre: "Hielo", emoji: "❄️" },
];

export function nivelPoderDesdeNumero(n: number): "latente" | "despierto" | "experto" | "maestro" {
  if (n >= 75) return "maestro";
  if (n >= 50) return "experto";
  if (n >= 25) return "despierto";
  return "latente";
}
