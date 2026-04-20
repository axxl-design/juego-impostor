import Pusher from "pusher";

let _pusher: Pusher | null = null;

export function pusherConfigurado(): boolean {
  return Boolean(
    process.env.PUSHER_APP_ID &&
      process.env.NEXT_PUBLIC_PUSHER_KEY &&
      process.env.PUSHER_SECRET &&
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  );
}

export function obtenerPusher(): Pusher | null {
  if (!pusherConfigurado()) return null;
  if (!_pusher) {
    _pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return _pusher;
}

export async function broadcast(codigo: string, evento: string, datos: unknown) {
  const p = obtenerPusher();
  if (!p) return;
  try {
    await p.trigger(`sala-${codigo}`, evento, datos);
  } catch (e) {
    console.error("[pusher] broadcast falló", e);
  }
}
