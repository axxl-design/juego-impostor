"use client";

import { motion } from "framer-motion";
import type { Carta } from "@/lib/vidas/types";

export function CartaDisplay({
  carta,
  onElegir,
  deshabilitado,
  etiquetaTurno,
}: {
  carta: Carta;
  onElegir?: (index: number) => void;
  deshabilitado?: boolean;
  etiquetaTurno?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative rounded-3xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal-xl)] p-6 sm:p-8">
        {etiquetaTurno && (
          <div className="absolute -top-3 left-6 bg-[var(--color-primario-500)] text-white px-3 py-1 text-xs font-bold rounded-full border-2 border-[var(--color-borde)]">
            {etiquetaTurno}
          </div>
        )}
        <div className="text-5xl sm:text-6xl text-center mb-3">{carta.icono}</div>
        <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight tracking-tight text-center text-balance">
          {carta.titulo}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-tinta)] leading-relaxed text-center text-balance">
          {carta.descripcion}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:gap-3">
        {carta.opciones.map((op, i) => (
          <motion.button
            key={i}
            disabled={deshabilitado}
            onClick={() => onElegir?.(i)}
            whileHover={!deshabilitado ? { y: -2 } : undefined}
            whileTap={!deshabilitado ? { x: 3, y: 3, boxShadow: "0 0 0 0 var(--color-borde)" } : undefined}
            transition={{ duration: 0.1 }}
            className="group w-full text-left p-4 rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-3">
              <span className="h-7 w-7 shrink-0 grid place-items-center rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-primario-500)] text-white text-sm font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm sm:text-base font-medium leading-snug">{op.texto}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
