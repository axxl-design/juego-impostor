"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Card } from "./ui/card";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

export function ReglasModal({ abierto, onCerrar }: Props) {
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, onCerrar]);

  if (!montado) return null;

  const contenido = (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
          onClick={onCerrar}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl my-auto"
          >
            <Card className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Ayuda</div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">Cómo jugar</h2>
                </div>
                <button
                  onClick={onCerrar}
                  aria-label="Cerrar"
                  className="h-9 w-9 rounded-xl border-2 border-[var(--color-borde)] grid place-items-center hover:bg-[var(--color-fondo)] transition shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Seccion titulo="🎭 El Juego del Impostor">
                <p>Uno de los jugadores es el <strong>impostor</strong>: los demás saben una palabra; él solo sabe la categoría.
                Durante la discusión, todos se hacen preguntas disimuladas. Al votar, si descubren al impostor ganan los civiles; si
                no, gana el impostor. El impostor también puede arriesgarse a adivinar la palabra y ganar instantáneamente.</p>
              </Seccion>

              <Seccion titulo="❓ ¿Quién Soy?">
                <p>Cada jugador recibe una palabra secreta (un personaje, objeto, lugar...). Se hacen preguntas entre ellos para
                descubrir qué les tocó. Adivinar suma 1 punto, fallar resta 1 (mínimo 0). Gana el primero en llegar al objetivo
                de puntos o quien tenga más al terminar las rondas.</p>
              </Seccion>

              <Seccion titulo="🎴 VANNY Deal">
                <p>
                  Juego de cartas multijugador (2-5 jugadores). Cada turno: <strong>robá 2 cartas → jugá hasta 3 cartas → descartá si te quedan más de 7</strong>.
                  Las cartas pueden ir a tu <em>mesa</em> (propiedades), a tu <em>banco</em> (dinero) o jugarse como <em>acción</em>.
                  Ganás al completar <strong>3 sets de colores distintos</strong> (modo Clásico) o <strong>2 sets</strong> (modo Rápido).
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Modos</p>
                <ul className="mt-1 space-y-1 text-[var(--color-tinta-suave)]">
                  <li><strong>Clásico</strong> — 3 sets para ganar.</li>
                  <li><strong>Rápido</strong> — 2 sets (partidas 8-15 min).</li>
                </ul>
                <p className="mt-2 text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Condiciones de victoria</p>
                <ul className="mt-1 space-y-1 text-[var(--color-tinta-suave)]">
                  <li>Por sets (3 o 2), por tiempo (15 min, gana mayor valor mesa+banco), o por valor en millones.</li>
                </ul>
                <p className="mt-3 text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">Cartas especiales (15 tipos)</p>
                <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-[var(--color-tinta-suave)] text-[12px]">
                  <li>💰 <strong>Renta Universal</strong> — cobrás renta a 1 rival.</li>
                  <li>🎯 <strong>Renta Bicolor</strong> — renta a TODOS en 1 de 2 colores.</li>
                  <li>🎂 <strong>Cumpleaños VANNY</strong> — cada uno te da $2M.</li>
                  <li>👑 <strong>Impuesto Imperial</strong> — 1 rival te paga $5M.</li>
                  <li>🃏 <strong>¡Pasá Conmigo!</strong> — robás 2 cartas extra.</li>
                  <li>🦹 <strong>Robo Selectivo</strong> — 1 propiedad ajena (no de set completo).</li>
                  <li>🔄 <strong>Intercambio Forzado</strong> — 1 x 1 propiedad.</li>
                  <li>💣 <strong>Asalto al Monopolio</strong> — robás 1 set COMPLETO.</li>
                  <li>🛡️ <strong>No, Gracias</strong> — anula un ataque contra vos.</li>
                  <li>🏠 <strong>Casa</strong> — +$3M a un set completo.</li>
                  <li>🏢 <strong>Torre</strong> — +$4M a un set con Casa.</li>
                  <li>🕵️ <strong>Espionaje</strong> — ves la mano ajena 10s.</li>
                  <li>💼 <strong>Auditoría Fiscal</strong> — 1 rival paga $1M por propiedad.</li>
                  <li>📢 <strong>Megáfono Viral</strong> — duplica la próxima acción.</li>
                  <li>⚖️ <strong>Juicio Popular</strong> — veredicto por votación (15s).</li>
                </ul>
              </Seccion>

              <Divisor />

              <Seccion titulo="Reglas extra del Impostor (opcionales)">
                <ul className="space-y-2">
                  <Li emoji="💡" nombre="Pistas">
                    El impostor puede pedir hasta 3 pistas (letra inicial, cantidad de letras, palabra relacionada).
                    Cada una cuesta 1 punto. Los civiles pueden pedir un contexto colectivo una vez por ronda.
                  </Li>
                  <Li emoji="🏆" nombre="Puntaje persistente">
                    Se suman puntos ronda a ronda. +3 civil que vota bien · +5 impostor que sobrevive · +7 impostor que adivina · +1 víctima (voto erróneo).
                  </Li>
                  <Li emoji="🎯" nombre="Robo de puntos">
                    Cuando un civil vota bien al impostor, le roba 2 puntos. Requiere Puntaje persistente.
                  </Li>
                  <Li emoji="⚡" nombre="Poderes aleatorios">
                    1-2 jugadores reciben un poder secreto por ronda: <em>Vidente</em> (ve el voto de otro),
                    <em> Escudo</em> (los votos contra él valen la mitad), <em>Doble agente</em> (acusa falsamente antes de votar),
                    <em> Traductor</em> (ve una palabra falsa extra para despistar).
                  </Li>
                  <Li emoji="💬" nombre="Preguntas sugeridas">
                    Panel plegable durante la discusión con preguntas neutras para romper el hielo.
                  </Li>
                  <Li emoji="👑" nombre="Jefe Final cada 5 rondas">
                    Ronda especial con 2 impostores (no saben quién es el otro), categoría Mezcla total y puntaje duplicado. Requiere Puntaje persistente.
                  </Li>
                </ul>
              </Seccion>

              <Seccion titulo="Reglas extra de ¿Quién Soy? (opcionales)">
                <ul className="space-y-2">
                  <Li emoji="💡" nombre="Pistas">
                    Cada jugador puede pedir hasta 3 pistas sobre su propia palabra. Cada una cuesta 1 punto (mínimo 1 pt para pedir).
                  </Li>
                  <Li emoji="🛡️" nombre="Escudo comprable">
                    Con 5+ puntos podés comprar un escudo por 2 puntos. Evita el próximo fallo (no se suman -1). Solo 1 activo a la vez.
                  </Li>
                </ul>
              </Seccion>

              <p className="mt-6 text-xs text-[var(--color-tinta-suave)] text-center">
                Todas las reglas extra son opt-in: si no las activás, el juego funciona como siempre.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(contenido, document.body);
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="font-display font-bold text-lg mb-2">{titulo}</h3>
      <div className="text-sm leading-relaxed text-[var(--color-tinta)]">{children}</div>
    </section>
  );
}

function Li({ emoji, nombre, children }: { emoji: string; nombre: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="text-xl leading-none shrink-0">{emoji}</span>
      <span>
        <strong className="font-bold">{nombre}.</strong>{" "}
        <span className="text-[var(--color-tinta-suave)]">{children}</span>
      </span>
    </li>
  );
}

function Divisor() {
  return <div className="my-5 h-px bg-[var(--color-borde)] opacity-30" />;
}
