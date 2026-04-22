"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import type {
  Carta,
  EstadoPartidaLocal,
} from "@/lib/vidas/types";
import {
  aplicarEfectos,
  calcularEfectoVinculoPareja,
  chequearMuertePorEdad,
  construirHistorial,
  generarFinal,
  seleccionarCarta,
} from "@/lib/vidas/motor";
import { TODAS_LAS_CARTAS, buscarCarta } from "@/lib/vidas/cartas";
import { buscarMundo, buscarRol } from "@/lib/vidas/mundos";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartaDisplay } from "./carta-display";
import { ConsecuenciaOverlay } from "./consecuencia-overlay";
import { StatsBar } from "./stats-bar";
import { PantallaFinal } from "./pantalla-final";
import { guardarSave } from "@/lib/vidas/store-local";

void calcularEfectoVinculoPareja;

export function JuegoLocal({ estadoInicial }: { estadoInicial: EstadoPartidaLocal }) {
  const router = useRouter();
  const [estado, setEstado] = useState<EstadoPartidaLocal>(estadoInicial);
  const [cartaExtra, setCartaExtra] = useState<Carta | null>(null);
  const [consecuencia, setConsecuencia] = useState<{
    titulo: string;
    consecuencia: string;
    efectos: import("@/lib/vidas/types").Efectos;
  } | null>(null);
  const [timelineAbierto, setTimelineAbierto] = useState(false);
  const [cargandoIA, setCargandoIA] = useState(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);

  const mundoDef = useMemo(() => buscarMundo(estado.mundo), [estado.mundo]);
  const rolDef = useMemo(() => buscarRol(estado.mundo, estado.jugador.rol), [estado.mundo, estado.jugador.rol]);

  const carta: Carta | null = useMemo(() => {
    if (!estado.cartaActualId) return null;
    if (cartaExtra && cartaExtra.id === estado.cartaActualId) return cartaExtra;
    return buscarCarta(estado.cartaActualId) ?? null;
  }, [estado.cartaActualId, cartaExtra]);

  useEffect(() => {
    if (estado.fase === "juego" && !estado.cartaActualId) {
      const siguiente = seleccionarCarta(TODAS_LAS_CARTAS, estado.jugador, estado.mundo, {
        desbloqueadas: estado.jugador.desbloqueadas,
      });
      if (!siguiente) {
        const siguienteEstado: EstadoPartidaLocal = {
          ...estado,
          fase: "fin",
        };
        setEstado(siguienteEstado);
        guardarSave(siguienteEstado);
        return;
      }
      const nuevoEstado: EstadoPartidaLocal = {
        ...estado,
        cartaActualId: siguiente.id,
      };
      setEstado(nuevoEstado);
      setCartaExtra(null);
      guardarSave(nuevoEstado);
    }
  }, [estado]);

  const elegir = (index: number) => {
    if (!carta) return;
    const opcion = carta.opciones[index];
    if (!opcion) return;
    const { jugador: despues, cambios } = aplicarEfectos(estado.jugador, opcion.efectos);
    despues.cartasUsadas = [...despues.cartasUsadas, carta.id];
    despues.historial = [...despues.historial, construirHistorial(carta.id, carta.titulo, estado.jugador, opcion, cambios)];
    if (opcion.desbloqueaCarta) {
      despues.desbloqueadas = [...despues.desbloqueadas, opcion.desbloqueaCarta];
    }
    const conChequeo = chequearMuertePorEdad(despues);
    const nuevoEstado: EstadoPartidaLocal = {
      ...estado,
      jugador: conChequeo,
      cartaActualId: null,
      fase: conChequeo.vivo ? "juego" : "fin",
    };
    setEstado(nuevoEstado);
    guardarSave(nuevoEstado);
    setCartaExtra(null);
    setConsecuencia({
      titulo: carta.titulo,
      consecuencia: opcion.consecuenciaTexto,
      efectos: cambios,
    });
  };

  const pedirCartaIA = async () => {
    if (estado.usosIAGeneracion >= 5 || cargandoIA) return;
    setCargandoIA(true);
    setErrorIA(null);
    try {
      const r = await fetch("/api/vidas/generar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mundo: estado.mundo, jugador: estado.jugador }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrorIA(j.error ?? "No se pudo generar");
        return;
      }
      const carta: Carta = j.carta;
      setCartaExtra(carta);
      const nuevo: EstadoPartidaLocal = {
        ...estado,
        cartaActualId: carta.id,
        usosIAGeneracion: estado.usosIAGeneracion + 1,
      };
      setEstado(nuevo);
      guardarSave(nuevo);
    } catch (e) {
      setErrorIA(e instanceof Error ? e.message : "Error");
    } finally {
      setCargandoIA(false);
    }
  };

  if (estado.fase === "fin") {
    const final = generarFinal(estado.jugador, mundoDef?.nombre ?? estado.mundo);
    return (
      <PantallaFinal
        jugador={estado.jugador}
        final={final}
        onJugarDeNuevo={() => router.push(`/vidas/local`)}
        onCambiarMundo={() => router.push(`/vidas/local`)}
        onVerTimeline={() => setTimelineAbierto(true)}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 pb-32">
      <div className="max-w-3xl mx-auto pt-4">
        <Card className="p-4 flex items-center gap-4">
          <Avatar nombre={estado.jugador.nombre} tamano={56} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-lg leading-tight truncate">
              {estado.jugador.nombre}
            </div>
            <div className="text-xs text-[var(--color-tinta-suave)] truncate">
              {rolDef?.nombre} · {mundoDef?.nombre} · {estado.jugador.edad} años · {estado.jugador.etapa}
            </div>
            <div className="mt-2">
              <StatsBar jugador={estado.jugador} />
            </div>
          </div>
        </Card>

        <div className="mt-2 text-xs text-[var(--color-tinta-suave)] px-2">
          Rango: <span className="font-bold text-[var(--color-tinta)]">{estado.jugador.rango}</span>
        </div>

        <div className="mt-6">
          {carta ? (
            <CartaDisplay carta={carta} onElegir={elegir} />
          ) : (
            <div className="text-center py-12 text-[var(--color-tinta-suave)]">Pensando tu próxima situación...</div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setTimelineAbierto(true)}
            className="text-xs font-bold inline-flex items-center gap-1 text-[var(--color-tinta-suave)] hover:text-[var(--color-tinta)]"
          >
            <Clock className="h-4 w-4" /> Ver historia ({estado.jugador.historial.length})
          </button>
          <div className="flex items-center gap-2">
            {errorIA && <span className="text-xs text-[var(--color-peligro)]">{errorIA}</span>}
            <Button
              tamano="sm"
              variante="secundario"
              disabled={estado.usosIAGeneracion >= 5 || cargandoIA}
              onClick={pedirCartaIA}
            >
              <Sparkles className="h-4 w-4" />
              {cargandoIA ? "Generando..." : `Situación IA (${5 - estado.usosIAGeneracion})`}
            </Button>
          </div>
        </div>
      </div>

      <ConsecuenciaOverlay
        visible={Boolean(consecuencia)}
        titulo={consecuencia?.titulo ?? ""}
        consecuencia={consecuencia?.consecuencia ?? ""}
        efectos={consecuencia?.efectos ?? {}}
        onContinuar={() => setConsecuencia(null)}
      />

      <TimelineModal
        visible={timelineAbierto}
        estado={estado}
        onCerrar={() => setTimelineAbierto(false)}
      />
    </div>
  );
}

function TimelineModal({
  visible,
  estado,
  onCerrar,
}: {
  visible: boolean;
  estado: EstadoPartidaLocal;
  onCerrar: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 p-4 grid place-items-center"
          onClick={onCerrar}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10 }}
            className="max-w-lg w-full max-h-[80vh] overflow-y-auto bg-[var(--color-fondo-elev)] border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal-xl)] rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display font-bold text-xl mb-3">Línea de vida</div>
            {estado.jugador.historial.length === 0 && (
              <div className="text-sm text-[var(--color-tinta-suave)]">Todavía no hay decisiones.</div>
            )}
            <div className="space-y-3">
              {estado.jugador.historial.map((h, i) => (
                <div key={i} className="pl-3 border-l-2 border-[var(--color-borde)]">
                  <div className="text-xs text-[var(--color-tinta-suave)]">A los {h.edad}</div>
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
      )}
    </AnimatePresence>
  );
}
