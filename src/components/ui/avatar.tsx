import { memo } from "react";
import { colorAvatar, iniciales } from "@/lib/utils";
import { cn } from "@/lib/utils";

function AvatarBase({
  nombre,
  tamano = 40,
  className,
}: {
  nombre: string;
  tamano?: number;
  className?: string;
}) {
  const color = colorAvatar(nombre);
  const fuente = Math.round(tamano * 0.4);
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold text-white border-2 border-[var(--color-borde)] rounded-full shrink-0",
        className,
      )}
      style={{
        width: tamano,
        height: tamano,
        background: color,
        fontSize: fuente,
        fontFamily: "var(--font-display)",
      }}
      aria-label={nombre}
    >
      {iniciales(nombre || "?")}
    </div>
  );
}

export const Avatar = memo(AvatarBase);
