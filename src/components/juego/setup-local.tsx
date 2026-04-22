"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Users, Tag, Gauge, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { CATEGORIAS_META as CATEGORIAS } from "@/lib/categorias-meta";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import type { Dificultad } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReglasExtraImpostorSeccion } from "@/components/juego/reglas-extra";

const DIFICULTADES: { id: Dificultad; nombre: string; tono: string }[] = [
  { id: "facil", nombre: "Fácil", tono: "from-emerald-400 to-emerald-600" },
  { id: "medio", nombre: "Medio", tono: "from-amber-400 to-orange-500" },
  { id: "dificil", nombre: "Difícil", tono: "from-pink-500 to-fuchsia-600" },
];

const TIEMPOS = [
  { seg: 60, label: "1m" },
  { seg: 180, label: "3m" },
  { seg: 300, label: "5m" },
  { seg: 480, label: "8m" },
  { seg: 600, label: "10m" },
];

export function SetupLocal() {
  const jugadores = useJuegoLocal((s) => s.jugadores);
  const config = useJuegoLocal((s) => s.config);
  const agregarJugador = useJuegoLocal((s) => s.agregarJugador);
  const quitarJugador = useJuegoLocal((s) => s.quitarJugador);
  const setConfig = useJuegoLocal((s) => s.setConfig);
  const setReglasExtra = useJuegoLocal((s) => s.setReglasExtra);
  const iniciarPartida = useJuegoLocal((s) => s.iniciarPartida);
  const [nombre, setNombre] = useState("");

  const puedeEmpezar = jugadores.length >= 3;

  const onAgregar = () => {
    if (!nombre.trim()) return;
    agregarJugador(nombre);
    setNombre("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-24 space-y-8">
      {/* Jugadores */}
      <Section icono={<Users className="h-5 w-5" />} titulo="Jugadores" sub={`${jugadores.length}/10 — mínimo 3`}>
        <Card className="p-4 sm:p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAgregar();
            }}
            className="flex gap-2"
          >
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del jugador"
              maxLength={20}
              autoFocus
            />
            <Button type="submit" tamano="md" disabled={!nombre.trim() || jugadores.length >= 10} className="shrink-0 px-4">
              <Plus className="h-5 w-5" />
            </Button>
          </form>
          <ul className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {jugadores.map((j) => (
                <motion.li
                  key={j.id}
                  initial={{ opacity: 0, x: -16, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-2 pr-3 rounded-2xl bg-[var(--color-fondo)] border-2 border-[var(--color-borde)]"
                >
                  <Avatar nombre={j.nombre} tamano={36} />
                  <span className="flex-1 font-medium truncate">{j.nombre}</span>
                  {config.reglasExtra.puntajePersistente && (
                    <span className="font-mono font-bold text-sm tabular-nums text-[var(--color-primario-500)] mr-1">
                      {j.puntos}pt
                    </span>
                  )}
                  <button
                    onClick={() => quitarJugador(j.id)}
                    className="h-9 w-9 rounded-xl border-2 border-[var(--color-borde)] flex items-center justify-center hover:bg-[var(--color-peligro)] hover:text-white transition"
                    aria-label={`Quitar ${j.nombre}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {jugadores.length === 0 && (
              <li className="text-center text-sm text-[var(--color-tinta-suave)] py-6">
                Agregá al menos 3 jugadores
              </li>
            )}
          </ul>
        </Card>
      </Section>

      {/* Categoría */}
      <Section icono={<Tag className="h-5 w-5" />} titulo="Categoría">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIAS.map((c) => {
            const activa = config.categoriaId === c.id;
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfig({ categoriaId: c.id })}
                className={cn(
                  "rounded-2xl p-3 text-left border-2 border-[var(--color-borde)] transition",
                  activa
                    ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none",
                )}
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-1 font-semibold text-sm leading-tight">{c.nombre}</div>
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* Dificultad */}
      <Section icono={<Gauge className="h-5 w-5" />} titulo="Dificultad">
        <div className="grid grid-cols-3 gap-3">
          {DIFICULTADES.map((d) => {
            const activa = config.dificultad === d.id;
            return (
              <motion.button
                key={d.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfig({ dificultad: d.id })}
                className={cn(
                  "rounded-2xl py-4 px-3 font-bold border-2 border-[var(--color-borde)] transition",
                  activa
                    ? `bg-gradient-to-br ${d.tono} text-white shadow-[var(--shadow-brutal)]`
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none",
                )}
              >
                {d.nombre}
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* Tiempo */}
      <Section icono={<Clock className="h-5 w-5" />} titulo="Tiempo de discusión">
        <div className="grid grid-cols-5 gap-2">
          {TIEMPOS.map((t) => {
            const activa = config.duracionSeg === t.seg;
            return (
              <motion.button
                key={t.seg}
                whileTap={{ scale: 0.94 }}
                onClick={() => setConfig({ duracionSeg: t.seg })}
                className={cn(
                  "rounded-2xl py-3 font-mono font-bold border-2 border-[var(--color-borde)] transition",
                  activa
                    ? "bg-[var(--color-cian)] text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none",
                )}
              >
                {t.label}
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* Reglas extra */}
      <Section icono={<Sparkles className="h-5 w-5" />} titulo="Reglas extra" sub="Opcionales">
        <ReglasExtraImpostorSeccion reglas={config.reglasExtra} onChange={setReglasExtra} />
      </Section>

      {/* CTA fija */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-3 sm:pb-6 bg-gradient-to-t from-[var(--color-fondo)] via-[var(--color-fondo)] to-transparent">
        <div className="mx-auto max-w-2xl">
          <Button
            tamano="xl"
            onClick={iniciarPartida}
            disabled={!puedeEmpezar}
            className="w-full"
          >
            <Play className="h-6 w-6" />
            Empezar partida
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  icono,
  titulo,
  sub,
  children,
}: {
  icono: React.ReactNode;
  titulo: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-[var(--color-primario-500)]">{icono}</span>
        <h2 className="font-display font-bold text-xl tracking-tight">{titulo}</h2>
        {sub && <span className="text-sm text-[var(--color-tinta-suave)] ml-auto">{sub}</span>}
      </div>
      {children}
    </section>
  );
}
