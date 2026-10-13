import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF, SOMBRA } from "./estilo";
import type { Grafico } from "./datos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useAnim = (inicio: number, fin: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round(inicio * fps);
  const b = Math.round(fin * fps);
  const e = spring({ frame: frame - a, fps, config: { damping: 200 } });
  const s = interpolate(frame, [b - 8, b], [1, 0], clamp);
  return { visible: frame >= a && frame <= b, v: e * s, e };
};

const Chip: React.FC<Extract<Grafico, { tipo: "chip" }>> = ({ texto, inicio, fin, posicion = "arriba" }) => {
  const { visible, v, e } = useAnim(inicio, fin);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: posicion === "arriba" ? 230 : 860,
        display: "flex",
        justifyContent: "center",
        opacity: v,
        transform: `translateY(${(1 - e) * -30}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "20px 40px",
          borderRadius: 999,
          background: C.lima,
          color: C.negro,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 3,
          textTransform: "uppercase",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const Titular: React.FC<Extract<Grafico, { tipo: "titular" }>> = ({ texto, acento, inicio, fin }) => {
  const { visible, v, e } = useAnim(inicio, fin);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 200,
        opacity: v,
        transform: `translateY(${(1 - e) * 40}px)`,
        textShadow: SOMBRA,
      }}
    >
      {acento ? (
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: C.lima }}>{acento}</div>
      ) : null}
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 100, lineHeight: 1.02, textTransform: "uppercase", color: C.blanco }}>
        {texto}
      </div>
    </div>
  );
};

const Lista: React.FC<Extract<Grafico, { tipo: "lista" }>> = ({ titulo, items, inicio, fin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { visible, v } = useAnim(inicio, fin);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 220,
        padding: "34px 44px",
        borderRadius: 32,
        background: "rgba(10,10,12,0.55)",
        border: "1.5px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(14px)",
        opacity: v,
      }}
    >
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.gris, textTransform: "uppercase", marginBottom: 18 }}>
        {titulo}
      </div>
      {items.map((it, i) => {
        const e = spring({ frame: frame - Math.round((inicio + 0.25 + i * 0.3) * fps), fps, config: { damping: 200 } });
        return (
          <div
            key={it}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: e,
              transform: `translateX(${(1 - e) * -30}px)`,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 52,
              color: C.blanco,
              textTransform: "uppercase",
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: C.lima, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500 }}>0{i + 1}</span>
            {it}
          </div>
        );
      })}
    </div>
  );
};

export const Graficos: React.FC<{ graficos: Grafico[] }> = ({ graficos }) => (
  <>
    {graficos.map((g, i) =>
      g.tipo === "chip" ? <Chip key={i} {...g} /> : g.tipo === "titular" ? <Titular key={i} {...g} /> : <Lista key={i} {...g} />,
    )}
  </>
);
