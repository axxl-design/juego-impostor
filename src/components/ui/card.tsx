import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  brutal?: boolean;
  glass?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, brutal = true, glass = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border-2 border-[var(--color-borde)]",
        brutal ? "shadow-[var(--shadow-brutal-lg)]" : "",
        glass ? "glass" : "bg-[var(--color-fondo-elev)]",
        className,
      )}
      {...props}
    />
  );
});
