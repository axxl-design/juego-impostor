"use client";

import Link from "next/link";
import { ArrowLeft, VenetianMask } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header({ volver }: { volver?: string }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
      {volver ? (
        <Link
          href={volver}
          className="inline-flex items-center gap-2 h-12 px-4 rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] shadow-[var(--shadow-brutal)] active:translate-x-1 active:translate-y-1 active:shadow-none transition font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Volver</span>
        </Link>
      ) : (
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="grid place-items-center h-11 w-11 rounded-2xl gradient-primario border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)] text-white">
            <VenetianMask className="h-5 w-5" />
          </span>
          <span className="font-display font-bold text-lg leading-none tracking-tight">
            Impostor
          </span>
        </Link>
      )}
      <ThemeToggle />
    </header>
  );
}
