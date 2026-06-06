# Fonts

## StyreneB (self-hosted)

The site uses **StyreneB** (Anthropic's primary sans-serif) as the body font, per the Claude design spec.

### Setup

To enable StyreneB, drop the following files into this directory:

- `StyreneB-Regular.woff2` (weight 400)
- `StyreneB-Medium.woff2`  (weight 500)
- `StyreneB-Semibold.woff2` (weight 600)

The site is already configured to load them via `assets/fonts/styreneb.css` — the font is requested with `font-display: swap` so the page won't be blocked if the files are missing.

### If files are missing

The CSS font stack falls back gracefully:

```css
--font-body: "StyreneB", "Spectral", "Inter", -apple-system, ...;
```

If the .woff2 files aren't present, the browser will use **Spectral** (the next font in the stack, currently loaded from Google Fonts). The site will look slightly different but will still be readable.

### Obtaining StyreneB

For **personal/educational use**, the font can be obtained from:
- Anthropic's brand resources page (requires sign-in)
- Community-shared copies on various font-sharing sites — verify the license for your use case

For **commercial use**, StyreneB must be licensed through Commercial Type (anthropic's font vendor).
