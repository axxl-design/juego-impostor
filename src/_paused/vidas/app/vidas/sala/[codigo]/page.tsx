"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/header";
import { LobbyOnline } from "@/components/vidas/lobby-online";
import { JuegoOnline } from "@/components/vidas/juego-online";
import {
  guardarJugadorIdVidas,
  obtenerJugadorIdVidas,
  useSalaVidas,
} from "@/lib/vidas/use-sala";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VidasSalaPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo: raw } = use(params);
  const codigo = raw.trim().toUpperCase();
  const router = useRouter();
  const [jugadorId, setJugadorId] = useState<string | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setJugadorId(obtenerJugadorIdVidas(codigo));
    setMontado(true);
  }, [codigo]);

  const { sala, error, cargando, accion, generarIA } = useSalaVidas(codigo);

  useEffect(() => {
    if (!sala || !jugadorId) return;
    if (!sala.jugadores.some((j) => j.id === jugadorId)) {
      setJugadorId(null);
    }
  }, [sala, jugadorId]);

  if (!montado) return null;

  if (error && !sala) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header volver="/vidas" />
        <main className="flex-1 grid place-items-center px-6">
          <Card className="p-6 max-w-sm text-center">
            <h1 className="font-display font-bold text-2xl">Sala no disponible</h1>
            <p className="mt-2 text-[var(--color-tinta-suave)]">{error}</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/vidas/online")}>
              Volver
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (cargando || !sala) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header volver="/vidas" />
        <main className="flex-1 grid place-items-center">
          <div className="text-[var(--color-tinta-suave)]">Conectando...</div>
        </main>
      </div>
    );
  }

  if (!jugadorId) {
    return (
      <UnirseUI
        codigo={codigo}
        onUnido={(id) => {
          setJugadorId(id);
          guardarJugadorIdVidas(codigo, id);
        }}
        accion={accion}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/vidas" />
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={sala.fase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {sala.fase === "lobby" || sala.fase === "setup-invitado" ? (
              <LobbyOnline sala={sala} jugadorId={jugadorId} accion={accion} />
            ) : (
              <JuegoOnline sala={sala} jugadorId={jugadorId} accion={accion} generarIA={generarIA} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function UnirseUI({
  codigo,
  onUnido,
  accion,
}: {
  codigo: string;
  onUnido: (id: string) => void;
  accion: (c: Record<string, unknown>) => Promise<{ jugadorId?: string }>;
}) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNombre(window.localStorage.getItem("vanny.vidas.nombre") ?? "");
    }
  }, []);

  const entrar = async () => {
    setError(null);
    if (!nombre.trim()) return setError("Poné tu nombre");
    setCargando(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vanny.vidas.nombre", nombre.trim().slice(0, 20));
    }
    try {
      const r = await accion({ tipo: "unirse", nombre });
      if (r.jugadorId) onUnido(r.jugadorId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/vidas" />
      <main className="flex-1 grid place-items-center px-6">
        <Card className="p-6 max-w-sm w-full">
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
            Vidas · Te invitaron
          </div>
          <div className="font-mono font-bold text-4xl tracking-[0.4em] mt-1 text-gradient-primario">
            {codigo}
          </div>
          <div className="mt-5 space-y-3">
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              maxLength={20}
              autoFocus
            />
            {error && <div className="text-sm text-[var(--color-peligro)]">{error}</div>}
            <Button onClick={entrar} cargando={cargando} tamano="lg" className="w-full">
              Entrar a la sala
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
