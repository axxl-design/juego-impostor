"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Vote, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useJuegoLocal } from "@/lib/store-local-impostor";
import { cn } from "@/lib/utils";

export function VotacionLocal() {
  const jugadores = useJuegoLocal((s) => s.jugadores);
  const votos = useJuegoLocal((s) => s.votos);
  const ronda = useJuegoLocal((s) => s.ronda);
  const registrarVoto = useJuegoLocal((s) => s.registrarVoto);
  const cerrarVotacion = useJuegoLocal((s) => s.cerrarVotacion);
  const usarPoderVidente = useJuegoLocal((s) => s.usarPoderVidente);
  const [votanteIdx, setVotanteIdx] = useState(0);
  const [vision, setVision] = useState<{ observadoNombre: string; votadoNombre: string } | null>(null);
  const votante = jugadores[votanteIdx];
  const yaVoto = votante ? votos[votante.id] : null;
  const todosVotaron = jugadores.every((j) => votos[j.id]);
  const videnteDeVotante = votante
    ? ronda?.poderes?.find((p) => p.jugadorId === votante.id && p.tipo === "vidente" && !p.usado)
    : null;

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-24 pt-2">
      <div className="mx-auto max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            ¿Quién es el impostor?
          </h2>
          <p className="mt-2 text-[var(--color-tinta-suave)]">
            Pasen el dispositivo. Cada uno vota una vez.
          </p>
        </div>

        {!todosVotaron && votante && (
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar nombre={votante.nombre} tamano={48} />
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
                  Vota
                </div>
                <div className="font-display font-bold text-xl">{votante.nombre}</div>
              </div>
            </div>
            {videnteDeVotante && !vision && (
              <button
                onClick={() => {
                  const r = usarPoderVidente(votante.id);
                  if (r) setVision(r);
                }}
                className="w-full mb-3 inline-flex items-center justify-center gap-2 h-10 rounded-xl border-2 border-indigo-500/60 bg-indigo-500/10 text-indigo-500 text-xs font-semibold hover:bg-indigo-500/20 transition"
              >
                <Eye className="h-3.5 w-3.5" />
                Usar poder Vidente
              </button>
            )}
            {vision && (
              <div className="mb-3 p-3 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/40 text-sm text-center">
                👁️ <strong>{vision.observadoNombre}</strong> va a votar a <strong>{vision.votadoNombre}</strong>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {jugadores
                .filter((j) => j.id !== votante.id)
                .map((j) => {
                  const elegido = yaVoto === j.id;
                  return (
                    <motion.button
                      key={j.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => registrarVoto(votante.id, j.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-[var(--color-borde)] transition",
                        elegido
                          ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                          : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none",
                      )}
                    >
                      <Avatar nombre={j.nombre} tamano={48} />
                      <span className="font-semibold text-sm truncate w-full">{j.nombre}</span>
                    </motion.button>
                  );
                })}
            </div>
            <Button
              className="w-full mt-4"
              tamano="lg"
              variante="secundario"
              onClick={() => { setVotanteIdx((i) => Math.min(i + 1, jugadores.length - 1)); setVision(null); }}
              disabled={!yaVoto}
            >
              {votanteIdx === jugadores.length - 1 ? "Listo" : "Pasar al siguiente"}
              <Check className="h-5 w-5" />
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {jugadores.map((j, i) => {
            const voto = votos[j.id];
            return (
              <button
                key={j.id}
                onClick={() => setVotanteIdx(i)}
                className={cn(
                  "p-2 rounded-xl border-2 border-[var(--color-borde)] flex items-center gap-2 text-left transition",
                  voto ? "bg-[var(--color-exito)]/15" : "bg-[var(--color-fondo-elev)]",
                  i === votanteIdx && "ring-2 ring-[var(--color-primario-500)] ring-offset-2 ring-offset-[var(--color-fondo)]",
                )}
              >
                <Avatar nombre={j.nombre} tamano={28} />
                <span className="text-xs font-semibold flex-1 truncate">{j.nombre}</span>
                {voto && <Check className="h-3 w-3 text-[var(--color-exito)]" />}
              </button>
            );
          })}
        </div>

        {todosVotaron && (
          <Button tamano="xl" className="w-full" onClick={cerrarVotacion}>
            <Vote className="h-6 w-6" />
            Revelar resultado
          </Button>
        )}
      </div>
    </div>
  );
}
