// Renderiza vídeos automáticamente a partir de archivos JSON.
//
// Uso:
//   npm run render:json                         -> renderiza todos los .json de /entradas
//   npm run render:json -- entradas/mio.json    -> renderiza solo ese archivo
//   npm run render:json -- entradas/mio.json VideoVertical
//
// El vídeo resultante se guarda en /salida/<nombre-del-json>.mp4
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Opcional: usar un Chrome/Chromium ya instalado en vez del que descarga Remotion.
const browserExecutable = process.env.REMOTION_BROWSER ?? null;

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [archivoArg, composicionArg] = process.argv.slice(2);

const archivos = archivoArg
  ? [path.resolve(archivoArg)]
  : fs
      .readdirSync(path.join(raiz, "entradas"))
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(raiz, "entradas", f));

if (archivos.length === 0) {
  console.error("No hay archivos .json en /entradas");
  process.exit(1);
}

console.log("Empaquetando el proyecto...");
const serveUrl = await bundle({
  entryPoint: path.join(raiz, "src", "index.ts"),
  publicDir: path.join(raiz, "public"),
});

fs.mkdirSync(path.join(raiz, "salida"), { recursive: true });

for (const archivo of archivos) {
  const datos = JSON.parse(fs.readFileSync(archivo, "utf8"));
  const id = composicionArg ?? datos.composicion ?? "VideoAutomatico";
  delete datos.composicion;

  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps: datos,
    browserExecutable,
  });

  const salida = path.join(
    raiz,
    "salida",
    `${path.basename(archivo, ".json")}.mp4`,
  );
  console.log(`\nRenderizando ${path.basename(archivo)} (${id}) -> ${salida}`);

  let ultimo = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: salida,
    inputProps: datos,
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== ultimo) process.stdout.write(`\r  ${(ultimo = pct)}%`);
    },
  });
  console.log("\n  ¡Listo!");
}
