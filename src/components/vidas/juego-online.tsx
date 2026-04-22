"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, Heart } from "lucide-react";
import type { Carta, EstadoSalaOnline } from "@/lib/vidas/types";
import { buscarCarta } from "@/lib/vidas/cartas";
import { buscarMundo, buscarRol } from "@/lib/vidas/mundos";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartaDisplay } from "./carta-display";
import { ConsecuenciaOverlay } from "./consecuencia-overlay";
import { StatsBar } from "./stats-bar";
import { PantallaFinal } from "./pantalla-final";
import { generarFinal } from "@/lib/vidas/motor";

export function JuegoOnline({
  sala,
  jugadorId,
  accion,
  generarIA,
}: {
  sala: EstadoSalaOnline;
  jugadorId: string;
  accion: (c: Record<string, unknown>) => Promise<unknown>;
  generarIA: (jugadorId: string) => Promise<unknown>;
}) {
  const yo = sala.jugadores.find((j) => j.id === jugadorId);
  const otro = sala.jugadores.find((j) => j.id !== jugadorId);
  const esMiTurno = sala.turnoDe === jugadorId;
  const mundoDef = sala.mundo ? buscarMundo(sala.mundo) : null;

  const [consecuenciaVista, setConsecuenciaVista] = useState<number>(0);
  const [timelineAbierto, setTimelineAbierto] = useState(false);
  const [cargandoIA, setCargandoIA] = useState(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);

  const carta: Carta | null = useMemo(() => {
    if (!sala.cartaActualId) return null;
    if (sala.cartaActualExtra) return sala.cartaActualExtra;
    return buscarCarta(sala.cartaActualId) ?? null;
  }, [sala.cartaActualId, sala.cartaActualExtra]);

  useEffect(() => {
    if (!carta && sala.fase === "juego" && esMiTurno) {
      accion({ tipo: "pedirCarta", jugadorId }).catch(() => {});
    }
  }, [carta, sala.fase, esMiTurno, accion, jugadorId]);

  if (sala.fase === "fin" && yo) {
    const muerto = !yo.vivo ? yo : otro && !otro.vivo ? otro : yo;
    const final = generarFinal(muerto, mundoDef?.nombre ?? sala.mundo ?? "", {
      tipoRelacion: sala.tipoRelacion ?? undefined,
      vinculo: sala.vinculo,
      parejaNombre: otro?.nombre,
    });
    return (
      <PantallaFinal
        jugador={muerto}
        final={final}
        onJugarDeNuevo={() => accion({ tipo: "volverALobby", jugadorId })}
      />
    );
  }

  if (!yo) {
    return (
      <div className="p-6 text-center text-[var(--color-tinta-suave)]">Esperando...</div>
    );
  }

  const elegir = async (index: number) => {
    try {
      await accion({ tipo: "elegirOpcion", jugadorId, opcionIndex: index });
    } catch (e) {
      console.error(e);
    }
  };

  const pedirIA = async () => {
    if (!esMiTurno || cargandoIA) return;
    setCargandoIA(true);
    setErrorIA(null);
    try {
      await generarIA(jugadorId);
    } catch (e) {
      setErrorIA(e instanceof Error ? e.message : "Error IA");
    } finally {
      setCargandoIA(false);
    }
  };

  const ultimaCons = sala.ultimaConsecuencia;
  const ultimaKey = ultimaCons?.ts ?? 0;
  const mostrarCons = ultimaKey > consecuenciaVista;

  return (
    <div className="min-h-screen px-4 sm:px-6 pb-32">
      <div className="max-w-3xl mx-auto pt-4 space-y-3">
        <DuoHeader yo={yo} otro={otro} vinculo={sala.vinculo} tipoRelacion={sala.tipoRelacion} />

        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[2px_2px_0_0_var(--color-borde)] text-xs font-bold">
            {esMiTurno
              ? "Te toca a vos"
              : `Esperando a ${otro?.nombre ?? "el otro jugador"}...`}
          </div>
        </div>

        <div className="mt-2">
          {carta ? (
            <CartaDisplay
              carta={carta}
              onElegir={esMiTurno ? elegir : undefined}
              deshabilitado={!esMiTurno}
              etiquetaTurno={
                esMiTurno
                  ? "Tu turno"
                  : `${sala.jugadores.find((j) => j.id === sala.turnoDe)?.nombre ?? ""} está eligiendo`
              }
            />
          ) : (
            <div className="text-center py-12 text-[var(--color-tinta-suave)]">
              {esMiTurno ? "Trayendo tu situación..." : "Esperando..."}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setTimelineAbierto(true)}
            className="text-xs font-bold inline-flex items-center gap-1 text-[var(--color-tinta-suave)]"
          >
            <Clock className="h-4 w-4" /> Ver historia ({yo.historial.length + (otro?.historial.length ?? 0)})
          </button>
          <div className="flex items-center gap-2">
            {errorIA && <span className="text-xs text-[var(--color-peligro)]">{errorIA}</span>}
            <Button
              tamano="sm"
              variante="secundario"
              disabled={!esMiTurno || sala.usosIAGeneracion >= 5 || cargandoIA || Boolean(carta)}
              onClick={pedirIA}
            >
              <Sparkles className="h-4 w-4" />
              {cargandoIA ? "Generando..." : `Situación IA (${5 - sala.usosIAGeneracion})`}
            </Button>
          </div>
        </div>
      </div>

      <ConsecuenciaOverlay
        visible={Boolean(ultimaCons) && mostrarCons}
        titulo={ultimaCons?.cartaTitulo ?? ""}
        consecuencia={ultimaCons?.consecuenciaTexto ?? ""}
        efectos={ultimaCons?.efectos ?? {}}
        autorNombre={ultimaCons?.jugadorNombre}
        onContinuar={() => setConsecuenciaVista(ultimaKey)}
      />

      {timelineAbierto && <TimelineModal sala={sala} onCerrar={() => setTimelineAbierto(false)} />}
    </div>
  );
}

function DuoHeader({
  yo,
  otro,
  vinculo,
  tipoRelacion,
}: {
  yo: EstadoSalaOnline["jugadores"][number];
  otro: EstadoSalaOnline["jugadores"][number] | undefined;
  vinculo: number;
  tipoRelacion: EstadoSalaOnline["tipoRelacion"];
}) {
  const rolYo = buscarRol(yo.mundo, yo.rol);
  const rolOtro = otro ? buscarRol(otro.mundo, otro.rol) : null;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <Card className="p-3 flex flex-col items-center text-center">
        <Avatar nombre={yo.nombre} tamano={44} />
        <div className="mt-1 font-display font-bold text-sm truncate max-w-full">{yo.nombre}</div>
        <div className="text-[10px] text-[var(--color-tinta-suave)] truncate max-w-full">
          {rolYo?.nombre} · {yo.edad}a
        </div>
        <div className="mt-1">
          <StatsBar jugador={yo} />
        </div>
      </Card>

      <div className="flex flex-col items-center gap-1">
        <Heart className={`h-6 w-6 ${tipoRelacion === "pareja" ? "text-[var(--color-acento)] fill-current" : "text-[var(--color-tinta-suave)]"}`} />
        <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
          Vínculo
        </div>
        <div className="font-mono tabular-nums font-bold text-lg">{vinculo}</div>
        <div className="h-1 w-14 rounded-full bg-[var(--color-borde)]/10 overflow-hidden">
          <div className="h-full bg-[var(--color-primario-500)]" style={{ width: `${vinculo}%` }} />
        </div>
      </div>

      {otro ? (
        <Card className="p-3 flex flex-col items-center text-center">
          <Avatar nombre={otro.nombre} tamano={44} />
          <div className="mt-1 font-display font-bold text-sm truncate max-w-full">{otro.nombre}</div>
          <div className="text-[10px] text-[var(--color-tinta-suave)] truncate max-w-full">
            {rolOtro?.nombre} · {otro.edad}a
          </div>
          <div className="mt-1">
            <StatsBar jugador={otro} />
          </div>
        </Card>
      ) : (
        <Card className="p-3 text-center">
          <div className="text-[10px] text-[var(--color-tinta-suave)]">Esperando segundo jugador</div>
        </Card>
      )}
    </div>
  );
}

