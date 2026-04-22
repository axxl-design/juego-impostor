"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, LogIn, AlertTriangle } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { guardarJugadorIdVidas } from "@/lib/vidas/use-sala";
import { pusherConfiguradoCliente } from "@/lib/pusher-client";

const CLAVE_NOMBRE = "vanny.vidas.nombre";

function leerNombre(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CLAVE_NOMBRE) ?? "";
}
function escribirNombre(n: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAVE_NOMBRE, n.trim().slice(0, 20));
}

export default function VidasOnlinePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pestaña, setPestaña] = useState<"crear" | "entrar">("crear");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sinPusher, setSinPusher] = useState(false);

  useEffect(() => {
    setNombre(leerNombre());
    setSinPusher(!pusherConfiguradoCliente());
  }, []);

  const crear = async () => {
    setError(null);
    if (!nombre.trim()) return setError("Poné tu nombre");
    setCargando(true);
    escribirNombre(nombre);
    try {
      const r = await fetch("/api/vidas/sala/crear", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Error");
      guardarJugadorIdVidas(j.codigo, j.jugadorId);
      router.push(`/vidas/sala/${j.codigo}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setCargando(false);
    }
  };

  const entrar = async () => {
    setError(null);
    if (!nombre.trim()) return setError("Poné tu nombre");
    const cod = codigo.trim().toUpperCase();
    if (cod.length !== 4) return setError("El código son 4 letras");
    setCargando(true);
    escribirNombre(nombre);
    try {
      const r = await fetch(`/api/vidas/sala/${cod}/accion`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tipo: "unirse", nombre }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "No se pudo entrar");
      guardarJugadorIdVidas(cod, j.jugadorId);
      router.push(`/vidas/sala/${cod}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header volver="/vidas" />
      <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mt-4"
        >
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-center">
            Vidas · con alguien
          </h1>
          <p className="mt-2 text-center text-[var(--color-tinta-suave)]">
            2 jugadores, desde su propio celular. Cada uno vive parte de la historia.
          </p>

          {sinPusher && (
            <div className="mt-6 p-3 rounded-2xl border-2 border-amber-500 bg-amber-500/10 text-sm flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
              <span>
                Pusher no configurado. El online va a usar polling cada 2.5s. Configurá claves en
                <code className="font-mono"> .env.local</code> para tiempo real — mirá el README.
              </span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)]">
            <button
              onClick={() => setPestaña("crear")}
              className={`h-11 rounded-xl font-semibold transition ${
                pestaña === "crear" ? "gradient-primario text-white" : ""
              }`}
            >
              Crear sala
            </button>
            <button
              onClick={() => setPestaña("entrar")}
              className={`h-11 rounded-xl font-semibold transition ${
                pestaña === "entrar" ? "gradient-primario text-white" : ""
              }`}
            >
              Entrar a una
            </button>
          </div>

          <Card className="mt-4 p-5 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
                Tu nombre
              </label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={20}
                placeholder="ej: Mati"
                autoFocus
              />
            </div>
            {pestaña === "entrar" && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
                  Código de sala
                </label>
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  maxLength={4}
                  placeholder="XBKR"
                  className="font-mono text-center text-2xl tracking-[0.5em] uppercase"
                />
              </div>
            )}
            {error && <div className="text-sm text-[var(--color-peligro)] font-medium">{error}</div>}
            <Button
              onClick={pestaña === "crear" ? crear : entrar}
              tamano="xl"
              cargando={cargando}
              className="w-full"
            >
              {pestaña === "crear" ? (
                <>
                  <Plus className="h-5 w-5" /> Crear sala nueva
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" /> Entrar
                </>
              )}
            </Button>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
