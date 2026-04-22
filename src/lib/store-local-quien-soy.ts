"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConfigQuienSoy, JugadorQuienSoy, ReglasExtraQuienSoy } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { esMismaPalabra, generarId, mezclar } from "./utils";
import { generarPista } from "./pistas";

export type FaseQS = "config" | "reparto" | "juego" | "fin";

export type ConfigQS = ConfigQuienSoy & { reglasExtra: ReglasExtraQuienSoy };

type Estado = {
  jugadores: JugadorQuienSoy[];
  config: ConfigQS;
  fase: FaseQS;
  rondaActual: number;
  indiceReparto: number;
  pistasUsadas: Record<string, number>;
  ultimaAdivinanza: {
    deId: string;
    deNombre: string;
    aId: string;
    aNombre: string;
    intento: string;
    palabraReal: string;
    acerto: boolean;
    escudoUsado?: boolean;
  } | null;
  ganador: { tipo: "puntos" | "rondas" | "terminada"; ids: string[] } | null;
  ganadorPendiente: { tipo: "puntos" | "rondas"; ids: string[] } | null;
  agregarJugador: (nombre: string) => void;
  quitarJugador: (id: string) => void;
  reiniciarJugadores: () => void;
  setConfig: (parcial: Partial<ConfigQS>) => void;
  setReglasExtra: (parcial: Partial<ReglasExtraQuienSoy>) => void;
  iniciarPartida: () => void;
  marcarVisto: (id: string) => void;
  avanzarReparto: () => void;
  intentarAdivinanza: (deId: string, aId: string, intento: string) => "acierto" | "fallo" | "fin";
  pedirPista: (jugadorId: string) => { texto: string } | null;
  comprarEscudo: (jugadorId: string) => boolean;
  terminarPartida: () => void;
  jugarOtraVez: () => void;
  volverAConfig: () => void;
  limpiarUltimaAdivinanza: () => void;
  siguienteRonda: () => void;
};

const REGLAS_DEFAULT: ReglasExtraQuienSoy = {
  pistasActivas: false,
  escudoComprable: false,
};

const CONFIG_DEFAULT: ConfigQS = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  modoVictoria: "puntos",
  objetivo: 5,
  reglasExtra: { ...REGLAS_DEFAULT },
};

function asignarPalabras(jugadores: JugadorQuienSoy[], categoriaId: string, dificultad: ConfigQuienSoy["dificultad"]) {
  const cat = buscarCategoria(categoriaId);
  if (!cat) return jugadores;
  const pool = mezclar([...cat.palabras[dificultad]]);
  return jugadores.map((j, i) => ({
    ...j,
    palabra: pool[i % pool.length],
    haVisto: false,
    escudo: false,
  }));
}

function nuevaPalabra(usadas: string[], categoriaId: string, dificultad: ConfigQuienSoy["dificultad"]): string {
  const cat = buscarCategoria(categoriaId);
  if (!cat) return "";
  const pool = cat.palabras[dificultad].filter((p) => !usadas.includes(p));
  const fuente = pool.length > 0 ? pool : cat.palabras[dificultad];
  return fuente[Math.floor(Math.random() * fuente.length)];
}

