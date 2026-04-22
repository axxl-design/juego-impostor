"use client";

import { Heart, Coins, Sparkles, HeartPulse, Zap } from "lucide-react";
import type { EstadoJugador } from "@/lib/vidas/types";

export function StatsBar({ jugador, vinculo }: { jugador: EstadoJugador; vinculo?: number }) {
  const s = jugador.stats;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatPill label="Karma" valor={s.karma} icon={<Heart className="h-3 w-3" />} bipolar />
      <StatPill label="Influencia" valor={s.influencia} icon={<Sparkles className="h-3 w-3" />} />
      <StatPill label="Riqueza" valor={s.riqueza} icon={<Coins className="h-3 w-3" />} />
      <StatPill label="Salud" valor={s.salud} icon={<HeartPulse className="h-3 w-3" />} />
      {jugador.mundo === "poderes" && (
        <StatPill label="Poder" valor={s.nivelPoder} icon={<Zap className="h-3 w-3" />} />
      )}
      {typeof vinculo === "number" && (
        <StatPill label="Vínculo" valor={vinculo} icon={<Heart className="h-3 w-3 fill-current" />} />
      )}
    </div>
  );
}

function StatPill({
  label,
  valor,
  icon,
  bipolar,
}: {
  label: string;
  valor: number;
  icon: React.ReactNode;
  bipolar?: boolean;
}) {
  const color = bipolar
    ? valor > 0
      ? "bg-[var(--color-exito)]/15 border-[var(--color-exito)]/40"
      : valor < 0
        ? "bg-[var(--color-peligro)]/15 border-[var(--color-peligro)]/40"
        : "bg-[var(--color-fondo-elev)]"
    : "bg-[var(--color-fondo-elev)]";
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl border-2 border-[var(--color-borde)] text-xs font-semibold shadow-[2px_2px_0_0_var(--color-borde)] ${color}`}
      title={label}
    >
      <span className="opacity-70">{icon}</span>
      <span className="font-mono tabular-nums">{bipolar && valor > 0 ? "+" : ""}{valor}</span>
    </div>
  );
}
