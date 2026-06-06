# Fonts

## Anthropic fonts (self-hosted)

The site uses **AnthropicSans**, **AnthropicSerif**, and **AnthropicMono** — Anthropic's open-source fonts released in 2025. These are the current official fonts that replaced the older "StyreneB" / "Tiempos Headline" / "JetBrains Mono" names from the original design spec.

### Font files

All five files are **variable woff2 fonts** with a `wght` axis spanning 300-800:

| File | Family | Style | Weight axis |
|---|---|---|---|
| `AnthropicSans-Romans.woff2` | Anthropic Sans | Normal | 300–800 |
| `AnthropicSans-Italics.woff2` | Anthropic Sans | Italic | 300–800 |
| `AnthropicSerif-Romans.woff2` | Anthropic Serif | Normal | 300–800 |
| `AnthropicSerif-Italics.woff2` | Anthropic Serif | Italic | 300–800 |
| `AnthropicMono.woff2` | Anthropic Mono | Normal | 300–800 |

### Source

Mirror at `github.com/matthieuhuguet/anthropic-fonts` — a public copy of the open-source fonts that Anthropic ships. Verified via fontTools: all files are valid WOFF2 (Web Open Font Format v2, TrueType).

### License

Open-source under the [Anthropic Fonts License](https://www.anthropic.com/brand) — free for personal, educational, and commercial use. Attribution appreciated but not required.

### Fallback chain

If the font files are missing, the site falls back to system fonts and Google Fonts. The fallback chain in `--font-body` is:

```css
--font-body: "AnthropicSans", "StyreneB", "Spectral", "Inter", -apple-system, ...;
```
