import { linearTiming, springTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./estilo";
import {
  GRAFICOS_CLIP2,
  GRAFICOS_CLIP9,
  PISADAS,
  RECORTES,
  SECCIONES,
  SUBS_CLIP2,
  SUBS_CLIP9,
  ZOOMS_CLIP9,
} from "./datos";
import { Graficos } from "./Graficos";
import { PalabrasPisada } from "./PalabrasPisada";
import { Producto } from "./Producto";
import { Resumen } from "./Resumen";
import { Subtitulos } from "./Subtitulos";
import { LookCine, Video, Vineta } from "./Video";

export const FPS_REVIEW = 30;
const T = 12; // duración de cada transición (frames)
const RESUMEN = 80; // tarjeta final (frames)

const dur = (clip: string) => Math.round((RECORTES[clip][1] - RECORTES[clip][0]) * FPS_REVIEW);
const desde = (clip: string) => RECORTES[clip][0];

// Orden del montaje
const ORDEN = [
  "clips/01.mp4",
  "clips/02.mp4",
  ...SECCIONES.flatMap((s) => s.clips),
  "clips/09.mp4",
];
const DURACIONES = [...ORDEN.map(dur), RESUMEN];

// Frame en el que arranca cada bloque (las transiciones se solapan T frames).
const INICIOS = DURACIONES.reduce<number[]>((acc, d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + DURACIONES[i - 1] - T);
  return acc;
}, []);

export const DURACION_REVIEW = INICIOS[INICIOS.length - 1] + RESUMEN;

const Persona: React.FC<{
  clip: string;
  saltos?: [number, number][];
  children?: React.ReactNode;
}> = ({ clip, saltos, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    <Video src={clip} desde={desde(clip)} saltos={saltos} />
    <LookCine />
    <Vineta fuerza={0.4} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)" }} />
    {children}
  </AbsoluteFill>
);

// Barra de progreso fina en la parte superior durante todo el vídeo.
const Progreso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - RESUMEN, durationInFrames - RESUMEN + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.15)", opacity: o }}>
      <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, background: C.lima, boxShadow: `0 0 18px ${C.lima}` }} />
    </div>
  );
};

const suave = springTiming({ config: { damping: 200 }, durationInFrames: T });
const lineal = linearTiming({ durationInFrames: T });

// Efectos de sonido sincronizados con transiciones y textos.
const Sonidos: React.FC = () => (
  <>
    {PISADAS.map((p, i) => (
      <Sequence key={`tick${i}`} from={Math.round(p.inicio * FPS_REVIEW)} durationInFrames={10}>
        <Audio src={staticFile("sfx/tick.wav")} volume={0.6} />
      </Sequence>
    ))}
    {INICIOS.slice(1).map((f, i) => {
      // Las secciones de producto (espalda) empiezan con un "impacto"; el resto con un "whoosh".
      const esSeccion = i >= 1 && i <= 5 && (i - 1) % 2 === 0;
      return (
        <Sequence key={`sfx${i}`} from={Math.max(0, f - 4)} durationInFrames={24}>
          <Audio src={staticFile(esSeccion ? "sfx/impacto.wav" : "sfx/whoosh.wav")} volume={esSeccion ? 0.5 : 0.35} />
        </Sequence>
      );
    })}
  </>
);

export const ReviewZapatillas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <TransitionSeries>
        {/* 1 · HOOK: ¿Pronador, supinador o neutral? */}
        <TransitionSeries.Sequence durationInFrames={dur("clips/01.mp4")}>
          <Persona clip="clips/01.mp4">
            <PalabrasPisada />
          </Persona>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={suave} />

        {/* 2 · Presentación */}
        <TransitionSeries.Sequence durationInFrames={dur("clips/02.mp4")}>
          <Persona clip="clips/02.mp4">
            <Graficos graficos={GRAFICOS_CLIP2} desde={desde("clips/02.mp4")} />
            <Subtitulos palabras={SUBS_CLIP2} desde={desde("clips/02.mp4")} />
          </Persona>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={suave} />

        {/* 3–8 · Las tres pisadas: toma de espalda (explicación) + lateral (modelo) */}
        {SECCIONES.flatMap((s, i) => [
          <TransitionSeries.Sequence key={`${s.numero}a`} durationInFrames={dur(s.clips[0])}>
            <Producto s={s} toma="espalda" desde={desde(s.clips[0])} />
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition key={`${s.numero}t1`} presentation={slide({ direction: "from-right" })} timing={suave} />,
          <TransitionSeries.Sequence key={`${s.numero}b`} durationInFrames={dur(s.clips[1])}>
            <Producto s={s} toma="lateral" desde={desde(s.clips[1])} />
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition
            key={`${s.numero}t2`}
            presentation={
              (i < SECCIONES.length - 1 ? wipe({ direction: "from-bottom" }) : fade()) as TransitionPresentation<Record<string, unknown>>
            }
            timing={i < SECCIONES.length - 1 ? suave : lineal}
          />,
        ])}

        {/* 9 · Cierre */}
        <TransitionSeries.Sequence durationInFrames={dur("clips/09.mp4")}>
          <Persona clip="clips/09.mp4" saltos={ZOOMS_CLIP9}>
            <Graficos graficos={GRAFICOS_CLIP9} desde={desde("clips/09.mp4")} />
            <Subtitulos palabras={SUBS_CLIP9} desde={desde("clips/09.mp4")} />
          </Persona>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={lineal} />

        {/* 10 · Resumen final */}
        <TransitionSeries.Sequence durationInFrames={RESUMEN}>
          <Resumen />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Progreso />
      <Sonidos />
    </AbsoluteFill>
  );
};
