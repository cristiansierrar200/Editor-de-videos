import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const FPS = 30;

export const clipSchema = z.object({
  // Ruta dentro de /public (p. ej. "clips/playa.mp4") o URL https://
  src: z.string(),
  tipo: z.enum(["video", "imagen"]).default("video"),
  // Duración del clip en segundos
  duracion: z.number().positive(),
  // Segundo del vídeo original desde el que empezar (solo vídeos)
  inicio: z.number().min(0).default(0),
  texto: z.string().optional(),
});

export const videoAutomaticoSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string().optional(),
  duracionTitulo: z.number().min(0).default(3),
  colorFondo: zColor().default("#0b0b0f"),
  colorTexto: zColor().default("#ffffff"),
  // Duración de la transición (fundido) entre clips, en segundos
  transicion: z.number().min(0).default(0.5),
  musica: z.string().optional(),
  volumenMusica: z.number().min(0).max(1).default(0.4),
  clips: z.array(clipSchema),
});

export type Clip = z.infer<typeof clipSchema>;
export type VideoAutomaticoProps = z.infer<typeof videoAutomaticoSchema>;

/** Duración total en frames calculada a partir de los props. */
export const calcularDuracion = (props: VideoAutomaticoProps) => {
  const segundos =
    props.duracionTitulo + props.clips.reduce((acc, c) => acc + c.duracion, 0);
  return Math.max(1, Math.round(segundos * FPS));
};
