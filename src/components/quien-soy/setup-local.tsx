"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Users, Tag, Gauge, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { CATEGORIAS } from "@/lib/palabras";
import { useJuegoQuienSoyLocal } from "@/lib/store-local-quien-soy";
import type { Dificultad, ModoVictoria } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIFICULTADES: { id: Dificultad; nombre: string; tono: string }[] = [
  { id: "facil", nombre: "Fácil", tono: "from-emerald-400 to-emerald-600" },
  { id: "medio", nombre: "Medio", tono: "from-amber-400 to-orange-500" },
  { id: "dificil", nombre: "Difícil", tono: "from-pink-500 to-fuchsia-600" },
];

const MODOS: { id: ModoVictoria; nombre: string; sub: string; min: number; max: number; def: number }[] = [
  { id: "puntos", nombre: "Primero a X puntos", sub: "Gana el primero que llegue al objetivo", min: 3, max: 20, def: 5 },
  { id: "rondas", nombre: "X rondas", sub: "Al terminar las rondas, gana el de más puntos", min: 3, max: 15, def: 5 },
];

export function SetupLocalQuienSoy() {
  const {
    jugadores,
    config,
    agregarJugador,
    quitarJugador,
    setConfig,
    iniciarPartida,
  } = useJuegoQuienSoyLocal();
  const [nombre, setNombre] = useState("");

  const puedeEmpezar = jugadores.length >= 2 && jugadores.length <= 6;
  const modoActivo = MODOS.find((m) => m.id === config.modoVictoria) ?? MODOS[0];

  const onAgregar = () => {
    if (!nombre.trim()) return;
    agregarJugador(nombre);
    setNombre("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-28 space-y-8">
      <Section icono={<Users className="h-5 w-5" />} titulo="Jugadores" sub={`${jugadores.length}/6 — mínimo 2`}>
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
            <Button type="submit" tamano="md" disabled={!nombre.trim() || jugadores.length >= 6} className="shrink-0 px-4">
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
                Agregá entre 2 y 6 jugadores
              </li>
            )}
          </ul>
        </Card>
      </Section>

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

      <Section icono={<Trophy className="h-5 w-5" />} titulo="Modo de victoria">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {MODOS.map((m) => {
            const activa = config.modoVictoria === m.id;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfig({ modoVictoria: m.id, objetivo: m.def })}
                className={cn(
                  "rounded-2xl p-4 text-left border-2 border-[var(--color-borde)] transition",
                  activa
                    ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none",
                )}
              >
                <div className="font-bold leading-tight">{m.nombre}</div>
                <div className={cn("text-xs mt-1 leading-snug", activa ? "text-white/80" : "text-[var(--color-tinta-suave)]")}>{m.sub}</div>
              </motion.button>
            );
          })}
        </div>
        <Card className="p-4">
          <label className="block">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-tinta-suave)]">
                <Target className="h-4 w-4" />
                {config.modoVictoria === "puntos" ? "Puntos para ganar" : "Cantidad de rondas"}
              </span>
              <span className="font-mono font-bold text-2xl text-gradient-primario tabular-nums">
                {config.objetivo}
              </span>
            </div>
            <input
              type="range"
              min={modoActivo.min}
              max={modoActivo.max}
              step={1}
              value={config.objetivo}
              onChange={(e) => setConfig({ objetivo: Number(e.target.value) })}
              className="w-full accent-[var(--color-primario-500)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-tinta-suave)] font-mono mt-1">
              <span>{modoActivo.min}</span>
              <span>{modoActivo.max}</span>
            </div>
          </label>
        </Card>
      </Section>

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
