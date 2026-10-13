import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SANS, SERIF, SOMBRA } from "./estilo";
import { BarridoLuz, GRADO_PRODUCTO, LookCine, Video, Vineta } from "./Video";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Contador superior "01 / 03" con línea que se dibuja.
const Contador: React.FC<{ numero: string; total: string }> = ({ numero, total }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  const l = interpolate(frame, [4, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 70,
        right: 70,
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: o,
        fontFamily: SANS,
        color: C.blanco,
        textShadow: SOMBRA,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 40, color: C.lima }}>{numero}</span>
      <span style={{ fontWeight: 400, fontSize: 32, color: C.gris }}>/ {total}</span>
      <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.35)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, width: `${l * 100}%`, background: C.lima }} />
      </div>
    </div>
  );
};

// Título grande del modelo (aparece en la primera toma de cada par).
const Titulo: React.FC<{ nombre: string; detalle: string }> = ({ nombre, detalle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const s = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 300,
        opacity: e * s,
        transform: `translateY(${(1 - e) * 50}px)`,
        textShadow: SOMBRA,
      }}
    >
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: C.lima }}>
        Opción
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: C.blanco,
        }}
      >
        {nombre}
      </div>
      {detalle ? (
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.gris, marginTop: 16, letterSpacing: 4 }}>
          {detalle}
        </div>
      ) : null}
    </div>
  );
};

// Etiqueta pequeña para la segunda toma (vista lateral).
const Etiqueta: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const s = interpolate(frame, [durationInFrames - 10, durationInFrames - 2], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        bottom: 300,
        opacity: e * s,
        transform: `translateX(${(1 - e) * 60}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 34px",
        borderRadius: 999,
        background: "rgba(10,10,12,0.55)",
        border: "1.5px solid rgba(255,255,255,0.25)",
        backdropFilter: "blur(12px)",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 36,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: C.blanco,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: C.lima, boxShadow: `0 0 16px ${C.lima}` }} />
      {texto}
    </div>
  );
};

export const Producto: React.FC<{
  src: string;
  numero: string;
  nombre: string;
  detalle: string;
  toma: "espalda" | "lateral";
}> = ({ src, numero, nombre, detalle, toma }) => (
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    <Video src={src} filtro={GRADO_PRODUCTO} zoom={toma === "espalda" ? [1.02, 1.1] : [1.1, 1.03]} volumen={0} />
    <LookCine />
    <BarridoLuz />
    <Vineta fuerza={0.6} />
    {/* Degradado inferior para que el texto respire */}
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%)" }} />
    <Contador numero={numero} total="03" />
    {toma === "espalda" ? <Titulo nombre={nombre} detalle={detalle} /> : <Etiqueta texto="Vista lateral" />}
  </AbsoluteFill>
);
