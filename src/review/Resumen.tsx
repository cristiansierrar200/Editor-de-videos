import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF } from "./estilo";
import { SECCIONES } from "./datos";

// Tarjeta final: resumen de las tres pisadas.
export const Resumen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 200 } });
  const fin = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const brillo = 0.35 + 0.1 * Math.sin(frame / 8);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.negro,
        background: `radial-gradient(circle at 50% 30%, rgba(212,255,58,${brillo * 0.35}) 0%, ${C.negro} 60%)`,
        opacity: fin,
        padding: "0 80px",
        justifyContent: "center",
      }}
    >
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 70, color: C.lima, opacity: t }}>
        En resumen
      </div>
      <div style={{ height: 3, width: 160 * t, background: C.lima, margin: "18px 0 50px" }} />
      {SECCIONES.map((s, i) => {
        const e = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 200 } });
        return (
          <div
            key={s.numero}
            style={{
              opacity: e,
              transform: `translateX(${(1 - e) * -60}px)`,
              padding: "26px 0",
              borderBottom: "1.5px solid rgba(255,255,255,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: C.lima }}>{s.numero}</span>
              <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 74, color: C.blanco, textTransform: "uppercase" }}>{s.tipo}</span>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.gris, marginLeft: 76, letterSpacing: 2 }}>
              {s.beneficio} · <span style={{ color: C.blanco }}>{s.marca} {s.modelo}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
