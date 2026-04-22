import { NextResponse } from "next/server";
import {
  borrarSala,
  configurarJugador,
  configurarMundoHost,
  configurarRelacion,
  guardarTrasAccion,
  iniciarPartida,
  obtenerSala,
  unirse,
  vistaPublica,
  volverALobby,
} from "@/lib/sala-store-vidas";
import { buscarRol } from "@/lib/vidas/mundos";
import { normalizarCodigo } from "@/lib/sala-storage";
import { broadcast } from "@/lib/pusher-server";
import { TODAS_LAS_CARTAS, buscarCarta } from "@/lib/vidas/cartas";
import {
  aplicarEfectos,
  calcularEfectoVinculoPareja,
  chequearMuertePorEdad,
  clamp,
  construirHistorial,
  seleccionarCarta,
} from "@/lib/vidas/motor";
import type { Efectos, EstadoJugador, MundoId, TipoRelacion } from "@/lib/vidas/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Accion =
  | { tipo: "unirse"; nombre: string }
  | { tipo: "salir"; jugadorId: string }
  | { tipo: "setRelacion"; jugadorId: string; relacion: TipoRelacion }
  | { tipo: "setMundo"; jugadorId: string; mundo: MundoId }
  | {
      tipo: "configurarJugador";
      jugadorId: string;
      rol: string;
      nombre: string;
      poderSubtipo?: EstadoJugador["poderSubtipo"];
    }
  | { tipo: "iniciar"; jugadorId: string }
  | { tipo: "pedirCarta"; jugadorId: string }
  | { tipo: "elegirOpcion"; jugadorId: string; opcionIndex: number }
  | { tipo: "volverALobby"; jugadorId: string }
  | { tipo: "borrar"; jugadorId: string };

