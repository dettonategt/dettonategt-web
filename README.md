# DETTONATE — NEW HORIZONS

Sitio estático del evento, construido con Astro. Contenido en español, diseño adaptable a móvil e imágenes locales optimizadas a WebP durante la compilación.

## Desarrollo

Requiere Node.js 22.12 o superior y pnpm.

```sh
pnpm install
pnpm dev
```

Abre la dirección que muestra Astro en la terminal (por defecto `http://localhost:4321`).

## Compilación

```sh
pnpm build
pnpm preview
```

Los archivos publicables se generan en `dist/`.

## Compartir con Cloudflare Tunnel

Con `cloudflared` instalado, ejecuta:

```sh
pnpm share
```

El comando compila el sitio, sirve únicamente `dist/` en `127.0.0.1:4322` y abre un Quick Tunnel sin requerir una cuenta de Cloudflare. Comparte la dirección `https://…trycloudflare.com` que aparece en la terminal. Mantén la terminal abierta y el equipo conectado; `Ctrl+C` detiene el sitio y el túnel. Al reiniciarlo, se genera un enlace nuevo.

Referencia: [Quick Tunnels de Cloudflare](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

## Edición

- `src/pages/index.astro`: contenido, artistas y enlace a FunCapital.
- `src/styles/global.css`: diseño, colores y estilos adaptables.
- `public/images/`: imágenes originales del evento.

La tipografía Montserrat se incluye localmente mediante `@fontsource/montserrat`, sin solicitudes a Google Fonts. Se utilizan los pesos 400, 500, 600 y 700, con Arial como respaldo.

Los iconos sociales son SVG locales de [Bootstrap Icons](https://github.com/twbs/icons), con su licencia MIT en `src/icons/social/LICENSE`. Los enlaces se configuran en `socialLinks` dentro de `src/pages/index.astro`; mientras `url` sea `null`, el icono queda desactivado.
