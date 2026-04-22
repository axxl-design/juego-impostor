"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  cargarSave,
  crearPartidaNueva,
  eliminarSave,
  guardarSave,
  listarSaves,
  type MetaSave,
} from "@/lib/vidas/store-local";
import { SetupMundoRol } from "@/components/vidas/setup-mundo-rol";
import { JuegoLocal } from "@/components/vidas/juego-local";
import type { EstadoPartidaLocal } from "@/lib/vidas/types";

type Vista = "lista" | "nuevo" | "jugar";

export default function VidasLocalPage() {
  const [vista, setVista] = useState<Vista>("lista");
  const [saves, setSaves] = useState<MetaSave[]>([]);
  const [montado, setMontado] = useState(false);
  const [partidaActiva, setPartidaActiva] = useState<EstadoPartidaLocal | null>(null);

  useEffect(() => {
    setSaves(listarSaves());
    setMontado(true);
  }, []);

  if (!montado) return null;

  const recargar = () => setSaves(listarSaves());

  if (vista === "jugar" && partidaActiva) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header volver="/vidas/local" />
        <main className="flex-1">
          <JuegoLocal estadoInicial={partidaActiva} />
        </main>
      </div>
    );
  }

  if (vista === "nuevo") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header volver="/vidas/local" />
        <main className="flex-1 pt-4">
          <SetupMundoRol
            onConfirmar={({ mundo, rolId, nombre, poderSubtipo }) => {
              const nueva = crearPartidaNueva(nombre, mundo, rolId, poderSubtipo);
              guardarSave(nueva);
              setPartidaActiva(nueva);
              setVista("jugar");
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/vidas" />
      <main className="flex-1 px-4 sm:px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-4 pb-6 text-center">
            <div className="text-5xl mb-2">🌍</div>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">
              Vidas · solo
            </h1>
            <p className="mt-2 text-[var(--color-tinta-suave)] max-w-md mx-auto">
              Una vida entera en tus manos. Elegí un personaje guardado o empezá uno nuevo.
            </p>
          </motion.div>

          <Button tamano="xl" className="w-full" onClick={() => setVista("nuevo")}>
            <Plus className="h-5 w-5" /> Nuevo personaje
          </Button>

          {saves.length > 0 && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-widest font-bold text-[var(--color-tinta-suave)] mb-3">
                Tus vidas guardadas
              </div>
              <div className="space-y-3">
                {saves.map((m) => (
                  <Card key={m.saveId} className="p-4 flex items-center gap-3">
                    <Avatar nombre={m.nombre} tamano={48} />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-base truncate">
                        {m.nombre} {!m.vivo && <span className="text-xs text-[var(--color-peligro)] ml-1">(fallecido)</span>}
                      </div>
                      <div className="text-xs text-[var(--color-tinta-suave)] truncate">
                        {m.rolNombre} · {m.mundoNombre} · {m.edad} años · {m.etapa}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
                        eliminarSave(m.saveId);
                        recargar();
                      }}
                      className="h-10 w-10 grid place-items-center rounded-xl border-2 border-[var(--color-borde)] text-[var(--color-peligro)]"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const cargado = cargarSave(m.saveId);
                        if (!cargado) return;
                        setPartidaActiva(cargado);
                        setVista("jugar");
                      }}
                      className="h-10 w-10 grid place-items-center rounded-xl border-2 border-[var(--color-borde)] bg-[var(--color-primario-500)] text-white"
                      aria-label="Continuar"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
