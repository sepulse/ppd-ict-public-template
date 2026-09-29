from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "icons"
ICONS.mkdir(parents=True, exist_ok=True)

BG = (51, 65, 85, 255)
FG = (248, 247, 242, 255)
ACCENT = (148, 163, 184, 255)


def make_icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(image)
    scale = size / 512

    def pt(x, y):
        return int(x * scale), int(y * scale)

    line_width = max(2, int(24 * scale))
    node_r = max(4, int(48 * scale))
    center_r = max(5, int(60 * scale))
    nodes = [pt(150, 160), pt(362, 160), pt(150, 352), pt(362, 352)]
    center = pt(256, 256)

    for node in nodes:
        draw.line([center, node], fill=FG, width=line_width)

    for x, y in nodes:
        draw.ellipse((x - node_r, y - node_r, x + node_r, y + node_r), fill=FG)

    cx, cy = center
    draw.ellipse((cx - center_r, cy - center_r, cx + center_r, cy + center_r), fill=ACCENT)
    inner = max(3, int(22 * scale))
    draw.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill=BG)
    return image


def save_png(size: int, filename: str):
    make_icon(size).save(ICONS / filename, "PNG", optimize=True)


save_png(192, "icon-192.png")
save_png(512, "icon-512.png")
save_png(192, "icon-192-maskable.png")
save_png(512, "icon-512-maskable.png")
save_png(180, "apple-touch-icon-180.png")
make_icon(180).save(ICONS / "apple-touch-icon.png", "PNG", optimize=True)
save_png(16, "favicon-16x16.png")
save_png(32, "favicon-32x32.png")
make_icon(64).save(ICONS / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#334155"/>
  <g stroke="#f8f7f2" stroke-width="24" stroke-linecap="round">
    <path d="M256 256 150 160M256 256 362 160M256 256 150 352M256 256 362 352"/>
  </g>
  <g fill="#f8f7f2">
    <circle cx="150" cy="160" r="48"/><circle cx="362" cy="160" r="48"/>
    <circle cx="150" cy="352" r="48"/><circle cx="362" cy="352" r="48"/>
  </g>
  <circle cx="256" cy="256" r="60" fill="#94a3b8"/>
  <circle cx="256" cy="256" r="22" fill="#334155"/>
</svg>
"""
(ICONS / "icon.svg").write_text(svg, encoding="utf-8")
(ROOT / "icon.svg").write_text(svg, encoding="utf-8")

for name in ["apple-touch-icon-180.png", "apple-touch-icon.png", "favicon.ico"]:
    (ROOT / name).write_bytes((ICONS / name).read_bytes())

pwa_dir = ROOT / "assets" / "pwa"
pwa_dir.mkdir(parents=True, exist_ok=True)
(pwa_dir / "icon-512.png").write_bytes((ICONS / "icon-512.png").read_bytes())

print("Generic white-label icon set generated.")
