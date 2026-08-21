#!/usr/bin/env python3
"""Build shelf-ready spine textures from official Pioneer cover photos.

Each spine is official cover *material* (leather, linen, cloth) painted as a
full-bleed binding — never a skinny crop of the front cover, windows, or
studio backdrop. Source files are first-party JPEGs in public/pioneer/covers/.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
COVERS = ROOT / "public/pioneer/covers"
SPINES = ROOT / "public/pioneer/spines"
WIDTH, HEIGHT = 80, 520


def is_studio_white(r: int, g: int, b: int) -> bool:
    return r >= 232 and g >= 232 and b >= 232 and max(r, g, b) - min(r, g, b) <= 22


def album_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    xs: list[int] = []
    ys: list[int] = []
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y][:3]
            if not is_studio_white(r, g, b):
                xs.append(x)
                ys.append(y)
    if not xs:
        return 0, 0, w, h
    return max(0, min(xs)), max(0, min(ys)), min(w, max(xs) + 1), min(h, max(ys) + 1)


def white_fraction(patch: Image.Image) -> float:
    px = patch.load()
    w, h = patch.size
    white = 0
    n = 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y][:3]
            n += 1
            if is_studio_white(r, g, b):
                white += 1
    return white / max(n, 1)


def body_luminance(im: Image.Image, box: tuple[int, int, int, int]) -> float:
    l, t, r, b = box
    crop = im.crop((l + 6, t + 6, max(l + 8, r - 6), max(t + 8, b - 6))).resize(
        (40, 40), Image.Resampling.BOX
    )
    px = crop.load()
    vals: list[float] = []
    for y in range(40):
        for x in range(40):
            r, g, b = px[x, y][:3]
            if is_studio_white(r, g, b):
                continue
            vals.append(0.299 * r + 0.587 * g + 0.114 * b)
    if not vals:
        return 80.0
    vals.sort()
    return vals[len(vals) // 2]


def material_score(patch: Image.Image, body_lum: float) -> float:
    """High score = even cover cloth/leather. Low score = photo, foil, type, sky."""
    if white_fraction(patch) > 0.08:
        return -80.0
    gray = patch.convert("L")
    rgb = ImageStat.Stat(patch)
    gst = ImageStat.Stat(gray)
    lum = 0.299 * rgb.mean[0] + 0.587 * rgb.mean[1] + 0.114 * rgb.mean[2]
    spread = gst.stddev[0]
    lo, hi = gray.getextrema()
    rng = hi - lo
    # Photo windows and gold display type swing hard.
    if rng > 150 or spread > 40:
        return -20.0
    if spread > 32:
        return 4.0
    return (
        55.0
        + (18.0 - abs(spread - 11))
        + (10.0 if 16 < lum < 230 else -6.0)
        - abs(lum - body_lum) * 0.28
    )


def collect_patches(im: Image.Image, box: tuple[int, int, int, int]) -> list[Image.Image]:
    l, t, r, b = box
    w, h = r - l, b - t
    # Stay inside the cover body so border foil / stitching / windows stay out.
    l += int(w * 0.14)
    r -= int(w * 0.10)
    t += int(h * 0.10)
    b -= int(h * 0.10)
    if r - l < 40 or b - t < 40:
        l, t, r, b = box
    pw, ph = 30, 42
    body_lum = body_luminance(im, box)
    scored: list[tuple[float, Image.Image]] = []
    y = t
    while y + ph <= b:
        x = l
        while x + pw <= r:
            patch = im.crop((x, y, x + pw, y + ph))
            score = material_score(patch, body_lum)
            if score > 20:
                scored.append((score, patch))
            x += 18
        y += 22
    scored.sort(key=lambda item: item[0], reverse=True)
    return [p for _, p in scored[:10]]


def average_body_color(im: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int]:
    l, t, r, b = box
    crop = im.crop((l + 8, t + 8, max(l + 10, r - 8), max(t + 10, b - 8)))
    small = crop.resize((48, 48), Image.Resampling.BOX)
    px = small.load()
    rs = gs = bs = n = 0
    for y in range(48):
        for x in range(48):
            r, g, b = px[x, y][:3]
            if is_studio_white(r, g, b):
                continue
            gray = int(0.299 * r + 0.587 * g + 0.114 * b)
            # Skip near-black photo interiors and bright window photos.
            if gray < 18 or gray > 235:
                continue
            rs += r
            gs += g
            bs += b
            n += 1
    if n == 0:
        return 48, 36, 28
    return rs // n, gs // n, bs // n


def build_texture(patches: list[Image.Image], fallback: tuple[int, int, int]) -> Image.Image:
    if not patches:
        tex = Image.new("RGB", (WIDTH, HEIGHT), fallback)
        return tex
    base = ImageOps.fit(patches[0], (WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    if len(patches) > 1:
        extra = ImageOps.fit(patches[1], (WIDTH, HEIGHT), Image.Resampling.LANCZOS)
        base = Image.blend(base, extra, 0.28)
    return base


def apply_cylinder(tex: Image.Image) -> Image.Image:
    w, h = tex.size
    shade = Image.new("L", (w, h))
    pix = shade.load()
    for x in range(w):
        t = x / max(w - 1, 1)
        # Rounded binding: highlight just left of center, darker toward the hinge.
        ridge = abs(t - 0.34) ** 0.65
        v = int(238 - ridge * 82 - t * 10)
        v = max(158, min(250, v))
        for y in range(h):
            edge = 14 if y < 8 or y > h - 9 else 0
            pix[x, y] = max(140, v - edge)
    cyl = ImageChops.multiply(tex, Image.merge("RGB", (shade, shade, shade)))
    return ImageEnhance.Contrast(cyl).enhance(1.03)


def is_light(tex: Image.Image) -> bool:
    st = ImageStat.Stat(tex)
    return (0.299 * st.mean[0] + 0.587 * st.mean[1] + 0.114 * st.mean[2]) >= 148


def add_binding_marks(im: Image.Image, light: bool) -> None:
    draw = ImageDraw.Draw(im)
    w, h = im.size
    foil = (58, 42, 28) if light else (210, 174, 96)
    head = (78, 58, 40) if light else (188, 148, 70)
    draw.rectangle([4, 3, w - 5, 7], fill=head)
    draw.rectangle([4, h - 8, w - 5, h - 4], fill=head)
    for y in (int(h * 0.16), int(h * 0.84)):
        draw.line([(int(w * 0.20), y), (int(w * 0.80), y)], fill=foil, width=2)


def make_spine(im: Image.Image) -> Image.Image:
    box = album_bbox(im)
    patches = collect_patches(im, box)
    tex = build_texture(patches, average_body_color(im, box))
    tex = tex.filter(ImageFilter.UnsharpMask(radius=0.6, percent=90, threshold=3))
    tex = apply_cylinder(tex)
    add_binding_marks(tex, is_light(tex))
    return tex.convert("RGB")


def main() -> None:
    SPINES.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in COVERS.glob("*.jpg") if p.is_file())
    if not files:
        raise SystemExit(f"no cover JPEGs in {COVERS}")
    for src in files:
        im = Image.open(src).convert("RGB")
        spine = make_spine(im)
        dest = SPINES / src.name
        spine.save(dest, "JPEG", quality=90, optimize=True)
        print(f"{src.name:32} patches-ok  light={is_light(spine)}")
    print(f"wrote {len(files)} spines to {SPINES}")


if __name__ == "__main__":
    main()
