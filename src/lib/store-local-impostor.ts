"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ConfigPartida,
  Dificultad,
  PistaImpostor,
  PoderJugador,
  PoderTipo,
  ReglasExtraImpostor,
  RondaDatos,
} from "./types";
import { buscarCategoria, CATEGORIAS } from "./palabras";
import { elegirAleatorio, esMismaPalabra, generarId, mezclar, seleccionarImpostorAleatorio } from "./utils";
import { generarContextoCivil, generarPista } from "./pistas";

export type Fase = "config" | "reparto" | "discusion" | "votacion" | "resultado";

type Jugador = { id: string; nombre: string; puntos: number };

const PUNTOS = {
  civilCorrecto: 3,
  impostorSobrevive: 5,
  impostorAdivina: 7,
  victima: 1,
};

const PODERES_DISPONIBLES: PoderTipo[] = ["vidente", "escudo", "dobleAgente", "traductor"];

type Estado = {
  jugadores: Jugador[];
  config: ConfigPartida;
  ronda: RondaDatos | null;
  fase: Fase;
  indiceReparto: number;
  finEn: number | null;
  votos: Record<string, string>;
  rondasJugadas: number;
  resultado: {
    ganaImpostor: boolean;
    impostorNombre: string;
    porAdivinanza?: boolean;
    palabraIntento?: string;
    impostoresExtra?: { id: string; nombre: string }[];
    esJefeFinal?: boolean;
    cambiosPuntaje?: { id: string; nombre: string; delta: number; total: number }[];
  } | null;
  agregarJugador: (nombre: string) => void;
  quitarJugador: (id: string) => void;
  renombrarJugador: (id: string, nombre: string) => void;
  reiniciarJugadores: () => void;
  setConfig: (parcial: Partial<ConfigPartida>) => void;
  setReglasExtra: (parcial: Partial<ReglasExtraImpostor>) => void;
  iniciarPartida: () => void;
  avanzarReparto: () => void;
  empezarDiscusion: () => void;
  irAVotacion: () => void;
  registrarVoto: (votanteId: string, votadoId: string) => void;
  cerrarVotacion: () => void;
  pedirPistaImpostor: (jugadorId: string) => PistaImpostor | null;
  pedirContextoCivil: () => string | null;
  usarPoderVidente: (jugadorId: string) => { observadoNombre: string; votadoNombre: string } | null;
  activarDobleAgente: (jugadorId: string, acusadoId: string) => void;
  intentarAdivinanzaImpostor: (jugadorId: string, intento: string) => "acierto" | "fallo" | "no-eras-el-impostor";
  reiniciarRonda: () => void;
  resetearPuntajes: () => void;
  volverAConfig: () => void;
};

const REGLAS_DEFAULT: ReglasExtraImpostor = {
  pistasActivas: false,
  puntajePersistente: false,
  roboPuntos: false,
  poderesAleatorios: false,
  preguntasSugeridas: false,
  jefeFinal: false,
};

const CONFIG_DEFAULT: ConfigPartida = {
  categoriaId: CATEGORIAS[0].id,
  dificultad: "facil",
  duracionSeg: 5 * 60,
  reglasExtra: { ...REGLAS_DEFAULT },
};

