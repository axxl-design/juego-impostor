"use client";

import { motion } from "framer-motion";
import type { PoderJugador } from "@/lib/types";

const INFO: Record<
  PoderJugador["tipo"],
  { emoji: string; nombre: string; descripcion: string; color: string }
> = {
  vidente: {
    emoji: "👁️",
    nombre: "Vidente",
    descripcion: "Antes de votar vas a poder ver el voto de otro jugador elegido al azar.",
    color: "from-indigo-500 to-purple-600",
  },
  escudo: {
    emoji: "🛡️",
    nombre: "Escudo",
    descripcion: "Los votos contra vos valen la mitad en esta ronda.",
    color: "from-cyan-500 to-blue-600",
  },
  dobleAgente: {
    emoji: "🎭",
    nombre: "Doble agente",
    descripcion: "Si sos impostor, podés acusar falsamente a alguien antes de votar.",
    color: "from-amber-500 to-red-500",
  },
  traductor: {
    emoji: "📖",
    nombre: "Traductor",
    descripcion: "Vas a ver una palabra extra (falsa) además de la real. Útil para despistar.",
    color: "from-emerald-500 to-teal-600",
  },
};

export function PoderCard({ poder }: { poder: PoderJugador }) {
  const info = INFO[poder.tipo];
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
      className={`w-full p-4 rounded-2xl border-2 border-[var(--color-borde)] bg-gradient-to-br ${info.color} text-white shadow-[var(--shadow-brutal)]`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none shrink-0">{info.emoji}</span>
        <div className="flex-1 text-left">
          <div className="text-[10px] uppercase tracking-widest opacity-80">Poder secreto</div>
          <div className="font-display font-black text-lg leading-tight">{info.nombre}</div>
          <div className="text-xs mt-1 opacity-90 leading-snug">{info.descripcion}</div>
        </div>
      </div>
    </motion.div>
  );
}
