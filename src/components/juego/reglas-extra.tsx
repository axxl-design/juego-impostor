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

function Toggle({ activo, onToggle, disabled }: { activo: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onToggle();
      }}
      className={cn(
        "relative w-11 h-6 mt-0.5 rounded-full border-2 border-[var(--color-borde)] shrink-0 transition-colors duration-200 ease-out",
        activo ? "bg-[var(--color-primario-500)]" : "bg-[var(--color-fondo)]",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 bg-white border-2 border-[var(--color-borde)] rounded-full transition-transform duration-200 ease-out",
          activo ? "translate-x-[1.25rem]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function ReglasExtraImpostorSeccion({ reglas, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      {REGLAS.map((r) => {
        const bloqueado = !!r.requiere && !reglas[r.requiere];
        const activo = !!reglas[r.key] && !bloqueado;
        const inhabilitado = disabled || bloqueado;
        return (
          <Card key={r.key} className={cn("p-3 sm:p-4", bloqueado && "opacity-60")}>
            <div
              className={cn("flex items-start gap-3", inhabilitado ? "cursor-not-allowed" : "cursor-pointer")}
              onClick={() => {
                if (inhabilitado) return;
                onChange({ [r.key]: !activo } as Partial<ReglasExtraImpostor>);
              }}
              title={bloqueado ? r.motivoBloqueo : undefined}
            >
              <Toggle
                activo={activo}
                disabled={inhabilitado}
                onToggle={() => onChange({ [r.key]: !activo } as Partial<ReglasExtraImpostor>)}
              />
              <span className="flex-1 min-w-0 select-none">
                <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
                  <span className="text-lg leading-none">{r.emoji}</span>
                  {r.titulo}
                </span>
                <span className="block text-xs sm:text-sm text-[var(--color-tinta-suave)] mt-0.5 leading-snug">
                  {bloqueado ? r.motivoBloqueo : r.descripcion}
                </span>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

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
      {items.map((r) => {
        const activo = reglas[r.key];
        return (
          <Card key={r.key} className="p-3 sm:p-4">
            <div
              className={cn("flex items-start gap-3", disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer")}
              onClick={() => {
                if (disabled) return;
                onChange({ [r.key]: !activo });
              }}
            >
              <Toggle
                activo={activo}
                disabled={disabled}
                onToggle={() => onChange({ [r.key]: !activo })}
              />
              <span className="flex-1 min-w-0 select-none">
                <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
                  <span className="text-lg leading-none">{r.emoji}</span>
                  {r.titulo}
                </span>
                <span className="block text-xs sm:text-sm text-[var(--color-tinta-suave)] mt-0.5 leading-snug">
                  {r.descripcion}
                </span>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
