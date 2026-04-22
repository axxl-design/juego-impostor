"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MUNDOS, SUBTIPOS_ELEMENTALES, buscarMundo, buscarRol } from "@/lib/vidas/mundos";
import type { MundoId, PoderSubtipo, TipoRelacion } from "@/lib/vidas/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export type ResultadoSetup = {
  mundo: MundoId;
  rolId: string;
  nombre: string;
  poderSubtipo?: PoderSubtipo;
};

export function SetupMundoRol({
  mundoFijo,
  ocultarTitulo,
  tituloCustom,
  onConfirmar,
  permitirElegirRelacion,
  relacionActual,
  onCambiarRelacion,
}: {
  mundoFijo?: MundoId;
  ocultarTitulo?: boolean;
  tituloCustom?: string;
  onConfirmar: (r: ResultadoSetup) => void;
  permitirElegirRelacion?: boolean;
  relacionActual?: TipoRelacion | null;
  onCambiarRelacion?: (r: TipoRelacion) => void;
}) {
  const [relacion, setRelacion] = useState<TipoRelacion | null>(relacionActual ?? null);
  const [mundoId, setMundoId] = useState<MundoId | null>(mundoFijo ?? null);
  const [rolId, setRolId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [poderSubtipo, setPoderSubtipo] = useState<PoderSubtipo | null>(null);

  const mundo = mundoId ? buscarMundo(mundoId) : null;
  const rol = mundoId && rolId ? buscarRol(mundoId, rolId) : null;
  const pideSubtipo = mundoId === "poderes" && rolId === "elemental";

  const puedeConfirmar =
    Boolean(mundoId) && Boolean(rolId) && nombre.trim().length >= 2 && (!pideSubtipo || poderSubtipo !== null) && (!permitirElegirRelacion || relacion !== null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      {!ocultarTitulo && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4 pb-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">
            {tituloCustom ?? "Elegí tu vida."}
          </h1>
          <p className="mt-2 text-[var(--color-tinta-suave)]">
            Un mundo, un rol, un nombre. Cada decisión va a pesar.
          </p>
        </motion.div>
      )}

      {permitirElegirRelacion && (
        <section className="mb-8">
          <SectionLabel>Tipo de relación</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {(["amigos", "pareja"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRelacion(r);
                  onCambiarRelacion?.(r);
                }}
                className={`p-4 rounded-2xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] font-semibold ${
                  relacion === r ? "gradient-primario text-white" : "bg-[var(--color-fondo-elev)]"
                }`}
              >
                {r === "amigos" ? "👯 Amigos" : "💞 Pareja"}
              </button>
            ))}
          </div>
        </section>
      )}

      {!mundoFijo && (
        <section className="mb-8">
          <SectionLabel>1 · Elegí tu mundo</SectionLabel>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {MUNDOS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMundoId(m.id);
                  setRolId(null);
                  setPoderSubtipo(null);
                }}
                className={`text-left p-4 rounded-2xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] transition ${
                  mundoId === m.id
                    ? "bg-[var(--color-primario-500)]/15 border-[var(--color-primario-500)]"
                    : "bg-[var(--color-fondo-elev)]"
                }`}
              >
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className="font-display font-bold text-lg leading-tight">{m.nombre}</div>
                <div className="mt-1 text-xs text-[var(--color-tinta-suave)]">{m.tagline}</div>
                <div className="mt-2 text-[10px] uppercase tracking-widest font-bold text-[var(--color-primario-600)]">
                  {m.tono}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {mundo && (
        <section className="mb-8">
          <SectionLabel>2 · Elegí tu rol</SectionLabel>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {mundo.roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRolId(r.id);
                  setPoderSubtipo(null);
                }}
                className={`text-left p-4 rounded-2xl border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] transition ${
                  rolId === r.id
                    ? "bg-[var(--color-cian)]/15 border-[var(--color-cian)]"
                    : "bg-[var(--color-fondo-elev)]"
                }`}
              >
                <div className="font-display font-bold text-base leading-tight">{r.nombre}</div>
                <div className="mt-1 text-xs text-[var(--color-tinta-suave)] leading-snug">{r.descripcion}</div>
                <div className="mt-2 text-[10px] uppercase tracking-widest font-bold text-[var(--color-tinta-suave)]">
                  Inicio: {r.rangoInicial}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {pideSubtipo && (
        <section className="mb-8">
          <SectionLabel>Elegí tu elemento</SectionLabel>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SUBTIPOS_ELEMENTALES.map((s) => (
              <button
                key={s.id}
                onClick={() => setPoderSubtipo(s.id)}
                className={`p-3 rounded-xl border-2 border-[var(--color-borde)] shadow-[2px_2px_0_0_var(--color-borde)] text-center ${
                  poderSubtipo === s.id
                    ? "bg-[var(--color-primario-500)] text-white"
                    : "bg-[var(--color-fondo-elev)]"
                }`}
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="text-xs font-bold mt-1">{s.nombre}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {rol && (
        <section className="mb-8">
          <SectionLabel>3 · Tu personaje</SectionLabel>
          <Card className="mt-3 p-5 flex items-center gap-4">
            <Avatar nombre={nombre || "??"} tamano={56} />
            <div className="flex-1">
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del personaje"
                maxLength={20}
                autoFocus
              />
              <div className="mt-2 text-xs text-[var(--color-tinta-suave)]">
                Máx 20 caracteres. Este nombre va a aparecer en el epílogo.
              </div>
            </div>
          </Card>
        </section>
      )}

      <Button
        tamano="xl"
        disabled={!puedeConfirmar}
        className="w-full"
        onClick={() => {
          if (!puedeConfirmar || !mundoId || !rolId) return;
          onConfirmar({
            mundo: mundoId,
            rolId,
            nombre: nombre.trim(),
            poderSubtipo: poderSubtipo ?? undefined,
          });
        }}
      >
        Empezar vida →
      </Button>
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
