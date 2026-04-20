"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Skull, RotateCcw, Home } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoLocal } from "@/lib/store-local";

export function ResultadoLocal() {
  const { resultado, ronda, reiniciarRonda, volverAConfig } = useJuegoLocal();

  useEffect(() => {
    if (resultado && !resultado.ganaImpostor) {
      const fin = Date.now() + 1500;
      const lanzar = () => {
        confetti({
          particleCount: 4,
          startVelocity: 35,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() * 0.4 },
          colors: ["#a855f7", "#ec4899", "#06b6d4", "#10b981"],
        });
        if (Date.now() < fin) requestAnimationFrame(lanzar);
      };
      lanzar();
    }
  }, [resultado]);

  if (!resultado || !ronda) return null;

  const civilesGanan = !resultado.ganaImpostor;

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12 pt-4">
      <div className="w-full max-w-md space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        >
          <Card
            className={`p-8 text-center text-white overflow-hidden relative ${
              civilesGanan ? "gradient-primario" : "bg-[#0a0a0f]"
            }`}
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
              {civilesGanan ? "Ganan los civiles" : "Gana el impostor"}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mt-2 tracking-tight">
              {civilesGanan ? "¡Atrapado!" : "Se salió con la suya"}
            </h1>
            <p className="mt-3 text-white/85">
              {civilesGanan
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
