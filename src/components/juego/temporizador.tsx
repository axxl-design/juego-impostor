"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Pause, Sparkles, VenetianMask, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { formatearTiempo } from "@/lib/utils";

export function TemporizadorPantalla() {
  const { finEn, irAVotacion, config, jugadores, intentarAdivinanzaImpostor } = useJuegoLocal();
  const [restante, setRestante] = useState(config.duracionSeg);
  const [fase, setFase] = useState<"oculto" | "eligiendo" | "escribiendo">("oculto");
  const [elegidoId, setElegidoId] = useState<string | null>(null);
  const [intento, setIntento] = useState("");

  useEffect(() => {
    if (!finEn) return;
    const tick = () => {
      const ms = finEn - Date.now();
      setRestante(Math.max(0, Math.ceil(ms / 1000)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [finEn]);

  useEffect(() => {
    if (restante === 0 && finEn) {
      const t = setTimeout(() => irAVotacion(), 800);
      return () => clearTimeout(t);
    }
  }, [restante, finEn, irAVotacion]);

  const peligro = restante <= 10;
  const progreso = config.duracionSeg > 0 ? restante / config.duracionSeg : 0;

  const cerrar = () => {
    setFase("oculto");
    setElegidoId(null);
    setIntento("");
  };

  const enviarIntento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elegidoId || !intento.trim()) return;
    const r = intentarAdivinanzaImpostor(elegidoId, intento);
    if (r === "no-eras-el-impostor") {
      cerrar();
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12">
      <div className="w-full max-w-md text-center space-y-10">
        <div>
          <div className="text-sm uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Discusión en curso
          </div>
          <p className="mt-2 text-balance text-[var(--color-tinta)]">
            Háganse preguntas para descubrir al impostor.
          </p>
        </div>

        <div className="relative aspect-square mx-auto w-64 sm:w-80">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--color-borde)"
              strokeWidth="2"
              opacity="0.15"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={peligro ? "#ef4444" : "url(#grad)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progreso) }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            key={restante}
            initial={{ scale: peligro ? 1.18 : 1.05, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className={`absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums tracking-tight ${
              peligro ? "text-[var(--color-peligro)]" : "text-gradient-primario"
            }`}
            style={{ fontSize: "clamp(3.5rem, 18vw, 6rem)" }}
          >
            {formatearTiempo(restante)}
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          <Button tamano="lg" onClick={irAVotacion} variante="primario">
            <Vote className="h-5 w-5" />
            Pasar a votación
          </Button>
          <button
            onClick={() => setFase("eligiendo")}
            className="inline-flex items-center justify-center gap-2 h-10 text-xs font-semibold text-[var(--color-tinta-suave)] hover:text-[var(--color-tinta)] transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            El impostor quiere intentar adivinar
          </button>
          <p className="text-xs text-[var(--color-tinta-suave)] flex items-center justify-center gap-1">
            <Pause className="h-3 w-3" /> Pueden pausar la discusión cuando estén listos
          </p>
        </div>
      </div>

      <AnimatePresence>
        {fase !== "oculto" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0a0a0f] flex items-start justify-center overflow-y-auto"
          >
            <div className="w-full max-w-md p-5 pt-10 pb-20">
              <button
                onClick={cerrar}
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancelar
              </button>

              {fase === "eligiendo" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border-2 border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
                      <VenetianMask className="h-3.5 w-3.5" />
                      Pantalla protegida
                    </div>
                    <h2 className="font-display font-black text-3xl text-white">Tocá tu nombre</h2>
                    <p className="mt-2 text-sm text-white/70 max-w-xs mx-auto">
                      Si sos el impostor, confirmá. Los civiles que toquen acá no pasa nada.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {jugadores.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => {
                          setElegidoId(j.id);
                          setFase("escribiendo");
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 transition"
                      >
                        <Avatar nombre={j.nombre} tamano={56} />
                        <span className="font-semibold text-sm text-white truncate max-w-full">{j.nombre}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {fase === "escribiendo" && elegidoId && (
                <motion.form
                  onSubmit={enviarIntento}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <span className="grid place-items-center h-14 w-14 rounded-2xl bg-red-500/20 border-2 border-red-500/40">
                        <VenetianMask className="h-7 w-7 text-red-400" />
                      </span>
                    </div>
                    <h2 className="font-display font-black text-2xl text-white">¿Cuál es la palabra secreta?</h2>
                    <p className="mt-2 text-sm text-white/70">
                      Si acertás ganás. Si fallás, ganan los civiles. Un solo intento.
                    </p>
                  </div>
                  <Card className="p-5 bg-white/5 border-white/20">
                    <Input
                      value={intento}
                      onChange={(e) => setIntento(e.target.value)}
                      placeholder="Escribí la palabra..."
                      maxLength={60}
                      autoFocus
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Button variante="secundario" tamano="md" type="button" onClick={cerrar}>
                        Cancelar
                      </Button>
                      <Button variante="peligro" tamano="md" type="submit" disabled={!intento.trim()}>
                        <Send className="h-4 w-4" />
                        Arriesgarse
                      </Button>
                    </div>
                  </Card>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
