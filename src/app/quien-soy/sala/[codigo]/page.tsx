"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/header";
import { LobbyOnlineQuienSoy } from "@/components/quien-soy/lobby-online";
import { JuegoOnlineQuienSoy } from "@/components/quien-soy/juego-online";
import {
  guardarJugadorIdQS,
  obtenerJugadorIdQS,
  useSalaQuienSoy,
} from "@/lib/use-sala-quien-soy";
import {
  guardarNombre,
  obtenerNombreGuardado,
} from "@/lib/use-sala-impostor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function QuienSoySalaPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo: codigoRaw } = use(params);
  const codigo = codigoRaw.trim().toUpperCase();
  const router = useRouter();
  const [jugadorId, setJugadorId] = useState<string | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setJugadorId(obtenerJugadorIdQS(codigo));
    setMontado(true);
  }, [codigo]);

  const { sala, palabra, error, cargando, accion } = useSalaQuienSoy(codigo, jugadorId);

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
        <Header volver="/" />
        <main className="flex-1 grid place-items-center px-6">
          <Card className="p-6 max-w-sm text-center">
            <h1 className="font-display font-bold text-2xl">Sala no disponible</h1>
            <p className="mt-2 text-[var(--color-tinta-suave)]">{error}</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/quien-soy/online")}>
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
        <Header volver="/" />
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
          guardarJugadorIdQS(codigo, id);
        }}
        accion={accion}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/" />
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
            {sala.fase === "lobby" ? (
              <LobbyOnlineQuienSoy sala={sala} jugadorId={jugadorId} accion={accion} />
            ) : (
              <JuegoOnlineQuienSoy sala={sala} palabra={palabra} jugadorId={jugadorId} accion={accion} />
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

  useEffect(() => setNombre(obtenerNombreGuardado()), []);

  const entrar = async () => {
    setError(null);
    if (!nombre.trim()) return setError("Poné tu nombre");
    setCargando(true);
    guardarNombre(nombre);
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
      <Header volver="/" />
      <main className="flex-1 grid place-items-center px-6">
        <Card className="p-6 max-w-sm w-full">
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
            ¿Quién Soy? · Te invitaron
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
