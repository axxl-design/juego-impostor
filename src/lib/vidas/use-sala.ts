"use client";

import { useCallback, useEffect, useState } from "react";
import { obtenerPusherCliente, pusherConfiguradoCliente } from "../pusher-client";
import type { EstadoSalaOnline } from "./types";

export function useSalaVidas(codigo: string) {
  const [sala, setSala] = useState<EstadoSalaOnline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch(`/api/vidas/sala/${codigo}`, { cache: "no-store" });
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

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  useEffect(() => {
    if (pusherConfiguradoCliente()) {
      const p = obtenerPusherCliente();
      if (!p) return;
      const channel = p.subscribe(`vidas-${codigo}`);
      const handler = (publica: EstadoSalaOnline) => setSala(publica);
      channel.bind("estado-actualizado", handler);
      return () => {
        channel.unbind("estado-actualizado", handler);
        p.unsubscribe(`vidas-${codigo}`);
      };
    }
    const id = setInterval(refrescar, 2500);
    return () => clearInterval(id);
  }, [codigo, refrescar]);

  const accion = useCallback(
    async (cuerpo: Record<string, unknown>) => {
      const r = await fetch(`/api/vidas/sala/${codigo}/accion`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? "Error");
      if (j.sala) setSala(j.sala);
      return j;
    },
    [codigo],
  );

  const generarIA = useCallback(
    async (jugadorId: string) => {
      const r = await fetch(`/api/vidas/sala/${codigo}/generar`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jugadorId }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? "Error IA");
      if (j.sala) setSala(j.sala);
      return j;
    },
    [codigo],
  );

  return { sala, error, cargando, accion, refrescar, generarIA };
}

export function obtenerJugadorIdVidas(codigo: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`vanny.vidas.jugadorId.${codigo}`);
}

export function guardarJugadorIdVidas(codigo: string, id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`vanny.vidas.jugadorId.${codigo}`, id);
}

export function olvidarJugadorIdVidas(codigo: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`vanny.vidas.jugadorId.${codigo}`);
}
