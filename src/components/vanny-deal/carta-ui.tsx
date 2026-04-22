"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Carta, Color } from "@/lib/vanny-deal/types";
import { COLORES } from "@/lib/vanny-deal/colores";
import { infoAccion } from "@/lib/vanny-deal/mazo";

// Tamaños disponibles: mini (mesa ajena), sm (mi mesa), md (mi mano), lg (preview modal)
type Tamano = "mini" | "sm" | "md" | "lg";

function dimensiones(t: Tamano) {
  switch (t) {
    case "mini":
      return "w-12 h-16";
    case "sm":
      return "w-16 h-24";
    case "md":
      return "w-24 h-36";
    case "lg":
      return "w-36 h-52";
  }
}

function borde(t: Tamano) {
  return t === "mini" ? "border-2" : "border-[3px]";
}

function sombra(t: Tamano) {
  return t === "mini" ? "shadow-[2px_2px_0_0_#0a0a0f]" : "shadow-[4px_4px_0_0_#0a0a0f]";
}

export interface CartaUIProps {
  carta: Carta;
  tamano?: Tamano;
  colorElegido?: Color; // para bicolor/arcoiris en mesa
  seleccionada?: boolean;
  deshabilitada?: boolean;
  onClick?: () => void;
  title?: string;
}

function CartaUIBase({ carta, tamano = "md", colorElegido, seleccionada, deshabilitada, onClick, title }: CartaUIProps) {
  const dim = dimensiones(tamano);
  const brd = borde(tamano);
  const shd = sombra(tamano);
  const base = `relative ${dim} ${brd} ${shd} rounded-xl overflow-hidden select-none border-[#0a0a0f] ${
    deshabilitada ? "opacity-40" : ""
  } ${seleccionada ? "ring-4 ring-amber-400 ring-offset-2" : ""} ${onClick ? "cursor-pointer" : ""}`;

  const mot = onClick && !deshabilitada
    ? { whileHover: { y: -4, scale: 1.02 }, whileTap: { scale: 0.97 } }
    : {};

  // Cada tipo dibuja su contenido
  let contenido;
  if (carta.tipo === "propiedad") {
    contenido = <Propiedad color={carta.color} nombre={carta.nombre} valor={carta.valor} tamano={tamano} />;
  } else if (carta.tipo === "dinero") {
    contenido = <Dinero valor={carta.valor} tamano={tamano} />;
  } else if (carta.tipo === "accion") {
    const info = infoAccion(carta.accion);
    contenido = (
      <Accion
        accion={carta.accion}
        nombre={info.nombre}
        descripcion={info.descripcion}
        emoji={info.emoji}
        valor={carta.valor}
        tamano={tamano}
        coloresRenta={carta.coloresRenta}
      />
    );
  } else if (carta.tipo === "casa") {
    contenido = <CasaUI tamano={tamano} />;
  } else if (carta.tipo === "torre") {
    contenido = <TorreUI tamano={tamano} />;
  } else if (carta.tipo === "bicolor") {
    contenido = <Bicolor carta={carta} tamano={tamano} colorElegido={colorElegido} />;
  } else if (carta.tipo === "arcoiris") {
    contenido = <Arcoiris tamano={tamano} />;
  }

  return (
    <motion.div className={base} onClick={deshabilitada ? undefined : onClick} title={title} {...mot}>
      {contenido}
    </motion.div>
  );
}

export const CartaUI = memo(CartaUIBase);

// ─── Propiedad ─────────────────────────────────────────────────────
function Propiedad({ color, nombre, valor, tamano }: { color: Color; nombre: string; valor: number; tamano: Tamano }) {
  const info = COLORES[color];
  const texto = tamano === "mini" ? info.emoji : nombre;
  const textoSize = tamano === "mini" ? "text-xs" : tamano === "sm" ? "text-[10px]" : tamano === "md" ? "text-xs" : "text-base";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: info.bg, color: info.fg }}>
      <div className="flex-1 flex items-center justify-center p-1">
        <div className={`font-black ${textoSize} text-center leading-tight`}>{texto}</div>
      </div>
      {tamano !== "mini" && (
        <div
          className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-[#0a0a0f]"
        >
          ${valor}M
        </div>
      )}
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black" style={{ background: info.bg }} />
    </div>
  );
}

// ─── Dinero ────────────────────────────────────────────────────────
function Dinero({ valor, tamano }: { valor: number; tamano: Tamano }) {
  const fs = tamano === "mini" ? "text-sm" : tamano === "sm" ? "text-lg" : tamano === "md" ? "text-3xl" : "text-5xl";
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#166534", color: "#fff" }}>
      <div className="absolute inset-1 border-2 border-white/40 rounded-md" />
      <div className={`font-black ${fs} font-mono`}>${valor}M</div>
    </div>
  );
}

