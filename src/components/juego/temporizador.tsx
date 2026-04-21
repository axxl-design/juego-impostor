"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Vote, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { formatearTiempo } from "@/lib/utils";

export function TemporizadorPantalla() {
  const { finEn, irAVotacion, config } = useJuegoLocal();
  const [restante, setRestante] = useState(config.duracionSeg);

  useEffect(() => {
    if (!finEn) return;
    const tick = () => {
      const ms = finEn - Date.now();
      setRestante(Math.max(0, Math.ceil(ms / 1000)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [finEn]);

  useEffect(() => {
    if (restante === 0 && finEn) {
      const t = setTimeout(() => irAVotacion(), 800);
      return () => clearTimeout(t);
    }
  }, [restante, finEn, irAVotacion]);

  const peligro = restante <= 10;
  const progreso = config.duracionSeg > 0 ? restante / config.duracionSeg : 0;

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12">
      <div className="w-full max-w-md text-center space-y-10">
        <div>
          <div className="text-sm uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Discusión en curso
          </div>
          <p className="mt-2 text-balance text-[var(--color-tinta)]">
            Háganse preguntas para descubrir al impostor.
          </p>
        </div>

        <div className="relative aspect-square mx-auto w-64 sm:w-80">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--color-borde)"
              strokeWidth="2"
              opacity="0.15"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={peligro ? "#ef4444" : "url(#grad)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progreso) }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            key={restante}
            initial={{ scale: peligro ? 1.18 : 1.05, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className={`absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums tracking-tight ${
              peligro ? "text-[var(--color-peligro)]" : "text-gradient-primario"
            }`}
            style={{ fontSize: "clamp(3.5rem, 18vw, 6rem)" }}
          >
            {formatearTiempo(restante)}
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          <Button tamano="lg" onClick={irAVotacion} variante="primario">
            <Vote className="h-5 w-5" />
            Pasar a votación
          </Button>
          <p className="text-xs text-[var(--color-tinta-suave)] flex items-center justify-center gap-1">
            <Pause className="h-3 w-3" /> Pueden pausar la discusión cuando estén listos
          </p>
        </div>
      </div>
    </div>
  );
}
