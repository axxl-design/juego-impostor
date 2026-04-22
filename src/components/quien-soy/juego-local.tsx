"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, X, Target, Trophy, Flag, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useJuegoQuienSoyLocal } from "@/lib/store-local-quien-soy";
import { cn } from "@/lib/utils";
import { lanzarConfetti } from "@/lib/confetti";

export function JuegoLocalQuienSoy() {
  const {
    jugadores,
    config,
    rondaActual,
    pistasUsadas,
    ultimaAdivinanza,
    ganadorPendiente,
    intentarAdivinanza,
    pedirPista,
    comprarEscudo,
    terminarPartida,
    siguienteRonda,
  } = useJuegoQuienSoyLocal();

  const [deId, setDeId] = useState<string>(jugadores[0]?.id ?? "");
  const [aId, setAId] = useState<string>(jugadores[1]?.id ?? "");
  const [intento, setIntento] = useState("");
  const [confirmandoFin, setConfirmandoFin] = useState(false);
  const [pistaMostrada, setPistaMostrada] = useState<{ nombre: string; texto: string } | null>(null);
  const confettiDisparadoRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ultimaAdivinanza) {
      confettiDisparadoRef.current = null;
      return;
    }
    const key = `${ultimaAdivinanza.deId}-${ultimaAdivinanza.aId}-${ultimaAdivinanza.intento}-${ultimaAdivinanza.acerto}`;
    if (ultimaAdivinanza.acerto && confettiDisparadoRef.current !== key) {
      confettiDisparadoRef.current = key;
      lanzarConfetti({
        duracionMs: 900,
        porTick: 3,
        startVelocity: 30,
        spread: 70,
        colors: ["#a855f7", "#ec4899", "#06b6d4", "#10b981"],
      });
    }
  }, [ultimaAdivinanza]);

  useEffect(() => {
    if (!jugadores.find((j) => j.id === deId)) setDeId(jugadores[0]?.id ?? "");
    if (!jugadores.find((j) => j.id === aId) || aId === deId) {
      const otro = jugadores.find((j) => j.id !== deId);
      setAId(otro?.id ?? "");
    }
  }, [jugadores, deId, aId]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deId || !aId || !intento.trim()) return;
    intentarAdivinanza(deId, aId, intento);
    setIntento("");
  };

  const ranking = [...jugadores].sort((a, b) => b.puntos - a.puntos);

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-12 pt-2">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-tinta-suave)]">
            {config.modoVictoria === "puntos"
              ? `Primero a ${config.objetivo} pts`
              : `Ronda ${rondaActual}/${config.objetivo}`}
          </div>
          <button
            onClick={() => setConfirmandoFin(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] text-xs font-semibold hover:bg-[var(--color-peligro)] hover:text-white transition"
          >
            <Flag className="h-3.5 w-3.5" />
            Terminar partida
          </button>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-display font-bold text-lg">Puntajes</h3>
            <span className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
              {jugadores.length} jugadores
            </span>
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
                  {j.escudo && <span className="ml-1">🛡️</span>}
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

        {(config.reglasExtra.pistasActivas || config.reglasExtra.escudoComprable) && (
          <Card className="p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2 px-1 font-bold">Acciones del jugador activo</div>
            <div className="grid grid-cols-2 gap-2">
              {config.reglasExtra.pistasActivas && (
                <button
                  onClick={() => {
                    const p = pedirPista(deId);
                    if (p) {
                      const j = jugadores.find((x) => x.id === deId);
                      setPistaMostrada({ nombre: j?.nombre ?? "", texto: p.texto });
                      setTimeout(() => setPistaMostrada(null), 4500);
                    }
                  }}
                  disabled={(pistasUsadas[deId] ?? 0) >= 3 || (jugadores.find((j) => j.id === deId)?.puntos ?? 0) <= 0}
                  className="inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border-2 border-[var(--color-primario-500)]/60 bg-[var(--color-primario-500)]/10 text-[var(--color-primario-500)] text-xs font-semibold hover:bg-[var(--color-primario-500)]/20 transition disabled:opacity-40"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  Pista ({pistasUsadas[deId] ?? 0}/3) -1pt
                </button>
              )}
              {config.reglasExtra.escudoComprable && (
                <button
                  onClick={() => comprarEscudo(deId)}
                  disabled={(jugadores.find((j) => j.id === deId)?.puntos ?? 0) < 5 || (jugadores.find((j) => j.id === deId)?.escudo ?? false)}
                  className="inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border-2 border-[var(--color-cian)]/60 bg-[var(--color-cian)]/10 text-[var(--color-cian)] text-xs font-semibold hover:bg-[var(--color-cian)]/20 transition disabled:opacity-40"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Comprar escudo (2 pts)
                </button>
              )}
            </div>
          </Card>
        )}

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-[var(--color-primario-500)]" />
            <h3 className="font-display font-bold text-lg">Adivinar</h3>
          </div>
          <form onSubmit={enviar} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Yo soy</span>
                <select
                  value={deId}
                  onChange={(e) => setDeId(e.target.value)}
                  className="mt-1 h-12 w-full rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] px-3 font-semibold shadow-[var(--shadow-brutal)] outline-none"
                >
                  {jugadores.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Adivino a</span>
                <select
                  value={aId}
                  onChange={(e) => setAId(e.target.value)}
                  className="mt-1 h-12 w-full rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] px-3 font-semibold shadow-[var(--shadow-brutal)] outline-none"
                >
                  {jugadores.filter((j) => j.id !== deId).map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Input
              value={intento}
              onChange={(e) => setIntento(e.target.value)}
              placeholder="Escribí lo que crees que es..."
              maxLength={60}
            />
            <Button type="submit" tamano="lg" className="w-full" disabled={!intento.trim() || !aId || deId === aId}>
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
        {pistaMostrada && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-30 max-w-md mx-auto"
          >
            <Card className="p-4 bg-[var(--color-primario-500)] text-white">
              <div className="text-xs uppercase tracking-widest opacity-80">
                <Lightbulb className="h-3 w-3 inline mr-1" /> Pista para {pistaMostrada.nombre}
              </div>
              <div className="font-display font-bold text-lg mt-1">{pistaMostrada.texto}</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ultimaAdivinanza && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-sm"
            >
              <Card
                className="p-6 text-center text-white overflow-hidden relative"
                style={{
                  background: ultimaAdivinanza.acerto
                    ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                }}
              >
                <div className="flex justify-center mb-3">
                  <span className="grid place-items-center h-20 w-20 rounded-3xl bg-white/20 backdrop-blur border-2 border-white/30">
                    {ultimaAdivinanza.acerto ? (
                      <Check className="h-12 w-12" strokeWidth={3} />
                    ) : (
                      <X className="h-12 w-12" strokeWidth={3} />
                    )}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-widest opacity-80">
                  {ultimaAdivinanza.deNombre} → {ultimaAdivinanza.aNombre}
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl mt-1">
                  {ultimaAdivinanza.acerto ? "¡Acertó!" : "Falló"}
                </h2>
                <div className="mt-3 text-sm opacity-90">Dijo</div>
                <div className="font-display font-bold text-xl mt-0.5">&ldquo;{ultimaAdivinanza.intento}&rdquo;</div>
                <div className="mt-3 text-sm opacity-90">
                  Era <span className="font-bold">{ultimaAdivinanza.palabraReal}</span>
                </div>
                {ultimaAdivinanza.acerto ? (
                  <div className="mt-1 text-sm opacity-90">+1 pt para {ultimaAdivinanza.deNombre}</div>
                ) : (
                  <div className="mt-1 text-sm opacity-90">
                    {ultimaAdivinanza.escudoUsado
                      ? `🛡️ Escudo usado — no perdió puntos`
                      : `-1 pt para ${ultimaAdivinanza.deNombre}`}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t-2 border-white/20">
                  <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Puntajes</div>
                  <ul className="grid grid-cols-2 gap-1 text-sm">
                    {[...jugadores].sort((a, b) => b.puntos - a.puntos).map((j) => (
                      <li key={j.id} className="flex items-center justify-between bg-white/15 rounded-lg px-2 py-1">
                        <span className="truncate font-semibold">{j.nombre}</span>
                        <span className="font-mono font-bold ml-2">{j.puntos}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <Button
                    tamano="lg"
                    variante="secundario"
                    className="w-full"
                    onClick={siguienteRonda}
                  >
                    {ganadorPendiente ? "Ver resultado final" : "Siguiente ronda"}
                  </Button>
                </div>
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
                  <Button variante="peligro" tamano="md" onClick={() => { setConfirmandoFin(false); terminarPartida(); }}>
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

export function FinLocalQuienSoy() {
  const { jugadores, ganador, config, jugarOtraVez, volverAConfig } = useJuegoQuienSoyLocal();
  const ranking = [...jugadores].sort((a, b) => b.puntos - a.puntos);

  useEffect(() => {
    if (!ganador) return;
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
  }, [ganador, ranking]);

  if (!ganador) return null;
  const podio = ranking.slice(0, 3);
  const restantes = ranking.slice(3);
  const empate = ganador.ids.length > 1;

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
              {ganador.tipo === "terminada"
                ? "Partida terminada"
                : config.modoVictoria === "puntos"
                  ? `Primero a ${config.objetivo} pts`
                  : `${config.objetivo} rondas jugadas`}
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">
            {empate ? (
              <>
                <span className="text-gradient-primario">¡Empate!</span>
              </>
            ) : (
              <>
                Ganó <span className="text-gradient-primario">{podio[0]?.nombre}</span>
              </>
            )}
          </h1>
        </motion.div>

        <Podio podio={podio} />

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

        <div className="grid grid-cols-2 gap-3">
          <Button tamano="lg" onClick={jugarOtraVez}>
            Jugar otra vez
          </Button>
          <Button tamano="lg" variante="secundario" onClick={volverAConfig}>
            Cambiar config
          </Button>
        </div>
      </div>
    </div>
  );
}

function Podio({ podio }: { podio: { id: string; nombre: string; puntos: number }[] }) {
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
              {idx === 0 && (
                <div className="text-2xl leading-none mb-1">👑</div>
              )}
              <div className="font-display font-bold text-sm sm:text-base leading-tight truncate max-w-full">
                {j.nombre}
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
