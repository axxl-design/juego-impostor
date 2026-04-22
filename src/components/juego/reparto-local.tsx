"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, VenetianMask, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { PoderCard } from "@/components/juego/poder-card";

export function RepartoLocal() {
  const jugadores = useJuegoLocal((s) => s.jugadores);
  const indiceReparto = useJuegoLocal((s) => s.indiceReparto);
  const ronda = useJuegoLocal((s) => s.ronda);
  const avanzarReparto = useJuegoLocal((s) => s.avanzarReparto);
  const [revelado, setRevelado] = useState(false);

  if (!ronda) return null;
  const jugador = jugadores[indiceReparto];
  if (!jugador) return null;
  const impostores = [ronda.impostorId, ...(ronda.impostoresExtra ?? [])];
  const esImpostor = impostores.includes(jugador.id);
  const ultimo = indiceReparto === jugadores.length - 1;
  const miPoder = ronda.poderes?.find((p) => p.jugadorId === jugador.id) ?? null;

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12">
      <div className="w-full max-w-md">
        {ronda.esJefeFinal && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[var(--shadow-brutal)] border-2 border-[var(--color-borde)]">
              <Crown className="h-4 w-4" />
              RONDA JEFE FINAL · 2x puntos
            </div>
          </motion.div>
        )}
        <div className="text-center mb-6">
          <div className="text-sm font-mono uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Jugador {indiceReparto + 1} de {jugadores.length}
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
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <VenetianMask className="absolute -right-10 -top-10 h-56 w-56 rotate-12" strokeWidth={1.2} />
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
                  onClick={() => setRevelado(true)}
                  className="mt-2"
                >
                  <Eye className="h-5 w-5" />
                  Revelar mi rol
                </Button>
              </div>
            </motion.div>
          ) : esImpostor ? (
            <motion.div
              key="impostor"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] overflow-hidden bg-[#0a0a0f] text-white p-8 sm:p-10 animar-pulso-rojo"
            >
              <div className="flex flex-col items-center text-center gap-5">
                <div className="text-xs uppercase tracking-widest text-red-400">Tu rol</div>
                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  className="font-display font-black text-5xl sm:text-6xl text-red-500 animar-glitch"
                  style={{ textShadow: "0 0 24px rgba(239,68,68,0.6)" }}
                >
                  IMPOSTOR
                </motion.div>
                <p className="text-white/85 max-w-xs">
                  Sabés que la categoría es{" "}
                  <span className="font-bold text-white">{ronda.categoriaNombre}</span>
                  , pero no la palabra. Disimulá.
                </p>
                {(ronda.impostoresExtra?.length ?? 0) > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 border-2 border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-widest">
                    Hay otro impostor — no sabés quién
                  </div>
                )}
                {miPoder && <PoderCard poder={miPoder} />}
                <BotonSiguiente onClick={() => { setRevelado(false); avanzarReparto(); }} ultimo={ultimo} />
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
                  {ronda.categoriaNombre}
                </div>
                <div className="w-full h-px bg-[var(--color-borde)] opacity-20" />
                <div className="text-xs uppercase tracking-widest text-[var(--color-primario-500)]">
                  Tu palabra secreta
                </div>
                <div
                  className="font-display font-black text-4xl sm:text-5xl text-balance leading-tight text-gradient-primario"
                  style={{ filter: "drop-shadow(0 4px 24px rgba(168,85,247,0.25))" }}
                >
                  {ronda.palabra}
                </div>
                {miPoder?.tipo === "traductor" && miPoder.datos?.palabraFalsa && (
                  <div className="w-full p-3 rounded-xl border-2 border-dashed border-[var(--color-cian)] bg-[var(--color-cian)]/10 text-sm">
                    <div className="text-xs uppercase tracking-widest text-[var(--color-cian)] font-bold mb-1">
                      📖 Traductor — Palabra falsa extra
                    </div>
                    <div className="font-display font-bold text-lg">{miPoder.datos.palabraFalsa}</div>
                  </div>
                )}
                <p className="text-sm text-[var(--color-tinta-suave)]">
                  Memorizala. Vas a tener que disimular para que el impostor no la adivine.
                </p>
                {miPoder && miPoder.tipo !== "traductor" && <PoderCard poder={miPoder} />}
                <BotonSiguiente onClick={() => { setRevelado(false); avanzarReparto(); }} ultimo={ultimo} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BotonSiguiente({ onClick, ultimo }: { onClick: () => void; ultimo: boolean }) {
  return (
    <Button tamano="lg" onClick={onClick} className="mt-2" variante="primario">
      {ultimo ? "Empezar la discusión" : "Listo, pasar al siguiente"}
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
}
