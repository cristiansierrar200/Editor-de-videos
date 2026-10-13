// Configuración global de Remotion (aplica a `npm run dev` y `npm run render`).
// Documentación: https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setConcurrency(null); // null = usa la mitad de los núcleos disponibles