function repartirPoderes(
  jugadoresIds: string[],
  impostorIds: string[],
  palabraReal: string,
  poolPalabrasFalsas: string[],
): PoderJugador[] {
  if (jugadoresIds.length < 3) return [];
  const cuantos = Math.random() < 0.5 ? 1 : 2;
  const candidatos = mezclar(jugadoresIds);
  const elegidos = candidatos.slice(0, Math.min(cuantos, candidatos.length));
  const poderesMezclados = mezclar([...PODERES_DISPONIBLES]);
  const lista: PoderJugador[] = [];
  elegidos.forEach((id, i) => {
    const tipo = poderesMezclados[i % poderesMezclados.length];
    const poder: PoderJugador = { jugadorId: id, tipo };
    if (tipo === "vidente") {
      const otros = jugadoresIds.filter((x) => x !== id);
      poder.datos = { observadoId: elegirAleatorio(otros) };
    } else if (tipo === "traductor") {
      const opcionesFalsas = poolPalabrasFalsas.filter((p) => p !== palabraReal);
      poder.datos = { palabraFalsa: opcionesFalsas.length > 0 ? elegirAleatorio(opcionesFalsas) : palabraReal };
    }
    // dobleAgente solo es útil si es impostor; lo mantenemos pero se activará en UI
    void impostorIds;
    lista.push(poder);
  });
  return lista;
}

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
      rondasJugadas: 0,
      resultado: null,

      agregarJugador: (nombre) => {
        const limpio = nombre.trim().slice(0, 20);
        if (!limpio) return;
        if (get().jugadores.length >= 10) return;
        set((s) => ({
          jugadores: [...s.jugadores, { id: generarId(), nombre: limpio, puntos: 0 }],
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
      setReglasExtra: (parcial) =>
        set((s) => {
          const reglas = { ...s.config.reglasExtra, ...parcial };
          if (!reglas.puntajePersistente) {
            reglas.roboPuntos = false;
            reglas.jefeFinal = false;
          }
          return { config: { ...s.config, reglasExtra: reglas } };
        }),

      iniciarPartida: () => {
        const { jugadores, config, rondasJugadas } = get();
        if (jugadores.length < 3) return;
        const reglas = config.reglasExtra;
        const esJefeFinal = reglas.jefeFinal && reglas.puntajePersistente && rondasJugadas > 0 && rondasJugadas % 5 === 0;
        const categoriaId = esJefeFinal ? "mezcla" : config.categoriaId;
        const cat = buscarCategoria(categoriaId) ?? buscarCategoria(config.categoriaId);
        if (!cat) return;
        const dif: Dificultad = config.dificultad;
        const palabra = elegirAleatorio(cat.palabras[dif]);
        const impostor = jugadores[seleccionarImpostorAleatorio(jugadores.length)];
        let impostoresExtra: string[] = [];
        if (esJefeFinal && jugadores.length >= 4) {
          const otros = jugadores.filter((j) => j.id !== impostor.id);
          const segundo = otros[seleccionarImpostorAleatorio(otros.length)];
          impostoresExtra = [segundo.id];
        }
        const impostoresAll = [impostor.id, ...impostoresExtra];
        const idsJugadores = jugadores.map((j) => j.id);
        const poderes = reglas.poderesAleatorios
          ? repartirPoderes(idsJugadores, impostoresAll, palabra, cat.palabras[dif])
          : [];
        const contextoCivilTexto = reglas.pistasActivas
          ? generarContextoCivil(palabra, cat.nombre, dif)
          : undefined;
        const ronda: RondaDatos = {
          categoriaId: cat.id,
          categoriaNombre: cat.nombre,
          palabra,
          impostorId: impostor.id,
          impostoresExtra: impostoresExtra.length > 0 ? impostoresExtra : undefined,
          esJefeFinal: esJefeFinal || undefined,
          pistasPedidas: [],
          contextoCivilUsado: false,
          contextoCivilTexto,
          poderes: poderes.length > 0 ? poderes : undefined,
        };
        set({
          ronda,
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

      pedirPistaImpostor: (jugadorId) => {
        const { ronda, config } = get();
        if (!ronda || !config.reglasExtra.pistasActivas) return null;
        const esImpostor = jugadorId === ronda.impostorId || (ronda.impostoresExtra ?? []).includes(jugadorId);
        if (!esImpostor) return null;
        const pistas = ronda.pistasPedidas ?? [];
        if (pistas.length >= 3) return null;
        const nivel = (pistas.length + 1) as 1 | 2 | 3;
        const nueva = generarPista(ronda.palabra, ronda.categoriaNombre, nivel);
        set({ ronda: { ...ronda, pistasPedidas: [...pistas, nueva] } });
        // Descuento de 1 punto si puntajePersistente activo
        if (config.reglasExtra.puntajePersistente) {
          set((s) => ({
            jugadores: s.jugadores.map((j) =>
              j.id === jugadorId ? { ...j, puntos: j.puntos - 1 } : j,
            ),
          }));
        }
        return nueva;
      },

      pedirContextoCivil: () => {
        const { ronda, config } = get();
        if (!ronda || !config.reglasExtra.pistasActivas) return null;
        if (ronda.contextoCivilUsado) return null;
        const texto = ronda.contextoCivilTexto ?? generarContextoCivil(ronda.palabra, ronda.categoriaNombre, config.dificultad);
        set({ ronda: { ...ronda, contextoCivilUsado: true, contextoCivilTexto: texto } });
        return texto;
      },

      usarPoderVidente: (jugadorId) => {
        const { ronda, votos, jugadores } = get();
        if (!ronda?.poderes) return null;
        const poder = ronda.poderes.find((p) => p.jugadorId === jugadorId && p.tipo === "vidente");
        if (!poder) return null;
        const observadoId = poder.datos?.observadoId;
        if (!observadoId) return null;
        const observado = jugadores.find((j) => j.id === observadoId);
        const votadoId = votos[observadoId];
        const votado = votadoId ? jugadores.find((j) => j.id === votadoId) : null;
        return {
          observadoNombre: observado?.nombre ?? "?",
          votadoNombre: votado?.nombre ?? "Todavía no votó",
        };
      },

      activarDobleAgente: (jugadorId, acusadoId) => {
        const { ronda } = get();
        if (!ronda?.poderes) return;
        const poderes = ronda.poderes.map((p) =>
          p.jugadorId === jugadorId && p.tipo === "dobleAgente"
            ? { ...p, datos: { ...p.datos, acusadoId }, usado: true }
            : p,
        );
        set({ ronda: { ...ronda, poderes } });
      },

      cerrarVotacion: () => {
        const { votos, jugadores, ronda, config, rondasJugadas } = get();
        if (!ronda) return;
        const conteoReal: Record<string, number> = {};
        const conteoAjustado: Record<string, number> = {};
        for (const [votanteId, votadoId] of Object.entries(votos)) {
          void votanteId;
          conteoReal[votadoId] = (conteoReal[votadoId] || 0) + 1;
          const tieneEscudo = ronda.poderes?.some(
            (p) => p.jugadorId === votadoId && p.tipo === "escudo",
          );
          const peso = tieneEscudo ? 0.5 : 1;
          conteoAjustado[votadoId] = (conteoAjustado[votadoId] || 0) + peso;
        }
        let masVotado = "";
        let max = -1;
        for (const [id, n] of Object.entries(conteoAjustado)) {
          if (n > max) {
            max = n;
            masVotado = id;
          }
        }
        const impostores = [ronda.impostorId, ...(ronda.impostoresExtra ?? [])];
        const civilesGanan = impostores.includes(masVotado);
        const impostorPrincipal = jugadores.find((j) => j.id === ronda.impostorId);
        const impostoresExtraInfo = (ronda.impostoresExtra ?? [])
          .map((id) => jugadores.find((j) => j.id === id))
          .filter((j): j is Jugador => !!j)
          .map((j) => ({ id: j.id, nombre: j.nombre }));

        // Aplicar puntajes si está activo
        const cambios: { id: string; nombre: string; delta: number; total: number }[] = [];
        let jugadoresNuevos = jugadores;
        if (config.reglasExtra.puntajePersistente) {
          const multiplicador = ronda.esJefeFinal ? 2 : 1;
          const deltas: Record<string, number> = {};
          if (civilesGanan) {
            // Civiles que votaron a un impostor ganan
            for (const [votanteId, votadoId] of Object.entries(votos)) {
              if (impostores.includes(votadoId) && !impostores.includes(votanteId)) {
                deltas[votanteId] = (deltas[votanteId] || 0) + PUNTOS.civilCorrecto * multiplicador;
                if (config.reglasExtra.roboPuntos) {
                  deltas[votadoId] = (deltas[votadoId] || 0) - 2 * multiplicador;
                  deltas[votanteId] = (deltas[votanteId] || 0) + 2 * multiplicador;
                }
              }
            }
          } else {
            // Impostores sobreviven
            for (const impId of impostores) {
              deltas[impId] = (deltas[impId] || 0) + PUNTOS.impostorSobrevive * multiplicador;
            }
            // Víctima: quien fue más votado pero no es impostor
            if (masVotado && !impostores.includes(masVotado)) {
              deltas[masVotado] = (deltas[masVotado] || 0) + PUNTOS.victima * multiplicador;
            }
          }
          jugadoresNuevos = jugadores.map((j) => {
            const delta = deltas[j.id] || 0;
            return { ...j, puntos: j.puntos + delta };
          });
          for (const j of jugadoresNuevos) {
            const delta = deltas[j.id] || 0;
            if (delta !== 0) cambios.push({ id: j.id, nombre: j.nombre, delta, total: j.puntos });
          }
        }

        set({
          jugadores: jugadoresNuevos,
          fase: "resultado",
          rondasJugadas: rondasJugadas + 1,
          resultado: {
            ganaImpostor: !civilesGanan,
            impostorNombre: impostorPrincipal?.nombre ?? "?",
            impostoresExtra: impostoresExtraInfo.length > 0 ? impostoresExtraInfo : undefined,
            esJefeFinal: ronda.esJefeFinal,
            cambiosPuntaje: cambios.length > 0 ? cambios : undefined,
          },
        });
      },

      intentarAdivinanzaImpostor: (jugadorId, intento) => {
        const { ronda, jugadores, fase, config, rondasJugadas } = get();
        if (!ronda || fase !== "discusion") return "no-eras-el-impostor";
        const impostores = [ronda.impostorId, ...(ronda.impostoresExtra ?? [])];
        if (!impostores.includes(jugadorId)) return "no-eras-el-impostor";
        const impostor = jugadores.find((j) => j.id === ronda.impostorId);
        const acerto = esMismaPalabra(intento, ronda.palabra);

        const cambios: { id: string; nombre: string; delta: number; total: number }[] = [];
        let jugadoresNuevos = jugadores;
        if (config.reglasExtra.puntajePersistente && acerto) {
          const multiplicador = ronda.esJefeFinal ? 2 : 1;
          jugadoresNuevos = jugadores.map((j) =>
            impostores.includes(j.id)
              ? { ...j, puntos: j.puntos + PUNTOS.impostorAdivina * multiplicador }
              : j,
          );
          for (const j of jugadoresNuevos) {
            if (impostores.includes(j.id))
              cambios.push({ id: j.id, nombre: j.nombre, delta: PUNTOS.impostorAdivina * multiplicador, total: j.puntos });
          }
        }

        const impostoresExtraInfo = (ronda.impostoresExtra ?? [])
          .map((id) => jugadores.find((j) => j.id === id))
          .filter((j): j is Jugador => !!j)
          .map((j) => ({ id: j.id, nombre: j.nombre }));

        set({
          jugadores: jugadoresNuevos,
          fase: "resultado",
          finEn: null,
          rondasJugadas: rondasJugadas + 1,
          resultado: {
            ganaImpostor: acerto,
            impostorNombre: impostor?.nombre ?? "?",
            porAdivinanza: true,
            palabraIntento: intento.slice(0, 60),
            impostoresExtra: impostoresExtraInfo.length > 0 ? impostoresExtraInfo : undefined,
            esJefeFinal: ronda.esJefeFinal,
            cambiosPuntaje: cambios.length > 0 ? cambios : undefined,
          },
        });
        return acerto ? "acierto" : "fallo";
      },

      reiniciarRonda: () => {
        get().iniciarPartida();
      },

      resetearPuntajes: () =>
        set((s) => ({
          jugadores: s.jugadores.map((j) => ({ ...j, puntos: 0 })),
          rondasJugadas: 0,
        })),

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
      partialize: (s) => ({
        jugadores: s.jugadores.map((j) => ({ ...j, puntos: s.config.reglasExtra.puntajePersistente ? j.puntos : 0 })),
        config: s.config,
        rondasJugadas: s.config.reglasExtra.puntajePersistente ? s.rondasJugadas : 0,
      }),
    },
  ),
);