// ─── Acción ────────────────────────────────────────────────────────
function Accion({
  accion,
  nombre,
  descripcion,
  emoji,
  valor,
  tamano,
  coloresRenta,
}: {
  accion: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  valor: number;
  tamano: Tamano;
  coloresRenta?: [Color, Color];
}) {
  const palette = paletaAccion(accion);
  const fs = tamano === "mini" ? "text-xs" : tamano === "sm" ? "text-[10px]" : tamano === "md" ? "text-xs" : "text-base";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-1" style={{ background: palette.bg, color: palette.fg }}>
      <div className={`font-black text-center ${fs} leading-tight uppercase`}>{tamano === "mini" ? emoji : nombre}</div>
      <div className={tamano === "mini" ? "text-xl" : tamano === "sm" ? "text-3xl" : tamano === "md" ? "text-5xl" : "text-7xl"}>
        {emoji}
      </div>
      {tamano !== "mini" && tamano !== "sm" && (
        <div className="text-[8px] leading-tight text-center opacity-90 px-1">{descripcion}</div>
      )}
      {coloresRenta && tamano !== "mini" && (
        <div className="flex gap-0.5 mb-0.5">
          {coloresRenta.map((c) => (
            <div
              key={c}
              className="w-3 h-3 rounded-sm border border-black"
              style={{ background: COLORES[c].bg }}
            />
          ))}
        </div>
      )}
      {tamano !== "mini" && (
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-[#0a0a0f]">
          ${valor}M
        </div>
      )}
    </div>
  );
}

function paletaAccion(accion: string): { bg: string; fg: string } {
  const ataque = ["impuestoImperial", "roboSelectivo", "asaltoMonopolio", "juicioPopular"];
  const defensa = ["noGracias"];
  const renta = ["rentaUniversal", "rentaBicolor", "cumpleanios"];
  const utilidad = ["pasaConmigo", "megafonoViral", "espionaje", "auditoriaFiscal", "intercambioForzado"];
  if (ataque.includes(accion)) return { bg: "#b91c1c", fg: "#fff" };
  if (defensa.includes(accion)) return { bg: "#06b6d4", fg: "#0a2e3a" };
  if (renta.includes(accion)) return { bg: "#f59e0b", fg: "#1f1300" };
  if (utilidad.includes(accion)) return { bg: "#7c3aed", fg: "#fff" };
  return { bg: "#334155", fg: "#fff" };
}

// ─── Casa / Torre ──────────────────────────────────────────────────
function CasaUI({ tamano }: { tamano: Tamano }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#06b6d4", color: "#0a2e3a" }}>
      <div className={tamano === "mini" ? "text-2xl" : tamano === "sm" ? "text-3xl" : "text-5xl"}>🏠</div>
      {tamano !== "mini" && <div className="text-[10px] font-bold">CASA +$3M</div>}
    </div>
  );
}
function TorreUI({ tamano }: { tamano: Tamano }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#7c3aed", color: "#fff" }}>
      <div className={tamano === "mini" ? "text-2xl" : tamano === "sm" ? "text-3xl" : "text-5xl"}>🏢</div>
      {tamano !== "mini" && <div className="text-[10px] font-bold">TORRE +$4M</div>}
    </div>
  );
}

// ─── Bicolor ───────────────────────────────────────────────────────
function Bicolor({ carta, tamano, colorElegido }: { carta: Extract<Carta, { tipo: "bicolor" }>; tamano: Tamano; colorElegido?: Color }) {
  const c1 = COLORES[carta.colores[0]];
  const c2 = COLORES[carta.colores[1]];
  const c1sel = colorElegido === carta.colores[0];
  const c2sel = colorElegido === carta.colores[1];
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className={`flex-1 flex items-center justify-center ${c1sel ? "ring-2 ring-inset ring-white" : ""}`} style={{ background: c1.bg, color: c1.fg }}>
        <span className="text-lg">{c1.emoji}</span>
      </div>
      <div className={`flex-1 flex items-center justify-center ${c2sel ? "ring-2 ring-inset ring-white" : ""}`} style={{ background: c2.bg, color: c2.fg }}>
        <span className="text-lg">{c2.emoji}</span>
      </div>
      {tamano !== "mini" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[9px] font-black uppercase bg-black/70 text-white px-1.5 py-0.5 rounded">BICOLOR</div>
        </div>
      )}
      {tamano !== "mini" && (
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-[#0a0a0f]">
          ${carta.valor}M
        </div>
      )}
    </div>
  );
}

// ─── Arcoíris ──────────────────────────────────────────────────────
function Arcoiris({ tamano }: { tamano: Tamano }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #dc2626 0%, #f97316 20%, #facc15 40%, #16a34a 60%, #06b6d4 80%, #7c3aed 100%)",
        color: "#fff",
      }}
    >
      <div className={tamano === "mini" ? "text-xl" : "text-3xl"}>🌈</div>
      {tamano !== "mini" && (
        <div className="absolute bottom-1 text-[9px] font-black uppercase bg-black/70 px-1.5 py-0.5 rounded">
          ARCOÍRIS
        </div>
      )}
    </div>
  );
}

// Reverso de carta (para mano de otros jugadores)
export function CartaReverso({ tamano = "sm" }: { tamano?: Tamano }) {
  const dim = dimensiones(tamano);
  return (
    <div
      className={`${dim} border-[3px] border-[#0a0a0f] rounded-xl shadow-[4px_4px_0_0_#0a0a0f] overflow-hidden relative`}
      style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">
        VANNY
      </div>
      <div className="absolute inset-1 border border-white/40 rounded-md" />
    </div>
  );
}
