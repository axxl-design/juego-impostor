"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/header";
import { SetupLocal } from "@/components/juego/setup-local";
import { RepartoLocal } from "@/components/juego/reparto-local";
import { TemporizadorPantalla } from "@/components/juego/temporizador";
import { VotacionLocal } from "@/components/juego/votacion-local";
import { ResultadoLocal } from "@/components/juego/resultado-local";
import { useJuegoLocal } from "@/lib/store-local";

export default function LocalPage() {
  const fase = useJuegoLocal((s) => s.fase);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  if (!montado) return null;

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header volver="/" />
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={fase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {fase === "config" && <SetupLocal />}
            {fase === "reparto" && <RepartoLocal />}
            {fase === "discusion" && <TemporizadorPantalla />}
            {fase === "votacion" && <VotacionLocal />}
            {fase === "resultado" && <ResultadoLocal />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
