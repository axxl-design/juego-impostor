"use client";

import type { EstadoJugador, EstadoPartidaLocal, MundoId } from "./types";
import { buscarMundo, buscarRol } from "./mundos";
import { etapaPorEdad, EDAD_MIN_JUVENTUD } from "./motor";

const CLAVE_INDEX = "vanny.vidas.saves";

export type MetaSave = {
  saveId: string;
  nombre: string;
  mundo: MundoId;
  mundoNombre: string;
  rol: string;
  rolNombre: string;
  edad: number;
  etapa: string;
  actualizadoEn: number;
  vivo: boolean;
};

function claveSave(saveId: string): string {
  return `vanny.vidas.save.${saveId}`;
}

export function generarSaveId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

export function listarSaves(): MetaSave[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CLAVE_INDEX);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as MetaSave[];
    return arr.sort((a, b) => b.actualizadoEn - a.actualizadoEn);
  } catch {
    return [];
  }
}

export function guardarIndice(lista: MetaSave[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAVE_INDEX, JSON.stringify(lista));
}

export function actualizarMeta(estado: EstadoPartidaLocal) {
  const mundoDef = buscarMundo(estado.mundo);
  const rolDef = buscarRol(estado.mundo, estado.jugador.rol);
  const meta: MetaSave = {
    saveId: estado.saveId,
    nombre: estado.jugador.nombre,
    mundo: estado.mundo,
    mundoNombre: mundoDef?.nombre ?? estado.mundo,
    rol: estado.jugador.rol,
    rolNombre: rolDef?.nombre ?? estado.jugador.rol,
    edad: estado.jugador.edad,
    etapa: estado.jugador.etapa,
    actualizadoEn: estado.actualizadoEn,
    vivo: estado.jugador.vivo,
  };
  const lista = listarSaves().filter((m) => m.saveId !== meta.saveId);
  lista.unshift(meta);
  guardarIndice(lista);
}

export function cargarSave(saveId: string): EstadoPartidaLocal | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(claveSave(saveId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EstadoPartidaLocal;
  } catch {
    return null;
  }
}

export function guardarSave(estado: EstadoPartidaLocal) {
  if (typeof window === "undefined") return;
  estado.actualizadoEn = Date.now();
  window.localStorage.setItem(claveSave(estado.saveId), JSON.stringify(estado));
  actualizarMeta(estado);
}

export function eliminarSave(saveId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(claveSave(saveId));
  const lista = listarSaves().filter((m) => m.saveId !== saveId);
  guardarIndice(lista);
}

export function crearJugador(
  nombre: string,
  mundo: MundoId,
  rolId: string,
  poderSubtipo?: EstadoJugador["poderSubtipo"],
): EstadoJugador {
  const rolDef = buscarRol(mundo, rolId);
  const edad = EDAD_MIN_JUVENTUD;
  return {
    id: generarSaveId(),
    nombre: nombre.trim().slice(0, 20) || "Anónimo",
    mundo,
    rol: rolId,
    poderSubtipo,
    edad,
    etapa: etapaPorEdad(edad),
    stats: {
      karma: rolDef?.statsIniciales.karma ?? 0,
      influencia: rolDef?.statsIniciales.influencia ?? 10,
      riqueza: rolDef?.statsIniciales.riqueza ?? 10,
      salud: rolDef?.statsIniciales.salud ?? 80,
      nivelPoder: mundo === "poderes" ? 10 : 0,
    },
    rango: rolDef?.rangoInicial ?? "Anónimo",
    historial: [],
    cartasUsadas: [],
    desbloqueadas: [],
    vivo: true,
  };
}

export function crearPartidaNueva(
  nombre: string,
  mundo: MundoId,
  rolId: string,
  poderSubtipo?: EstadoJugador["poderSubtipo"],
): EstadoPartidaLocal {
  const saveId = generarSaveId();
  const jugador = crearJugador(nombre, mundo, rolId, poderSubtipo);
  const ahora = Date.now();
  return {
    saveId,
    version: 1,
    creadoEn: ahora,
    actualizadoEn: ahora,
    jugador,
    mundo,
    fase: "juego",
    cartaActualId: null,
    usosIAGeneracion: 0,
  };
}
