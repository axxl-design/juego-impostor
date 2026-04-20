"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario" | "ghost" | "peligro" | "exito";
type Tamano = "sm" | "md" | "lg" | "xl";

type ButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  variante?: Variante;
  tamano?: Tamano;
  cargando?: boolean;
  children?: ReactNode;
};

const variantes: Record<Variante, string> = {
  primario:
    "gradient-primario text-white border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)]",
  secundario:
    "bg-[var(--color-fondo-elev)] text-[var(--color-tinta)] border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)]",
  ghost:
    "bg-transparent text-[var(--color-tinta)] border-2 border-transparent hover:bg-[var(--color-fondo-elev)]",
  peligro:
    "bg-[var(--color-peligro)] text-white border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)]",
  exito:
    "bg-[var(--color-exito)] text-white border-2 border-[var(--color-borde)] shadow-[var(--shadow-brutal)]",
};

const tamanos: Record<Tamano, string> = {
  sm: "h-10 px-4 text-sm rounded-xl",
  md: "h-12 px-5 text-base rounded-2xl",
  lg: "h-14 px-7 text-lg rounded-2xl",
  xl: "h-16 px-8 text-xl rounded-3xl font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variante = "primario", tamano = "md", cargando, disabled, children, ...props },
    ref,
  ) {
    const interactivo = !disabled && !cargando;
    return (
      <motion.button
        ref={ref}
        disabled={disabled || cargando}
        whileTap={interactivo ? { x: 4, y: 4, boxShadow: "0 0 0 0 var(--color-borde)" } : undefined}
        whileHover={interactivo ? { y: -2 } : undefined}
        transition={{ duration: 0.1 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold tracking-tight select-none transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantes[variante],
          tamanos[tamano],
          className,
        )}
        {...props}
      >
        {cargando ? (
          <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : null}
        {children}
      </motion.button>
    );
  },
);
