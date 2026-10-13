// Toda la "edición" del vídeo de review vive aquí: clips, textos, subtítulos y gráficos.
// Los tiempos van en SEGUNDOS, relativos al inicio de cada clip.

export type Palabra = { texto: string; inicio: number; fin: number };

export type Grafico =
  | { tipo: "chip"; texto: string; inicio: number; fin: number; posicion?: "arriba" | "medio" }
  | { tipo: "titular"; texto: string; acento?: string; inicio: number; fin: number }
  | { tipo: "lista"; titulo: string; items: string[]; inicio: number; fin: number };

// Palabras que aparecen de arriba hacia abajo mientras corres (clip 1).
export const PISADAS = [
  { texto: "Pronador", inicio: 0.5 },
  { texto: "Supinador", inicio: 1.9 },
  { texto: "Neutral", inicio: 3.3 },
];

// Subtítulos del clip 2 (hablas de 0 a 4,0 s).
// PENDIENTE: escribir aquí la frase exacta con sus tiempos.
export const SUBS_CLIP2: Palabra[] = [];
export const GRAFICOS_CLIP2: Grafico[] = [];

// Subtítulos del clip final (frases en 0,4–5,8 s · 6,1–8,3 s · 9,0–12,0 s).
// PENDIENTE: escribir aquí lo que dices con sus tiempos.
export const SUBS_CLIP9: Palabra[] = [];
export const GRAFICOS_CLIP9: Grafico[] = [];

// Los seis clips de producto: dos tomas (espalda + lateral) por modelo.
export const MODELOS = [
  { numero: "01", nombre: "Modelo 1", detalle: "", clips: ["clips/03.mp4", "clips/04.mp4"] },
  { numero: "02", nombre: "Modelo 2", detalle: "", clips: ["clips/05.mp4", "clips/06.mp4"] },
  { numero: "03", nombre: "Modelo 3", detalle: "", clips: ["clips/07.mp4", "clips/08.mp4"] },
];

/**
 * Convierte una frase en palabras con tiempos repartidos de forma proporcional a su longitud.
 * Útil cuando solo conoces cuándo empieza y termina la frase.
 */
export const repartir = (frase: string, inicio: number, fin: number): Palabra[] => {
  const palabras = frase.split(/\s+/).filter(Boolean);
  const pesos = palabras.map((p) => p.length + 2);
  const total = pesos.reduce((a, b) => a + b, 0);
  let t = inicio;
  return palabras.map((texto, i) => {
    const d = ((fin - inicio) * pesos[i]) / total;
    const w = { texto, inicio: t, fin: t + d };
    t += d;
    return w;
  });
};
