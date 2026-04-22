"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartaUI } from "./carta-ui";
import type {
  Carta,
  Color,
  VistaPrivada,
  VistaPublica,
} from "@/lib/vanny-deal/types";
import { COLORES } from "@/lib/vanny-deal/colores";
import type { AccionCliente } from "@/lib/sala-store-vanny-deal";
import type { PayloadAccion } from "@/lib/vanny-deal/acciones";

// ─── Overlay para jugar una carta de acción (target picker) ────────

interface OverlayAccionProps {
  carta: Carta;
  sala: VistaPublica;
  jugadorId: string;
  onCerrar: () => void;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}

export function OverlayAccion({ carta, sala, jugadorId, onCerrar, onAccion }: OverlayAccionProps) {
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const [cartaObjetivo, setCartaObjetivo] = useState<string | null>(null);
  const [cartaOfrecida, setCartaOfrecida] = useState<string | null>(null);
  const [veredicto, setVeredicto] = useState<"robarPropiedad" | "cobrar3M" | null>(null);
  const [agregarACartaId, setAgregarACartaId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const otros = sala.jugadores.filter((j) => j.id !== jugadorId);
  const yo = sala.jugadores.find((j) => j.id === jugadorId);

  const confirmar = async () => {
    setErr(null);
    const payload: PayloadAccion = {};
    if (carta.tipo === "casa" || carta.tipo === "torre") {
      if (!agregarACartaId) return setErr("Elegí un set completo");
      payload.agregarACartaId = agregarACartaId;
    } else if (carta.tipo === "accion") {
      const a = carta.accion;
      if (a === "rentaUniversal") {
        if (!color) return setErr("Elegí un color tuyo");
        if (!objetivo) return setErr("Elegí un oponente");
        payload.setColorRenta = color;
        payload.objetivoJugadorId = objetivo;
      } else if (a === "rentaBicolor") {
        if (!color) return setErr("Elegí uno de los 2 colores");
        payload.setColorRenta = color;
      } else if (a === "impuestoImperial" || a === "espionaje" || a === "auditoriaFiscal") {
        if (!objetivo) return setErr("Elegí un oponente");
        payload.objetivoJugadorId = objetivo;
      } else if (a === "roboSelectivo") {
        if (!objetivo) return setErr("Elegí un oponente");
        if (!cartaObjetivo) return setErr("Elegí la propiedad a robar");
        payload.objetivoJugadorId = objetivo;
        payload.objetivoCartaId = cartaObjetivo;
      } else if (a === "intercambioForzado") {
        if (!objetivo || !cartaObjetivo || !cartaOfrecida) return setErr("Elegí propiedades");
        payload.objetivoJugadorId = objetivo;
        payload.objetivoCartaId = cartaObjetivo;
        payload.ofrecidaCartaId = cartaOfrecida;
      } else if (a === "asaltoMonopolio") {
        if (!objetivo || !color) return setErr("Elegí oponente y color del set");
        payload.objetivoJugadorId = objetivo;
        payload.setColor = color;
      } else if (a === "juicioPopular") {
        if (!objetivo || !veredicto) return setErr("Elegí oponente y veredicto");
        payload.objetivoJugadorId = objetivo;
        payload.veredictoJuicio = veredicto;
      }
      // cumpleanios, pasaConmigo, megafonoViral: sin payload adicional
    }
    const r = await onAccion({ tipo: "jugarAccion", jugadorId, cartaId: carta.id, payload });
    if (!r.ok) setErr(r.error ?? "Error");
    else onCerrar();
  };

  return (
    <ModalBase onCerrar={onCerrar}>
      <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
        Jugar carta
      </div>
      <div className="flex gap-3">
        <CartaUI carta={carta} tamano="lg" />
        <div className="flex-1 space-y-3 text-sm">
          <ContenidoPayload
            carta={carta}
            sala={sala}
            yo={yo}
            otros={otros}
            objetivo={objetivo}
            setObjetivo={setObjetivo}
            color={color}
            setColor={setColor}
            cartaObjetivo={cartaObjetivo}
            setCartaObjetivo={setCartaObjetivo}
            cartaOfrecida={cartaOfrecida}
            setCartaOfrecida={setCartaOfrecida}
            veredicto={veredicto}
            setVeredicto={setVeredicto}
            agregarACartaId={agregarACartaId}
            setAgregarACartaId={setAgregarACartaId}
          />
        </div>
      </div>
      {err && <div className="text-sm text-[var(--color-peligro)] mt-2">{err}</div>}
      <div className="mt-4 flex gap-2 justify-end">
        <Button variante="ghost" tamano="sm" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button tamano="sm" onClick={confirmar}>
          Jugar
        </Button>
      </div>
    </ModalBase>
  );
}

function ContenidoPayload({
  carta,
  sala,
  yo,
  otros,
  objetivo,
  setObjetivo,
  color,
  setColor,
  cartaObjetivo,
  setCartaObjetivo,
  cartaOfrecida,
  setCartaOfrecida,
  veredicto,
  setVeredicto,
  agregarACartaId,
  setAgregarACartaId,
}: {
  carta: Carta;
  sala: VistaPublica;
  yo?: VistaPublica["jugadores"][number];
  otros: VistaPublica["jugadores"];
  objetivo: string | null;
  setObjetivo: (v: string | null) => void;
  color: Color | null;
  setColor: (v: Color | null) => void;
  cartaObjetivo: string | null;
  setCartaObjetivo: (v: string | null) => void;
  cartaOfrecida: string | null;
  setCartaOfrecida: (v: string | null) => void;
  veredicto: "robarPropiedad" | "cobrar3M" | null;
  setVeredicto: (v: "robarPropiedad" | "cobrar3M" | null) => void;
  agregarACartaId: string | null;
  setAgregarACartaId: (v: string | null) => void;
}) {
  // Casa / Torre: elegir set completo propio
  if (carta.tipo === "casa" || carta.tipo === "torre") {
    const setsCompletos = (yo?.mesa ?? []).filter((s) => {
      if (s.color === "servicio") return false;
      if (s.cartaIds.length < COLORES[s.color].cantidadSet) return false;
      if (carta.tipo === "casa" && s.casa) return false;
      if (carta.tipo === "torre" && (!s.casa || s.torre)) return false;
      return true;
    });
    return (
      <div>
        <div>Elegí un set completo:</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {setsCompletos.length === 0 && <div className="text-xs text-[var(--color-tinta-suave)]">No hay sets elegibles</div>}
          {setsCompletos.map((s) => (
            <button
              key={s.color}
              onClick={() => setAgregarACartaId(s.cartaIds[0])}
              className={`px-2 py-1 rounded border-2 border-black text-xs font-bold ${
                s.cartaIds[0] === agregarACartaId ? "ring-2 ring-amber-400" : ""
              }`}
              style={{ background: COLORES[s.color].bg, color: COLORES[s.color].fg }}
            >
              {COLORES[s.color].nombre}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (carta.tipo !== "accion") return null;
  const a = carta.accion;

  // cumpleaños / pasaConmigo / megafonoViral: sin payload
  if (a === "cumpleanios" || a === "pasaConmigo" || a === "megafonoViral") {
    return <div className="text-xs text-[var(--color-tinta-suave)]">Esta carta se aplica directamente.</div>;
  }

  // rentaBicolor
  if (a === "rentaBicolor") {
    const cols = carta.coloresRenta ?? [];
    return (
      <div>
        <div>Elegí uno de los dos colores:</div>
        <div className="flex gap-1 mt-2">
          {cols.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`px-2 py-1 rounded border-2 border-black text-xs font-bold ${
                color === c ? "ring-2 ring-amber-400" : ""
              }`}
              style={{ background: COLORES[c].bg, color: COLORES[c].fg }}
            >
              {COLORES[c].nombre}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-[var(--color-tinta-suave)] mt-1">
          Cobrás a TODOS los jugadores.
        </div>
      </div>
    );
  }

  // rentaUniversal: color propio + oponente
  if (a === "rentaUniversal") {
    const misSets = yo?.mesa ?? [];
    return (
      <div className="space-y-2">
        <div>Color tuyo:</div>
        <div className="flex flex-wrap gap-1">
          {misSets.map((s) => (
            <button
              key={s.color}
              onClick={() => setColor(s.color)}
              className={`px-2 py-1 rounded border-2 border-black text-xs font-bold ${
                color === s.color ? "ring-2 ring-amber-400" : ""
              }`}
              style={{ background: COLORES[s.color].bg, color: COLORES[s.color].fg }}
            >
              {COLORES[s.color].nombre} ({s.cartaIds.length})
            </button>
          ))}
        </div>
        <div>Oponente:</div>
        <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />
      </div>
    );
  }

  // Single target simple
  if (a === "impuestoImperial" || a === "espionaje" || a === "auditoriaFiscal") {
    return <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />;
  }

  // roboSelectivo
  if (a === "roboSelectivo") {
    const obj = otros.find((o) => o.id === objetivo);
    const disponibles = obj
      ? obj.mesa.flatMap((s) =>
          s.cartaIds.length < COLORES[s.color].cantidadSet ? s.cartaIds : [],
        )
      : [];
    return (
      <div className="space-y-2">
        <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />
        {obj && (
          <div>
            <div>Propiedades robables:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {disponibles.length === 0 && (
                <div className="text-xs text-[var(--color-tinta-suave)]">Sin propiedades libres</div>
              )}
              {disponibles.map((id) => (
                <button
                  key={id}
                  onClick={() => setCartaObjetivo(id)}
                  className={`px-2 py-1 rounded border-2 border-black text-[10px] font-bold ${
                    cartaObjetivo === id ? "ring-2 ring-amber-400" : ""
                  } bg-[var(--color-fondo-elev)]`}
                >
                  {id.slice(0, 10)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // intercambioForzado
  if (a === "intercambioForzado") {
    const obj = otros.find((o) => o.id === objetivo);
    const ajenas = obj ? obj.mesa.flatMap((s) => (s.cartaIds.length < COLORES[s.color].cantidadSet ? s.cartaIds : [])) : [];
    const mias = yo ? yo.mesa.flatMap((s) => (s.cartaIds.length < COLORES[s.color].cantidadSet ? s.cartaIds : [])) : [];
    return (
      <div className="space-y-2">
        <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />
        {obj && (
          <>
            <div>Su propiedad:</div>
            <div className="flex flex-wrap gap-1">
              {ajenas.map((id) => (
                <button
                  key={id}
                  onClick={() => setCartaObjetivo(id)}
                  className={`px-2 py-1 rounded border-2 border-black text-[10px] ${
                    cartaObjetivo === id ? "ring-2 ring-amber-400" : ""
                  } bg-[var(--color-fondo-elev)]`}
                >
                  {id.slice(0, 10)}
                </button>
              ))}
            </div>
            <div>Tu propiedad:</div>
            <div className="flex flex-wrap gap-1">
              {mias.map((id) => (
                <button
                  key={id}
                  onClick={() => setCartaOfrecida(id)}
                  className={`px-2 py-1 rounded border-2 border-black text-[10px] ${
                    cartaOfrecida === id ? "ring-2 ring-amber-400" : ""
                  } bg-[var(--color-fondo-elev)]`}
                >
                  {id.slice(0, 10)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // asaltoMonopolio
  if (a === "asaltoMonopolio") {
    const obj = otros.find((o) => o.id === objetivo);
    const setsCompletos = obj
      ? obj.mesa.filter((s) => s.cartaIds.length >= COLORES[s.color].cantidadSet)
      : [];
    return (
      <div className="space-y-2">
        <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />
        {obj && (
          <>
            <div>Elegí un SET COMPLETO:</div>
            <div className="flex flex-wrap gap-1">
              {setsCompletos.length === 0 && (
                <div className="text-xs text-[var(--color-tinta-suave)]">No tiene sets completos</div>
              )}
              {setsCompletos.map((s) => (
                <button
                  key={s.color}
                  onClick={() => setColor(s.color)}
                  className={`px-2 py-1 rounded border-2 border-black text-xs font-bold ${
                    color === s.color ? "ring-2 ring-amber-400" : ""
                  }`}
                  style={{ background: COLORES[s.color].bg, color: COLORES[s.color].fg }}
                >
                  {COLORES[s.color].nombre}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // juicioPopular
  if (a === "juicioPopular") {
    return (
      <div className="space-y-2">
        <OponenteSelector otros={otros} objetivo={objetivo} setObjetivo={setObjetivo} />
        <div>Veredicto:</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setVeredicto("robarPropiedad")}
            className={`px-2 py-1 rounded border-2 border-black text-xs ${
              veredicto === "robarPropiedad" ? "ring-2 ring-amber-400" : ""
            } bg-[var(--color-fondo-elev)]`}
          >
            Robar 1 propiedad
          </button>
          <button
            onClick={() => setVeredicto("cobrar3M")}
            className={`px-2 py-1 rounded border-2 border-black text-xs ${
              veredicto === "cobrar3M" ? "ring-2 ring-amber-400" : ""
            } bg-[var(--color-fondo-elev)]`}
          >
            Cobrar $3M
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function OponenteSelector({
  otros,
  objetivo,
  setObjetivo,
}: {
  otros: VistaPublica["jugadores"];
  objetivo: string | null;
  setObjetivo: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {otros.map((o) => (
        <button
          key={o.id}
          onClick={() => setObjetivo(o.id)}
          className={`px-2 py-1 rounded-full border-2 border-black text-xs ${
            objetivo === o.id ? "ring-2 ring-amber-400" : ""
          } bg-[var(--color-fondo-elev)]`}
        >
          {o.avatar} {o.nombre}
        </button>
      ))}
    </div>
  );
}

// ─── Modal base ───────────────────────────────────────────────────

function ModalBase({ children, onCerrar }: { children: React.ReactNode; onCerrar: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-2"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="p-4 bg-[var(--color-fondo-elev)]">{children}</Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Overlay de pago ───────────────────────────────────────────────

export function OverlayPago({
  sala,
  mano,
  jugadorId,
  onAccion,
}: {
  sala: VistaPublica;
  mano: VistaPrivada | null;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}) {
  const pago = sala.pago;
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const yo = sala.jugadores.find((j) => j.id === jugadorId);
  const abierto = pago?.deudores.includes(jugadorId) ?? false;

  useEffect(() => {
    setSeleccionadas([]);
  }, [pago?.id]);

  if (!pago || !abierto || !yo) return null;

  const dineroValor = (id: string) => {
    const c = yo.banco.cartas.find((x) => x.id === id);
    return c?.valor ?? 0;
  };
  const propValor = (id: string) => {
    for (const s of yo.mesa) {
      if (s.cartaIds.includes(id)) {
        // valor de la carta — no tenemos el valor aquí (faltan cartas en vista pública),
        // usamos valorPropiedad del color como aproximación
        return COLORES[s.color].valorPropiedad;
      }
    }
    return 0;
  };
  const totalSel = seleccionadas.reduce((s, id) => s + dineroValor(id) + propValor(id), 0);
  const valorTotalMio = yo.banco.valorTotal + yo.mesa.reduce((sum, s) => sum + s.cartaIds.length * COLORES[s.color].valorPropiedad + (s.casa ? 3 : 0) + (s.torre ? 4 : 0), 0);
  const minimo = Math.min(pago.monto, valorTotalMio);

  const pagar = async () => {
    setErr(null);
    if (totalSel < minimo) {
      setErr(`Necesitás al menos $${minimo}M (total seleccionado $${totalSel}M)`);
      return;
    }
    const r = await onAccion({ tipo: "pagar", jugadorId, cartas: seleccionadas });
    if (!r.ok) setErr(r.error ?? "Error");
  };

  const pagarConNada = async () => {
    const r = await onAccion({ tipo: "pagarConNada", jugadorId });
    if (!r.ok) setErr(r.error ?? "Error");
  };

  return (
    <ModalBase onCerrar={() => { /* bloqueante */ }}>
      <div className="text-xs uppercase tracking-widest text-[var(--color-peligro)] font-bold">
        Pago pendiente
      </div>
      <div className="mt-1 font-bold text-lg">
        Debés ${pago.monto}M a {sala.jugadores.find((x) => x.id === pago.acreedorId)?.nombre ?? "?"}
      </div>
      <div className="text-xs text-[var(--color-tinta-suave)]">{pago.motivo}</div>

      {valorTotalMio === 0 ? (
        <div className="mt-3 space-y-2">
          <div className="text-sm">No tenés nada para pagar.</div>
          <Button tamano="sm" onClick={pagarConNada}>
            Pagar con nada
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-1">
              Banco (${yo.banco.valorTotal}M)
            </div>
            <div className="flex flex-wrap gap-1">
              {yo.banco.cartas.map((c) => {
                const sel = seleccionadas.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      setSeleccionadas(
                        sel ? seleccionadas.filter((x) => x !== c.id) : [...seleccionadas, c.id],
                      )
                    }
                    className={`text-[11px] font-mono font-black px-2 py-1 rounded border-2 border-black ${
                      sel ? "bg-amber-400" : "bg-green-700 text-white"
                    }`}
                  >
                    ${c.valor}M
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-1">
              Propiedades (puestas al valor base)
            </div>
            <div className="flex flex-wrap gap-1">
              {yo.mesa.flatMap((s) =>
                s.cartaIds.map((id) => {
                  const sel = seleccionadas.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() =>
                        setSeleccionadas(
                          sel ? seleccionadas.filter((x) => x !== id) : [...seleccionadas, id],
                        )
                      }
                      className={`text-[10px] font-bold px-2 py-1 rounded border-2 border-black ${
                        sel ? "ring-2 ring-amber-400" : ""
                      }`}
                      style={{
                        background: COLORES[s.color].bg,
                        color: COLORES[s.color].fg,
                      }}
                    >
                      {COLORES[s.color].emoji} ${COLORES[s.color].valorPropiedad}M
                    </button>
                  );
                }),
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Total: <span className="font-mono font-black">${totalSel}M</span> / ${minimo}M</div>
            <Button tamano="sm" onClick={pagar} disabled={totalSel < minimo}>
              Pagar
            </Button>
          </div>
        </div>
      )}
      {err && <div className="text-sm text-[var(--color-peligro)] mt-2">{err}</div>}
    </ModalBase>
  );
}

// ─── Overlay No Gracias ────────────────────────────────────────────

export function OverlayNoGracias({
  sala,
  mano,
  jugadorId,
  onAccion,
}: {
  sala: VistaPublica;
  mano: VistaPrivada | null;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}) {
  const ng = sala.noGracias;
  if (!ng || !ng.esperandoRespuestaDe.includes(jugadorId)) return null;
  const misCartas = mano?.mano.filter((c) => c.tipo === "accion" && c.accion === "noGracias") ?? [];

  const restante = Math.max(0, ng.expira - Date.now());
  const seg = Math.ceil(restante / 1000);

  const usar = async () => {
    if (misCartas.length === 0) return;
    await onAccion({ tipo: "usarNoGracias", jugadorId, cartaId: misCartas[0].id });
  };
  const pasar = async () => {
    await onAccion({ tipo: "pasarNoGracias", jugadorId });
  };

  const origenN = sala.jugadores.find((j) => j.id === ng.accionOriginal.origenJugadorId)?.nombre;
  return (
    <ModalBase onCerrar={() => { /* bloqueante */ }}>
      <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
        Ventana de defensa · {seg}s
      </div>
      <div className="mt-1 text-lg font-bold">
        {origenN} te atacó con <span className="italic">{ng.accionOriginal.tipo}</span>
      </div>
      <div className="text-xs text-[var(--color-tinta-suave)] mt-1">
        {ng.cadenaNoGracias.length === 0
          ? "Podés usar un No, Gracias para cancelar."
          : `Ya hay ${ng.cadenaNoGracias.length} No, Gracias en cascada.`}
      </div>
      <div className="mt-3 flex gap-2">
        <Button tamano="sm" onClick={usar} disabled={misCartas.length === 0}>
          🛡️ Usar No, Gracias {misCartas.length === 0 ? "(no tenés)" : ""}
        </Button>
        <Button tamano="sm" variante="secundario" onClick={pasar}>
          Dejar pasar
        </Button>
      </div>
    </ModalBase>
  );
}

// ─── Overlay Juicio ────────────────────────────────────────────────

export function OverlayJuicio({
  sala,
  jugadorId,
  onAccion,
}: {
  sala: VistaPublica;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}) {
  const j = sala.juicio;
  if (!j) return null;
  const esElegible = j.origenJugadorId !== jugadorId && j.objetivoJugadorId !== jugadorId;
  const yaVoto = !!j.votos[jugadorId];
  const restante = Math.max(0, j.expira - Date.now());
  const seg = Math.ceil(restante / 1000);
  const origenN = sala.jugadores.find((x) => x.id === j.origenJugadorId)?.nombre;
  const objN = sala.jugadores.find((x) => x.id === j.objetivoJugadorId)?.nombre;
  const votar = async (voto: "si" | "no") => {
    await onAccion({ tipo: "votarJuicio", jugadorId, voto });
  };

  return (
    <ModalBase onCerrar={() => { /* bloqueante */ }}>
      <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
        Juicio Popular · {seg}s
      </div>
      <div className="mt-1 text-lg font-bold">
        {origenN} vs {objN}
      </div>
      <div className="text-sm mt-1">
        Veredicto propuesto:{" "}
        {j.veredicto === "robarPropiedad" ? "robar 1 propiedad a " + objN : "cobrar $3M a " + objN}
      </div>
      <div className="text-xs text-[var(--color-tinta-suave)] mt-1">
        Votos: {Object.keys(j.votos).length}
      </div>
      {esElegible ? (
        yaVoto ? (
          <div className="mt-3 text-sm">Ya votaste.</div>
        ) : (
          <div className="mt-3 flex gap-2">
            <Button tamano="sm" variante="exito" onClick={() => votar("si")}>
              SÍ
            </Button>
            <Button tamano="sm" variante="peligro" onClick={() => votar("no")}>
              NO
            </Button>
          </div>
        )
      ) : (
        <div className="mt-3 text-sm text-[var(--color-tinta-suave)]">No podés votar vos.</div>
      )}
    </ModalBase>
  );
}

// ─── Overlay Espionaje ─────────────────────────────────────────────

export function OverlayEspionaje({
  sala,
  mano,
  jugadorId,
  onAccion,
}: {
  sala: VistaPublica;
  mano: VistaPrivada | null;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}) {
  const esp = sala.espionaje;
  if (!esp) return null;
  const soyEspia = esp.miradorId === jugadorId;
  const soyObjetivo = esp.objetivoId === jugadorId;
  const restante = Math.max(0, esp.expira - Date.now());
  const seg = Math.ceil(restante / 1000);

  const cerrar = async () => {
    await onAccion({ tipo: "cerrarEspionaje", jugadorId });
  };

  if (soyEspia && mano?.manoEspiada) {
    return (
      <ModalBase onCerrar={cerrar}>
        <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)]">
          Espiando mano · {seg}s
        </div>
        <div className="mt-2 flex flex-wrap gap-1 max-h-[60vh] overflow-auto">
          {mano.manoEspiada.map((c) => (
            <CartaUI key={c.id} carta={c} tamano="sm" />
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Button tamano="sm" onClick={cerrar}>
            Cerrar
          </Button>
        </div>
      </ModalBase>
    );
  }
  if (soyObjetivo) {
    return (
      <ModalBase onCerrar={() => { /* bloqueante */ }}>
        <div className="text-lg font-bold">🕵️ Alguien está mirando tu mano…</div>
        <div className="text-sm mt-1">Durante {seg}s.</div>
      </ModalBase>
    );
  }
  return null;
}

// ─── Overlay Fin ───────────────────────────────────────────────────

export function OverlayFin({
  sala,
  jugadorId,
  onAccion,
}: {
  sala: VistaPublica;
  jugadorId: string;
  onAccion: (a: AccionCliente) => Promise<{ ok: boolean; error?: string }>;
}) {
  const ganadorId = sala.ganador?.jugadorIds.join(",") ?? "";
  useEffect(() => {
    if (!ganadorId) return;
    (async () => {
      try {
        const mod = await import("canvas-confetti");
        mod.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      } catch {}
    })();
  }, [ganadorId]);

  if (!sala.ganador) return null;
  const esHost = sala.hostId === jugadorId;
  const g = sala.ganador;
  const ganadores = sala.jugadores.filter((j) => g.jugadorIds.includes(j.id));
  const estadisticas = sala.estadisticas;

  return (
    <ModalBase onCerrar={() => { /* bloqueante */ }}>
      <div className="text-center">
        <div className="text-5xl">🏆</div>
        <div className="mt-2 text-2xl font-black">
          {ganadores.length === 1 ? "¡GANADOR!" : "EMPATE"}
        </div>
        <div className="mt-1 font-bold">
          {ganadores.map((g) => `${g.avatar} ${g.nombre}`).join(", ")}
        </div>
        <div className="text-xs text-[var(--color-tinta-suave)] mt-1">{g.motivo}</div>
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-[var(--color-tinta-suave)] mb-2">
          Estadísticas
        </div>
        <div className="space-y-1 text-sm">
          {sala.jugadores.map((j) => {
            const est = estadisticas[j.id];
            if (!est) return null;
            return (
              <div key={j.id} className="flex justify-between">
                <span>{j.avatar} {j.nombre}</span>
                <span className="font-mono text-xs">
                  🃏 {est.cartasJugadas} · ⚔️ {est.ataques} · 🛡️ {est.defensas}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        {esHost && (
          <>
            <Button
              tamano="sm"
              variante="secundario"
              onClick={() => onAccion({ tipo: "volverALobby", jugadorId })}
            >
              Volver al lobby
            </Button>
            <Button tamano="sm" onClick={() => onAccion({ tipo: "jugarOtraVez", jugadorId })}>
              Jugar de nuevo
            </Button>
          </>
        )}
        {!esHost && (
          <div className="text-sm text-[var(--color-tinta-suave)]">Esperando al anfitrión…</div>
        )}
      </div>
    </ModalBase>
  );
}
