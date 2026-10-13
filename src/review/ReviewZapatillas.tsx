import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./estilo";
import {
  GRAFICOS_CLIP2,
  GRAFICOS_CLIP9,
  MODELOS,
  SUBS_CLIP2,
  SUBS_CLIP9,
} from "./datos";
import { Graficos } from "./Graficos";
import { PalabrasPisada } from "./PalabrasPisada";
import { Producto } from "./Producto";
import { Subtitulos } from "./Subtitulos";
import { LookCine, Video, Vineta } from "./Video";

export const FPS_REVIEW = 30;
const T = 12; // duración de cada transición (frames)

// Duración útil de cada clip en frames (según la duración real de cada archivo).
const DUR: Record<string, number> = {
  "clips/01.mp4": 157,
  "clips/02.mp4": 134,
  "clips/03.mp4": 156,
  "clips/04.mp4": 133,
  "clips/05.mp4": 140,
  "clips/06.mp4": 128,
  "clips/07.mp4": 125,
  "clips/08.mp4": 138,
  "clips/09.mp4": 370,
};

export const DURACION_REVIEW =
  Object.values(DUR).reduce((a, b) => a + b, 0) - (Object.keys(DUR).length - 1) * T;

const Persona: React.FC<{ src: string; children?: React.ReactNode; salida?: boolean }> = ({
  src,
  children,
  salida,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const negro = salida ? interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], { extrapolateLeft: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <Video src={src} />
      <LookCine />
      <Vineta fuerza={0.4} />
      {children}
      <AbsoluteFill style={{ backgroundColor: "black", opacity: negro }} />
    </AbsoluteFill>
  );
};

// Barra de progreso fina en la parte superior durante todo el vídeo.
const Progreso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.15)" }}>
      <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, background: C.lima, boxShadow: `0 0 18px ${C.lima}` }} />
    </div>
  );
};

const suave = springTiming({ config: { damping: 200 }, durationInFrames: T });
const lineal = linearTiming({ durationInFrames: T });

export const ReviewZapatillas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <TransitionSeries>
        {/* 1 · Corriendo: Pronador / Supinador / Neutral */}
        <TransitionSeries.Sequence durationInFrames={DUR["clips/01.mp4"]}>
          <Persona src="clips/01.mp4">
            <PalabrasPisada />
          </Persona>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={suave} />

        {/* 2 · Presentación con la zapatilla */}
        <TransitionSeries.Sequence durationInFrames={DUR["clips/02.mp4"]}>
          <Persona src="clips/02.mp4">
            <Graficos graficos={GRAFICOS_CLIP2} />
            <Subtitulos palabras={SUBS_CLIP2} />
          </Persona>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={suave} />

        {/* 3–8 · Producto: dos tomas por modelo */}
        {MODELOS.flatMap((m, i) => [
          <TransitionSeries.Sequence key={`${m.numero}a`} durationInFrames={DUR[m.clips[0]]}>
            <Producto src={m.clips[0]} numero={m.numero} nombre={m.nombre} detalle={m.detalle} toma="espalda" />
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition key={`${m.numero}t1`} presentation={fade()} timing={lineal} />,
          <TransitionSeries.Sequence key={`${m.numero}b`} durationInFrames={DUR[m.clips[1]]}>
            <Producto src={m.clips[1]} numero={m.numero} nombre={m.nombre} detalle={m.detalle} toma="lateral" />
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition
            key={`${m.numero}t2`}
            presentation={i < MODELOS.length - 1 ? slide({ direction: "from-right" }) : fade()}
            timing={suave}
          />,
        ])}

        {/* 9 · Cierre */}
        <TransitionSeries.Sequence durationInFrames={DUR["clips/09.mp4"]}>
          <Persona src="clips/09.mp4" salida>
            <Graficos graficos={GRAFICOS_CLIP9} />
            <Subtitulos palabras={SUBS_CLIP9} />
          </Persona>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Progreso />
    </AbsoluteFill>
  );
};
