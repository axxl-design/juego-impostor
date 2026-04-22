"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import type { EstadoJugador, RespuestaFinal } from "@/lib/vidas/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buscarMundo, buscarRol } from "@/lib/vidas/mundos";

export function PantallaFinal({
  jugador,
  final,
  onJugarDeNuevo,
  onCambiarMundo,
  onVerTimeline,
}: {
  jugador: EstadoJugador;
  final: RespuestaFinal;
  onJugarDeNuevo?: () => void;
  onCambiarMundo?: () => void;
  onVerTimeline?: () => void;
}) {
  const lanzado = useRef(false);
  useEffect(() => {
    if (lanzado.current) return;
    lanzado.current = true;
    if (jugador.stats.karma >= 50) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#06b6d4", "#fcd34d"],
        });
      }, 400);
    }
  }, [jugador.stats.karma]);

  const mundoDef = buscarMundo(jugador.mundo);
  const rolDef = buscarRol(jugador.mundo, jugador.rol);

  return (
    <div className="min-h-screen px-4 sm:px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-6"
      >
        <div className="text-center">
          <div className="text-5xl mb-2">{mundoDef?.emoji ?? "🕊️"}</div>
          <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
            Fin de la vida
          </div>
          <h1 className="mt-1 font-display font-black text-3xl sm:text-5xl tracking-tight">
            {jugador.nombre}
          </h1>
          <div className="mt-1 text-sm text-[var(--color-tinta-suave)]">
            {rolDef?.nombre} · {mundoDef?.nombre} · {jugador.edad} años
          </div>
        </div>

        <Card className="mt-6 p-6">
          <p className="text-base sm:text-lg leading-relaxed">{final.resumen}</p>
          <div className="mt-4 pt-4 border-t border-[var(--color-borde)]/20">
            <p className="text-sm italic text-[var(--color-primario-600)] font-display">
              &ldquo;{final.frase}&rdquo;
            </p>
          </div>
        </Card>

        <StatsFinales jugador={jugador} />

        {final.epilogoRelacion && (
          <Card className="mt-6 p-6 bg-[var(--color-primario-500)]/10 border-[var(--color-primario-500)]">
            <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-primario-600)] mb-2">
              Epílogo de la relación
            </div>
            <p className="text-base leading-relaxed">{final.epilogoRelacion}</p>
          </Card>
        )}

        <section className="mt-6">
          <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)] mb-3">
            Decisiones que te definieron
          </div>
          <div className="space-y-2">
            {final.highlights.map((h, i) => (
              <Card key={i} className="p-4">
                <div className="text-xs text-[var(--color-tinta-suave)]">
                  A los {h.edad} · {h.tituloCarta}
                </div>
                <div className="mt-1 text-sm font-semibold">{h.opcionTexto}</div>
                <div className="mt-1 text-xs text-[var(--color-tinta-suave)] italic">
                  {h.consecuenciaTexto}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-2 sm:grid-cols-3">
          {onJugarDeNuevo && (
            <Button tamano="lg" onClick={onJugarDeNuevo}>
              Otra vida
            </Button>
          )}
          {onCambiarMundo && (
            <Button tamano="lg" variante="secundario" onClick={onCambiarMundo}>
              Cambiar mundo
            </Button>
          )}
          {onVerTimeline && (
            <Button tamano="lg" variante="ghost" onClick={onVerTimeline}>
              Ver línea de vida
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatsFinales({ jugador }: { jugador: EstadoJugador }) {
  const stats: [string, number, boolean][] = [
    ["Karma", jugador.stats.karma, true],
    ["Influencia", jugador.stats.influencia, false],
    ["Riqueza", jugador.stats.riqueza, false],
    ["Salud final", jugador.stats.salud, false],
  ];
  if (jugador.mundo === "poderes") stats.push(["Poder", jugador.stats.nivelPoder, false]);
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
      {stats.map(([label, valor, bipolar]) => {
        const ancho = bipolar ? Math.abs(valor) : valor;
        const color = bipolar
          ? valor >= 0
            ? "bg-[var(--color-exito)]"
            : "bg-[var(--color-peligro)]"
          : "bg-[var(--color-primario-500)]";
        return (
          <div
            key={label}
            className="p-3 rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]"
          >
            <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
              {label}
            </div>
            <div className="font-mono tabular-nums text-xl font-bold">
              {bipolar && valor > 0 ? "+" : ""}
              {valor}
            </div>
            <div className="mt-1 h-2 rounded-full bg-[var(--color-borde)]/10 overflow-hidden">
              <div className={`h-full ${color}`} style={{ width: `${ancho}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
