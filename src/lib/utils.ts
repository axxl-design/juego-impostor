export function generarCodigoSala(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let codigo = "";
  for (let i = 0; i < 4; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }
  return codigo;
}

export function generarId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const PALETA_AVATAR = [
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#3B82F6",
  "#D946EF",
  "#84CC16",
];

export function colorAvatar(nombre: string): string {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = (hash << 5) - hash + nombre.charCodeAt(i);
    hash |= 0;
  }
  return PALETA_AVATAR[Math.abs(hash) % PALETA_AVATAR.length];
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function elegirAleatorio<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function mezclar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cn(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(" ");
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + costo);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

export function esMismaPalabra(input: string, objetivo: string): boolean {
  const ni = normalizar(input);
  const no = normalizar(objetivo);
  if (!ni || !no) return false;
  if (ni === no) return true;

  const sin = (s: string) => s.replace(/\s+/g, "");
  const niCompacto = sin(ni);
  const noCompacto = sin(no);
  if (niCompacto === noCompacto) return true;

  const tol = noCompacto.length <= 4 ? 1 : 2;
  if (levenshtein(ni, no) <= tol) return true;
  if (levenshtein(niCompacto, noCompacto) <= tol) return true;

  if (niCompacto.length >= 4 && noCompacto.includes(niCompacto)) return true;

  const noTokens = no.split(" ").filter((t) => t.length >= 3);
  const niTokens = ni.split(" ").filter((t) => t.length >= 1);
  if (noTokens.length > 0 && niTokens.length > 0) {
    const todosMatch = noTokens.every((nt) =>
      niTokens.some((it) => {
        const tt = nt.length <= 4 ? 1 : 2;
        return it === nt || levenshtein(it, nt) <= tt;
      }),
    );
    if (todosMatch) return true;
  }

  return false;
}
