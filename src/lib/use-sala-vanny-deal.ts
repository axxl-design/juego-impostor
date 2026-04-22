"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerPusherCliente, pusherConfiguradoCliente } from "./pusher-client";
import type { VistaPublica, VistaPrivada } from "./vanny-deal/types";
import type { AccionCliente } from "./sala-store-vanny-deal";

function nuevoActionId(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

export function useSalaVannyDeal(codigo: string, jugadorId: string | null) {
  const [sala, setSala] = useState<VistaPublica | null>(null);
  const [mano, setMano] = useState<VistaPrivada | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const ultimaTs = useRef<number>(0);

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch(`/api/vanny-deal/sala/${codigo}`, { cache: "no-store" });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error ?? "No se pudo cargar la sala");
        return;
      }
      const j = await r.json();
      setSala(j.sala);
      setError(null);
    } finally {
      setCargando(false);
    }
  }, [codigo]);

  const refrescarMano = useCallback(async () => {
    if (!jugadorId) return;
    try {
      const r = await fetch(
        `/api/vanny-deal/sala/${codigo}/mano?jugadorId=${jugadorId}`,
        { cache: "no-store" },
      );
      if (!r.ok) return;
      const j = await r.json();
      setMano(j.mano);
    } catch {}
  }, [codigo, jugadorId]);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  useEffect(() => {
    if (!sala || !jugadorId) return;
    if (sala.fase !== "lobby") refrescarMano();
    else setMano(null);
  }, [sala?.fase, sala?.turnoIdx, sala?.cartasJugadasEnTurno, jugadorId, refrescarMano, sala]);

  useEffect(() => {
    if (pusherConfiguradoCliente()) {
      const p = obtenerPusherCliente();
      if (!p) return;
      const canal = p.subscribe(`vanny-deal-${codigo}`);
      const onAny = (data: { sala: VistaPublica; ts: number }) => {
        if (data.ts <= ultimaTs.current) return;
        ultimaTs.current = data.ts;
        setSala(data.sala);
        refrescarMano();
      };
      const eventos = [
        "deal:jugador-entra",
        "deal:jugador-sale",
        "deal:partida-empieza",
        "deal:partida-termina",
        "deal:turno-cambia",
        "deal:carta-jugada",
        "deal:carta-especial-usada",
        "deal:propiedad-movida",
        "deal:pago-iniciado",
        "deal:pago-completado",
        "deal:no-gracias-ofrecida",
        "deal:juicio-popular-iniciado",
        "deal:voto-emitido",
        "deal:cambio",
      ];
      for (const e of eventos) canal.bind(e, onAny);
      return () => {
        for (const e of eventos) canal.unbind(e, onAny);
        p.unsubscribe(`vanny-deal-${codigo}`);
      };
    }
    const id = setInterval(refrescar, 1500);
    return () => clearInterval(id);
  }, [codigo, refrescar, refrescarMano]);

  // Tick local para que los timers se actualicen (NG, espionaje, juicio, tiempo)
  useEffect(() => {
    if (!sala) return;
    if (sala.fase === "fin" || sala.fase === "lobby") return;
    const id = setInterval(() => {
      refrescar();
    }, 2000);
    return () => clearInterval(id);
  }, [sala?.fase, refrescar, sala]);

  const accion = useCallback(
    async (accion: AccionCliente): Promise<{ ok: boolean; error?: string; sala?: VistaPublica; datos?: unknown }> => {
      try {
        const r = await fetch(`/api/vanny-deal/sala/${codigo}/accion`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ actionId: nuevoActionId(), accion }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return { ok: false, error: j.error ?? "Error" };
        if (j.sala) setSala(j.sala);
        return { ok: true, sala: j.sala, datos: j.datos };
      } catch (e) {
        return { ok: false, error: (e as Error).message };
      }
    },
    [codigo],
  );

  return { sala, mano, error, cargando, accion, refrescar, refrescarMano };
}

const PREFIJO = "vanny.deal.jugadorId.";
export function obtenerJugadorIdDeal(codigo: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PREFIJO + codigo);
}
export function guardarJugadorIdDeal(codigo: string, id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIJO + codigo, id);
}
export function olvidarJugadorIdDeal(codigo: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIJO + codigo);
}
