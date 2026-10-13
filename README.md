# Editor de vídeos automático (Remotion)

Proyecto de [Remotion](https://www.remotion.dev) para crear y editar vídeos con código y
renderizarlos automáticamente a partir de archivos JSON.

## 1. Requisitos en tu ordenador

| Programa | Para qué | Cómo instalarlo |
|---|---|---|
| **Node.js 18 o superior** (recomendado 22 LTS) | Ejecutar Remotion | https://nodejs.org (descarga la versión LTS) |
| **Git** | Descargar este repositorio | https://git-scm.com |

No hace falta instalar FFmpeg ni Chrome: Remotion trae FFmpeg incluido y descarga
automáticamente su propio Chrome la primera vez que renderizas.

En **Linux** puede que necesites estas librerías del sistema (Ubuntu/Debian):

```bash
sudo apt install -y libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2 \
  libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 \
  libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2
```

## 2. Instalación

```bash
git clone https://github.com/cristiansierrar200/Editor-de-videos.git
cd Editor-de-videos
npm install
```

## 3. Uso

### Editor visual (Remotion Studio)

```bash
npm run dev
```

Se abre en el navegador (http://localhost:3000). Ahí puedes previsualizar el vídeo y
cambiar título, colores, clips, etc. desde el panel derecho.

### Renderizado automático desde JSON

1. Copia tus vídeos, fotos y música en la carpeta `public/` (por ejemplo `public/clips/playa.mp4`).
2. Crea un archivo `.json` en `entradas/` (usa `entradas/ejemplo.json` como plantilla).
3. Ejecuta:

```bash
npm run render:json                              # renderiza todos los JSON de entradas/
npm run render:json -- entradas/mio.json         # solo uno
npm run render:json -- entradas/mio.json VideoVertical   # forzar formato vertical
```

Los vídeos terminados aparecen en `salida/`.

### Formato del JSON

```json
{
  "composicion": "VideoAutomatico",
  "titulo": "Vacaciones 2026",
  "subtitulo": "Editado automáticamente",
  "duracionTitulo": 3,
  "transicion": 0.5,
  "colorFondo": "#0b0b0f",
  "colorTexto": "#ffffff",
  "musica": "musica/fondo.mp3",
  "volumenMusica": 0.4,
  "clips": [
    { "src": "clips/playa.mp4", "tipo": "video", "duracion": 4, "inicio": 10, "texto": "Día 1" },
    { "src": "fotos/atardecer.jpg", "tipo": "imagen", "duracion": 3, "texto": "Atardecer" }
  ]
}
```

- `composicion`: `VideoAutomatico` (1920×1080, horizontal) o `VideoVertical` (1080×1920, Reels/TikTok/Shorts).
- `duracion` e `inicio` van en **segundos**; `inicio` es el segundo del clip original desde el que se recorta.
- `src` es una ruta dentro de `public/` o una URL `https://`.
- Las imágenes tienen un zoom suave automático y todos los clips tienen fundido de entrada/salida.

## Estructura

```
src/
  index.ts                     # punto de entrada de Remotion
  Root.tsx                     # registra las composiciones (horizontal y vertical)
  schema.ts                    # parámetros editables del vídeo (validados con zod)
  compositions/VideoAutomatico.tsx  # la plantilla del vídeo
scripts/render.mjs             # renderizado automático por lotes
entradas/                      # tus archivos JSON
public/                        # tus clips, fotos y música
salida/                        # vídeos renderizados (no se suben a git)
remotion.config.ts             # configuración (códec, calidad, etc.)
```

## Problemas frecuentes

- **No puede descargar Chrome** (red corporativa, sin internet): indica uno ya instalado con
  `REMOTION_BROWSER=/ruta/a/chrome npm run render:json`.
- **Actualizar Remotion**: `npm run upgrade`.
- Documentación oficial: https://www.remotion.dev/docs

> Nota: Remotion es gratuito para particulares y empresas de hasta 3 personas; empresas más
> grandes necesitan licencia (https://www.remotion.dev/license).
