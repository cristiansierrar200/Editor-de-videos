import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SOMBRA } from "./estilo";
import type { Palabra } from "./datos";

// Agrupa las palabras en bloques cortos (máx. 4 palabras o pausa > 0,35 s).
const agrupar = (palabras: Palabra[]) => {
  const grupos: Palabra[][] = [];
  for (const p of palabras) {
    const g = grupos[grupos.length - 1];
    if (!g || g.length >= 4 || p.inicio - g[g.length - 1].fin > 0.35) grupos.push([p]);
    else g.push(p);
  }
  return grupos;
};

// Subtítulos estilo "reels": la palabra que suena se ilumina en lima y crece un poco.
export const Subtitulos: React.FC<{ palabras: Palabra[]; bottom?: number }> = ({ palabras, bottom = 420 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grupo = agrupar(palabras).find((g) => t >= g[0].inicio - 0.05 && t <= g[g.length - 1].fin + 0.15);
  if (!grupo) return null;

  const entrada = spring({ frame: frame - Math.round(grupo[0].inicio * fps), fps, config: { damping: 14, mass: 0.6 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 22px",
        transform: `scale(${interpolate(entrada, [0, 1], [0.85, 1])})`,
        opacity: entrada,
      }}
    >
      {grupo.map((p, i) => {
        const activa = t >= p.inicio && t < p.fin + 0.05;
        const pop = spring({ frame: frame - Math.round(p.inicio * fps), fps, config: { damping: 12, mass: 0.4 } });
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 78,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: activa ? C.lima : C.blanco,
              textShadow: SOMBRA,
              WebkitTextStroke: "2px rgba(0,0,0,0.35)",
              transform: `scale(${activa ? 1 + 0.1 * pop : 1})`,
              display: "inline-block",
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};
