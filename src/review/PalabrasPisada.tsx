import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SANS, SERIF, SOMBRA } from "./estilo";
import { PISADAS } from "./datos";

const Palabra: React.FC<{ texto: string; indice: number; desde: number }> = ({
  texto,
  indice,
  desde,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - desde;
  if (f < 0) return <div style={{ height: 210 }} />;

  const entrada = spring({ frame: f, fps, config: { damping: 18, mass: 0.7 } });
  const linea = interpolate(f, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const desenfoque = interpolate(entrada, [0, 1], [14, 0]);

  return (
    <div style={{ height: 210, display: "flex", alignItems: "center", gap: 28 }}>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 54,
          color: C.lima,
          width: 90,
          textAlign: "right",
          opacity: entrada,
          textShadow: SOMBRA,
        }}
      >
        0{indice + 1}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Máscara: la palabra baja desde arriba */}
        <div style={{ overflow: "hidden", paddingBottom: 6 }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 118,
              letterSpacing: 3,
              lineHeight: 1,
              textTransform: "uppercase",
              color: C.blanco,
              textShadow: SOMBRA,
              transform: `translateY(${(1 - entrada) * -110}%)`,
              filter: `blur(${desenfoque}px)`,
            }}
          >
            {texto}
          </div>
        </div>
        <div
          style={{
            height: 6,
            width: `${linea * 100}%`,
            background: C.lima,
            borderRadius: 3,
            marginTop: 10,
            boxShadow: `0 0 24px ${C.lima}`,
          }}
        />
      </div>
    </div>
  );
};

export const PalabrasPisada: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const salida = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const etiqueta = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: salida }}>
      {/* Degradado superior para dar legibilidad */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 70,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 10,
          color: C.gris,
          textTransform: "uppercase",
          opacity: etiqueta,
        }}
      >
        Tipos de pisada
      </div>
      <div style={{ position: "absolute", top: 260, left: 40 }}>
        {PISADAS.map((p, i) => (
          <Palabra
            key={p.texto}
            texto={p.texto}
            indice={i}
            desde={Math.round(p.inicio * fps)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
