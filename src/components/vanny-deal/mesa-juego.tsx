"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartaReverso, CartaUI } from "./carta-ui";
import type { AccionCliente } from "@/lib/sala-store-vanny-deal";
import type {
  Carta,
  Color,
  VistaPrivada,
  VistaPublica,
} from "@/lib/vanny-deal/types";
import { COLORES, COLORES_LISTA } from "@/lib/vanny-deal/colores";
import { OverlayAccion } from "./overlays";
import { infoAccion } from "@/lib/vanny-deal/mazo";

interface Props {
  sala: VistaPublica;
  mano: VistaPrivada | null;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}

export function MesaJuego({ sala, mano, jugadorId, onAccion }: Props) {
  const yo = sala.jugadores.find((j) => j.id === jugadorId);
  const idxYo = sala.jugadores.findIndex((j) => j.id === jugadorId);
  const otros = sala.jugadores.filter((_, i) => i !== idxYo);
  const enTurno = sala.jugadores[sala.turnoIdx]?.id === jugadorId;
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [overlayAccion, setOverlayAccion] = useState<Carta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [descartando, setDescartando] = useState<string[]>([]);

  const misManoCartas = mano?.mano ?? [];
  const cartaSel = useMemo(
    () => misManoCartas.find((c) => c.id === seleccionada) ?? null,
    [seleccionada, misManoCartas],
  );

  const debeDescartar = (yo?.cantidadMano ?? 0) - 7;
  const necesitaDescarte = enTurno && debeDescartar > 0;

  const jugarComoProp = async (carta: Carta) => {
    setError(null);
    if (carta.tipo === "bicolor") {
      const c = prompt(
        `¿Color? (1: ${COLORES[carta.colores[0]].nombre}, 2: ${COLORES[carta.colores[1]].nombre})`,
        "1",
      );
      const color = c === "2" ? carta.colores[1] : carta.colores[0];
      const r = await onAccion({ tipo: "jugarPropiedad", jugadorId, cartaId: carta.id, colorElegido: color });
      if (!r.ok) setError(r.error ?? "Error");
      else setSeleccionada(null);
      return;
    }
    if (carta.tipo === "arcoiris") {
      const opciones = COLORES_LISTA.map((c, i) => `${i + 1}: ${COLORES[c].nombre}`).join("\n");
      const c = prompt(`¿Color para el arcoíris?\n${opciones}`, "1");
      const n = parseInt(c ?? "1", 10);
      const color = COLORES_LISTA[Math.max(1, Math.min(COLORES_LISTA.length, n)) - 1];
      const r = await onAccion({
        tipo: "jugarPropiedad",
        jugadorId,
        cartaId: carta.id,
        colorElegido: color,
      });
      if (!r.ok) setError(r.error ?? "Error");
      else setSeleccionada(null);
      return;
    }
    const r = await onAccion({ tipo: "jugarPropiedad", jugadorId, cartaId: carta.id });
    if (!r.ok) setError(r.error ?? "Error");
    else setSeleccionada(null);
  };

  const jugarComoDinero = async (carta: Carta) => {
    setError(null);
    const r = await onAccion({ tipo: "jugarDinero", jugadorId, cartaId: carta.id });
    if (!r.ok) setError(r.error ?? "Error");
    else setSeleccionada(null);
  };

  const abrirAccion = (carta: Carta) => {
    setOverlayAccion(carta);
  };

  const terminarTurno = async () => {
    setError(null);
    if (necesitaDescarte && descartando.length !== debeDescartar) {
      setError(`Elegí ${debeDescartar} carta(s) para descartar`);
      return;
    }
    const r = await onAccion({
      tipo: "terminarTurno",
      jugadorId,
      descartarIds: necesitaDescarte ? descartando : undefined,
    });
    if (!r.ok) setError(r.error ?? "Error");
    else {
      setDescartando([]);
      setSeleccionada(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header: otros jugadores */}
      <div className="sticky top-0 z-30 bg-[var(--color-fondo)]/95 backdrop-blur border-b-2 border-[var(--color-borde)]">
        <div className="flex gap-2 overflow-x-auto px-3 py-2">
          {otros.map((j) => (
            <OtroJugador key={j.id} jugador={j} esTurno={sala.jugadores[sala.turnoIdx]?.id === j.id} />
          ))}
        </div>
      </div>

      {/* Mesa central */}
      <div className="flex-1 px-3 py-3 space-y-3">
        <MesaCentral sala={sala} />

        {yo && <MiZona jugador={yo} />}
      </div>

      {/* Mano + acciones */}
      <div className="sticky bottom-0 z-30 bg-[var(--color-fondo-elev)] border-t-2 border-[var(--color-borde)] shadow-[0_-4px_0_0_var(--color-borde)]">
        <div className="px-3 py-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-tinta-suave)]">
              Mi mano · {misManoCartas.length} {necesitaDescarte && <span className="text-[var(--color-peligro)]">· descartá {debeDescartar}</span>}
            </div>
            <div className="flex gap-2 items-center">
              {enTurno && (
                <div className="text-[11px] font-mono">
                  {sala.cartasJugadasEnTurno}/3 jugadas
                </div>
              )}
              {enTurno ? (
                <Button tamano="sm" onClick={terminarTurno}>
                  Terminar turno
                </Button>
              ) : (
                <div className="text-[11px] text-[var(--color-tinta-suave)]">
                  Turno de{" "}
                  <span className="font-bold">{sala.jugadores[sala.turnoIdx]?.nombre}</span>
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-xs text-[var(--color-peligro)]">{error}</div>}

          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
            {misManoCartas.map((c) => {
              const estaSel = c.id === seleccionada;
              const estaDescart = descartando.includes(c.id);
              return (
                <div key={c.id} className="snap-start shrink-0">
                  <CartaUI
                    carta={c}
                    tamano="md"
                    seleccionada={estaSel || estaDescart}
                    onClick={() => {
                      if (necesitaDescarte) {
                        if (estaDescart) {
                          setDescartando(descartando.filter((x) => x !== c.id));
                        } else if (descartando.length < debeDescartar) {
                          setDescartando([...descartando, c.id]);
                        }
                      } else {
                        setSeleccionada(estaSel ? null : c.id);
                      }
                    }}
                  />
                </div>
              );
            })}
            {misManoCartas.length === 0 && (
              <div className="text-sm text-[var(--color-tinta-suave)] p-3">Mano vacía</div>
            )}
          </div>

          {cartaSel && !necesitaDescarte && (
            <OpcionesJugar
              carta={cartaSel}
              enTurno={enTurno}
              onPropiedad={() => jugarComoProp(cartaSel)}
              onDinero={() => jugarComoDinero(cartaSel)}
              onAccion={() => abrirAccion(cartaSel)}
              onCerrar={() => setSeleccionada(null)}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {overlayAccion && (
          <OverlayAccion
            carta={overlayAccion}
            sala={sala}
            jugadorId={jugadorId}
            onCerrar={() => setOverlayAccion(null)}
            onAccion={onAccion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Encabezado de otro jugador ───────────────────────────────────
function OtroJugador({
  jugador,
  esTurno,
}: {
  jugador: VistaPublica["jugadores"][number];
  esTurno: boolean;
}) {
  return (
    <div
      className={`shrink-0 min-w-[180px] rounded-xl border-2 p-2 bg-[var(--color-fondo-elev)] ${
        esTurno ? "border-amber-500 ring-2 ring-amber-500" : "border-[var(--color-borde)]"
      } ${!jugador.conectado ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-2xl">{jugador.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">
            {jugador.nombre}
            {!jugador.conectado && " 💤"}
          </div>
          <div className="text-[10px] text-[var(--color-tinta-suave)]">
            🖐️ {jugador.cantidadMano} · 💰 ${jugador.banco.valorTotal}M · ✅ {jugador.setsCompletos} sets
          </div>
        </div>
      </div>
      {/* Mini chips de mesa */}
      <div className="flex flex-wrap gap-1 mt-1">
        {jugador.mesa.map((s) => (
          <div
            key={s.color}
            className="text-[9px] font-mono px-1 py-0.5 rounded border border-black"
            style={{ background: COLORES[s.color].bg, color: COLORES[s.color].fg }}
          >
            {COLORES[s.color].emoji} {s.cartaIds.length}/{COLORES[s.color].cantidadSet}
            {s.casa ? " 🏠" : ""}
            {s.torre ? " 🏢" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mesa central ─────────────────────────────────────────────────
function MesaCentral({ sala }: { sala: VistaPublica }) {
  return (
    <Card className="p-3 flex items-center justify-around gap-3">
      <div className="flex flex-col items-center gap-1">
        <CartaReverso tamano="md" />
        <div className="text-[10px] font-mono">{sala.cantidadMazo} mazo</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        {sala.topeDescarte ? (
          <CartaUI carta={sala.topeDescarte} tamano="md" />
        ) : (
          <div className="w-24 h-36 rounded-xl border-[3px] border-dashed border-[var(--color-borde)]" />
        )}
        <div className="text-[10px] font-mono">{sala.cantidadDescarte} descarte</div>
      </div>
    </Card>
  );
}

// ─── Mi zona: propiedades + banco ─────────────────────────────────
function MiZona({ jugador }: { jugador: VistaPublica["jugadores"][number] }) {
  return (
    <div className="space-y-3">
      <Card className="p-3">
        <div className="text-[11px] uppercase tracking-widest font-bold text-[var(--color-tinta-suave)] mb-2">
          Mi mesa · {jugador.setsCompletos} sets completos
        </div>
        <div className="space-y-2">
          {jugador.mesa.length === 0 && (
            <div className="text-xs text-[var(--color-tinta-suave)]">Ninguna propiedad todavía.</div>
          )}
          {jugador.mesa.map((set) => (
            <div key={set.color} className="flex items-center gap-2">
              <div
                className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded border border-black"
                style={{ background: COLORES[set.color].bg, color: COLORES[set.color].fg }}
              >
                {COLORES[set.color].nombre} {set.cartaIds.length}/{COLORES[set.color].cantidadSet}
                {set.casa ? " 🏠" : ""}
                {set.torre ? " 🏢" : ""}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
            Mi banco
          </div>
          <div className="font-mono text-xl font-black">${jugador.banco.valorTotal}M</div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {jugador.banco.cartas.map((c) => (
            <div
              key={c.id}
              className="text-[11px] font-mono font-black px-2 py-1 rounded border-2 border-black bg-green-700 text-white"
            >
              ${c.valor}M
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Opciones al seleccionar carta ─────────────────────────────────
function OpcionesJugar({
  carta,
  enTurno,
  onPropiedad,
  onDinero,
  onAccion,
  onCerrar,
}: {
  carta: Carta;
  enTurno: boolean;
  onPropiedad: () => void;
  onDinero: () => void;
  onAccion: () => void;
  onCerrar: () => void;
}) {
  const esProp = carta.tipo === "propiedad" || carta.tipo === "bicolor" || carta.tipo === "arcoiris";
  const esAccion = carta.tipo === "accion" || carta.tipo === "casa" || carta.tipo === "torre";
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-wrap gap-2 items-center border-t border-[var(--color-borde)]/30 pt-2"
    >
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-tinta-suave)]">
        Con esta carta:
      </div>
      {esProp && (
        <Button tamano="sm" onClick={onPropiedad} disabled={!enTurno}>
          🏘️ A mi mesa
        </Button>
      )}
      {esAccion && (
        <Button tamano="sm" onClick={onAccion} disabled={!enTurno}>
          ⚡ Jugar efecto
        </Button>
      )}
      {!esProp && (
        <Button tamano="sm" variante="secundario" onClick={onDinero} disabled={!enTurno}>
          💵 Al banco (${carta.valor}M)
        </Button>
      )}
      <Button tamano="sm" variante="ghost" onClick={onCerrar}>
        Cancelar
      </Button>
    </motion.div>
  );
}
