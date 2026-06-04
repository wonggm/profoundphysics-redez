#!/usr/bin/env python3
"""
Scraper for profoundphysics.com articles.

Generates per-article markdown stubs in articles/<slug>.md. The current version
generates STUB pages (Option B in the plan): each file is a YAML frontmatter +
title + excerpt + a coral CTA back to the canonical URL on profoundphysics.com.

A future Option A implementation that captures full article bodies would need
to handle the live site's raw-LaTeX-without-delimiters convention, which is
non-trivial. For now we keep it minimal and link to the canonical source.

Usage:
    python3 scripts/scrape.py
    python3 scripts/scrape.py --only <slug>
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_JSON = ROOT / "articles.json"
ARTICLES_DIR = ROOT / "articles"

STUB_TEMPLATE = """---
title: {title}
category: {category}
date: {date}
original_url: {original_url}
excerpt: {excerpt}
canonical: true
---

# {title}

> {excerpt}

This article is part of the **Profound Physics** archive. The full piece lives at
[profoundphysics.com]({original_url}) — click through to read it on the original
site, where the math typesets correctly and the figures are preserved.

## Why this stub exists

This redesigned archive is a curated reading hub, not a content mirror. Hosting
every article locally would mean re-typesetting several thousand lines of math
into a format our static-site pipeline can render. Until that pipeline exists,
per-article pages here serve as a *card catalogue entry* — a stable, archived
landing page for each piece that points back to the canonical source.

**Last updated:** {date} · **Category:** {category}

---

*← [Back to the full archive]({index_url})*
"""


def build_stub(article: dict, index_filename: str = "../index.html") -> str:
    return STUB_TEMPLATE.format(
        title=article["title"],
        category=article["category"],
        date=article["date"],
        original_url=article["original_url"],
        excerpt=article["excerpt"],
        index_url=index_filename,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only",
        metavar="SLUG",
        help="Only generate the stub for a single article slug (for testing).",
    )
    args = parser.parse_args()

    if not ARTICLES_JSON.exists():
        print(f"error: {ARTICLES_JSON} not found", file=sys.stderr)
        return 1

    data = json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))
    articles = data["articles"]

    if args.only:
        articles = [a for a in articles if a["slug"] == args.only]
        if not articles:
            print(f"error: slug '{args.only}' not in articles.json", file=sys.stderr)
            return 1

    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)

    generated = 0
    for article in articles:
        out = ARTICLES_DIR / f"{article['slug']}.md"
        out.write_text(build_stub(article), encoding="utf-8")
        generated += 1

    print(f"Wrote {generated} stub article page(s) to {ARTICLES_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
