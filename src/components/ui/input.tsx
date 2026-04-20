import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border-2 border-[var(--color-borde)] bg-[var(--color-fondo-elev)] px-4 text-base font-medium text-[var(--color-tinta)] shadow-[var(--shadow-brutal)] outline-none transition",
        "placeholder:text-[var(--color-tinta-suave)]",
        "focus:translate-x-1 focus:translate-y-1 focus:shadow-none focus:border-[var(--color-primario-500)]",
        className,
      )}
      {...props}
    />
  );
});