function TimelineModal({
  sala,
  onCerrar,
}: {
  sala: EstadoSalaOnline;
  onCerrar: () => void;
}) {
  const entradas = sala.jugadores
    .flatMap((j) => j.historial.map((h) => ({ ...h, nombre: j.nombre })))
    .sort((a, b) => a.ts - b.ts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 bg-black/50 p-4 grid place-items-center"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto bg-[var(--color-fondo-elev)] border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display font-bold text-xl mb-3">Línea de vida compartida</div>
        {entradas.length === 0 && (
          <div className="text-sm text-[var(--color-tinta-suave)]">Todavía no hay decisiones.</div>
        )}
        <div className="space-y-3">
          {entradas.map((h, i) => (
            <div key={i} className="pl-3 border-l-2 border-[var(--color-borde)]">
              <div className="text-xs text-[var(--color-tinta-suave)]">
                <span className="font-bold text-[var(--color-primario-600)]">{h.nombre}</span> · a los {h.edad}
              </div>
              <div className="text-sm font-semibold">{h.tituloCarta}</div>
              <div className="text-xs italic text-[var(--color-tinta)]">{h.opcionTexto}</div>
              <div className="text-xs text-[var(--color-tinta-suave)]">{h.consecuenciaTexto}</div>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={onCerrar}>
          Cerrar
        </Button>
      </motion.div>
    </motion.div>
  );
}
