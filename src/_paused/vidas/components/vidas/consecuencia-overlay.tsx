"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Efectos } from "@/lib/vidas/types";
import { Button } from "@/components/ui/button";

export function ConsecuenciaOverlay({
  visible,
  titulo,
  consecuencia,
  efectos,
  autorNombre,
  onContinuar,
}: {
  visible: boolean;
  titulo: string;
  consecuencia: string;
  efectos: Efectos;
  autorNombre?: string;
  onContinuar: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95 }}
            className="max-w-md w-full bg-[var(--color-fondo-elev)] border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] rounded-3xl p-6"
          >
            {autorNombre && (
              <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-1">
                {autorNombre} eligió
              </div>
            )}
            <h3 className="font-display font-bold text-xl leading-tight">{titulo}</h3>
            <p className="mt-3 text-sm text-[var(--color-tinta)] leading-relaxed">
              {consecuencia}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(efectos)
                .filter(([k]) => k !== "edad" && k !== "rango")
                .map(([k, v]) => {
                  if (typeof v !== "number" || v === 0) return null;
                  const positivo = v > 0;
                  const bg = positivo ? "bg-[var(--color-exito)]/20 border-[var(--color-exito)]" : "bg-[var(--color-peligro)]/20 border-[var(--color-peligro)]";
                  const label = etiquetaStat(k);
                  return (
                    <motion.span
                      key={k}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border-2 ${bg}`}
                    >
                      {positivo ? "+" : ""}
                      {v} {label}
                    </motion.span>
                  );
                })}
              {efectos.rango && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg border-2 bg-[var(--color-primario-500)]/20 border-[var(--color-primario-500)]">
                  ⭐ {efectos.rango}
                </span>
              )}
              {efectos.edad && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg border-2 bg-[var(--color-cian)]/20 border-[var(--color-cian)]">
                  +{efectos.edad} años
                </span>
              )}
            </div>

            <Button tamano="lg" className="mt-5 w-full" onClick={onContinuar}>
              Continuar →
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function etiquetaStat(k: string): string {
  switch (k) {
    case "karma":
      return "karma";
    case "influencia":
      return "influencia";
    case "riqueza":
      return "riqueza";
    case "salud":
      return "salud";
    case "nivelPoder":
      return "poder";
    case "vinculo":
      return "vínculo";
    default:
      return k;
  }
}
