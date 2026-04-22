"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Vote, Check, Trophy, Skull, RotateCcw, Home, VenetianMask, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn, formatearTiempo } from "@/lib/utils";
import { lanzarConfetti } from "@/lib/confetti";
import type { RolPrivado, SalaPublica } from "@/lib/use-sala-impostor";

type Props = {
  sala: SalaPublica;
  rol: RolPrivado;
  jugadorId: string;
  accion: (c: Record<string, unknown>) => Promise<unknown>;
};

export function JuegoOnline({ sala, rol, jugadorId, accion }: Props) {
  if (sala.fase === "discusion") return <Discusion {...{ sala, rol, jugadorId, accion }} />;
  if (sala.fase === "votacion") return <Votacion {...{ sala, rol, jugadorId, accion }} />;
  if (sala.fase === "resultado") return <Resultado {...{ sala, rol, jugadorId, accion }} />;
  return null;
}

function Discusion({ sala, rol, jugadorId, accion }: Props) {
  const [restante, setRestante] = useState(sala.config.duracionSeg);
  const [verRol, setVerRol] = useState(true);
  const [adivinanzaAbierta, setAdivinanzaAbierta] = useState(false);
  const esHost = sala.hostId === jugadorId;
  const esImpostor = rol?.esImpostor ?? false;

  useEffect(() => {
    if (!sala.finEn) return;
    const tick = () => {
      const ms = sala.finEn! - Date.now();
      setRestante(Math.max(0, Math.ceil(ms / 1000)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [sala.finEn]);

  const peligro = restante <= 10;
  const progreso = sala.config.duracionSeg > 0 ? restante / sala.config.duracionSeg : 0;

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-24 pt-2">
      <div className="mx-auto w-full max-w-md space-y-6">
        <CartaRol rol={rol} visible={verRol} alternar={() => setVerRol((v) => !v)} />

        <div className="relative aspect-square mx-auto w-56 sm:w-64">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-borde)" strokeWidth="2" opacity="0.15" />
            <motion.circle
              cx="50" cy="50" r="46" fill="none"
              stroke={peligro ? "#ef4444" : "url(#gradOnline)"}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progreso) }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
            <defs>
              <linearGradient id="gradOnline" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            key={restante}
            initial={{ scale: peligro ? 1.15 : 1.05, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className={`absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums ${
              peligro ? "text-[var(--color-peligro)]" : "text-gradient-primario"
            }`}
            style={{ fontSize: "clamp(3rem, 14vw, 5rem)" }}
          >
            {formatearTiempo(restante)}
          </motion.div>
        </div>

        <div className="text-center text-sm text-[var(--color-tinta-suave)]">
          Háganse preguntas para descubrir al impostor.
        </div>

        {esImpostor && (
          <button
            onClick={() => setAdivinanzaAbierta(true)}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-red-500/60 bg-red-500/5 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition"
          >
            <Sparkles className="h-4 w-4" />
            Creo que sé la palabra
          </button>
        )}

        {esHost && (
          <Button tamano="lg" className="w-full" onClick={() => accion({ tipo: "pasarVotacion", jugadorId })}>
            <Vote className="h-5 w-5" />
            Pasar a votación
          </Button>
        )}
      </div>

      <AnimatePresence>
        {adivinanzaAbierta && (
          <AdivinanzaImpostor
            onCerrar={() => setAdivinanzaAbierta(false)}
            onEnviar={async (intento) => {
              await accion({ tipo: "impostorAdivina", jugadorId, intento }).catch(() => {});
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdivinanzaImpostor({
  onCerrar,
  onEnviar,
}: {
  onCerrar: () => void;
  onEnviar: (intento: string) => Promise<void>;
}) {
  const [intento, setIntento] = useState("");
  const [enviando, setEnviando] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intento.trim() || enviando) return;
    setEnviando(true);
    await onEnviar(intento.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        <Card className="p-6 bg-[#0a0a0f] text-white overflow-hidden relative">
          <div className="flex justify-center mb-3">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-red-500/20 border-2 border-red-500/40">
              <VenetianMask className="h-7 w-7 text-red-400" />
            </span>
          </div>
          <div className="text-xs uppercase tracking-widest text-red-400 text-center">Jugada arriesgada</div>
          <h2 className="font-display font-black text-2xl text-center mt-1">¿Cuál es la palabra secreta?</h2>
          <p className="text-sm text-white/70 text-center mt-2">
            Si acertás ganás. Si fallás, los civiles ganan. Un solo intento.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <Input
              value={intento}
              onChange={(e) => setIntento(e.target.value)}
              placeholder="Escribí la palabra..."
              maxLength={60}
              autoFocus
              className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button variante="secundario" tamano="md" type="button" onClick={onCerrar} disabled={enviando}>
                Cancelar
              </Button>
              <Button variante="peligro" tamano="md" type="submit" cargando={enviando} disabled={!intento.trim()}>
                <Send className="h-4 w-4" />
                Arriesgarse
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function CartaRol({
  rol,
  visible,
  alternar,
}: {
  rol: RolPrivado;
  visible: boolean;
  alternar: () => void;
}) {
  if (!rol) {
    return (
      <Card className="p-5 text-center text-sm text-[var(--color-tinta-suave)]">
        Cargando tu rol...
      </Card>
    );
  }
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {visible ? (
          rol.esImpostor ? (
            <motion.div
              key="imp"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformPerspective: 1000 }}
            >
              <Card className="p-5 bg-[#0a0a0f] text-white overflow-hidden">
                <div className="flex items-center gap-4">
                  <span className="grid place-items-center h-14 w-14 rounded-2xl bg-red-500/20 border-2 border-red-500/40">
                    <VenetianMask className="h-7 w-7 text-red-400" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest text-red-400">Tu rol</div>
                    <div className="font-display font-black text-2xl text-red-500 leading-none">
                      IMPOSTOR
                    </div>
                    <div className="text-xs text-white/70 mt-1">
                      {rol.impostorCiego
                        ? "No sabés ni la categoría. Disimulá."
                        : `Categoría: ${rol.categoriaNombre}. No sabés la palabra.`}
                    </div>
                  </div>
                  <button
                    onClick={alternar}
                    className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 grid place-items-center transition"
                    aria-label="Ocultar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="civil"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformPerspective: 1000 }}
            >
              <Card className="p-5 overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-tinta-suave)]">
                      {rol.categoriaNombre}
                    </div>
                    <div className="font-display font-black text-3xl text-gradient-primario leading-tight break-words">
                      {rol.palabra}
                    </div>
                  </div>
                  <button
                    onClick={alternar}
                    className="h-10 w-10 rounded-xl border-2 border-[var(--color-borde)] grid place-items-center transition hover:bg-[var(--color-fondo)]"
                    aria-label="Ocultar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          )
        ) : (
          <motion.button
            key="oculto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={alternar}
            className="w-full h-20 rounded-3xl border-2 border-dashed border-[var(--color-borde)] flex items-center justify-center gap-2 text-[var(--color-tinta-suave)] hover:text-[var(--color-tinta)] transition"
          >
            <Eye className="h-4 w-4" />
            <span className="text-sm font-semibold">Ver mi rol</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function Votacion({ sala, jugadorId, accion }: Props) {
  const yaVoto = sala.votosPor[jugadorId];
  const esHost = sala.hostId === jugadorId;
  const total = sala.jugadores.length;
  const votados = sala.votosCount;

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-12 pt-2">
      <div className="mx-auto max-w-md w-full space-y-5">
        <div className="text-center">
          <h2 className="font-display font-bold text-3xl tracking-tight">¿Quién es el impostor?</h2>
          <p className="mt-2 text-sm text-[var(--color-tinta-suave)]">
            Votos: <span className="font-mono font-bold">{votados}/{total}</span>
          </p>
        </div>

        <Card className="p-3">
          <div className="grid grid-cols-1 gap-2">
            {sala.jugadores
              .filter((j) => j.id !== jugadorId)
              .map((j) => {
                const elegido = yaVoto === j.id;
                return (
                  <motion.button
                    key={j.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => accion({ tipo: "votar", jugadorId, votadoId: j.id })}
                    disabled={Boolean(yaVoto)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-2xl border-2 border-[var(--color-borde)] transition text-left",
                      elegido
                        ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                        : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]",
                      yaVoto && !elegido && "opacity-50",
                    )}
                  >
                    <Avatar nombre={j.nombre} tamano={44} />
                    <span className="flex-1 font-semibold">{j.nombre}</span>
                    {elegido && <Check className="h-5 w-5" />}
                  </motion.button>
                );
              })}
          </div>
        </Card>

        {yaVoto && (
          <div className="text-center text-sm text-[var(--color-tinta-suave)]">
            Tu voto quedó registrado. Esperando a los demás...
          </div>
        )}

        {esHost && (
          <Button
            variante="secundario"
            className="w-full"
            onClick={() => accion({ tipo: "cerrarVotacion", jugadorId })}
          >
            Cerrar votación ya
          </Button>
        )}
      </div>
    </div>
  );
}

function Resultado({ sala, jugadorId, accion }: Props) {
  const esHost = sala.hostId === jugadorId;
  const res = sala.resultado;

  useEffect(() => {
    if (res && !res.ganaImpostor) {
      lanzarConfetti({
        duracionMs: 1500,
        porTick: 4,
        startVelocity: 35,
        spread: 80,
        colors: ["#a855f7", "#ec4899", "#06b6d4", "#10b981"],
      });
    }
  }, [res]);

  if (!res) return null;
  const civilesGanan = !res.ganaImpostor;
  const porAdivinanza = res.porAdivinanza === true;

  const titulo = porAdivinanza
    ? civilesGanan
      ? "El impostor falló"
      : "¡El impostor adivinó!"
    : civilesGanan
      ? "¡Atrapado!"
      : "Se salió con la suya";

  const subtitulo = porAdivinanza
    ? civilesGanan
      ? "Ganan los civiles — se arriesgó y falló"
      : "Gana el impostor — adivinó la palabra"
    : civilesGanan
      ? "Ganan los civiles"
      : "Gana el impostor";

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12 pt-4">
      <div className="w-full max-w-md space-y-5">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, x: porAdivinanza && !civilesGanan ? -8 : 0 }}
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
                {civilesGanan ? <Trophy className="h-10 w-10" /> : <Skull className="h-10 w-10 text-red-400" />}
              </span>
            </div>
            <div className="text-xs uppercase tracking-widest opacity-80">
              {subtitulo}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mt-2 tracking-tight">
              {titulo}
            </h1>
          </Card>
        </motion.div>

        <Card className="p-5">
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] text-center mb-3">
            El impostor era
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Avatar nombre={res.impostorNombre} tamano={56} />
            <div className="font-display font-bold text-2xl">
              {res.impostorNombre}
              {res.impostorId === jugadorId && (
                <span className="ml-2 text-sm text-[var(--color-primario-500)] font-normal">(vos)</span>
              )}
            </div>
          </div>
          {porAdivinanza && (
            <div className="mt-5 pt-5 border-t-2 border-[var(--color-borde)] border-dashed">
              <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] text-center">
                {civilesGanan ? "Intentó con" : "Adivinó"}
              </div>
              <div className="mt-1 font-display font-bold text-2xl text-center">
                &ldquo;{res.palabraIntento}&rdquo;
              </div>
              {civilesGanan && res.palabraReal && (
                <div className="mt-3 text-sm text-[var(--color-tinta-suave)] text-center">
                  La palabra era <span className="font-bold text-gradient-primario">{res.palabraReal}</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {esHost ? (
          <Button tamano="xl" className="w-full" onClick={() => accion({ tipo: "nuevaRonda", jugadorId })}>
            <RotateCcw className="h-6 w-6" />
            Jugar otra vez
          </Button>
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
