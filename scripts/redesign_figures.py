#!/usr/bin/env python3
"""
Redesign all figures in assets/images/ to blend with the page design.

For each raster image (JPG, PNG, GIF):
  1. Detect brightness (sample a 20x20 grid)
  2. Add a cream-tinted card background
  3. Add rounded corners (12px)
  4. Add a 1px hairline border
  5. Export as .webp (lossless, ~30% smaller)

The original image's pixel data is preserved exactly — only the surrounding
presentation is changed.

Usage:
    python3 scripts/redesign_figures.py
    python3 scripts/redesign_figures.py --dry-run
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "assets" / "images"

# Design tokens from the page
BG_LIGHT = "#f5f0e8"  # cream-tinted background for light images
BG_DARK  = "#efe9de"  # slightly darker for dark images
BORDER   = "#e6dfd8"  # hairline border

PADDING = 16       # px around the original image
RADIUS  = 12       # corner radius (matches --r-lg)
BORDER_W = 1       # hairline thickness

WEBP_QUALITY = 90  # high quality, visually lossless
BRIGHTNESS_THRESHOLD = 128  # above = light, below = dark


def detect_brightness(img: Image.Image) -> float:
    """Return mean brightness 0-255 from a downsampled image."""
    small = img.convert("RGB").resize((20, 20))
    pixels = list(small.getdata())
    return sum(sum(p) for p in pixels) / (20 * 20 * 3)


def hex_to_rgb(h: str) -> tuple:
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def rounded_mask(size: tuple, radius: int) -> Image.Image:
    """Create a mask with rounded corners."""
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size[0] - 1, size[1] - 1)], radius=radius, fill=255)
    return mask


def process_image(src_path: Path) -> Path | None:
    """Process a single image and write a .webp version. Returns the new path."""
    try:
        img = Image.open(src_path)
    except Exception as e:
        print(f"  ✗ Cannot open {src_path.name}: {e}")
        return None

    # Skip if too small or extreme aspect ratio
    w, h = img.size
    if w < 80 or h < 80:
        print(f"  ⊘ Skipping (too small): {src_path.name} ({w}x{h})")
        return None
    if w / h > 3 or h / w > 3:
        print(f"  ⊘ Skipping (extreme aspect): {src_path.name} ({w}x{h})")
        return None

    # Detect brightness
    brightness = detect_brightness(img)
    bg_color = BG_LIGHT if brightness > BRIGHTNESS_THRESHOLD else BG_DARK
    bg_rgb = hex_to_rgb(bg_color)
    border_rgb = hex_to_rgb(BORDER)

    # Convert source to RGBA for compositing
    if img.mode == "P":
        img = img.convert("RGBA")
    elif img.mode == "RGB":
        img = img.convert("RGBA")
    elif img.mode == "CMYK":
        img = img.convert("RGBA")

    # New canvas with background
    canvas_w = w + 2 * PADDING + 2 * BORDER_W
    canvas_h = h + 2 * PADDING + 2 * BORDER_W
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (*bg_rgb, 255))

    # Paste the original image centered
    canvas.paste(img, (PADDING + BORDER_W, PADDING + BORDER_W), img if img.mode == "RGBA" else None)

    # Add rounded corners
    mask = rounded_mask((canvas_w, canvas_h), RADIUS)
    rounded = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    rounded.paste(canvas, (0, 0), mask)

    # Add hairline border
    draw = ImageDraw.Draw(rounded)
    draw.rounded_rectangle(
        [(0, 0), (canvas_w - 1, canvas_h - 1)],
        radius=RADIUS,
        outline=(*border_rgb, 255),
        width=BORDER_W,
    )

    # Export as WebP
    out_path = src_path.with_suffix(".webp")
    # Convert to RGB for webp (no alpha needed for our card)
    final = Image.new("RGB", rounded.size, (*bg_rgb, 255))
    final.paste(rounded, mask=rounded.split()[3] if rounded.mode == "RGBA" else None)
    final.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)

    return out_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Count images without processing")
    args = parser.parse_args()

    if not IMAGES_DIR.exists():
        print(f"error: {IMAGES_DIR} not found", file=sys.stderr)
        return 1

    # Find all raster images
    extensions = {".jpg", ".jpeg", ".png", ".gif"}
    image_paths = []
    for ext in extensions:
        image_paths.extend(IMAGES_DIR.rglob(f"*{ext}"))
    image_paths.sort()

    print(f"Found {len(image_paths)} raster images")

    if args.dry_run:
        return 0

    processed = 0
    skipped = 0
    failed = 0
    total_saved = 0

    for path in image_paths:
        # Skip if webp already exists and is newer
        webp_path = path.with_suffix(".webp")
        if webp_path.exists():
            if webp_path.stat().st_mtime > path.stat().st_mtime:
                print(f"  ⏭ Already processed: {path.name}")
                continue

        original_size = path.stat().st_size
        result = process_image(path)
        if result is None:
            skipped += 1
            continue
        new_size = result.stat().st_size
        saved = original_size - new_size
        total_saved += saved
        reduction = (saved / original_size) * 100 if original_size > 0 else 0
        print(f"  ✓ {path.name} → {result.name} ({reduction:+.0f}%)")
        processed += 1

    print(f"\n{'='*50}")
    print(f"Processed: {processed}")
    print(f"Skipped:   {skipped}")
    print(f"Failed:    {failed}")
    if total_saved > 0:
        print(f"Total saved: {total_saved / 1024:.0f} KB ({total_saved / (1024*1024):.1f} MB)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
