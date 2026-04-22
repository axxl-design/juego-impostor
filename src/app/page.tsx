"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, VenetianMask, HelpCircle, Lock } from "lucide-react";
import { Header } from "@/components/header";

export default function Hub() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center pt-6 sm:pt-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] mb-6 sm:mb-8">
              <Sparkles className="h-4 w-4 text-[var(--color-primario-500)]" />
              <span className="text-sm font-semibold tracking-tight">Juegos casuales · Para reunirse</span>
            </div>
            <h1 className="font-display font-black text-balance leading-[0.92] tracking-tighter text-6xl sm:text-7xl md:text-8xl">
              <span className="text-gradient-primario">VANNY</span>
              <br />
              Games Vault.
            </h1>
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-[var(--color-tinta-suave)] max-w-xl mx-auto text-balance">
              Juegos casuales para pasarla bien con amigos. Elegí uno y empezá a jugar.
            </p>
          </motion.div>

          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-2">
            <JuegoCard
              href="/impostor/local"
              hrefSecundario="/impostor/online"
              titulo="El Juego del Impostor"
              tagline="Encontrá al infiltrado entre tus amigos."
              descripcion="Una palabra secreta. Uno no la sabe. Háganse preguntas y atrápenlo antes de que se acabe el tiempo."
              meta="15 categorías · 2-8 jugadores · Local + Online"
              icono={<VenetianMask className="h-8 w-8" />}
              variante="primario"
              delay={0.1}
            />
            <JuegoCard
              href="/quien-soy/local"
              hrefSecundario="/quien-soy/online"
              titulo="¿Quién Soy?"
              tagline="Adiviná qué personaje sos."
              descripcion="Cada uno recibe una palabra secreta. Hagan preguntas, deduzcan y traten de adivinar la del otro antes que el tiempo se acabe."
              meta="15 categorías · 2-6 jugadores · Local + Online"
              icono={<HelpCircle className="h-8 w-8" />}
              variante="cian"
              delay={0.2}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-10 sm:mt-12"
          >
            <div className="flex items-center gap-3 mb-4 px-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
                Próximamente
              </span>
              <div className="flex-1 h-px bg-[var(--color-borde)] opacity-20" />
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
              <ProximoCard etiqueta="Más juegos en camino" />
              <ProximoCard etiqueta="¿Sugerís uno?" />
              <ProximoCard etiqueta="Próximamente" />
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="relative z-10 px-6 py-6 text-center text-sm text-[var(--color-tinta-suave)]">
        Hecho para jugar con amigos · <span className="font-mono">{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

function JuegoCard({
  href,
  hrefSecundario,
  titulo,
  tagline,
  descripcion,
  meta,
  icono,
  variante,
  delay,
}: {
  href: string;
  hrefSecundario: string;
  titulo: string;
  tagline: string;
  descripcion: string;
  meta: string;
  icono: React.ReactNode;
  variante: "primario" | "cian";
  delay: number;
}) {
  const fondo =
    variante === "primario"
      ? "gradient-primario text-white"
      : "bg-[var(--color-cian)] text-white";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] p-6 sm:p-8 h-full overflow-hidden ${fondo}`}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 mb-5 relative z-10">
        {icono}
      </div>
      <h2 className="font-display font-black text-3xl sm:text-4xl leading-[1.05] tracking-tight mb-2 relative z-10">
        {titulo}
      </h2>
      <div className="text-base sm:text-lg font-semibold text-white/90 mb-3 relative z-10">
        {tagline}
      </div>
      <p className="text-white/80 text-sm sm:text-base leading-snug relative z-10">
        {descripcion}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider bg-white/15 backdrop-blur border-2 border-white/30 rounded-full px-3 py-1 relative z-10">
        {meta}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 relative z-10">
        <Link
          href={href}
          className="h-12 rounded-2xl bg-white text-[#0a0a0f] border-2 border-white flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/90 active:translate-x-1 active:translate-y-1 transition"
        >
          Jugar local
          <span className="inline-block">→</span>
        </Link>
        <Link
          href={hrefSecundario}
          className="h-12 rounded-2xl bg-white/15 backdrop-blur border-2 border-white/40 text-white flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/25 active:translate-x-1 active:translate-y-1 transition"
        >
          Jugar online →
        </Link>
      </div>
    </motion.div>
  );
}

function ProximoCard({ etiqueta }: { etiqueta: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--color-borde)] bg-[var(--color-fondo-elev)]/50 p-5 min-h-32 flex flex-col items-center justify-center text-center gap-2 opacity-60">
      <Lock className="h-5 w-5 text-[var(--color-tinta-suave)]" />
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-tinta-suave)]">
        {etiqueta}
      </span>
    </div>
  );
}
