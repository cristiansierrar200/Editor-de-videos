import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta: negro profundo + blanco + verde lima (el color de la zapatilla del vídeo).
export const C = {
  lima: "#D4FF3A",
  blanco: "#FFFFFF",
  negro: "#0A0A0C",
  gris: "rgba(255,255,255,0.72)",
};

export const SANS = "Montserrat";
export const SERIF = "Playfair Display";

const fuentes: [string, string, string, "normal" | "italic"][] = [
  [SANS, "montserrat-latin-400-normal.woff2", "400", "normal"],
  [SANS, "montserrat-latin-600-normal.woff2", "600", "normal"],
  [SANS, "montserrat-latin-800-normal.woff2", "800", "normal"],
  [SANS, "montserrat-latin-900-normal.woff2", "900", "normal"],
  [SERIF, "playfair-display-latin-500-italic.woff2", "500", "italic"],
  [SERIF, "playfair-display-latin-700-italic.woff2", "700", "italic"],
];

for (const [family, archivo, weight, style] of fuentes) {
  loadFont({ family, url: staticFile(`fonts/${archivo}`), weight, style });
}

// Sombra suave para que el texto se lea sobre cualquier fondo.
export const SOMBRA = "0 6px 30px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)";
