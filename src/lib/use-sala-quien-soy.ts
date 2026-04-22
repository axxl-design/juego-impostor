"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerPusherCliente, pusherConfiguradoCliente } from "./pusher-client";
import type { ConfigQuienSoy } from "./types";

export type SalaQuienSoyPublica = {
  codigo: string;
  hostId: string;
  jugadores: { id: string; nombre: string; puntos: number; haVisto: boolean }[];
  config: ConfigQuienSoy;
  fase: "lobby" | "reparto" | "juego" | "fin";
  rondaActual: number;
  ultimaAdivinanza: {
    deId: string;
    deNombre: string;
    aId: string;
    aNombre: string;
    intento: string;
    palabraReal: string;
    acerto: boolean;
    ts: number;
  } | null;
  ganador: { tipo: "puntos" | "rondas" | "terminada"; ids: string[] } | null;
  categoriaNombre: string | null;
};

export type PalabraPrivada = {
  palabra: string | null;
  categoriaNombre: string | null;
} | null;

export function useSalaQuienSoy(codigo: string, jugadorId: string | null) {
  const [sala, setSala] = useState<SalaQuienSoyPublica | null>(null);
  const [palabra, setPalabra] = useState<PalabraPrivada>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const ultimaPalabraTs = useRef<number>(0);

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch(`/api/quien-soy/sala/${codigo}`, { cache: "no-store" });
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

  const refrescarPalabra = useCallback(async () => {
    if (!jugadorId) return;
    try {
      const r = await fetch(`/api/quien-soy/sala/${codigo}/palabra?jugadorId=${jugadorId}`, { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      setPalabra(j.palabra);
    } catch {}
  }, [codigo, jugadorId]);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  useEffect(() => {
    if (!sala || !jugadorId) return;
    if (sala.fase === "reparto" || sala.fase === "juego") {
      refrescarPalabra();
    }
    if (sala.fase === "lobby" || sala.fase === "fin") {
      setPalabra(null);
    }
  }, [sala?.fase, sala?.rondaActual, jugadorId, refrescarPalabra, sala]);

  useEffect(() => {
    if (pusherConfiguradoCliente()) {
      const p = obtenerPusherCliente();
      if (!p) return;
      const channel = p.subscribe(`quien-soy-${codigo}`);
      const handlerEstado = (publica: SalaQuienSoyPublica) => setSala(publica);
      const handlerPalabras = (data: { ts: number }) => {
        if (data.ts > ultimaPalabraTs.current) {
          ultimaPalabraTs.current = data.ts;
          refrescarPalabra();
        }
      };
      channel.bind("estado-actualizado", handlerEstado);
      channel.bind("palabras-asignadas", handlerPalabras);
      return () => {
        channel.unbind("estado-actualizado", handlerEstado);
        channel.unbind("palabras-asignadas", handlerPalabras);
        p.unsubscribe(`quien-soy-${codigo}`);
      };
    }
    const id = setInterval(refrescar, 2000);
    return () => clearInterval(id);
  }, [codigo, refrescar, refrescarPalabra]);

  const accion = useCallback(
    async (cuerpo: Record<string, unknown>) => {
      const r = await fetch(`/api/quien-soy/sala/${codigo}/accion`, {
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

  return { sala, palabra, error, cargando, accion, refrescar, refrescarPalabra };
}

export function obtenerJugadorIdQS(codigo: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`vanny.quien-soy.jugadorId.${codigo}`);
}
export function guardarJugadorIdQS(codigo: string, id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`vanny.quien-soy.jugadorId.${codigo}`, id);
}
export function olvidarJugadorIdQS(codigo: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`vanny.quien-soy.jugadorId.${codigo}`);
}
