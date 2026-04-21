"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConfigPartida, Dificultad, RondaDatos } from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { elegirAleatorio, generarId, seleccionarImpostorAleatorio } from "./utils";

export type Fase = "config" | "reparto" | "discusion" | "votacion" | "resultado";

type Jugador = { id: string; nombre: string };

type Estado = {
  jugadores: Jugador[];
  config: ConfigPartida;
  ronda: RondaDatos | null;
  fase: Fase;
  indiceReparto: number;
  finEn: number | null;
  votos: Record<string, string>;
  resultado: { ganaImpostor: boolean; impostorNombre: string } | null;
  agregarJugador: (nombre: string) => void;
  quitarJugador: (id: string) => void;
  renombrarJugador: (id: string, nombre: string) => void;
  reiniciarJugadores: () => void;
  setConfig: (parcial: Partial<ConfigPartida>) => void;
  iniciarPartida: () => void;
  avanzarReparto: () => void;
  empezarDiscusion: () => void;
  irAVotacion: () => void;
  registrarVoto: (votanteId: string, votadoId: string) => void;
  cerrarVotacion: () => void;
  reiniciarRonda: () => void;
  volverAConfig: () => void;
};

const CONFIG_DEFAULT: ConfigPartida = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  impostorCiego: false,
};

export const useJuegoLocal = create<Estado>()(
  persist(
    (set, get) => ({
      jugadores: [],
      config: CONFIG_DEFAULT,
      ronda: null,
      fase: "config",
      indiceReparto: 0,
      finEn: null,
      votos: {},
      resultado: null,

      agregarJugador: (nombre) => {
        const limpio = nombre.trim().slice(0, 20);
        if (!limpio) return;
        if (get().jugadores.length >= 10) return;
        set((s) => ({
          jugadores: [...s.jugadores, { id: generarId(), nombre: limpio }],
        }));
      },
      quitarJugador: (id) =>
        set((s) => ({ jugadores: s.jugadores.filter((j) => j.id !== id) })),
      renombrarJugador: (id, nombre) =>
        set((s) => ({
          jugadores: s.jugadores.map((j) =>
            j.id === id ? { ...j, nombre: nombre.slice(0, 20) } : j,
          ),
        })),
      reiniciarJugadores: () => set({ jugadores: [] }),

      setConfig: (parcial) => set((s) => ({ config: { ...s.config, ...parcial } })),

      iniciarPartida: () => {
        const { jugadores, config } = get();
        if (jugadores.length < 3) return;
        const cat = buscarCategoria(config.categoriaId);
        if (!cat) return;
        const dif: Dificultad = config.dificultad;
        const palabra = elegirAleatorio(cat.palabras[dif]);
        const impostor = jugadores[seleccionarImpostorAleatorio(jugadores.length)];
        set({
          ronda: {
            categoriaId: cat.id,
            categoriaNombre: cat.nombre,
            palabra,
            impostorId: impostor.id,
            impostorCiego: config.impostorCiego,
          },
          fase: "reparto",
          indiceReparto: 0,
          votos: {},
          resultado: null,
          finEn: null,
        });
      },

      avanzarReparto: () => {
        const { indiceReparto, jugadores } = get();
        if (indiceReparto + 1 >= jugadores.length) {
          set({ fase: "discusion", finEn: Date.now() + get().config.duracionSeg * 1000 });
        } else {
          set({ indiceReparto: indiceReparto + 1 });
        }
      },

      empezarDiscusion: () =>
        set((s) => ({
          fase: "discusion",
          finEn: Date.now() + s.config.duracionSeg * 1000,
        })),

      irAVotacion: () => set({ fase: "votacion", finEn: null }),

      registrarVoto: (votanteId, votadoId) =>
        set((s) => ({ votos: { ...s.votos, [votanteId]: votadoId } })),

      cerrarVotacion: () => {
        const { votos, jugadores, ronda } = get();
        if (!ronda) return;
        const conteo: Record<string, number> = {};
        for (const v of Object.values(votos)) conteo[v] = (conteo[v] || 0) + 1;
        let masVotado = "";
        let max = -1;
        for (const [id, n] of Object.entries(conteo)) {
          if (n > max) { max = n; masVotado = id; }
        }
        const impostor = jugadores.find((j) => j.id === ronda.impostorId);
        const civilesGanan = masVotado === ronda.impostorId;
        set({
          fase: "resultado",
          resultado: {
            ganaImpostor: !civilesGanan,
            impostorNombre: impostor?.nombre ?? "?",
          },
        });
      },

      reiniciarRonda: () => {
        get().iniciarPartida();
      },

      volverAConfig: () =>
        set({
          fase: "config",
          ronda: null,
          indiceReparto: 0,
          finEn: null,
          votos: {},
          resultado: null,
        }),
    }),
    {
      name: "juego-impostor-local",
      partialize: (s) => ({ jugadores: s.jugadores, config: s.config }),
    },
  ),
);
