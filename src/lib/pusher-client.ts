"use client";

import PusherClient from "pusher-js";

let _pusher: PusherClient | null = null;

export function pusherConfiguradoCliente() {
  return Boolean(
    process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  );
}

export function obtenerPusherCliente(): PusherClient | null {
  if (!pusherConfiguradoCliente()) return null;
  if (typeof window === "undefined") return null;
  if (!_pusher) {
    _pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return _pusher;
}
