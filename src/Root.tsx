import { Composition } from "remotion";
import { VideoAutomatico } from "./compositions/VideoAutomatico";
import {
  FPS,
  calcularDuracion,
  videoAutomaticoSchema,
  type VideoAutomaticoProps,
} from "./schema";

// Props de ejemplo: se ven en el Studio y se usan si no pasas otros.
const propsPorDefecto: VideoAutomaticoProps = {
  titulo: "Mi vídeo automático",
  subtitulo: "Hecho con Remotion",
  duracionTitulo: 3,
  colorFondo: "#0b0b0f",
  colorTexto: "#ffffff",
  transicion: 0.5,
  volumenMusica: 0.4,
  clips: [
    { src: "", tipo: "imagen", duracion: 2.5, inicio: 0, texto: "Escena 1" },
    { src: "", tipo: "imagen", duracion: 2.5, inicio: 0, texto: "Escena 2" },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Horizontal 16:9 (YouTube) */}
      <Composition
        id="VideoAutomatico"
        component={VideoAutomatico}
        schema={videoAutomaticoSchema}
        defaultProps={propsPorDefecto}
        fps={FPS}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => ({
          durationInFrames: calcularDuracion(props),
        })}
      />
      {/* Vertical 9:16 (Reels / TikTok / Shorts) */}
      <Composition
        id="VideoVertical"
        component={VideoAutomatico}
        schema={videoAutomaticoSchema}
        defaultProps={propsPorDefecto}
        fps={FPS}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: calcularDuracion(props),
        })}
      />
    </>
  );
};
