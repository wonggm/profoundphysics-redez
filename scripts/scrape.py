#!/usr/bin/env python3
"""
Scraper for profoundphysics.com articles using Playwright.

Renders each article in a headless Chromium browser, extracts the article body,
replaces rendered KaTeX math with the original LaTeX (wrapped in $...$ or $$...$$),
converts to markdown, and saves to articles/<slug>.md.

Usage:
    python3 scripts/scrape.py              # Scrape all 50 articles
    python3 scripts/scrape.py --only <slug>  # Scrape one article
    python3 scripts/scrape.py --list       # List all article slugs
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag
from markdownify import markdownify as md
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_JSON = ROOT / "articles.json"
ARTICLES_DIR = ROOT / "articles"


def load_articles() -> list[dict]:
    """Load articles.json and return the list of article dicts."""
    if not ARTICLES_JSON.exists():
        print(f"error: {ARTICLES_JSON} not found", file=sys.stderr)
        sys.exit(1)
    data = json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))
    return data["articles"]


def extract_latex_from_katex(article_html: str) -> str:
    """
    Replace all rendered KaTeX spans with the original LaTeX.

    - Display math (parent is .katex-display) → $$...$$
    - Inline math → $...$

    Returns the cleaned HTML string.
    """
    soup = BeautifulSoup(article_html, "html.parser")

    # Find all .katex spans
    katex_spans = soup.find_all("span", class_="katex")

    for span in katex_spans:
        # Extract LaTeX from <annotation> child
        annotation = span.find("annotation")
        if not annotation or not annotation.string:
            continue

        latex = annotation.string.strip()

        # Determine if display or inline math
        parent = span.parent
        is_display = parent and "katex-display" in parent.get("class", [])

        if is_display:
            replacement = f"\n\n$${latex}$$\n\n"
            # Replace the entire .katex-display parent
            parent.replace_with(NavigableString(replacement))
        else:
            replacement = f"${latex}$"
            span.replace_with(NavigableString(replacement))

    return str(soup)


def clean_article_html(html: str) -> str:
    """
    Extract the article body from the full page HTML.
    Removes navigation, sidebar, footer, ads, etc.
    """
    soup = BeautifulSoup(html, "html.parser")

    # Find the article element
    article = soup.find("article")
    if not article:
        # Fallback: try main or entry-content
        article = soup.find("main") or soup.find(class_="entry-content")

    if not article:
        return ""

    # Remove unwanted elements
    for tag in article.find_all(["nav", "footer", "aside", "script", "style"]):
        tag.decompose()

    # Remove common non-content classes
    for class_name in ["sidebar", "related-posts", "comments", "author-bio", "share-buttons"]:
        for el in article.find_all(class_=re.compile(class_name, re.I)):
            el.decompose()

    # Extract the main content area (usually .entry-content)
    content = article.find(class_="entry-content")
    if content:
        return str(content)

    # Fallback: return the entire article
    return str(article)


def html_to_markdown(html: str) -> str:
    """Convert HTML to markdown, preserving headings, lists, code blocks, etc."""
    # Use markdownify with appropriate options
    markdown = md(
        html,
        heading_style="atx",  # Use # for headings
        bullets="-",  # Use - for list items
        code_language="",  # No default language for code blocks
    )

    # Clean up excessive blank lines
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)

    # Unescape underscores inside math blocks (markdownify escapes them, but KaTeX needs raw _)
    # Display math: $$...$$
    def unescape_math_display(match):
        content = match.group(1)
        content = content.replace(r"\_", "_")
        return f"$${content}$$"

    markdown = re.sub(r"\$\$(.*?)\$\$", unescape_math_display, markdown, flags=re.DOTALL)

    # Inline math: $...$
    def unescape_math_inline(match):
        content = match.group(1)
        content = content.replace(r"\_", "_")
        return f"${content}$"

    markdown = re.sub(r"\$(.*?)\$", unescape_math_inline, markdown)

    return markdown.strip()


def download_image(url: str, save_path: Path) -> bool:
    """Download an image from URL and save to local path."""
    try:
        import requests
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"    ⚠ Failed to download image {url}: {e}")
        return False


def scrape_article(url: str, slug: str) -> dict:
    """
    Scrape a single article and return a dict with:
    - title: str
    - content_html: str (cleaned HTML with LaTeX restored)
    - content_md: str (markdown version)
    - images: list of (original_url, local_path) tuples
    """
    print(f"  Scraping {slug}...")

    images = []
    image_dir = ROOT / "assets" / "images" / slug
    image_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Load the page
            page.goto(url, wait_until="domcontentloaded", timeout=60000)

            # Wait for page to settle
            page.wait_for_timeout(3000)

            # Get the full page HTML
            html = page.content()

            # Extract images from the article
            soup = BeautifulSoup(html, 'html.parser')
            article = soup.find('article') or soup.find('main')
            if article:
                content = article.find(class_='entry-content') or article
                img_tags = content.find_all('img')
                for i, img in enumerate(img_tags):
                    src = img.get('src')
                    # Skip data: URIs (lazy-loading placeholders)
                    if not src or src.startswith('data:'):
                        # Remove the img tag entirely
                        img.decompose()
                        continue

                    # Make URL absolute
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        from urllib.parse import urlparse
                        parsed = urlparse(url)
                        src = f"{parsed.scheme}://{parsed.netloc}{src}"

                    # Download image
                    ext = Path(src).suffix or '.jpg'
                    if '?' in ext:
                        ext = ext.split('?')[0]
                    local_filename = f"img_{i+1}{ext}"
                    local_path = image_dir / local_filename

                    if download_image(src, local_path):
                        images.append((src, f"../assets/images/{slug}/{local_filename}"))
                        # Replace src in HTML with local path
                        img['src'] = f"../assets/images/{slug}/{local_filename}"
                        print(f"    ✓ Downloaded image {i+1}: {local_filename}")
                    else:
                        # Remove failed images from HTML
                        img.decompose()

            # Get the updated HTML
            html = str(soup)

        except Exception as e:
            print(f"    ✗ Error loading {url}: {e}")
            browser.close()
            return None
        finally:
            browser.close()

    # Extract the article body
    article_html = clean_article_html(html)
    if not article_html:
        print(f"    ✗ No article content found")
        return None

    # Replace KaTeX with LaTeX
    article_html = extract_latex_from_katex(article_html)

    # Extract title
    soup = BeautifulSoup(html, "html.parser")
    title_el = soup.find("h1", class_="entry-title") or soup.find("h1")
    title = title_el.get_text(strip=True) if title_el else slug.replace("-", " ").title()

    # Convert to markdown
    content_md = html_to_markdown(article_html)

    return {
        "title": title,
        "content_html": article_html,
        "content_md": content_md,
        "images": images,
    }


def generate_article_md(article_data: dict, meta: dict) -> str:
    """Generate the markdown file content with YAML frontmatter."""
    frontmatter = f"""---
