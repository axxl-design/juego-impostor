"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Play, LogOut, Crown, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { CATEGORIAS_META } from "@/lib/categorias-meta";
import type { Dificultad } from "@/lib/types";
import { cn } from "@/lib/utils";
import { olvidarJugadorId } from "@/lib/use-sala-impostor";
import { useRouter } from "next/navigation";
import type { SalaPublica } from "@/lib/use-sala-impostor";

const DIFICULTADES: { id: Dificultad; nombre: string; tono: string }[] = [
  { id: "facil", nombre: "Fácil", tono: "from-emerald-400 to-emerald-600" },
  { id: "medio", nombre: "Medio", tono: "from-amber-400 to-orange-500" },
  { id: "dificil", nombre: "Difícil", tono: "from-pink-500 to-fuchsia-600" },
];

const TIEMPOS = [
  { seg: 60, label: "1m" },
  { seg: 180, label: "3m" },
  { seg: 300, label: "5m" },
  { seg: 480, label: "8m" },
  { seg: 600, label: "10m" },
];

type Props = {
  sala: SalaPublica;
  jugadorId: string;
  accion: (c: Record<string, unknown>) => Promise<unknown>;
};

export function LobbyOnline({ sala, jugadorId, accion }: Props) {
  const router = useRouter();
  const esHost = sala.hostId === jugadorId;
  const [copiado, setCopiado] = useState<"codigo" | "link" | null>(null);
  const [iniciando, setIniciando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = typeof window !== "undefined" ? `${window.location.origin}/impostor/sala/${sala.codigo}` : "";

  const copiar = async (qué: "codigo" | "link") => {
    const texto = qué === "codigo" ? sala.codigo : url;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(qué);
      setTimeout(() => setCopiado(null), 1500);
    } catch {}
  };

  const compartir = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: { title: string; text: string; url: string }) => Promise<void> }).share({
          title: "El Juego del Impostor — VANNY Games Vault",
          text: `Unite a mi sala: ${sala.codigo}`,
          url,
        });
        return;
      } catch {}
    }
    copiar("link");
  };

  const iniciar = async () => {
    setError(null);
    setIniciando(true);
    try {
      await accion({ tipo: "iniciar", jugadorId });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setIniciando(false);
    }
  };

  const salir = async () => {
    await accion({ tipo: "salir", jugadorId });
    olvidarJugadorId(sala.codigo);
    router.push("/");
  };

  const puedeEmpezar = sala.jugadores.length >= 3;

  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 pb-28 pt-2 space-y-6">
      <Card className="p-5 overflow-hidden relative gradient-primario text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">Código de sala</div>
            <div className="font-mono font-black text-5xl sm:text-6xl tracking-[0.35em] mt-1">
              {sala.codigo}
            </div>
          </div>
          <button
            onClick={() => copiar("codigo")}
            className="h-11 px-3 rounded-xl bg-white/15 backdrop-blur border-2 border-white/30 hover:bg-white/25 transition flex items-center gap-2 text-sm font-semibold shrink-0"
          >
            {copiado === "codigo" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copiado === "codigo" ? "¡Copiado!" : "Código"}</span>
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => copiar("link")}
            className="h-11 rounded-xl bg-white/15 backdrop-blur border-2 border-white/30 hover:bg-white/25 transition flex items-center justify-center gap-2 text-sm font-semibold"
          >
            {copiado === "link" ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            {copiado === "link" ? "¡Copiado!" : "Copiar link"}
          </button>
          <button
            onClick={compartir}
            className="h-11 rounded-xl bg-white text-[var(--color-primario-700)] border-2 border-white hover:bg-white/90 transition flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </div>
      </Card>

      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-bold text-xl tracking-tight">
            Jugadores · {sala.jugadores.length}
          </h2>
          <button
            onClick={salir}
            className="text-sm text-[var(--color-tinta-suave)] hover:text-[var(--color-peligro)] transition inline-flex items-center gap-1"
          >
            <LogOut className="h-3 w-3" />
            Salir
          </button>
        </div>
        <Card className="p-3">
          <AnimatePresence initial={false}>
            {sala.jugadores.map((j) => (
              <motion.div
                key={j.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-2 rounded-xl"
              >
                <Avatar nombre={j.nombre} tamano={40} />
                <span className="font-semibold flex-1 truncate">
                  {j.nombre}
                  {j.id === jugadorId && (
                    <span className="ml-2 text-xs text-[var(--color-tinta-suave)] font-normal">(vos)</span>
                  )}
                </span>
                {j.id === sala.hostId && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primario-600)] bg-[var(--color-primario-100)] dark:bg-[var(--color-primario-900)]/30 px-2 py-1 rounded-full">
                    <Crown className="h-3 w-3" />
                    Anfitrión
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {sala.jugadores.length < 3 && (
            <div className="text-center text-sm text-[var(--color-tinta-suave)] py-3">
              Esperando más jugadores... (mínimo 3)
            </div>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl tracking-tight mb-3 px-1">Categoría</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIAS_META.map((c) => {
            const activa = sala.config.categoriaId === c.id;
            return (
              <button
                key={c.id}
                disabled={!esHost}
                onClick={() => accion({ tipo: "configurar", jugadorId, config: { categoriaId: c.id } })}
                className={cn(
                  "rounded-2xl p-3 text-left border-2 border-[var(--color-borde)] transition",
                  activa
                    ? "gradient-primario text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]",
                  !esHost && "opacity-70",
                )}
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-1 font-semibold text-sm leading-tight">{c.nombre}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl tracking-tight mb-3 px-1">Dificultad</h2>
        <div className="grid grid-cols-3 gap-3">
          {DIFICULTADES.map((d) => {
            const activa = sala.config.dificultad === d.id;
            return (
              <button
                key={d.id}
                disabled={!esHost}
                onClick={() => accion({ tipo: "configurar", jugadorId, config: { dificultad: d.id } })}
                className={cn(
                  "rounded-2xl py-4 px-3 font-bold border-2 border-[var(--color-borde)] transition",
                  activa
                    ? `bg-gradient-to-br ${d.tono} text-white shadow-[var(--shadow-brutal)]`
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]",
                  !esHost && "opacity-70",
                )}
              >
                {d.nombre}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl tracking-tight mb-3 px-1">Tiempo</h2>
        <div className="grid grid-cols-5 gap-2">
          {TIEMPOS.map((t) => {
            const activa = sala.config.duracionSeg === t.seg;
            return (
              <button
                key={t.seg}
                disabled={!esHost}
                onClick={() => accion({ tipo: "configurar", jugadorId, config: { duracionSeg: t.seg } })}
                className={cn(
                  "rounded-2xl py-3 font-mono font-bold border-2 border-[var(--color-borde)] transition",
                  activa
                    ? "bg-[var(--color-cian)] text-white shadow-[var(--shadow-brutal)]"
                    : "bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]",
                  !esHost && "opacity-70",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <Card className="p-4">
          <label className={cn("flex items-center gap-3", esHost ? "cursor-pointer" : "opacity-70")}>
            <input
              type="checkbox"
              disabled={!esHost}
              checked={sala.config.impostorCiego}
              onChange={(e) =>
                accion({
                  tipo: "configurar",
                  jugadorId,
                  config: { impostorCiego: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <span className="relative w-12 h-7 rounded-full border-2 border-[var(--color-borde)] bg-[var(--color-fondo)] peer-checked:gradient-primario transition-colors">
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white border-2 border-[var(--color-borde)] rounded-full peer-checked:translate-x-5 transition-transform" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">Impostor a ciegas</span>
              <span className="block text-sm text-[var(--color-tinta-suave)]">
                El impostor tampoco ve la categoría.
              </span>
            </span>
          </label>
        </Card>
      </section>

      {!esHost && (
        <div className="text-center text-sm text-[var(--color-tinta-suave)]">
          Solo el anfitrión puede cambiar la configuración y empezar.
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-3 sm:pb-6 bg-gradient-to-t from-[var(--color-fondo)] via-[var(--color-fondo)] to-transparent">
        <div className="mx-auto max-w-2xl">
          {error && (
            <div className="text-center text-sm text-[var(--color-peligro)] mb-2">{error}</div>
          )}
          {esHost ? (
            <Button
              tamano="xl"
              onClick={iniciar}
              disabled={!puedeEmpezar}
              cargando={iniciando}
              className="w-full"
            >
              <Play className="h-6 w-6" />
              Empezar partida
            </Button>
          ) : (
            <div className="h-16 flex items-center justify-center text-sm text-[var(--color-tinta-suave)] border-2 border-dashed border-[var(--color-borde)] rounded-2xl">
              Esperando al anfitrión...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
