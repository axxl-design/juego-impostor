"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoQuienSoyLocal } from "@/lib/store-local-quien-soy";
import { buscarCategoria } from "@/lib/palabras";

export function RepartoLocalQuienSoy() {
  const { jugadores, indiceReparto, config, avanzarReparto, marcarVisto, rondaActual } = useJuegoQuienSoyLocal();
  const [revelado, setRevelado] = useState(false);

  const jugador = jugadores[indiceReparto];
  if (!jugador) return null;
  const cat = buscarCategoria(config.categoriaId);
  const ultimo = indiceReparto === jugadores.length - 1;

  const reveal = () => {
    setRevelado(true);
    marcarVisto(jugador.id);
  };

  const siguiente = () => {
    setRevelado(false);
    avanzarReparto();
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Ronda {rondaActual} · Jugador {indiceReparto + 1} de {jugadores.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!revelado ? (
            <motion.div
              key="sobre"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformPerspective: 1000 }}
              className="relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] overflow-hidden gradient-primario text-white p-8 sm:p-10"
            >
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <HelpCircle className="absolute -right-10 -top-10 h-56 w-56 rotate-12" strokeWidth={1.2} />
              </div>
              <div className="relative flex flex-col items-center text-center gap-5">
                <Avatar nombre={jugador.nombre} tamano={88} />
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-80">Te toca a vos</div>
                  <div className="font-display font-bold text-3xl sm:text-4xl mt-1 break-words">
                    {jugador.nombre}
                  </div>
                </div>
                <p className="text-white/85 max-w-xs">
                  Asegurate de que nadie más esté mirando la pantalla.
                </p>
                <Button
                  variante="secundario"
                  tamano="lg"
                  onClick={reveal}
                  className="mt-2"
                >
                  <Eye className="h-5 w-5" />
                  Ver mi palabra
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="palabra"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] overflow-hidden bg-[var(--color-fondo-elev)] p-8 sm:p-10"
            >
              <div className="flex flex-col items-center text-center gap-5">
                <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
                  Categoría
                </div>
                <div className="font-display font-bold text-xl text-[var(--color-tinta-suave)]">
                  {cat?.emoji} {cat?.nombre}
                </div>
                <div className="w-full h-px bg-[var(--color-borde)] opacity-20" />
                <div className="text-xs uppercase tracking-widest text-[var(--color-primario-500)]">
                  Sos
                </div>
                <div
                  className="font-display font-black text-4xl sm:text-5xl text-balance leading-tight text-gradient-primario"
                  style={{ filter: "drop-shadow(0 4px 24px rgba(168,85,247,0.25))" }}
                >
                  {jugador.palabra}
                </div>
                <p className="text-sm text-[var(--color-tinta-suave)] max-w-xs">
                  Memorizala. Los demás te van a hacer preguntas para descubrir qué sos.
                </p>
                <Button tamano="lg" onClick={siguiente} className="mt-2" variante="primario">
                  {ultimo ? "Empezar la ronda" : "Listo, pasar al siguiente"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