title: {meta['title']}
category: {meta['category']}
date: {meta['date']}
original_url: {meta['original_url']}
excerpt: {meta['excerpt']}
canonical: false
---

"""

    body = f"""# {article_data['title']}

> {meta['excerpt']}

*Originally published at [profoundphysics.com]({meta['original_url']}).*

---

{article_data['content_md']}

---

*← [Back to the full archive](../index.html)*
"""

    return frontmatter + body


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", metavar="SLUG", help="Only scrape one article")
    parser.add_argument("--list", action="store_true", help="List all article slugs")
    args = parser.parse_args()

    articles = load_articles()

    if args.list:
        for a in articles:
            print(f"{a['slug']:60}  {a['category']:30}  {a['date']}")
        return 0

    if args.only:
        articles = [a for a in articles if a["slug"] == args.only]
        if not articles:
            print(f"error: slug '{args.only}' not in articles.json", file=sys.stderr)
            return 1

    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Scraping {len(articles)} article(s)...\n")

    success = 0
    failed = 0

    for i, article in enumerate(articles, 1):
        slug = article["slug"]
        url = article["original_url"]

        print(f"[{i}/{len(articles)}] {slug}")

        result = scrape_article(url, slug)
        if not result:
            failed += 1
            continue

        # Generate the markdown file
        md_content = generate_article_md(result, article)

        # Write to file
        out_path = ARTICLES_DIR / f"{slug}.md"
        out_path.write_text(md_content, encoding="utf-8")

        print(f"    ✓ Wrote {out_path.name} ({len(md_content)} chars)")
        success += 1

        # Brief pause to avoid hammering the server
        if i < len(articles):
            time.sleep(1)

    print(f"\n{'='*60}")
    print(f"Done. Success: {success}, Failed: {failed}")
    print(f"{'='*60}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
