"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Vote, Check, Trophy, Skull, RotateCcw, Home, VenetianMask, Sparkles, Send, Lightbulb, MessageCircleQuestion, ChevronDown, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn, formatearTiempo } from "@/lib/utils";
import { lanzarConfetti } from "@/lib/confetti";
import type { RolPrivado, SalaPublica } from "@/lib/use-sala-impostor";
import { PoderCard } from "@/components/juego/poder-card";
import { preguntasAleatorias } from "@/lib/preguntas-impostor";

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
  const [pistasLocal, setPistasLocal] = useState<string[]>([]);
  const [contextoLocal, setContextoLocal] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<string[]>(() => preguntasAleatorias(5));
  const [preguntasAbierto, setPreguntasAbierto] = useState(false);
  const [dobleAgenteAbierto, setDobleAgenteAbierto] = useState(false);
  const esHost = sala.hostId === jugadorId;
  const esImpostor = rol?.esImpostor ?? false;
  const reglas = sala.config.reglasExtra;
  const miPoder = rol?.poder ?? null;

  useEffect(() => {
    setPistasLocal(rol?.pistasPedidas?.map((p) => p.texto) ?? []);
  }, [rol?.pistasPedidas]);

  useEffect(() => {
    setContextoLocal(sala.contextoCivilTexto ?? null);
  }, [sala.contextoCivilTexto]);

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

  const pedirPista = async () => {
    try {
      const r = await accion({ tipo: "pedirPista", jugadorId }) as { pista?: { texto: string } };
      if (r?.pista?.texto) setPistasLocal((p) => [...p, r.pista!.texto]);
    } catch {}
  };
  const pedirContexto = async () => {
    try {
      const r = await accion({ tipo: "pedirContextoCivil", jugadorId }) as { texto?: string };
      if (r?.texto) setContextoLocal(r.texto);
    } catch {}
  };

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-6 pb-24 pt-2">
      <div className="mx-auto w-full max-w-md space-y-6">
        {sala.esJefeFinal && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[var(--shadow-brutal)] border-2 border-[var(--color-borde)]">
              <Crown className="h-4 w-4" />
              Jefe Final · 2x puntos
            </div>
          </div>
        )}

        <CartaRol rol={rol} visible={verRol} alternar={() => setVerRol((v) => !v)} />

        {miPoder && <PoderCard poder={miPoder} />}

        {sala.acusacionDobleAgente?.map((a, i) => (
          <div key={i} className="text-center">
            <div className="inline-block px-3 py-1.5 rounded-full bg-amber-500/15 border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              🎭 {a.deNombre} cree que {a.aNombre} es el impostor
            </div>
          </div>
        ))}

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

        {reglas.preguntasSugeridas && (
          <Card className="p-3 text-left">
            <button onClick={() => setPreguntasAbierto((v) => !v)} className="w-full flex items-center justify-between gap-2 font-semibold text-sm">
              <span className="inline-flex items-center gap-2">
                <MessageCircleQuestion className="h-4 w-4 text-[var(--color-primario-500)]" />
                Preguntas sugeridas
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${preguntasAbierto ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {preguntasAbierto && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {preguntas.map((p, i) => (
                      <li key={i} className="px-3 py-2 rounded-xl bg-[var(--color-fondo)] border-2 border-[var(--color-borde)]">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPreguntas(preguntasAleatorias(5))} className="mt-2 w-full text-xs font-semibold text-[var(--color-primario-500)] hover:underline">
                    Otra ronda de preguntas
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}

        {reglas.pistasActivas && esImpostor && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--color-primario-500)]">
                <Lightbulb className="h-3.5 w-3.5" />
                Pistas ({pistasLocal.length}/3)
              </span>
              <button
                onClick={pedirPista}
                disabled={pistasLocal.length >= 3}
                className="text-xs font-bold text-[var(--color-primario-500)] hover:underline disabled:opacity-50"
              >
                Pedir pista (-1 pt)
              </button>
            </div>
            {pistasLocal.length === 0 ? (
              <p className="text-xs text-[var(--color-tinta-suave)]">Sin pistas todavía</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {pistasLocal.map((p, i) => (
                  <li key={i} className="font-semibold">#{i + 1} · {p}</li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {reglas.pistasActivas && !esImpostor && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--color-cian)]">
                <Eye className="h-3.5 w-3.5" />
                Contexto
              </span>
              {!contextoLocal && (
                <button onClick={pedirContexto} className="text-xs font-bold text-[var(--color-cian)] hover:underline">
                  Pedir contexto (1 por ronda)
                </button>
              )}
            </div>
            {contextoLocal ? (
              <p className="text-sm">{contextoLocal}</p>
            ) : (
              <p className="text-xs text-[var(--color-tinta-suave)]">Alguno puede pedir contexto colectivo</p>
            )}
          </Card>
        )}

        {esImpostor && miPoder?.tipo === "dobleAgente" && !miPoder.usado && (
          <button
            onClick={() => setDobleAgenteAbierto(true)}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition"
          >
            🎭 Acusar falsamente (Doble Agente)
          </button>
        )}

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

      <AnimatePresence>
        {dobleAgenteAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setDobleAgenteAbierto(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <Card className="p-5">
                <h2 className="font-display font-black text-xl text-center">¿A quién acusás?</h2>
                <p className="text-xs text-center text-[var(--color-tinta-suave)] mt-1 mb-4">Todos verán tu acusación</p>
                <div className="grid grid-cols-2 gap-2">
                  {sala.jugadores.filter((j) => j.id !== jugadorId).map((j) => (
                    <button
                      key={j.id}
                      onClick={async () => {
                        await accion({ tipo: "dobleAgente", jugadorId, acusadoId: j.id }).catch(() => {});
                        setDobleAgenteAbierto(false);
                      }}
                      className="flex items-center gap-2 p-3 rounded-xl border-2 border-[var(--color-borde)] hover:bg-[var(--color-fondo)] transition"
                    >
                      <Avatar nombre={j.nombre} tamano={32} />
                      <span className="font-semibold text-sm truncate">{j.nombre}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
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
                      Categoría: {rol.categoriaNombre}. No sabés la palabra.
                    </div>
                    {rol.haySegundoImpostor && (
                      <div className="text-[10px] uppercase tracking-widest text-red-300 mt-1 font-bold">
                        Hay otro impostor — no sabés quién
                      </div>
                    )}
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
                    {rol.palabraFalsa && (
                      <div className="mt-2 p-2 rounded-lg border-2 border-dashed border-[var(--color-cian)] bg-[var(--color-cian)]/10 text-xs">
                        <span className="font-bold text-[var(--color-cian)]">📖 Traductor — Palabra falsa:</span> {rol.palabraFalsa}
                      </div>
                    )}
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
  const puntajeActivo = sala.config.reglasExtra.puntajePersistente;

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

  const ranking = puntajeActivo ? [...sala.jugadores].sort((a, b) => b.puntos - a.puntos) : [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 pb-12 pt-4">
      <div className="w-full max-w-md space-y-5">
        {res.esJefeFinal && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[var(--shadow-brutal)] border-2 border-[var(--color-borde)]">
              <Crown className="h-4 w-4" />
              Jefe Final · 2x puntos
            </div>
          </div>
        )}
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
            {res.impostoresExtra && res.impostoresExtra.length > 0 ? "Los impostores eran" : "El impostor era"}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Avatar nombre={res.impostorNombre} tamano={56} />
              <div className="font-display font-bold text-2xl">
                {res.impostorNombre}
                {res.impostorId === jugadorId && (
                  <span className="ml-2 text-sm text-[var(--color-primario-500)] font-normal">(vos)</span>
                )}
              </div>
            </div>
            {res.impostoresExtra?.map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <Avatar nombre={i.nombre} tamano={48} />
                <div className="font-display font-bold text-xl">{i.nombre}</div>
              </div>
            ))}
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

        {puntajeActivo && ranking.length > 0 && (
          <Card className="p-5">
            <h3 className="font-display font-bold text-lg mb-3">Leaderboard</h3>
            <ul className="space-y-2">
              {ranking.map((j, i) => {
                const cambio = res.cambiosPuntaje?.find((c) => c.id === j.id);
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
                    <span className="font-semibold flex-1 truncate">
                      {j.nombre}
                      {j.id === jugadorId && (
                        <span className={cn("ml-2 text-xs font-normal", i === 0 ? "text-white/80" : "text-[var(--color-tinta-suave)]")}>(vos)</span>
                      )}
                    </span>
                    {cambio && cambio.delta !== 0 && (
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        cambio.delta > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500",
                      )}>
                        {cambio.delta > 0 ? "+" : ""}{cambio.delta}
                      </span>
                    )}
                    <span className="font-mono font-black text-xl tabular-nums">{j.puntos}</span>
                  </motion.li>
                );
              })}
            </ul>
          </Card>
        )}

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
