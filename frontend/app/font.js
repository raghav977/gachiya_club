// Prefer loading a local copy of the Bogle font. Place your font files under
// `public/fonts/` (example: `public/fonts/BBH-Sans-Bogle-400.woff2`).
// If you don't have the font files yet, add them to that folder and keep the
// file names in sync with the `src` paths below.

// Safe fallback: if you haven't added the local font file yet, exporting a
// lightweight object prevents the Next build from failing. When you place the
// real font file at `public/fonts/BBH-Sans-Bogle-400.woff2` you can replace
// this with the `next/font/local` usage again.

export const bogle = {
  // CSS variable name kept the same so `app/layout.js` works unchanged
  variable: "--font-bbh-sans-bogle",
  // className is empty for fallback; when using next/font this will be a real
  // class name to apply the font-family automatically.
  className: "",
};