export async function POST(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  const { codigo: codigoRaw } = await ctx.params;
  const codigo = normalizarCodigo(codigoRaw);
  const body = (await req.json().catch(() => null)) as Accion | null;
  if (!body || !body.tipo) {
    return NextResponse.json({ error: "Falta acción" }, { status: 400 });
  }

  const pre = await obtenerSala(codigo);
  if (!pre && body.tipo !== "unirse") {
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }

  let extra: Record<string, unknown> = {};

  switch (body.tipo) {
    case "unirse": {
      const r = await unirse(codigo, body.nombre);
      if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
      extra = { jugadorId: r.jugadorId };
      break;
    }
    case "setRelacion": {
      const r = await configurarRelacion(codigo, body.jugadorId, body.relacion);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "setMundo": {
      const r = await configurarMundoHost(codigo, body.jugadorId, body.mundo);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "configurarJugador": {
      const salaActual = await obtenerSala(codigo);
      if (!salaActual) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      const rolDef = buscarRol(salaActual.mundo ?? "medieval", body.rol);
      const r = await configurarJugador(codigo, body.jugadorId, {
        rol: body.rol,
        nombre: body.nombre,
        poderSubtipo: body.poderSubtipo,
        statsIniciales: rolDef
          ? { ...rolDef.statsIniciales, nivelPoder: salaActual.mundo === "poderes" ? 10 : 0 }
          : undefined,
        rangoInicial: rolDef?.rangoInicial,
      });
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "iniciar": {
      const r = await iniciarPartida(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "pedirCarta": {
      const sala = await obtenerSala(codigo);
      if (!sala) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      if (sala.fase !== "juego") return NextResponse.json({ error: "No es momento" }, { status: 400 });
      if (sala.cartaActualId) {
        extra = { cartaId: sala.cartaActualId };
        break;
      }
      const quienToca = sala.jugadores.find((j) => j.id === sala.turnoDe);
      if (!quienToca || !quienToca.vivo) return NextResponse.json({ error: "Jugador inválido" }, { status: 400 });
      const mundo = sala.mundo ?? "medieval";
      const pool = TODAS_LAS_CARTAS;
      const elegida = seleccionarCarta(pool, quienToca, mundo, {
        tipoRelacion: sala.tipoRelacion,
        desbloqueadas: quienToca.desbloqueadas,
      });
      if (!elegida) {
        return NextResponse.json({ error: "No hay más cartas" }, { status: 400 });
      }
      sala.cartaActualId = elegida.id;
      sala.cartaActualExtra = null;
      await guardarTrasAccion(sala);
      extra = { cartaId: elegida.id };
      break;
    }
    case "elegirOpcion": {
      const sala = await obtenerSala(codigo);
      if (!sala) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      if (sala.fase !== "juego") return NextResponse.json({ error: "No es momento" }, { status: 400 });
      if (sala.turnoDe !== body.jugadorId) return NextResponse.json({ error: "No es tu turno" }, { status: 400 });
      const cartaId = sala.cartaActualId;
      if (!cartaId) return NextResponse.json({ error: "No hay carta activa" }, { status: 400 });
      const carta = sala.cartaActualExtra ?? buscarCarta(cartaId);
      if (!carta) return NextResponse.json({ error: "Carta no encontrada" }, { status: 400 });
      const opcion = carta.opciones[body.opcionIndex];
      if (!opcion) return NextResponse.json({ error: "Opción inválida" }, { status: 400 });
      const jugIdx = sala.jugadores.findIndex((j) => j.id === body.jugadorId);
      if (jugIdx < 0) return NextResponse.json({ error: "Jugador inválido" }, { status: 400 });
      const jugadorAntes = sala.jugadores[jugIdx];
      const { jugador: despues, cambios } = aplicarEfectos(jugadorAntes, opcion.efectos);
      despues.cartasUsadas = [...despues.cartasUsadas, carta.id];
      if (opcion.desbloqueaCarta) {
        despues.desbloqueadas = [...despues.desbloqueadas, opcion.desbloqueaCarta];
      }
      despues.historial = [...despues.historial, construirHistorial(carta.id, carta.titulo, jugadorAntes, opcion, cambios)];
      const conChequeo = chequearMuertePorEdad(despues);
      sala.jugadores[jugIdx] = conChequeo;

      const otroIdx = 1 - jugIdx;
      const otro = sala.jugadores[otroIdx];
      if (otro && sala.tipoRelacion === "pareja") {
        const delta = (opcion.efectos.vinculo ?? 0) + calcularEfectoVinculoPareja(opcion.efectos, {});
        sala.vinculo = clamp(sala.vinculo + delta, 0, 100);
      } else if (otro && typeof opcion.efectos.vinculo === "number") {
        sala.vinculo = clamp(sala.vinculo + opcion.efectos.vinculo, 0, 100);
      }

      sala.ultimaConsecuencia = {
        jugadorId: jugadorAntes.id,
        jugadorNombre: jugadorAntes.nombre,
        cartaTitulo: carta.titulo,
        opcionTexto: opcion.texto,
        consecuenciaTexto: opcion.consecuenciaTexto,
        efectos: cambios as Efectos,
        ts: Date.now(),
      };
      sala.cartaActualId = null;
      sala.cartaActualExtra = null;

      const ambosVivos = sala.jugadores.every((j) => j.vivo);
      if (!ambosVivos) {
        sala.fase = "fin";
      } else {
        sala.turnoDe = otro?.id ?? sala.turnoDe;
      }

      await guardarTrasAccion(sala);
      extra = { muerteOcurrida: !ambosVivos };
      break;
    }
    case "volverALobby": {
      const r = await volverALobby(codigo, body.jugadorId);
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      break;
    }
    case "borrar": {
      await borrarSala(codigo);
      return NextResponse.json({ ok: true });
    }
    case "salir":
      break;
    default:
      return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  }

  const salaFinal = await obtenerSala(codigo);
  if (!salaFinal) return NextResponse.json({ ok: true, ...extra });
  const publica = vistaPublica(salaFinal);
  await broadcast(`vidas-${codigo}`, "estado-actualizado", publica);
  return NextResponse.json({ sala: publica, ...extra });
}
