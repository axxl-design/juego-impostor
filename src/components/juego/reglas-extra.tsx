"use client";

import { Card } from "@/components/ui/card";
import type { ReglasExtraImpostor } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  reglas: ReglasExtraImpostor;
  onChange: (parcial: Partial<ReglasExtraImpostor>) => void;
  disabled?: boolean;
};

type ReglaDef = {
  key: keyof ReglasExtraImpostor;
  titulo: string;
  emoji: string;
  descripcion: string;
  requiere?: keyof ReglasExtraImpostor;
  motivoBloqueo?: string;
};

const REGLAS: ReglaDef[] = [
  {
    key: "pistasActivas",
    titulo: "Pistas",
    emoji: "💡",
    descripcion: "Impostor puede pedir hasta 3 pistas (cuesta 1 pt c/u). Civiles ven 1 contexto por ronda.",
  },
  {
    key: "puntajePersistente",
    titulo: "Puntaje persistente",
    emoji: "🏆",
    descripcion: "Se suman puntos ronda a ronda con leaderboard.",
  },
  {
    key: "roboPuntos",
    titulo: "Robo de puntos",
    emoji: "🎯",
    descripcion: "Civil que vota bien al impostor le roba 2 pts.",
    requiere: "puntajePersistente",
    motivoBloqueo: "Necesita Puntaje persistente",
  },
  {
    key: "poderesAleatorios",
    titulo: "Poderes aleatorios",
    emoji: "⚡",
    descripcion: "1-2 jugadores reciben un poder secreto por ronda (vidente, escudo, doble agente, traductor).",
  },
  {
    key: "preguntasSugeridas",
    titulo: "Preguntas sugeridas",
    emoji: "💬",
    descripcion: "Panel plegable con preguntas para romper el hielo en la discusión.",
  },
  {
    key: "jefeFinal",
    titulo: "Jefe Final cada 5 rondas",
    emoji: "👑",
    descripcion: "Ronda especial con 2 impostores, categoría Mezcla total y puntaje duplicado.",
    requiere: "puntajePersistente",
    motivoBloqueo: "Necesita Puntaje persistente",
  },
];

export function ReglasExtraImpostorSeccion({ reglas, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      {REGLAS.map((r) => {
        const bloqueado = !!r.requiere && !reglas[r.requiere];
        const activo = !!reglas[r.key] && !bloqueado;
        return (
          <Card key={r.key} className={cn("p-3 sm:p-4", bloqueado && "opacity-60")}>
            <label
              className={cn(
                "flex items-start gap-3",
                disabled || bloqueado ? "cursor-not-allowed" : "cursor-pointer",
              )}
              title={bloqueado ? r.motivoBloqueo : undefined}
            >
              <input
                type="checkbox"
                disabled={disabled || bloqueado}
                checked={activo}
                onChange={(e) => onChange({ [r.key]: e.target.checked } as Partial<ReglasExtraImpostor>)}
                className="sr-only peer"
              />
              <span className="relative w-11 h-6 mt-0.5 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo)] peer-checked:gradient-primario transition-colors shrink-0">
                <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white border-2 border-[var(--color-borde)] rounded-full peer-checked:translate-x-5 transition-transform" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
                  <span className="text-lg leading-none">{r.emoji}</span>
                  {r.titulo}
                </span>
                <span className="block text-xs sm:text-sm text-[var(--color-tinta-suave)] mt-0.5 leading-snug">
                  {bloqueado ? r.motivoBloqueo : r.descripcion}
                </span>
              </span>
            </label>
          </Card>
        );
      })}
    </div>
  );
}

// Variante para ¿Quién Soy?
type PropsQS = {
  reglas: { pistasActivas: boolean; escudoComprable: boolean };
  onChange: (parcial: Partial<{ pistasActivas: boolean; escudoComprable: boolean }>) => void;
  disabled?: boolean;
};

export function ReglasExtraQuienSoySeccion({ reglas, onChange, disabled }: PropsQS) {
  const items = [
    {
      key: "pistasActivas" as const,
      titulo: "Pistas",
      emoji: "💡",
      descripcion: "Cada jugador puede pedir hasta 3 pistas sobre su palabra (cuesta 1 pt, mín 1 pt).",
    },
    {
      key: "escudoComprable" as const,
      titulo: "Escudo comprable",
      emoji: "🛡️",
      descripcion: "Con 5+ pts podés comprar un escudo por 2 pts. Evita el próximo fallo.",
    },
  ];
  return (
    <div className="space-y-2">
      {items.map((r) => (
        <Card key={r.key} className="p-3 sm:p-4">
          <label className={cn("flex items-start gap-3", disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer")}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={reglas[r.key]}
              onChange={(e) => onChange({ [r.key]: e.target.checked })}
              className="sr-only peer"
            />
            <span className="relative w-11 h-6 mt-0.5 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo)] peer-checked:gradient-primario transition-colors shrink-0">
              <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white border-2 border-[var(--color-borde)] rounded-full peer-checked:translate-x-5 transition-transform" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
                <span className="text-lg leading-none">{r.emoji}</span>
                {r.titulo}
              </span>
              <span className="block text-xs sm:text-sm text-[var(--color-tinta-suave)] mt-0.5 leading-snug">
                {r.descripcion}
              </span>
            </span>
          </label>
        </Card>
      ))}
    </div>
  );
}
