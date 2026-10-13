import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF, SOMBRA } from "./estilo";
import type { Grafico } from "./datos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useAnim = (inicio: number, fin: number, desde: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.round((inicio - desde) * fps);
  const b = Math.round((fin - desde) * fps);
  const e = spring({ frame: frame - a, fps, config: { damping: 200 } });
  const s = interpolate(frame, [b - 8, b], [1, 0], clamp);
  return { visible: frame >= a && frame <= b, v: e * s, e, f: frame - a, fps };
};

type P<T extends Grafico["tipo"]> = Extract<Grafico, { tipo: T }> & { desde: number };

const Chip: React.FC<P<"chip">> = ({ texto, inicio, fin, desde, posicion = "arriba" }) => {
  const { visible, v, e } = useAnim(inicio, fin, desde);
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

// Titular en la parte superior: acento en cursiva lima + texto que entra palabra a palabra.
const Titular: React.FC<P<"titular">> = ({ texto, acento, inicio, fin, desde, tamano = 84 }) => {
  const { visible, v, f, fps } = useAnim(inicio, fin, desde);
  if (!visible) return null;
  const palabras = texto.split(" ");
  const barra = interpolate(f, [0, 14], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: tamano < 80 ? 120 : 170, opacity: v, textShadow: SOMBRA }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 70 * barra, height: 4, background: C.lima, boxShadow: `0 0 16px ${C.lima}` }} />
        {acento ? (
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 62, color: C.lima }}>{acento}</div>
        ) : null}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 22px", marginTop: 6 }}>
        {palabras.map((p, i) => {
          const e = spring({ frame: f - 4 - i * 3, fps, config: { damping: 200 } });
          return (
            <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: tamano,
                  lineHeight: 1.08,
                  textTransform: "uppercase",
                  color: C.blanco,
                  transform: `translateY(${(1 - e) * 100}%)`,
                }}
              >
                {p}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Llamada a la acción: botón lima con brillo pulsante e icono de mensaje.
const Cta: React.FC<P<"cta">> = ({ texto, sub, inicio, fin, desde }) => {
  const { visible, v, e, f, fps } = useAnim(inicio, fin, desde);
  if (!visible) return null;
  const pulso = 1 + 0.035 * Math.sin((f / fps) * Math.PI * 2.2);
  const subE = spring({ frame: f - 8, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 210,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: v,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "30px 60px",
          borderRadius: 999,
          background: C.lima,
          color: C.negro,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 66,
          letterSpacing: 4,
          textTransform: "uppercase",
          transform: `scale(${interpolate(e, [0, 1], [0.6, 1]) * pulso})`,
          boxShadow: `0 0 ${50 + 20 * Math.sin(f / 5)}px rgba(212,255,58,0.55), 0 16px 40px rgba(0,0,0,0.35)`,
        }}
      >
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke={C.negro} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
        </svg>
        {texto}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 54,
          color: C.blanco,
          textShadow: SOMBRA,
          opacity: subE,
          transform: `translateY(${(1 - subE) * 20}px)`,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

export const Graficos: React.FC<{ graficos: Grafico[]; desde?: number }> = ({ graficos, desde = 0 }) => (
  <>
    {graficos.map((g, i) =>
      g.tipo === "chip" ? (
        <Chip key={i} {...g} desde={desde} />
      ) : g.tipo === "titular" ? (
        <Titular key={i} {...g} desde={desde} />
      ) : (
        <Cta key={i} {...g} desde={desde} />
      ),
    )}
  </>
);
