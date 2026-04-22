"use client";

type ConfettiFn = (opts: {
  particleCount: number;
  startVelocity: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
}) => void;

let confettiPromise: Promise<ConfettiFn> | null = null;

function cargar(): Promise<ConfettiFn> {
  if (!confettiPromise) {
    confettiPromise = import("canvas-confetti").then((m) => m.default as unknown as ConfettiFn);
  }
  return confettiPromise;
}

export type OpcionesConfetti = {
  duracionMs: number;
  porTick: number;
  startVelocity: number;
  spread: number;
  colors: string[];
};

export async function lanzarConfetti(opts: OpcionesConfetti): Promise<void> {
  const confetti = await cargar();
  const fin = Date.now() + opts.duracionMs;
  const ciclo = () => {
    confetti({
      particleCount: opts.porTick,
      startVelocity: opts.startVelocity,
      spread: opts.spread,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      colors: opts.colors,
    });
    if (Date.now() < fin) requestAnimationFrame(ciclo);
  };
  ciclo();
}
