"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import { Header } from "@/components/header";

export default function VidasHub() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/" />
      <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center pt-6 sm:pt-12"
          >
            <div className="text-6xl mb-3">🌍</div>
            <h1 className="font-display font-black text-5xl sm:text-7xl leading-[0.92] tracking-tighter">
              Vidas
            </h1>
            <p className="mt-4 text-lg text-[var(--color-tinta-suave)] max-w-xl mx-auto text-balance">
              Elegí un mundo, un rol y viví tu historia. Cada decisión cuenta hasta el último día.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link
              href="/vidas/local"
              className="group p-6 rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] bg-[var(--color-fondo-elev)] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-[var(--shadow-brutal)] transition"
            >
              <div className="h-14 w-14 rounded-2xl grid place-items-center bg-[var(--color-primario-500)] text-white border-2 border-[var(--color-borde)] mb-4">
                <User className="h-6 w-6" />
              </div>
              <div className="font-display font-bold text-2xl">Solo</div>
              <p className="mt-2 text-sm text-[var(--color-tinta-suave)]">
                Una vida en este dispositivo. Se guarda automáticamente: podés cerrar y retomar cuando quieras.
              </p>
            </Link>

            <Link
              href="/vidas/online"
              className="group p-6 rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] gradient-primario text-white hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-[var(--shadow-brutal)] transition"
            >
              <div className="h-14 w-14 rounded-2xl grid place-items-center bg-white/20 backdrop-blur border-2 border-white/40 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <div className="font-display font-bold text-2xl">Con alguien</div>
              <p className="mt-2 text-sm text-white/80">
                Dos jugadores, el mismo mundo, turnos alternados. Amigos o pareja — el tono se adapta.
              </p>
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-2xl border-2 border-dashed border-[var(--color-borde)]/50 bg-[var(--color-fondo-elev)]/60 text-sm text-[var(--color-tinta-suave)]">
            <span className="font-bold text-[var(--color-tinta)]">Próximamente: </span>
            Japón feudal · Antigua Grecia · Futuro distópico · Colonia espacial · Post-apocalíptico.
          </div>
        </div>
      </main>
    </div>
  );
}
