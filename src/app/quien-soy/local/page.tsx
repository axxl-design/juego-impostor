"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/header";
import { SetupLocalQuienSoy } from "@/components/quien-soy/setup-local";
import { RepartoLocalQuienSoy } from "@/components/quien-soy/reparto-local";
import { JuegoLocalQuienSoy, FinLocalQuienSoy } from "@/components/quien-soy/juego-local";
import { useJuegoQuienSoyLocal } from "@/lib/store-local-quien-soy";

export default function QuienSoyLocalPage() {
  const fase = useJuegoQuienSoyLocal((s) => s.fase);
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
            {fase === "config" && <SetupLocalQuienSoy />}
            {fase === "reparto" && <RepartoLocalQuienSoy />}
            {fase === "juego" && <JuegoLocalQuienSoy />}
            {fase === "fin" && <FinLocalQuienSoy />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
