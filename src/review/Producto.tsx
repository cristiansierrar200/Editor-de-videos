import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SANS, SERIF, SOMBRA } from "./estilo";
import type { Seccion } from "./datos";
import { BarridoLuz, GRADO_PRODUCTO, LookCine, Video, Vineta } from "./Video";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useSalida = (margen = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - margen, durationInFrames - 1], [1, 0], clamp);
};

// Contador superior "01 / 03" con línea que se dibuja.
const Contador: React.FC<{ numero: string }> = ({ numero }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  const l = interpolate(frame, [4, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 70,
        right: 70,
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: o,
        fontFamily: SANS,
        textShadow: SOMBRA,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 40, color: C.lima }}>{numero}</span>
      <span style={{ fontWeight: 400, fontSize: 32, color: C.gris }}>/ 03</span>
      <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.3)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, width: `${l * 100}%`, background: C.lima }} />
      </div>
    </div>
  );
};

// Diagrama de la pisada vista desde atrás: pierna + talón que se inclinan.
const Diagrama: React.FC<{ inclinacion: number }> = ({ inclinacion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const giro = spring({ frame: frame - 24, fps, config: { damping: 9, mass: 0.8 } });
  const angulo = inclinacion * giro;
  const etiqueta = inclinacion > 0 ? "Hacia adentro" : inclinacion < 0 ? "Hacia afuera" : "Alineada";
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: 470,
        width: 280,
        padding: "26px 0 22px",
        borderRadius: 34,
        background: "rgba(10,10,12,0.5)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: e,
        transform: `translateX(${(1 - e) * 80}px)`,
      }}
    >
      <svg width="200" height="250" viewBox="0 0 200 250">
        {/* Referencia neutral */}
        <line x1="100" y1="10" x2="100" y2="230" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeDasharray="8 9" />
        <line x1="20" y1="232" x2="180" y2="232" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
        <g transform={`rotate(${angulo} 100 228)`}>
          <rect x="80" y="20" width="40" height="150" rx="20" fill={C.blanco} />
          <path d="M66 170 Q66 150 100 150 Q134 150 134 170 L134 205 Q134 228 100 228 Q66 228 66 205 Z" fill={C.lima} />
        </g>
        {inclinacion !== 0 ? (
          <path
            d={inclinacion > 0 ? "M150 70 Q170 110 150 150" : "M50 70 Q30 110 50 150"}
            stroke={C.lima}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity={giro}
            markerEnd="url(#flecha)"
          />
        ) : (
          <path d="M140 60 l14 14 l26 -30" stroke={C.lima} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={giro} />
        )}
        <defs>
          <marker id="flecha" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={C.lima} />
          </marker>
        </defs>
      </svg>
      <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: C.blanco, textTransform: "uppercase" }}>
        {etiqueta}
      </div>
    </div>
  );
};

// Toma de espalda: tipo de pisada + descripción + diagrama + qué buscar.
const Explicacion: React.FC<{ s: Seccion }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const salida = useSalida();
  const t = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const d = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const b = spring({ frame: frame - 30, fps, config: { damping: 15, mass: 0.7 } });
  const subrayado = interpolate(frame, [38, 56], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: salida, textShadow: SOMBRA }}>
      <div style={{ position: "absolute", left: 70, top: 200 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 60, color: C.lima, opacity: t }}>Pisada</div>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.blanco,
              transform: `translateY(${(1 - t) * 105}%)`,
            }}
          >
            {s.tipo}
          </div>
        </div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 600, fontSize: 38, color: C.blanco, opacity: d * 0.9, maxWidth: 560 }}>
          {s.descripcion}
        </div>
      </div>
      <Diagrama inclinacion={s.inclinacion} />
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 190, opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 58, color: C.blanco }}>Busca</div>
        <div style={{ display: "inline-block", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: -12,
              right: -12,
              bottom: 8,
              height: "42%",
              background: C.lima,
              transformOrigin: "left",
              transform: `scaleX(${subrayado})`,
              borderRadius: 6,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: s.beneficio.length > 14 ? 74 : s.beneficio.length > 10 ? 86 : 110,
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: C.blanco,
              textShadow: "0 4px 18px rgba(0,0,0,0.5)",
            }}
          >
            {s.beneficio}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Toma lateral: modelo recomendado + claves.
const Modelo: React.FC<{ s: Seccion }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const salida = useSalida();
  const cab = spring({ frame, fps, config: { damping: 200 } });
  const m = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const espaciado = interpolate(frame, [0, 40], [30, 14], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: salida, textShadow: SOMBRA }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 200,
          opacity: cab,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: C.gris,
        }}
      >
        Pisada {s.tipo.toLowerCase()} · <span style={{ color: C.lima }}>{s.beneficio}</span>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 190 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 52, color: C.lima, opacity: m }}>Te recomendamos</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: espaciado, color: C.blanco, textTransform: "uppercase", opacity: m, marginTop: 6 }}>
          {s.marca}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 116,
              lineHeight: 1.02,
              textTransform: "uppercase",
              color: C.blanco,
              transform: `translateY(${(1 - m) * 105}%)`,
            }}
          >
            {s.modelo}
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
          {s.claves.map((c, i) => {
            const e = spring({ frame: frame - 22 - i * 6, fps, config: { damping: 14, mass: 0.6 } });
            return (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 28px",
                  borderRadius: 999,
                  border: `2px solid ${C.lima}`,
                  background: "rgba(10,10,12,0.45)",
                  backdropFilter: "blur(10px)",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: 2,
                  color: C.blanco,
                  textTransform: "uppercase",
                  opacity: e,
                  transform: `scale(${interpolate(e, [0, 1], [0.7, 1])})`,
                  textShadow: "none",
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 6, background: C.lima }} />
                {c}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Destello de luz al empezar cada sección.
const Destello: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 14], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, rgba(255,255,255,1) 0%, rgba(212,255,58,0.6) 40%, rgba(212,255,58,0) 75%)`,
        opacity: o,
        mixBlendMode: "screen",
      }}
    />
  );
};

export const Producto: React.FC<{ s: Seccion; toma: "espalda" | "lateral"; desde: number }> = ({ s, toma, desde }) => (
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    <Video
      src={toma === "espalda" ? s.clips[0] : s.clips[1]}
      desde={desde}
      filtro={GRADO_PRODUCTO}
      zoom={toma === "espalda" ? [1.02, 1.1] : [1.1, 1.03]}
      volumen={0}
    />
    <LookCine />
    <BarridoLuz />
    <Vineta fuerza={0.6} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.7) 100%)",
      }}
    />
    <Contador numero={s.numero} />
    {toma === "espalda" ? <Explicacion s={s} /> : <Modelo s={s} />}
    {toma === "espalda" ? <Destello /> : null}
  </AbsoluteFill>
);
