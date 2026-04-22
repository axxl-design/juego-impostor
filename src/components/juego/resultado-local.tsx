"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Skull, RotateCcw, Home, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { lanzarConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

export function ResultadoLocal() {
  const { resultado, ronda, jugadores, config, reiniciarRonda, volverAConfig, resetearPuntajes } = useJuegoLocal();

  useEffect(() => {
    if (resultado && !resultado.ganaImpostor) {
      lanzarConfetti({
        duracionMs: 1500,
        porTick: 4,
        startVelocity: 35,
        spread: 80,
        colors: ["#a855f7", "#ec4899", "#06b6d4", "#10b981"],
      });
    }
  }, [resultado]);

  if (!resultado || !ronda) return null;

  const civilesGanan = !resultado.ganaImpostor;
  const porAdivinanza = resultado.porAdivinanza === true;
  const puntajeActivo = config.reglasExtra.puntajePersistente;

  const titulo = porAdivinanza
    ? civilesGanan
      ? "El impostor falló"
      : "¡El impostor adivinó!"
    : civilesGanan
      ? "¡Atrapado!"
      : "Se salió con la suya";

  const subtitulo = porAdivinanza
    ? civilesGanan
      ? "Se arriesgó y falló"
      : "Adivinó la palabra secreta"
    : civilesGanan
      ? "Ganan los civiles"
      : "Gana el impostor";

  const ranking = puntajeActivo ? [...jugadores].sort((a, b) => b.puntos - a.puntos) : [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12 pt-4">
      <div className="w-full max-w-md space-y-6">
        {resultado.esJefeFinal && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[var(--shadow-brutal)] border-2 border-[var(--color-borde)]">
              <Crown className="h-4 w-4" />
              Jefe Final · 2x puntos
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, x: porAdivinanza && !civilesGanan ? -8 : 0 }}
          animate={porAdivinanza && !civilesGanan
            ? { scale: 1, opacity: 1, x: [0, -6, 6, -4, 4, 0] }
            : { scale: 1, opacity: 1 }}
          transition={porAdivinanza && !civilesGanan
            ? { duration: 0.6, ease: "easeOut" }
            : { type: "spring", stiffness: 240, damping: 20 }}
        >
          <Card
            className="p-8 text-center text-white overflow-hidden relative"
            style={{
              background: civilesGanan
                ? "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
                : "linear-gradient(135deg, #0a0a0f 0%, #4c0519 100%)",
            }}
          >
            <div className="flex justify-center mb-4">
              <span className="grid place-items-center h-20 w-20 rounded-3xl bg-white/20 backdrop-blur border-2 border-white/30">
                {civilesGanan ? (
                  <Trophy className="h-10 w-10" />
                ) : (
                  <Skull className="h-10 w-10 text-red-400" />
                )}
              </span>
            </div>
            <div className="text-xs uppercase tracking-widest opacity-80">
              {subtitulo}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mt-2 tracking-tight">
              {titulo}
            </h1>
            <p className="mt-3 text-white/85">
              {porAdivinanza
                ? civilesGanan
                  ? "El impostor apostó todo y no acertó la palabra."
                  : "El impostor adivinó la palabra secreta y se llevó la ronda."
                : civilesGanan
                  ? "Lograron descubrir al infiltrado a tiempo."
                  : "El impostor logró pasar desapercibido."}
            </p>
          </Card>
        </motion.div>

        <Card className="p-5">
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] text-center mb-3">
            {resultado.impostoresExtra && resultado.impostoresExtra.length > 0 ? "Los impostores eran" : "El impostor era"}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Avatar nombre={resultado.impostorNombre} tamano={56} />
              <div className="font-display font-bold text-2xl">{resultado.impostorNombre}</div>
            </div>
            {resultado.impostoresExtra?.map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <Avatar nombre={i.nombre} tamano={48} />
                <div className="font-display font-bold text-xl">{i.nombre}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t-2 border-[var(--color-borde)] border-dashed text-center">
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
              La palabra era
            </div>
            <div className="mt-1 font-display font-bold text-3xl text-gradient-primario">
              {ronda.palabra}
            </div>
            <div className="text-sm text-[var(--color-tinta-suave)] mt-1">
              ({ronda.categoriaNombre})
            </div>
            {porAdivinanza && resultado.palabraIntento && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
                  El impostor dijo
                </div>
                <div className="mt-1 font-display font-bold text-xl">
                  &ldquo;{resultado.palabraIntento}&rdquo;
                </div>
              </div>
            )}
          </div>
        </Card>

        {puntajeActivo && ranking.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-display font-bold text-lg">Leaderboard</h3>
              <button onClick={resetearPuntajes} className="text-xs text-[var(--color-tinta-suave)] hover:text-[var(--color-peligro)] transition">
                Resetear
              </button>
            </div>
            <ul className="space-y-2">
              {ranking.map((j, i) => {
                const cambio = resultado.cambiosPuntaje?.find((c) => c.id === j.id);
                return (
                  <motion.li
                    layout
                    key={j.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-2xl border-2 border-[var(--color-borde)]",
                      i === 0
                        ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                        : "bg-[var(--color-fondo)] dark:bg-[var(--color-fondo-elev)]",
                    )}
                  >
                    <span className={cn("font-mono font-bold text-sm w-6 text-center", i === 0 ? "text-white" : "text-[var(--color-tinta-suave)]")}>#{i + 1}</span>
                    <Avatar nombre={j.nombre} tamano={36} />
                    <span className="font-semibold flex-1 truncate">{j.nombre}</span>
                    {cambio && cambio.delta !== 0 && (
                      <motion.span
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          cambio.delta > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500",
                        )}
                      >
                        {cambio.delta > 0 ? "+" : ""}{cambio.delta}
                      </motion.span>
                    )}
                    <span className="font-mono font-black text-xl tabular-nums">{j.puntos}</span>
                  </motion.li>
                );
              })}
            </ul>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button tamano="lg" onClick={reiniciarRonda}>
            <RotateCcw className="h-5 w-5" />
            Otra ronda
          </Button>
          <Button tamano="lg" variante="secundario" onClick={volverAConfig}>
            Cambiar config
          </Button>
        </div>
        <Link href="/" className="block text-center text-sm text-[var(--color-tinta-suave)] underline-offset-4 hover:underline">
          <span className="inline-flex items-center gap-1"><Home className="h-3 w-3" />Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}
