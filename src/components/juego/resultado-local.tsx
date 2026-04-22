"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Skull, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { lanzarConfetti } from "@/lib/confetti";

export function ResultadoLocal() {
  const { resultado, ronda, reiniciarRonda, volverAConfig } = useJuegoLocal();

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

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12 pt-4">
      <div className="w-full max-w-md space-y-6">
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
            El impostor era
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Avatar nombre={resultado.impostorNombre} tamano={56} />
            <div className="font-display font-bold text-2xl">{resultado.impostorNombre}</div>
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
