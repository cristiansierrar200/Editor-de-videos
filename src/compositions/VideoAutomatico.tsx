import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FPS, type Clip, type VideoAutomaticoProps } from "../schema";

// Permite usar rutas de /public ("clips/a.mp4") o URLs completas.
const resolver = (src: string) =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

const Titulo: React.FC<{
  titulo: string;
  subtitulo?: string;
  color: string;
}> = ({ titulo, subtitulo, color }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const salida = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: salida,
        color,
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        textAlign: "center",
        padding: 80,
      }}
    >
      <h1
        style={{
          fontSize: 110,
          margin: 0,
          transform: `translateY(${(1 - entrada) * 60}px)`,
          opacity: entrada,
        }}
      >
        {titulo}
      </h1>
      {subtitulo ? (
        <h2 style={{ fontSize: 50, fontWeight: 400, opacity: entrada * 0.8 }}>
          {subtitulo}
        </h2>
      ) : null}
    </AbsoluteFill>
  );
};

const Escena: React.FC<{
  clip: Clip;
  transicion: number;
  colorTexto: string;
}> = ({ clip, transicion, colorTexto }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.max(1, Math.round(transicion * FPS));
  const opacidad = interpolate(
    frame,
    [0, t, durationInFrames - t, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Efecto "Ken Burns" suave para las imágenes
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08]);

  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      {clip.src === "" ? (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #4f46e5, #db2777)",
          }}
        />
      ) : clip.tipo === "video" ? (
        <OffthreadVideo
          src={resolver(clip.src)}
          startFrom={Math.round(clip.inicio * FPS)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Img
          src={resolver(clip.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      )}
      {clip.texto ? (
        <AbsoluteFill
          style={{ justifyContent: "flex-end", alignItems: "center" }}
        >
          <div
            style={{
              marginBottom: 100,
              padding: "16px 36px",
              borderRadius: 16,
              background: "rgba(0,0,0,0.55)",
              color: colorTexto,
              fontSize: 56,
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 600,
            }}
          >
            {clip.texto}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const VideoAutomatico: React.FC<VideoAutomaticoProps> = (props) => {
  const framesTitulo = Math.round(props.duracionTitulo * FPS);
  let cursor = framesTitulo;

  return (
    <AbsoluteFill style={{ backgroundColor: props.colorFondo }}>
      {framesTitulo > 0 ? (
        <Sequence durationInFrames={framesTitulo} name="Título">
          <Titulo
            titulo={props.titulo}
            subtitulo={props.subtitulo}
            color={props.colorTexto}
          />
        </Sequence>
      ) : null}

      {props.clips.map((clip, i) => {
        const duracion = Math.max(1, Math.round(clip.duracion * FPS));
        const desde = cursor;
        cursor += duracion;
        return (
          <Sequence
            key={i}
            from={desde}
            durationInFrames={duracion}
            name={`Clip ${i + 1}`}
          >
            <Escena
              clip={clip}
              transicion={props.transicion}
              colorTexto={props.colorTexto}
            />
          </Sequence>
        );
      })}

      {props.musica ? (
        <Audio src={resolver(props.musica)} volume={props.volumenMusica} />
      ) : null}
    </AbsoluteFill>
  );
};
