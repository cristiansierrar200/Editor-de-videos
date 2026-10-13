import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Corrección de color "premium": más luz, contraste y color, viñeta y un toque cálido.
export const GRADO_PRODUCTO =
  "brightness(1.14) contrast(1.2) saturate(1.35)";
export const GRADO_PERSONA = "brightness(1.05) contrast(1.08) saturate(1.12)";

export const Video: React.FC<{
  src: string;
  desde?: number; // segundo del archivo original donde empieza el clip
  filtro?: string;
  zoom?: [number, number];
  saltos?: [number, number][]; // zoom "punch-in": [segundo original, escala]
  volumen?: number;
}> = ({ src, desde = 0, filtro = GRADO_PERSONA, zoom = [1, 1.04], saltos, volumen = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  let escala = interpolate(frame, [0, durationInFrames], zoom);
  if (saltos) {
    const t = frame / fps + desde;
    const actual = [...saltos].reverse().find(([s]) => t >= s);
    escala *= actual ? actual[1] : 1;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={Math.round(desde * fps)}
        volume={volumen}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: filtro,
          transform: `scale(${escala})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Vineta: React.FC<{ fuerza?: number }> = ({ fuerza = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${fuerza}) 100%)`,
    }}
  />
);

// Barrido de luz diagonal que cruza el plano una vez (efecto de "brillo" de anuncio).
export const BarridoLuz: React.FC<{ desde?: number; duracion?: number }> = ({
  desde = 6,
  duracion = 32,
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [desde, desde + duracion], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(115deg, rgba(255,255,255,0) ${x - 18}%, rgba(255,255,255,0.22) ${x}%, rgba(255,255,255,0) ${x + 18}%)`,
        mixBlendMode: "soft-light",
      }}
    />
  );
};

// Tono cálido arriba / frío abajo, mezclado en "soft-light" para dar look de cine.
export const LookCine: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(255,170,90,0.28) 0%, rgba(255,255,255,0) 45%, rgba(40,90,160,0.25) 100%)",
      mixBlendMode: "soft-light",
    }}
  />
);
