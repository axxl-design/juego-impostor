"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2 } from "lucide-react";
import type { EstadoSalaOnline, MundoId, TipoRelacion } from "@/lib/vidas/types";
import { MUNDOS, SUBTIPOS_ELEMENTALES, buscarMundo } from "@/lib/vidas/mundos";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LobbyOnline({
  sala,
  jugadorId,
  accion,
}: {
  sala: EstadoSalaOnline;
  jugadorId: string;
  accion: (c: Record<string, unknown>) => Promise<unknown>;
}) {
  const esHost = sala.hostId === jugadorId;
  const yo = sala.jugadores.find((j) => j.id === jugadorId);
  const otro = sala.jugadores.find((j) => j.id !== jugadorId);
  const yoConfigurado = Boolean(yo?.rol && yo.rol !== "campesino" || yo?.rango && yo.rango !== "—");
  const otroConfigurado = Boolean(otro?.rol && otro.rango && otro.rango !== "—");

  const [copiado, setCopiado] = useState(false);
  const [nombreInput, setNombreInput] = useState(yo?.nombre ?? "");
  const [rolInput, setRolInput] = useState<string>("");
  const [poderSubtipo, setPoderSubtipo] = useState<string>("");
  const [errorConfig, setErrorConfig] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(sala.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const compartir = async () => {
    const url = `${window.location.origin}/vidas/sala/${sala.codigo}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Vidas · VANNY Games Vault", text: `Entrá con el código ${sala.codigo}`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  const setRelacion = (t: TipoRelacion) => {
    accion({ tipo: "setRelacion", jugadorId, relacion: t }).catch(() => {});
  };
  const setMundo = (m: MundoId) => {
    accion({ tipo: "setMundo", jugadorId, mundo: m }).catch(() => {});
  };

  const puedeEmpezarHost = esHost && sala.mundo && sala.tipoRelacion && sala.jugadores.length === 2 && yoConfigurado && otroConfigurado;
  const pideSubtipo = sala.mundo === "poderes" && rolInput === "elemental";

  const confirmarPersonaje = async () => {
    setErrorConfig(null);
    const nombreLimpio = nombreInput.trim();
    if (nombreLimpio.length < 2) {
      setErrorConfig("Nombre demasiado corto");
      return;
    }
    if (!rolInput) {
      setErrorConfig("Elegí un rol");
      return;
    }
    if (pideSubtipo && !poderSubtipo) {
      setErrorConfig("Elegí elemento");
      return;
    }
    setCargando(true);
    try {
      await accion({
        tipo: "configurarJugador",
        jugadorId,
        rol: rolInput,
        nombre: nombreLimpio,
        poderSubtipo: poderSubtipo || undefined,
      });
    } finally {
      setCargando(false);
    }
  };

  const mundoDef = sala.mundo ? buscarMundo(sala.mundo) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-4 pb-6 text-center">
        <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
          Sala de Vidas
        </div>
        <div className="mt-1 font-mono font-bold text-4xl sm:text-5xl tracking-[0.4em] text-gradient-primario">
          {sala.codigo}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Button tamano="sm" variante="secundario" onClick={copiarCodigo}>
            {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiado ? "Copiado" : "Copiar"}
          </Button>
          <Button tamano="sm" variante="secundario" onClick={compartir}>
            <Share2 className="h-4 w-4" /> Compartir
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {sala.jugadores.map((j) => (
          <Card key={j.id} className="p-4 flex items-center gap-3">
            <Avatar nombre={j.nombre} tamano={40} />
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm truncate">
                {j.nombre} {j.id === sala.hostId && <span className="ml-1 text-[10px] text-[var(--color-primario-600)]">HOST</span>}
              </div>
              <div className="text-[10px] text-[var(--color-tinta-suave)] truncate">
                {j.rango && j.rango !== "—" ? j.rango : "Sin configurar"}
              </div>
            </div>
          </Card>
        ))}
        {sala.jugadores.length < 2 && (
          <Card className="p-4 flex items-center gap-3 bg-dashed opacity-70">
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-[var(--color-borde)]/50" />
            <div className="text-xs text-[var(--color-tinta-suave)]">Esperando al segundo jugador...</div>
          </Card>
        )}
      </div>

      <section className="mb-6">
        <SectionLabel>1 · Tipo de relación {!esHost && <span className="text-[var(--color-tinta-suave)]">(elige el host)</span>}</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["amigos", "pareja"] as const).map((t) => (
            <button
              key={t}
              disabled={!esHost}
              onClick={() => setRelacion(t)}
              className={`p-4 rounded-2xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] font-semibold disabled:opacity-60 ${
                sala.tipoRelacion === t ? "gradient-primario text-white" : "bg-[var(--color-fondo-elev)]"
              }`}
            >
              {t === "amigos" ? "👯 Amigos" : "💞 Pareja"}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <SectionLabel>
          2 · Mundo {!esHost && <span className="text-[var(--color-tinta-suave)]">(elige el host)</span>}
        </SectionLabel>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {MUNDOS.map((m) => (
            <button
              key={m.id}
              disabled={!esHost}
              onClick={() => setMundo(m.id)}
              className={`text-left p-3 rounded-2xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] disabled:opacity-60 ${
                sala.mundo === m.id
                  ? "bg-[var(--color-primario-500)]/15 border-[var(--color-primario-500)]"
                  : "bg-[var(--color-fondo-elev)]"
              }`}
            >
              <div className="text-2xl mb-1">{m.emoji}</div>
              <div className="font-display font-bold text-sm leading-tight">{m.nombre}</div>
              <div className="mt-1 text-[10px] text-[var(--color-tinta-suave)]">{m.tagline}</div>
            </button>
          ))}
        </div>
      </section>

      {sala.mundo && mundoDef && (
        <section className="mb-6">
          <SectionLabel>3 · Tu personaje en {mundoDef.nombre}</SectionLabel>
          <Card className="mt-3 p-4 space-y-3">
            <Input
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Tu nombre de personaje"
              maxLength={20}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {mundoDef.roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRolInput(r.id);
                    if (r.id !== "elemental") setPoderSubtipo("");
                  }}
                  className={`text-left p-3 rounded-xl border-2 border-[var(--color-borde)] shadow-[2px_2px_0_0_var(--color-borde)] ${
                    rolInput === r.id ? "bg-[var(--color-cian)]/15 border-[var(--color-cian)]" : "bg-[var(--color-fondo-elev)]"
                  }`}
                >
                  <div className="font-display font-bold text-sm">{r.nombre}</div>
                  <div className="text-[10px] text-[var(--color-tinta-suave)]">{r.descripcion}</div>
                </button>
              ))}
            </div>
            {pideSubtipo && (
              <div>
                <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)] mb-2">
                  Elemento
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {SUBTIPOS_ELEMENTALES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPoderSubtipo(s.id)}
                      className={`p-2 rounded-lg border-2 border-[var(--color-borde)] text-center ${
                        poderSubtipo === s.id ? "bg-[var(--color-primario-500)] text-white" : "bg-[var(--color-fondo-elev)]"
                      }`}
                    >
                      <div className="text-lg">{s.emoji}</div>
                      <div className="text-[9px] font-bold">{s.nombre}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {errorConfig && <div className="text-xs text-[var(--color-peligro)]">{errorConfig}</div>}
            <Button onClick={confirmarPersonaje} cargando={cargando} className="w-full">
              Guardar personaje
            </Button>
            {yo && yo.rol !== "campesino" && (
              <div className="text-xs text-[var(--color-tinta-suave)] text-center">
                Guardado: <span className="font-bold">{yo.rango}</span>
              </div>
            )}
          </Card>
        </section>
      )}

      {esHost && (
        <Button
          tamano="xl"
          disabled={!puedeEmpezarHost}
          className="w-full"
          onClick={() => accion({ tipo: "iniciar", jugadorId })}
        >
          Empezar vidas →
        </Button>
      )}
      {!esHost && (
        <div className="text-center text-sm text-[var(--color-tinta-suave)]">
          Cuando el host arranque la partida, aparece acá.
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
      {children}
    </div>
  );
}
