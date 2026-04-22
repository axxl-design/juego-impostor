// Adaptador de almacenamiento para salas online.
//
// Si están configuradas variables de entorno de Vercel KV o Upstash Redis
// (ver README), usa Redis vía REST API — compartido entre instancias serverless.
// Si no, cae a un Map en memoria persistido en globalThis (funciona en dev
// y en un único proceso Node, pero NO sobrevive reinicios ni escala horizontal).

const TTL_SEGUNDOS = 60 * 60 * 4; // 4 horas

function leerEnv(...nombres: string[]): string | undefined {
  for (const n of nombres) {
    const v = process.env[n];
    if (v && v.trim()) return v;
  }
  return undefined;
}

function configKV() {
  const url = leerEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = leerEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return { url, token };
}

export function kvDisponible(): boolean {
  return configKV() !== null;
}

async function kvCmd<T = unknown>(cmd: (string | number)[]): Promise<T> {
  const cfg = configKV();
  if (!cfg) throw new Error("KV no configurado");
  const r = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const j = (await r.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!r.ok || j.error) throw new Error(j.error || `KV ${r.status}`);
  return j.result as T;
}

declare global {
  // eslint-disable-next-line no-var
  var __salasStoreMem: Map<string, { expira: number; valor: string }> | undefined;
}

const MEMORIA =
  globalThis.__salasStoreMem ?? new Map<string, { expira: number; valor: string }>();
globalThis.__salasStoreMem = MEMORIA;

function limpiarMemoria() {
  const ahora = Date.now();
  for (const [k, v] of MEMORIA) {
    if (v.expira < ahora) MEMORIA.delete(k);
  }
}

export function normalizarCodigo(codigo: string): string {
  return (codigo ?? "").trim().toUpperCase();
}

function clave(namespace: string, codigo: string): string {
  return `sala:${namespace}:${normalizarCodigo(codigo)}`;
}

export async function storageGet<T>(namespace: string, codigo: string): Promise<T | null> {
  const k = clave(namespace, codigo);
  if (kvDisponible()) {
    const raw = await kvCmd<string | null>(["GET", k]);
    if (!raw) {
      console.log(`[sala-storage] GET miss (KV) ns=${namespace} codigo="${codigo}" normalizado="${normalizarCodigo(codigo)}" key=${k}`);
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  limpiarMemoria();
  const entrada = MEMORIA.get(k);
  if (!entrada) {
    console.log(`[sala-storage] GET miss (MEM) ns=${namespace} codigo="${codigo}" normalizado="${normalizarCodigo(codigo)}" key=${k} totalEnMem=${MEMORIA.size} aviso="Memoria NO persiste entre instancias de Vercel — configurá KV/Upstash"`);
    return null;
  }
  if (entrada.expira < Date.now()) {
    MEMORIA.delete(k);
    console.log(`[sala-storage] GET expirado ns=${namespace} codigo="${codigo}" key=${k}`);
    return null;
  }
  try {
    return JSON.parse(entrada.valor) as T;
  } catch {
    return null;
  }
}

export async function storageSet<T>(
  namespace: string,
  codigo: string,
  valor: T,
): Promise<void> {
  const k = clave(namespace, codigo);
  const payload = JSON.stringify(valor);
  if (kvDisponible()) {
    await kvCmd(["SET", k, payload, "EX", TTL_SEGUNDOS]);
    console.log(`[sala-storage] SET (KV) ns=${namespace} codigo="${codigo}" key=${k} ttl=${TTL_SEGUNDOS}s`);
    return;
  }
  MEMORIA.set(k, { expira: Date.now() + TTL_SEGUNDOS * 1000, valor: payload });
  console.log(`[sala-storage] SET (MEM) ns=${namespace} codigo="${codigo}" key=${k} totalEnMem=${MEMORIA.size}`);
}

export async function storageDelete(namespace: string, codigo: string): Promise<void> {
  const k = clave(namespace, codigo);
  if (kvDisponible()) {
    await kvCmd(["DEL", k]);
    return;
  }
  MEMORIA.delete(k);
}

export async function storageExists(namespace: string, codigo: string): Promise<boolean> {
  const k = clave(namespace, codigo);
  if (kvDisponible()) {
    const n = await kvCmd<number>(["EXISTS", k]);
    return n > 0;
  }
  limpiarMemoria();
  return MEMORIA.has(k);
}