export const useJuegoQuienSoyLocal = create<Estado>()(
  persist(
    (set, get) => ({
      jugadores: [],
      config: CONFIG_DEFAULT,
      fase: "config",
      rondaActual: 0,
      indiceReparto: 0,
      pistasUsadas: {},
      ultimaAdivinanza: null,
      ganador: null,
      ganadorPendiente: null,

      agregarJugador: (nombre) => {
        const limpio = nombre.trim().slice(0, 20);
        if (!limpio) return;
        if (get().jugadores.length >= 6) return;
        set((s) => ({
          jugadores: [
            ...s.jugadores,
            { id: generarId(), nombre: limpio, palabra: "", puntos: 0, haVisto: false, escudo: false },
          ],
        }));
      },
      quitarJugador: (id) =>
        set((s) => ({ jugadores: s.jugadores.filter((j) => j.id !== id) })),
      reiniciarJugadores: () => set({ jugadores: [] }),

      setConfig: (parcial) =>
        set((s) => {
          const next = { ...s.config, ...parcial };
          if (parcial.reglasExtra) next.reglasExtra = { ...s.config.reglasExtra, ...parcial.reglasExtra };
          return { config: next };
        }),
      setReglasExtra: (parcial) =>
        set((s) => ({ config: { ...s.config, reglasExtra: { ...s.config.reglasExtra, ...parcial } } })),

      iniciarPartida: () => {
        const { jugadores, config } = get();
        if (jugadores.length < 2 || jugadores.length > 6) return;
        const conPalabras = asignarPalabras(
          jugadores.map((j) => ({ ...j, puntos: 0, escudo: false })),
          config.categoriaId,
          config.dificultad,
        );
        set({
          jugadores: conPalabras,
          fase: "reparto",
          rondaActual: 1,
          indiceReparto: 0,
          pistasUsadas: {},
          ultimaAdivinanza: null,
          ganador: null,
          ganadorPendiente: null,
        });
      },

      marcarVisto: (id) =>
        set((s) => ({
          jugadores: s.jugadores.map((j) => (j.id === id ? { ...j, haVisto: true } : j)),
        })),

      avanzarReparto: () => {
        const { indiceReparto, jugadores } = get();
        if (indiceReparto + 1 >= jugadores.length) {
          set({ fase: "juego" });
        } else {
          set({ indiceReparto: indiceReparto + 1 });
        }
      },

      pedirPista: (jugadorId) => {
        const { jugadores, pistasUsadas, config } = get();
        if (!config.reglasExtra.pistasActivas) return null;
        const j = jugadores.find((x) => x.id === jugadorId);
        if (!j) return null;
        const usadas = pistasUsadas[jugadorId] ?? 0;
        if (usadas >= 3) return null;
        if (j.puntos <= 0) return null;
        const nivel = (usadas + 1) as 1 | 2 | 3;
        const cat = buscarCategoria(config.categoriaId);
        const catNombre = cat?.nombre ?? "";
        const pista = generarPista(j.palabra, catNombre, nivel);
        set({
          jugadores: jugadores.map((x) => (x.id === jugadorId ? { ...x, puntos: x.puntos - 1 } : x)),
          pistasUsadas: { ...pistasUsadas, [jugadorId]: usadas + 1 },
        });
        return { texto: pista.texto };
      },

      comprarEscudo: (jugadorId) => {
        const { jugadores, config } = get();
        if (!config.reglasExtra.escudoComprable) return false;
        const j = jugadores.find((x) => x.id === jugadorId);
        if (!j) return false;
        if (j.escudo) return false;
        if (j.puntos < 5) return false;
        set({
          jugadores: jugadores.map((x) =>
            x.id === jugadorId ? { ...x, puntos: x.puntos - 2, escudo: true } : x,
          ),
        });
        return true;
      },

      intentarAdivinanza: (deId, aId, intento) => {
        const { jugadores, config, rondaActual } = get();
        const de = jugadores.find((j) => j.id === deId);
        const a = jugadores.find((j) => j.id === aId);
        if (!de || !a || de.id === a.id) return "fallo";
        const acerto = esMismaPalabra(intento, a.palabra);
        const palabraReal = a.palabra;

        if (acerto) {
          const usadas = jugadores.map((j) => j.palabra);
          const nuevasA = nuevaPalabra(usadas, config.categoriaId, config.dificultad);
          const usadas2 = [...usadas.filter((p) => p !== a.palabra), nuevasA];
          const nuevasDe = nuevaPalabra(usadas2, config.categoriaId, config.dificultad);
          const nuevos = jugadores.map((j) => {
            if (j.id === deId) return { ...j, puntos: j.puntos + 1, palabra: nuevasDe };
            if (j.id === aId) return { ...j, palabra: nuevasA };
            return j;
          });
          const ganador = nuevos.find((j) => j.id === deId);
          set({
            jugadores: nuevos,
            ultimaAdivinanza: {
              deId,
              deNombre: de.nombre,
              aId,
              aNombre: a.nombre,
              intento,
              palabraReal,
              acerto: true,
            },
          });
          if (config.modoVictoria === "puntos" && ganador && ganador.puntos >= config.objetivo) {
            set({ ganadorPendiente: { tipo: "puntos", ids: [deId] } });
            return "fin";
          }
          if (config.modoVictoria === "rondas" && rondaActual >= config.objetivo) {
            const max = Math.max(...nuevos.map((j) => j.puntos));
            const ganadores = nuevos.filter((j) => j.puntos === max).map((j) => j.id);
            set({ ganadorPendiente: { tipo: "rondas", ids: ganadores } });
            return "fin";
          }
          return "acierto";
        } else {
          const escudoActivo = de.escudo === true;
          const nuevos = jugadores.map((j) => {
            if (j.id !== deId) return j;
            if (escudoActivo) return { ...j, escudo: false };
            return { ...j, puntos: Math.max(0, j.puntos - 1) };
          });
          set({
            jugadores: nuevos,
            ultimaAdivinanza: {
              deId,
              deNombre: de.nombre,
              aId,
              aNombre: a.nombre,
              intento,
              palabraReal,
              acerto: false,
              escudoUsado: escudoActivo,
            },
          });
          return "fallo";
        }
      },

      terminarPartida: () => {
        const { jugadores } = get();
        const max = Math.max(0, ...jugadores.map((j) => j.puntos));
        const ganadores = jugadores.filter((j) => j.puntos === max).map((j) => j.id);
        set({ fase: "fin", ganador: { tipo: "terminada", ids: ganadores }, ganadorPendiente: null, ultimaAdivinanza: null });
      },

      siguienteRonda: () => {
        const { ganadorPendiente, ultimaAdivinanza, rondaActual } = get();
        if (!ultimaAdivinanza) return;
        if (ganadorPendiente) {
          set({
            fase: "fin",
            ganador: ganadorPendiente,
            ganadorPendiente: null,
            ultimaAdivinanza: null,
          });
          return;
        }
        if (ultimaAdivinanza.acerto) {
          set({ rondaActual: rondaActual + 1, ultimaAdivinanza: null });
        } else {
          set({ ultimaAdivinanza: null });
        }
      },

      jugarOtraVez: () => {
        const { jugadores, config } = get();
        const reseteados = jugadores.map((j) => ({ ...j, puntos: 0, haVisto: false, escudo: false }));
        const conPalabras = asignarPalabras(reseteados, config.categoriaId, config.dificultad);
        set({
          jugadores: conPalabras,
          fase: "reparto",
          rondaActual: 1,
          indiceReparto: 0,
          pistasUsadas: {},
          ultimaAdivinanza: null,
          ganador: null,
          ganadorPendiente: null,
        });
      },

      volverAConfig: () =>
        set({
          fase: "config",
          rondaActual: 0,
          indiceReparto: 0,
          pistasUsadas: {},
          ultimaAdivinanza: null,
          ganador: null,
          ganadorPendiente: null,
        }),

      limpiarUltimaAdivinanza: () => set({ ultimaAdivinanza: null }),
    }),
    {
      name: "vanny-quien-soy-local",
      partialize: (s) => ({
        jugadores: s.jugadores.map((j) => ({ ...j, palabra: "", puntos: 0, haVisto: false, escudo: false })),
        config: s.config,
      }),
    },
  ),
);
