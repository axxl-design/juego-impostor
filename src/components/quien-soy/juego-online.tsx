"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, X, Target, Trophy, Eye, RotateCcw, Home, HelpCircle, Flag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { lanzarConfetti } from "@/lib/confetti";
import type { PalabraPrivada, SalaQuienSoyPublica } from "@/lib/use-sala-quien-soy";

type Props = {
  sala: SalaQuienSoyPublica;
  palabra: PalabraPrivada;
  jugadorId: string;
  accion: (c: Record<string, unknown>) => Promise<unknown>;
};

export function JuegoOnlineQuienSoy(props: Props) {
  if (props.sala.fase === "reparto") return <Reparto {...props} />;
  if (props.sala.fase === "juego") return <Juego {...props} />;
  if (props.sala.fase === "fin") return <Fin {...props} />;
  return null;
}

function Reparto({ sala, palabra, jugadorId, accion }: Props) {
  const [revelado, setRevelado] = useState(false);
  const yo = sala.jugadores.find((j) => j.id === jugadorId);
  const esHost = sala.hostId === jugadorId;
  const yoVi = yo?.haVisto ?? false;
  const todosVieron = sala.jugadores.every((j) => j.haVisto);

  const reveal = async () => {
    setRevelado(true);
    if (!yoVi) await accion({ tipo: "marcarVisto", jugadorId });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Ronda {sala.rondaActual} · Mirá tu palabra
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!revelado ? (
            <motion.div
              key="sobre"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformPerspective: 1000 }}
              className="relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] overflow-hidden gradient-primario text-white p-8 sm:p-10"
            >
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <HelpCircle className="absolute -right-10 -top-10 h-56 w-56 rotate-12" strokeWidth={1.2} />
              </div>
              <div className="relative flex flex-col items-center text-center gap-5">
                <Avatar nombre={yo?.nombre ?? "?"} tamano={88} />
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-80">Tu palabra</div>
                  <div className="font-display font-bold text-3xl sm:text-4xl mt-1 break-words">
                    {yo?.nombre}
                  </div>
                </div>
                <p className="text-white/85 max-w-xs">
                  Solo vos vas a ver tu palabra. Que nadie te mire.
                </p>
                <Button variante="secundario" tamano="lg" onClick={reveal} className="mt-2">
                  <Eye className="h-5 w-5" />
                  Ver mi palabra
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="palabra"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="relative rounded-3xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] overflow-hidden bg-[var(--color-fondo-elev)] p-8 sm:p-10"
            >
              <div className="flex flex-col items-center text-center gap-5">
                <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
                  Categoría
                </div>
                <div className="font-display font-bold text-xl text-[var(--color-tinta-suave)]">
                  {palabra?.categoriaNombre ?? "..."}
                </div>
                <div className="w-full h-px bg-[var(--color-borde)] opacity-20" />
                <div className="text-xs uppercase tracking-widest text-[var(--color-primario-500)]">
                  Sos
                </div>
                <div
                  className="font-display font-black text-4xl sm:text-5xl text-balance leading-tight text-gradient-primario"
                  style={{ filter: "drop-shadow(0 4px 24px rgba(168,85,247,0.25))" }}
                >
                  {palabra?.palabra ?? "..."}
                </div>
                <p className="text-sm text-[var(--color-tinta-suave)] max-w-xs">
                  Memorizala. Los demás te van a hacer preguntas para descubrir qué sos.
                </p>
                <div className="text-xs text-[var(--color-tinta-suave)] font-mono mt-1">
                  Listos: {sala.jugadores.filter((j) => j.haVisto).length}/{sala.jugadores.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {esHost && todosVieron && (
          <Button tamano="lg" className="w-full mt-6" onClick={() => accion({ tipo: "continuar", jugadorId })}>
            Empezar la ronda
          </Button>
        )}
      </div>
    </div>
  );
}

