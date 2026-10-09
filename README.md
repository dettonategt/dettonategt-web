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

## Edición

- `src/pages/index.astro`: contenido, artistas y enlace a FunCapital.
- `src/styles/global.css`: diseño, colores y estilos adaptables.
- `public/images/`: imágenes originales del evento.

Las fuentes Barlow Condensed y Space Grotesk se cargan desde Google Fonts; hay fuentes de respaldo para conexiones sin acceso a ese servicio.
