"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Smartphone, Globe, Sparkles, VenetianMask } from "lucide-react";
import { Header } from "@/components/header";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center pt-8 sm:pt-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] mb-8">
              <Sparkles className="h-4 w-4 text-[var(--color-primario-500)]" />
              <span className="text-sm font-semibold tracking-tight">3 a 10 jugadores · Para reunirse</span>
            </div>
            <h1 className="font-display font-bold text-balance leading-[0.95] tracking-tighter text-6xl sm:text-7xl md:text-8xl">
              Encontrá al
              <br />
              <span className="text-gradient-primario">impostor.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[var(--color-tinta-suave)] max-w-xl mx-auto text-balance">
              Una palabra secreta. Un infiltrado entre ustedes. Hagan
              preguntas, mientan bien y atrápenlo antes de que se acabe el
              tiempo.
            </p>
          </motion.div>

          <div className="mt-12 sm:mt-20 grid gap-6 sm:gap-8 md:grid-cols-2">
            <ModoCard
              href="/local"
              titulo="Un dispositivo"
              descripcion="Pasen el celular de mano en mano. Cada uno ve su rol en privado."
              icono={<Smartphone className="h-8 w-8" />}
              variante="primario"
              delay={0.1}
              destacado
            />
            <ModoCard
              href="/online"
              titulo="Online"
              descripcion="Cada uno desde su celular. Compartí el link y juegan juntos."
              icono={<Globe className="h-8 w-8" />}
              variante="cian"
              delay={0.2}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto"
          >
            <Stat numero="15" texto="categorías" />
            <Stat numero="1800+" texto="palabras" />
            <Stat numero="3" texto="dificultades" />
          </motion.div>
        </div>
      </main>
      <footer className="relative z-10 px-6 py-6 text-center text-sm text-[var(--color-tinta-suave)]">
        Hecho para jugar con amigos · <span className="font-mono">{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

function ModoCard({
  href,
  titulo,
  descripcion,
  icono,
  variante,
  delay,
  destacado,
}: {
  href: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  variante: "primario" | "cian";
  delay: number;
  destacado?: boolean;
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
    >
      <Link href={href} className="block group">
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ x: 6, y: 6, boxShadow: "0 0 0 0 var(--color-borde)" }}
          transition={{ duration: 0.15 }}
          className={`relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] p-7 sm:p-9 h-full overflow-hidden ${fondo}`}
        >
          {destacado && (
            <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/20 backdrop-blur">
              Más rápido
            </span>
          )}
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 mb-6">
            {icono}
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight tracking-tight mb-3">
            {titulo}
          </h2>
          <p className="text-white/90 text-base sm:text-lg leading-snug">
            {descripcion}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 font-semibold">
            Empezar
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </div>
          <VenetianMask
            className="absolute -right-6 -bottom-6 h-40 w-40 opacity-15 rotate-12 pointer-events-none"
            strokeWidth={1.5}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

function Stat({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="text-center">
      <div className="font-mono font-bold text-3xl sm:text-4xl text-gradient-primario">
        {numero}
      </div>
      <div className="text-xs sm:text-sm text-[var(--color-tinta-suave)] uppercase tracking-wider mt-1">
        {texto}
      </div>
    </div>
  );
}
