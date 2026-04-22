"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  CondicionVictoria,
  LimiteTurno,
  ModoJuego,
  VistaPublica,
} from "@/lib/vanny-deal/types";
import type { AccionCliente } from "@/lib/sala-store-vanny-deal";
import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface Props {
  sala: VistaPublica;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}

export function Lobby({ sala, jugadorId, onAccion }: Props) {
  const esHost = sala.hostId === jugadorId;
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compartir = async () => {
    const url = `${window.location.origin}/vanny-deal/sala/${sala.codigo}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "VANNY Deal",
          text: `Unite a mi partida de VANNY Deal. Código: ${sala.codigo}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copiado");
      }
    } catch {}
  };

  const cambiar = async (cambios: Partial<VistaPublica["config"]>) => {
    setError(null);
    const r = await onAccion({ tipo: "configurar", jugadorId, cambios });
    if (!r.ok) setError(r.error ?? "Error");
  };

  const iniciar = async () => {
    setCargando(true);
    setError(null);
    const r = await onAccion({ tipo: "iniciarPartida", jugadorId });
    if (!r.ok) setError(r.error ?? "Error");
    setCargando(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
              Código de sala
            </div>
            <div className="font-mono text-4xl font-black tracking-[0.3em]">{sala.codigo}</div>
          </div>
          <div className="flex gap-2">
            <Button
              tamano="sm"
              variante="secundario"
              onClick={() =>
                navigator.clipboard.writeText(sala.codigo).then(() => {})
              }
            >
              <Copy className="h-4 w-4" /> Copiar
            </Button>
            <Button tamano="sm" onClick={compartir}>
              <Share2 className="h-4 w-4" /> Compartir
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
            Jugadores ({sala.jugadores.length}/5)
          </div>
          <div className="flex flex-wrap gap-2">
            {sala.jugadores.map((j) => (
              <div
                key={j.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--color-borde)] ${
                  j.id === sala.hostId ? "bg-[var(--color-primario-500)] text-white" : "bg-[var(--color-fondo-elev)]"
                }`}
              >
                <span className="text-lg">{j.avatar}</span>
                <span className="font-semibold text-sm">
                  {j.nombre}
                  {j.id === sala.hostId ? " 👑" : ""}
                  {j.id === jugadorId ? " (vos)" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
            Modo de juego
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["clasico", "rapido"] as ModoJuego[]).map((m) => (
              <button
                key={m}
                disabled={!esHost}
                onClick={() =>
                  cambiar({
                    modo: m,
                    victoria: { tipo: "sets", cantidad: m === "rapido" ? 2 : 3 },
                  })
                }
                className={`h-14 rounded-xl border-2 font-semibold transition text-left px-3 ${
                  sala.config.modo === m
                    ? "gradient-primario text-white border-[var(--color-borde)]"
                    : "border-[var(--color-borde)] bg-[var(--color-fondo-elev)]"
                } ${!esHost ? "opacity-60" : ""}`}
              >
                <div className="text-sm font-black">
                  {m === "clasico" ? "Clásico" : "Rápido"}
                </div>
                <div className="text-xs opacity-80">
                  {m === "clasico" ? "3 sets para ganar" : "2 sets (8-15 min)"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
            Condición de victoria
          </div>
          <div className="grid grid-cols-2 gap-2">
            <VictoriaBtn
              label="3 sets"
              activo={sala.config.victoria.tipo === "sets" && sala.config.victoria.cantidad === 3}
              disabled={!esHost}
              onClick={() => cambiar({ victoria: { tipo: "sets", cantidad: 3 } })}
            />
            <VictoriaBtn
              label="2 sets"
              activo={sala.config.victoria.tipo === "sets" && sala.config.victoria.cantidad === 2}
              disabled={!esHost}
              onClick={() => cambiar({ victoria: { tipo: "sets", cantidad: 2 } })}
            />
            <VictoriaBtn
              label="Por tiempo (15 min)"
              activo={sala.config.victoria.tipo === "tiempo"}
              disabled={!esHost}
              onClick={() => cambiar({ victoria: { tipo: "tiempo", minutos: 15 } })}
            />
            <VictoriaBtn
              label="Por valor ($30M)"
              activo={sala.config.victoria.tipo === "valor"}
              disabled={!esHost}
              onClick={() => cambiar({ victoria: { tipo: "valor", millones: 30 } })}
            />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
            Tiempo por turno
          </div>
          <div className="grid grid-cols-4 gap-2">
            {([30, 60, 90, null] as LimiteTurno[]).map((t) => (
              <button
                key={String(t)}
                disabled={!esHost}
                onClick={() => cambiar({ limiteTurnoSeg: t })}
                className={`h-11 rounded-xl border-2 font-semibold ${
                  sala.config.limiteTurnoSeg === t
                    ? "gradient-primario text-white border-[var(--color-borde)]"
                    : "border-[var(--color-borde)] bg-[var(--color-fondo-elev)]"
                } ${!esHost ? "opacity-60" : ""}`}
              >
                {t === null ? "∞" : `${t}s`}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-sm text-[var(--color-peligro)]">{error}</div>}

        {esHost ? (
          <Button
            tamano="xl"
            className="w-full"
            disabled={sala.jugadores.length < 2}
            cargando={cargando}
            onClick={iniciar}
          >
            {sala.jugadores.length < 2 ? "Esperando jugadores…" : "Empezar partida"}
          </Button>
        ) : (
          <div className="text-center text-[var(--color-tinta-suave)] text-sm">
            Esperando que el anfitrión inicie…
          </div>
        )}
      </Card>
    </div>
  );
}

function VictoriaBtn({
  label,
  activo,
  disabled,
  onClick,
}: {
  label: string;
  activo: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`h-12 rounded-xl border-2 font-semibold text-sm ${
        activo
          ? "gradient-primario text-white border-[var(--color-borde)]"
          : "border-[var(--color-borde)] bg-[var(--color-fondo-elev)]"
      } ${disabled ? "opacity-60" : ""}`}
    >
      {label}
    </button>
  );
}

export function _lobbyCondicionNombre(v: CondicionVictoria): string {
  if (v.tipo === "sets") return `${v.cantidad} sets`;
  if (v.tipo === "tiempo") return `${v.minutos} min`;
  return `$${v.millones}M`;
}
