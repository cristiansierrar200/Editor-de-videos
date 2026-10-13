// Toda la "edición" del vídeo de review vive aquí: guion, subtítulos, gráficos y recortes.
// Los tiempos van en SEGUNDOS respecto al archivo ORIGINAL de cada clip.

export type Palabra = { texto: string; inicio: number; fin: number };

export type Grafico =
  | { tipo: "chip"; texto: string; inicio: number; fin: number; posicion?: "arriba" | "medio" }
  | { tipo: "titular"; texto: string; acento?: string; inicio: number; fin: number; tamano?: number }
  | { tipo: "cta"; texto: string; sub: string; inicio: number; fin: number };

// Estima sílabas en español (grupos de vocales) para repartir el tiempo de cada palabra.
const silabas = (p: string) =>
  Math.max(1, (p.toLowerCase().match(/[aeiouáéíóúü]+/g) ?? []).length);

/** Reparte las palabras de una frase entre `inicio` y `fin` según sus sílabas. */
export const sincronizar = (frase: string, inicio: number, fin: number): Palabra[] => {
  const palabras = frase.split(/\s+/).filter(Boolean);
  const pesos = palabras.map((p) => silabas(p) + 0.35);
  const total = pesos.reduce((a, b) => a + b, 0);
  let t = inicio;
  return palabras.map((texto, i) => {
    const d = ((fin - inicio) * pesos[i]) / total;
    const w = { texto, inicio: t, fin: t + d };
    t += d;
    return w;
  });
};

// Recortes: qué parte de cada archivo se usa [desde, hasta] en segundos.
export const RECORTES: Record<string, [number, number]> = {
  "clips/01.mp4": [0, 3.67],
  "clips/02.mp4": [0.5, 4.1],
  "clips/03.mp4": [0.4, 4.4],
  "clips/04.mp4": [0.2, 4.2],
  "clips/05.mp4": [0.4, 4.4],
  "clips/06.mp4": [0.2, 4.2],
  "clips/07.mp4": [0.1, 4.1],
  "clips/08.mp4": [0.4, 4.4],
  "clips/09.mp4": [0.45, 12.15],
};

// ── 1 · HOOK: aparecen de arriba hacia abajo mientras corres ─────────────────
export const PISADAS = [
  { texto: "¿Pronador,", inicio: 0.25 },
  { texto: "supinador", inicio: 0.9 },
  { texto: "o neutral?", inicio: 1.55 },
];

// ── 2 · Presentación ────────────────────────────────────────────────────────
export const SUBS_CLIP2 = sincronizar(
  "Te contamos qué debes buscar en tus tenis para correr.",
  0.75,
  3.95,
);
export const GRAFICOS_CLIP2: Grafico[] = [
  { tipo: "titular", acento: "Encuentra", texto: "tus tenis ideales según tu pisada", inicio: 0.6, fin: 4.1 },
];

// ── 3–8 · Las tres pisadas ─────────────────────────────────────────────────
export type Seccion = {
  numero: string;
  tipo: string;
  beneficio: string;
  descripcion: string;
  inclinacion: number; // grados del diagrama de pisada (+ hacia adentro, - hacia afuera)
  marca: string;
  modelo: string;
  claves: string[];
  clips: [string, string];
};

export const SECCIONES: Seccion[] = [
  {
    numero: "01",
    tipo: "Pronadora",
    beneficio: "Estabilidad",
    descripcion: "Tu pie gira hacia adentro",
    inclinacion: 14,
    marca: "Adidas",
    modelo: "Duramo SL",
    claves: ["Comodidad", "Base de apoyo"],
    clips: ["clips/03.mp4", "clips/04.mp4"],
  },
  {
    numero: "02",
    tipo: "Supinadora",
    beneficio: "Amortiguación",
    descripcion: "Apoyas más el borde exterior",
    inclinacion: -14,
    marca: "Adidas",
    modelo: "Galaxy Star",
    claves: ["Amortiguación", "Pisada cómoda"],
    clips: ["clips/05.mp4", "clips/06.mp4"],
  },
  {
    numero: "03",
    tipo: "Neutral",
    beneficio: "Comodidad y amortiguación",
    descripcion: "Tu pie se mueve de forma natural",
    inclinacion: 0,
    marca: "Adidas",
    modelo: "Runfalcon 6",
    claves: ["Comodidad", "Ajuste"],
    clips: ["clips/07.mp4", "clips/08.mp4"],
  },
];

// ── 9 · Cierre ─────────────────────────────────────────────────────────────
export const SUBS_CLIP9 = [
  ...sincronizar(
    "Recuerda: la manera más práctica de saber cuál es tu tipo de pisada es grabarte corriendo en una caminadora",
    0.65,
    5.85,
  ),
  ...sincronizar("y así vas a poder saber qué tipo de pisada tienes.", 6.1, 8.2),
  ...sincronizar("Escríbenos y nosotros te ayudamos a elegir tu par ideal.", 9.05, 12.0),
];
export const GRAFICOS_CLIP9: Grafico[] = [
  { tipo: "titular", acento: "Tip", texto: "Grábate corriendo en caminadora", inicio: 3.0, fin: 8.3, tamano: 62 },
  { tipo: "cta", texto: "Escríbenos", sub: "Te ayudamos a elegir tu par ideal", inicio: 9.0, fin: 12.15 },
];
// Zoom "punch-in" en los cambios de frase del cierre (segundo del original → escala).
export const ZOOMS_CLIP9: [number, number][] = [
  [0, 1],
  [6.05, 1.14],
  [9.0, 1.0],
];
