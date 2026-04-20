"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerPusherCliente, pusherConfiguradoCliente } from "./pusher-client";
import type { ConfigPartida } from "./types";

export type SalaPublica = {
  codigo: string;
  hostId: string;
  jugadores: { id: string; nombre: string }[];
  config: ConfigPartida;
  fase: "lobby" | "reparto" | "discusion" | "votacion" | "resultado";
  finEn: number | null;
  votosCount: number;
  votosPor: Record<string, string>;
  resultado: { ganaImpostor: boolean; impostorId: string; impostorNombre: string } | null;
  categoriaNombre: string | null;
};

export type RolPrivado = {
  esImpostor: boolean;
  palabra: string | null;
  categoriaNombre: string | null;
  impostorCiego: boolean;
} | null;

export function useSala(codigo: string, jugadorId: string | null) {
  const [sala, setSala] = useState<SalaPublica | null>(null);
  const [rol, setRol] = useState<RolPrivado>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const faseAnterior = useRef<string | null>(null);

  const refrescar = useCallback(async () => {
    try {
      const r = await fetch(`/api/sala/${codigo}`, { cache: "no-store" });
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

  const refrescarRol = useCallback(async () => {
    if (!jugadorId) return;
    try {
      const r = await fetch(`/api/sala/${codigo}/rol?jugadorId=${jugadorId}`, { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      setRol(j.rol);
    } catch {}
  }, [codigo, jugadorId]);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  useEffect(() => {
    if (!sala) return;
    const fase = sala.fase;
    if (fase !== faseAnterior.current) {
      faseAnterior.current = fase;
      if ((fase === "discusion" || fase === "votacion" || fase === "resultado") && jugadorId) {
        refrescarRol();
      }
      if (fase === "lobby") setRol(null);
    }
  }, [sala, jugadorId, refrescarRol]);

  useEffect(() => {
    if (pusherConfiguradoCliente()) {
      const p = obtenerPusherCliente();
      if (!p) return;
      const channel = p.subscribe(`sala-${codigo}`);
      const handler = (publica: SalaPublica) => setSala(publica);
      channel.bind("estado-actualizado", handler);
      return () => {
        channel.unbind("estado-actualizado", handler);
        p.unsubscribe(`sala-${codigo}`);
      };
    }
    const id = setInterval(refrescar, 2500);
    return () => clearInterval(id);
  }, [codigo, refrescar]);

  const accion = useCallback(
    async (cuerpo: Record<string, unknown>) => {
      const r = await fetch(`/api/sala/${codigo}/accion`, {
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

  return { sala, rol, error, cargando, accion, refrescar, refrescarRol };
}

export function obtenerNombreGuardado(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("impostor.nombre") ?? "";
}
export function guardarNombre(nombre: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("impostor.nombre", nombre.trim().slice(0, 20));
}
export function obtenerJugadorId(codigo: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`impostor.jugadorId.${codigo}`);
}
export function guardarJugadorId(codigo: string, id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`impostor.jugadorId.${codigo}`, id);
}
export function olvidarJugadorId(codigo: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`impostor.jugadorId.${codigo}`);
}
