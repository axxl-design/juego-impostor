"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lobby } from "@/components/vanny-deal/lobby";
import { MesaJuego } from "@/components/vanny-deal/mesa-juego";
import {
  OverlayEspionaje,
  OverlayFin,
  OverlayJuicio,
  OverlayNoGracias,
  OverlayPago,
} from "@/components/vanny-deal/overlays";
import {
  guardarJugadorIdDeal,
  obtenerJugadorIdDeal,
  olvidarJugadorIdDeal,
  useSalaVannyDeal,
} from "@/lib/use-sala-vanny-deal";
import { guardarNombre, obtenerNombreGuardado } from "@/lib/use-sala-impostor";

export default function SalaVannyDealPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = use(params);
  const codigo = codigoRaw.toUpperCase();
  const router = useRouter();

  const [jugadorId, setJugadorId] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const id = obtenerJugadorIdDeal(codigo);
    setJugadorId(id);
    setListo(true);
  }, [codigo]);

  const { sala, mano, error, cargando, accion } = useSalaVannyDeal(codigo, jugadorId);

  // Heartbeat para reconexión: tocar cada 20s
  useEffect(() => {
    if (!jugadorId || !sala) return;
    const id = setInterval(() => {
      accion({ tipo: "tocar", jugadorId });
    }, 20_000);
    return () => clearInterval(id);
  }, [jugadorId, sala, accion]);

  if (!listo || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta-suave)]">
        Cargando…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header volver="/vanny-deal" />
        <main className="px-4 py-8 max-w-md mx-auto">
          <Card className="p-5">
            <div className="font-bold text-lg">No se pudo cargar la sala</div>
            <div className="text-sm text-[var(--color-tinta-suave)] mt-1">{error}</div>
            <div className="mt-4">
              <Button tamano="sm" onClick={() => router.push("/vanny-deal")}>
                Volver
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!sala) return null;

  if (!jugadorId) {
    return (
      <UnirseRapido
        codigo={codigo}
        onEntra={(id) => {
          guardarJugadorIdDeal(codigo, id);
          setJugadorId(id);
        }}
      />
    );
  }

  const soyJugador = sala.jugadores.some((j) => j.id === jugadorId);
  if (!soyJugador) {
    // limpio y vuelvo a unirse
    olvidarJugadorIdDeal(codigo);
    return (
      <UnirseRapido
        codigo={codigo}
        onEntra={(id) => {
          guardarJugadorIdDeal(codigo, id);
          setJugadorId(id);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header volver="/vanny-deal" />

      {sala.fase === "lobby" && (
        <Lobby sala={sala} jugadorId={jugadorId} onAccion={accion} />
      )}
      {sala.fase !== "lobby" && (
        <MesaJuego sala={sala} mano={mano} jugadorId={jugadorId} onAccion={accion} />
      )}

      <AnimatePresence>
        {sala.fase === "pago" && (
          <OverlayPago sala={sala} mano={mano} jugadorId={jugadorId} onAccion={accion} />
        )}
        {sala.fase === "noGraciasVentana" && (
          <OverlayNoGracias sala={sala} mano={mano} jugadorId={jugadorId} onAccion={accion} />
        )}
        {sala.fase === "espionajeAbierto" && (
          <OverlayEspionaje sala={sala} mano={mano} jugadorId={jugadorId} onAccion={accion} />
        )}
        {sala.fase === "juicioPopular" && (
          <OverlayJuicio sala={sala} jugadorId={jugadorId} onAccion={accion} />
        )}
        {sala.fase === "fin" && (
          <OverlayFin sala={sala} jugadorId={jugadorId} onAccion={accion} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Pantalla para unirse si alguien llega con el link sin jugadorId
function UnirseRapido({ codigo, onEntra }: { codigo: string; onEntra: (id: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setNombre(obtenerNombreGuardado());
  }, []);

  const entrar = async () => {
    setErr(null);
    if (!nombre.trim()) return setErr("Poné tu nombre");
    setCargando(true);
    guardarNombre(nombre);
    try {
      const actionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const r = await fetch(`/api/vanny-deal/sala/${codigo}/accion`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actionId, accion: { tipo: "unirse", nombre } }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Error");
      if (j.datos?.jugadorId) onEntra(j.datos.jugadorId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen">
      <Header volver="/vanny-deal" />
      <main className="px-4 py-8 max-w-md mx-auto">
        <Card className="p-5 space-y-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
              Sala
            </div>
            <div className="font-mono text-3xl font-black tracking-[0.3em]">{codigo}</div>
          </div>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={20}
            placeholder="Tu nombre"
          />
          {err && <div className="text-sm text-[var(--color-peligro)]">{err}</div>}
          <Button onClick={entrar} tamano="lg" className="w-full" cargando={cargando}>
            Entrar
          </Button>
        </Card>
      </main>
    </div>
  );
}
