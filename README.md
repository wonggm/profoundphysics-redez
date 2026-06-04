# Profound Physics — Articles Archive

A redesign of [profoundphysics.com](https://profoundphysics.com/) focused on its
**Articles** content. Hosted on GitHub Pages. Static, no build step, math rendered
by KaTeX.

## Design

The site applies the **Claude** design language (warm cream canvas, slab-serif
Cormorant Garamond display, coral CTAs, dark-navy product surfaces) to a literary
physics archive. The aesthetic is editorial — a magazine for physics, not a SaaS
template.

The Claude design system is documented at
[`awesome-design-md/design-md/claude/DESIGN.md`](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/claude/DESIGN.md).

## Structure

```
.
├── index.html              # Landing page (the articles hub)
├── article.html            # Per-article page (rendered via ?slug=)
├── styles.css              # All design tokens + section rules
├── app.js                  # Hub rendering, search, filter, KaTeX
├── article.js              # Per-article page renderer
├── articles.json           # Canonical list of 50 articles
├── articles/               # Markdown stub for each article (one .md per article)
├── assets/
│   ├── spike-mark.svg      # 4-spoke radial brand glyph
│   ├── favicon.svg
│   └── README.md           # Brand asset documentation
├── scripts/
│   └── scrape.py           # Generates articles/<slug>.md stubs
└── .gitignore
```

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

A static server is required (not `file://`) because `articles.json` is loaded
via `fetch()`.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: Profound Physics articles archive"
gh repo create profoundphysics --public --source=. --remote=origin --push
# In GitHub: Settings → Pages → Source: main / (root) → Save
```

There is no build step. What is in `main` is what is served. Update by editing
a file, committing, and pushing.

## Adding or updating articles

Edit `articles.json` to add a new article, change an excerpt, or re-categorize
a piece. The hub and per-article pages re-render from this JSON on every load.
To regenerate the markdown stubs:

```bash
python3 scripts/scrape.py                # all 50
python3 scripts/scrape.py --only <slug>  # one article
```

## Math rendering

Math is rendered by [KaTeX](https://katex.org/) 0.16.11 (auto-render extension)
via the jsDelivr CDN. Both inline (`$...$`) and display (`$$...$$`) math are
supported, as well as the LaTeX `\(`/`\)` and `\[`/`\]` alternatives. Excerpts
in `articles.json` use TeX where Unicode is insufficient (e.g. `G_{\mu\nu}` for
the Einstein field equation).

## Source attribution

All article content (titles, excerpts, and dates) is taken from the live
[profoundphysics.com](https://profoundphysics.com/) archive. Per-article pages
on this site link back to the canonical URL on the original site; the article
*body* is not mirrored here. This redesign is a curated reading hub, not a
content mirror.