function Juego({ sala, palabra, jugadorId, accion }: Props) {
  const [aId, setAId] = useState<string>(sala.jugadores.find((j) => j.id !== jugadorId)?.id ?? "");
  const [intento, setIntento] = useState("");
  const [feedback, setFeedback] = useState<"acierto" | "fallo" | null>(null);
  const [verPalabra, setVerPalabra] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [confirmandoFin, setConfirmandoFin] = useState(false);
  const ultimaTs = useRef<number>(0);
  const esHost = sala.hostId === jugadorId;

  useEffect(() => {
    if (!sala.ultimaAdivinanza) return;
    if (sala.ultimaAdivinanza.ts <= ultimaTs.current) return;
    ultimaTs.current = sala.ultimaAdivinanza.ts;
    if (sala.ultimaAdivinanza.acerto) {
      setFeedback("acierto");
      lanzarConfetti({
        duracionMs: 900,
        porTick: 3,
        startVelocity: 30,
        spread: 70,
        colors: ["#a855f7", "#ec4899", "#06b6d4", "#10b981"],
      });
    } else {
      setFeedback("fallo");
    }
    const t = setTimeout(() => setFeedback(null), 2400);
    return () => clearTimeout(t);
  }, [sala.ultimaAdivinanza]);

  useEffect(() => {
    if (!sala.jugadores.find((j) => j.id === aId) || aId === jugadorId) {
      const otro = sala.jugadores.find((j) => j.id !== jugadorId);
      setAId(otro?.id ?? "");
    }
  }, [sala.jugadores, aId, jugadorId]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aId || !intento.trim() || enviando) return;
    setEnviando(true);
    try {
      await accion({ tipo: "adivinar", jugadorId, aId, intento });
      setIntento("");
    } catch {} finally {
      setEnviando(false);
    }
  };

  const ranking = [...sala.jugadores].sort((a, b) => b.puntos - a.puntos);

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-12 pt-2">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-tinta-suave)]">
            {sala.config.modoVictoria === "puntos"
              ? `Primero a ${sala.config.objetivo} pts`
              : `Ronda ${sala.rondaActual}/${sala.config.objetivo}`}
          </div>
          {esHost && (
            <button
              onClick={() => setConfirmandoFin(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] text-xs font-semibold hover:bg-[var(--color-peligro)] hover:text-white transition"
            >
              <Flag className="h-3.5 w-3.5" />
              Terminar partida
            </button>
          )}
        </div>

        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Tu palabra</div>
            <button
              onClick={() => setVerPalabra((v) => !v)}
              className="h-9 w-9 rounded-xl border-2 border-[var(--color-borde)] grid place-items-center hover:bg-[var(--color-fondo)] transition"
              aria-label="Ver/ocultar palabra"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {verPalabra ? (
            <div className="font-display font-black text-2xl text-gradient-primario break-words">
              {palabra?.palabra ?? "..."}
            </div>
          ) : (
            <div className="font-mono text-2xl tracking-[0.4em] text-[var(--color-tinta-suave)]">
              ••••••
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-bold text-lg">Puntajes</h3>
          </div>
          <ul className="space-y-2">
            {ranking.map((j, i) => (
              <motion.li
                layout
                key={j.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-2xl border-2 border-[var(--color-borde)]",
                  i === 0 && j.puntos > 0
                    ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo)] dark:bg-[var(--color-fondo-elev)]",
                )}
              >
                <span className={cn("font-mono font-bold text-sm w-6 text-center", i === 0 && j.puntos > 0 ? "text-white" : "text-[var(--color-tinta-suave)]")}>
                  #{i + 1}
                </span>
                <Avatar nombre={j.nombre} tamano={36} />
                <span className="font-semibold flex-1 truncate">
                  {j.nombre}
                  {j.id === jugadorId && (
                    <span className={cn("ml-2 text-xs font-normal", i === 0 && j.puntos > 0 ? "text-white/80" : "text-[var(--color-tinta-suave)]")}>(vos)</span>
                  )}
                </span>
                <motion.span
                  key={j.puntos}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono font-black text-xl tabular-nums"
                >
                  {j.puntos}
                </motion.span>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-[var(--color-primario-500)]" />
            <h3 className="font-display font-bold text-lg">Adivinar</h3>
          </div>
          <form onSubmit={enviar} className="space-y-3">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">A quién le adivinás</span>
              <select
                value={aId}
                onChange={(e) => setAId(e.target.value)}
                className="mt-1 h-12 w-full rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] px-3 font-semibold shadow-[var(--shadow-brutal)] outline-none"
              >
                {sala.jugadores.filter((j) => j.id !== jugadorId).map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </select>
            </label>
            <Input
              value={intento}
              onChange={(e) => setIntento(e.target.value)}
              placeholder="Lo que crees que es..."
              maxLength={60}
            />
            <Button type="submit" tamano="lg" className="w-full" disabled={!intento.trim() || !aId} cargando={enviando}>
              <Send className="h-5 w-5" />
              Enviar adivinanza
            </Button>
            <p className="text-xs text-[var(--color-tinta-suave)] text-center">
              Acierto = +1 punto. Fallo = -1 (mínimo 0).
            </p>
          </form>
        </Card>
      </div>

      <AnimatePresence>
        {feedback && sala.ultimaAdivinanza && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setFeedback(null)}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-sm"
            >
              <Card
                className="p-7 text-center text-white overflow-hidden relative"
                style={{
                  background: feedback === "acierto"
                    ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                }}
              >
                <div className="flex justify-center mb-3">
                  <span className="grid place-items-center h-20 w-20 rounded-3xl bg-white/20 backdrop-blur border-2 border-white/30">
                    {feedback === "acierto" ? (
                      <Check className="h-12 w-12" strokeWidth={3} />
                    ) : (
                      <X className="h-12 w-12" strokeWidth={3} />
                    )}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-widest opacity-80">
                  {sala.ultimaAdivinanza.deNombre} → {sala.ultimaAdivinanza.aNombre}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl mt-1">
                  {feedback === "acierto" ? "¡Acertó!" : "Falló"}
                </h2>
                <div className="mt-3 text-sm opacity-90">Dijo</div>
                <div className="font-display font-bold text-xl mt-0.5">&ldquo;{sala.ultimaAdivinanza.intento}&rdquo;</div>
                {feedback === "acierto" ? (
                  <div className="mt-3 text-sm opacity-90">
                    Era <span className="font-bold">{sala.ultimaAdivinanza.palabraReal}</span> · +1 pt
                  </div>
                ) : (
                  <div className="mt-3 text-sm opacity-90">-1 pt</div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmandoFin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setConfirmandoFin(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <Card className="p-6 text-center">
                <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-[var(--color-peligro)]/15 border-2 border-[var(--color-peligro)] mb-3">
                  <Flag className="h-6 w-6 text-[var(--color-peligro)]" />
                </div>
                <h2 className="font-display font-bold text-xl">¿Terminar la partida?</h2>
                <p className="mt-2 text-sm text-[var(--color-tinta-suave)]">
                  Gana el que tenga más puntos en este momento.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button variante="secundario" tamano="md" onClick={() => setConfirmandoFin(false)}>
                    Seguir jugando
                  </Button>
                  <Button
                    variante="peligro"
                    tamano="md"
                    onClick={async () => {
                      setConfirmandoFin(false);
                      await accion({ tipo: "terminarPartida", jugadorId }).catch(() => {});
                    }}
                  >
                    Terminar
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Fin({ sala, jugadorId, accion }: Props) {
  const esHost = sala.hostId === jugadorId;
  const ranking = [...sala.jugadores].sort((a, b) => b.puntos - a.puntos);
  const podio = ranking.slice(0, 3);
  const restantes = ranking.slice(3);
  const empate = (sala.ganador?.ids.length ?? 0) > 1;
  const tipo = sala.ganador?.tipo;

  useEffect(() => {
    if (!sala.ganador) return;
    const top = ranking[0];
    const segundo = ranking[1];
    const ventaja = (top?.puntos ?? 0) - (segundo?.puntos ?? 0);
    lanzarConfetti({
      duracionMs: ventaja >= 3 ? 1800 : 900,
      porTick: ventaja >= 3 ? 5 : 3,
      startVelocity: ventaja >= 3 ? 40 : 30,
      spread: ventaja >= 3 ? 90 : 70,
      colors: ["#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#10b981"],
    });
  }, [sala.ganador, ranking]);

  return (
    <div className="flex flex-col flex-1 items-center px-4 sm:px-6 pb-12 pt-2">
      <div className="w-full max-w-md space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] mb-4">
            <Trophy className="h-4 w-4 text-[var(--color-primario-500)]" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {tipo === "terminada"
                ? "Partida terminada"
                : sala.config.modoVictoria === "puntos"
                  ? `Primero a ${sala.config.objetivo} pts`
                  : `${sala.config.objetivo} rondas`}
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">
            {empate ? (
              <span className="text-gradient-primario">¡Empate!</span>
            ) : (
              <>Ganó <span className="text-gradient-primario">{podio[0]?.nombre}</span></>
            )}
          </h1>
        </motion.div>

        <Podio podio={podio} jugadorId={jugadorId} />

        {restantes.length > 0 && (
          <Card className="p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2 px-1">Resto</div>
            <ul className="space-y-2">
              {restantes.map((j, i) => (
                <li key={j.id} className="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-fondo)]">
                  <span className="font-mono font-bold text-sm w-6 text-center text-[var(--color-tinta-suave)]">#{i + 4}</span>
                  <Avatar nombre={j.nombre} tamano={32} />
                  <span className="font-semibold flex-1 truncate">{j.nombre}</span>
                  <span className="font-mono font-bold tabular-nums">{j.puntos}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {esHost ? (
          <div className="grid grid-cols-2 gap-3">
            <Button tamano="lg" onClick={() => accion({ tipo: "jugarOtraVez", jugadorId })}>
              <RotateCcw className="h-5 w-5" />
              Otra vez
            </Button>
            <Button tamano="lg" variante="secundario" onClick={() => accion({ tipo: "volverALobby", jugadorId })}>
              Cambiar config
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-[var(--color-tinta-suave)]">
            Esperando al anfitrión...
          </div>
        )}
        <Link href="/" className="block text-center text-sm text-[var(--color-tinta-suave)] hover:underline">
          <span className="inline-flex items-center gap-1"><Home className="h-3 w-3" /> Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}

function Podio({ podio, jugadorId }: { podio: { id: string; nombre: string; puntos: number }[]; jugadorId: string }) {
  const orden = [1, 0, 2];
  const alturas = ["h-28", "h-40", "h-20"];
  const tonos = [
    "from-zinc-300 to-zinc-500",
    "from-amber-300 to-amber-500",
    "from-orange-400 to-orange-700",
  ];
  const labels = ["2º", "1º", "3º"];

  return (
    <div className="grid grid-cols-3 gap-2 items-end">
      {orden.map((idx, vis) => {
        const j = podio[idx];
        if (!j) return <div key={vis} />;
        return (
          <motion.div
            key={j.id}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 + vis * 0.18 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + vis * 0.18, type: "spring", stiffness: 260, damping: 18 }}
            >
              <Avatar nombre={j.nombre} tamano={idx === 0 ? 64 : 48} />
            </motion.div>
            <div className="text-center min-h-12">
              {idx === 0 && <div className="text-2xl leading-none mb-1">👑</div>}
              <div className="font-display font-bold text-sm sm:text-base leading-tight truncate max-w-full">
                {j.nombre}
                {j.id === jugadorId && (
                  <span className="ml-1 text-xs text-[var(--color-tinta-suave)] font-normal">(vos)</span>
                )}
              </div>
              <div className="font-mono font-black text-lg text-gradient-primario tabular-nums">
                {j.puntos}
              </div>
            </div>
            <div
              className={cn(
                "w-full rounded-t-2xl border-2 border-b-0 border-[var(--color-borde)] bg-gradient-to-b text-white flex items-start justify-center pt-2 font-display font-black text-2xl",
                tonos[idx],
                alturas[vis],
              )}
            >
              {labels[vis]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
