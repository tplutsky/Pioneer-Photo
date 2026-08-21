import { useState } from "react";
import type { AlbumCoverDef } from "@/data/covers";
import { cn } from "@/lib/utils";

/**
 * Album covers: official Pioneer product photos when `photoSrc` is set,
 * with the original CSS/SVG skin as the fallback if the image is missing.
 */

interface Skin {
  base: string;
  shade: string;
  ink: string;
  accent: string;
  texture: "leather" | "linen" | "paper" | "board";
}

const SKINS: Record<string, Skin> = {
  "burgundy-gold-frame": { base: "#5d1f28", shade: "#3d1219", ink: "#f4e3c1", accent: "#d8b169", texture: "leather" },
  "ivory-linen-emboss": { base: "#efe6d4", shade: "#ddd0b8", ink: "#5a4a34", accent: "#b79f74", texture: "linen" },
  "navy-heritage-spine": { base: "#22304c", shade: "#141d31", ink: "#e8d9b4", accent: "#cdae6f", texture: "leather" },
  "floral-garden": { base: "#e7d3d6", shade: "#d3b6bc", ink: "#5b3742", accent: "#a8617a", texture: "board" },
  "kraft-travel-journal": { base: "#c8a678", shade: "#a9865a", ink: "#4a3620", accent: "#6d5433", texture: "paper" },
  "sage-botanical": { base: "#c3cdb6", shade: "#a5b295", ink: "#3c4a34", accent: "#65784f", texture: "linen" },
  "black-archival": { base: "#20201f", shade: "#101010", ink: "#ddd6c8", accent: "#8b8577", texture: "board" },
  "warm-brown-family": { base: "#6b4a2f", shade: "#48301c", ink: "#f0dfbe", accent: "#cfa86a", texture: "leather" },
  "pale-blue-baby": { base: "#cddce8", shade: "#adc2d3", ink: "#3d4f5f", accent: "#7d9cb5", texture: "linen" },
  "red-gold-holiday": { base: "#7a1f22", shade: "#521315", ink: "#f6e3b8", accent: "#e0bb6e", texture: "board" },
  "pearl-wedding": { base: "#f0ece2", shade: "#ddd7c8", ink: "#5c5245", accent: "#c2ab7d", texture: "linen" },
  "forest-expedition": { base: "#2f4634", shade: "#1d2c22", ink: "#e6dcc0", accent: "#bda169", texture: "leather" },
  "memory-book-ivory": { base: "#efe6d4", shade: "#ddd0b8", ink: "#5a4a34", accent: "#b79f74", texture: "linen" },
};

const fallback: Skin = SKINS["black-archival"]!;

export function coverSkin(coverId: string): Skin {
  return SKINS[coverId] ?? fallback;
}

function TexturedOverlay({ texture }: { texture: Skin["texture"] }) {
  const cls =
    texture === "leather"
      ? "leather-texture opacity-40"
      : texture === "linen"
        ? "linen-texture opacity-45"
        : texture === "paper"
          ? "paper-grain opacity-50"
          : "paper-grain opacity-25";
  return <div className={cn("pointer-events-none absolute inset-0", cls)} />;
}

function Motif({ cover, skin }: { cover: AlbumCoverDef; skin: Skin }) {
  const a = skin.accent;
  switch (cover.id) {
    case "floral-garden":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-70">
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 10 + (i % 4) * 26;
            const y = 14 + Math.floor(i / 4) * 34;
            return (
              <g key={i} fill={a} opacity={0.55}>
                {[0, 72, 144, 216, 288].map((r) => (
                  <ellipse key={r} cx={x} cy={y} rx="3" ry="7" transform={`rotate(${r} ${x} ${y})`} />
                ))}
                <circle cx={x} cy={y} r="2" fill={skin.ink} />
              </g>
            );
          })}
        </svg>
      );
    case "sage-botanical":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-60">
          {[25, 50, 75].map((x, i) => (
            <g key={x} stroke={a} strokeWidth="1.2" fill="none">
              <path d={`M${x} 120 C ${x} 80, ${x + (i - 1) * 12} 50, ${x} 20`} />
              {Array.from({ length: 6 }).map((_, k) => (
                <ellipse key={k} cx={x + (k % 2 ? 7 : -7)} cy={30 + k * 15} rx="7" ry="3.4" fill={a} opacity="0.5" stroke="none" />
              ))}
            </g>
          ))}
        </svg>
      );
    case "red-gold-holiday":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-80">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M50 70 L52 66 L50 56 L48 66 Z"
              fill={a}
              transform={`rotate(${i * 22.5} 50 70) translate(0 ${i % 2 ? -6 : 0})`}
              opacity="0.75"
            />
          ))}
          <circle cx="50" cy="70" r="5" fill={a} />
        </svg>
      );
    case "kraft-travel-journal":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full">
          <rect x="12" y="18" width="34" height="26" fill="none" stroke={a} strokeWidth="1.4" transform="rotate(-8 29 31)" />
          <rect x="56" y="96" width="30" height="22" fill="none" stroke={a} strokeWidth="1.4" transform="rotate(6 71 107)" />
          <path d="M8 70 q22 -14 44 0 t40 -4" stroke={a} strokeWidth="1.2" fill="none" strokeDasharray="4 4" />
        </svg>
      );
    case "forest-expedition":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-70">
          <circle cx="50" cy="70" r="26" fill="none" stroke={a} strokeWidth="1.4" />
          <path d="M50 42 L57 70 L50 98 L43 70 Z" fill={a} opacity="0.6" />
          <path d="M22 70 L50 63 L78 70 L50 77 Z" fill={a} opacity="0.4" />
        </svg>
      );
    case "pale-blue-baby":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-70">
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${8 + i * 10} 12 a5 5 0 0 1 10 0`} fill="none" stroke={a} strokeWidth="1.4" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={`b${i}`} d={`M${8 + i * 10} 128 a5 5 0 0 0 10 0`} fill="none" stroke={a} strokeWidth="1.4" />
          ))}
        </svg>
      );
    case "pearl-wedding":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full">
          <rect x="0" y="86" width="100" height="12" fill={a} opacity="0.35" />
          <circle cx="50" cy="52" r="18" fill="none" stroke={a} strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

export function AlbumCover({
  cover,
  title,
  subtitle,
  className,
}: {
  cover: AlbumCoverDef;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const skin = coverSkin(cover.id);
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(cover.photoSrc) && !photoFailed;
  return (
    <div
      className={cn("relative overflow-hidden rounded-r-md rounded-l-sm select-none", className)}
      style={{
        background: `linear-gradient(150deg, ${skin.base}, ${skin.shade})`,
        boxShadow: "var(--shadow-spine)",
      }}
    >
      {!showPhoto && <TexturedOverlay texture={skin.texture} />}
      {!showPhoto && <Motif cover={cover} skin={skin} />}
      {cover.photoSrc ? (
        <img
          src={cover.photoSrc}
          alt=""
          onError={() => setPhotoFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            showPhoto ? "opacity-100" : "hidden",
          )}
        />
      ) : null}
      {!showPhoto && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-[7%]"
            style={{ background: `linear-gradient(90deg, ${skin.shade}, transparent)` }}
          />
          <div className="absolute inset-y-0 left-[7%] w-px" style={{ background: skin.accent, opacity: 0.4 }} />
        </>
      )}

      {/* title frame — CSS/SVG fallback only; official photos already are the cover */}
      {!showPhoto && <div className="absolute inset-[10%] flex flex-col items-center justify-center px-2 text-center">
        <div
          className="flex w-full flex-col items-center justify-center gap-1 px-2 py-4"
          style={{ border: `1.5px solid ${skin.accent}`, boxShadow: `inset 0 0 0 3px ${skin.base}` }}
        >
          <span
            className="font-display text-[0.72rem] leading-tight font-semibold sm:text-sm"
            style={{ color: skin.ink }}
          >
            {title}
          </span>
          {subtitle ? (
            <span className="text-[0.6rem] tracking-[0.16em] uppercase" style={{ color: skin.accent }}>
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>}
      {!showPhoto && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10" />
      )}
    </div>
  );
}

export function spineDateLabel(dateRange: string): string {
  const years = dateRange.match(/\d{4}/g);
  if (!years?.length) return dateRange.length > 8 ? dateRange.slice(0, 7) : dateRange;
  if (years.length === 1) return years[0]!;
  return `${years[0]!.slice(2)}–${years[1]!.slice(2)}`;
}

/** Upright album on a shelf: spine forward, with year and photo count. */
export function AlbumSpine({
  cover,
  title,
  dateRange,
  photoCount,
  className,
}: {
  cover: AlbumCoverDef;
  title: string;
  dateRange?: string;
  photoCount?: number;
  className?: string;
}) {
  const skin = coverSkin(cover.id);
  const dateLabel = dateRange ? spineDateLabel(dateRange) : "";
  return (
    <div
      className={cn("relative overflow-hidden rounded-t-sm rounded-b-[2px]", className)}
      style={{
        background: `linear-gradient(100deg, ${skin.shade}, ${skin.base} 40%, ${skin.shade})`,
        boxShadow: "var(--shadow-spine)",
      }}
    >
      <TexturedOverlay texture={skin.texture} />
      <div className="absolute inset-x-1 top-2 h-px" style={{ background: skin.accent, opacity: 0.7 }} />
      <div className="absolute inset-x-1 bottom-2 h-px" style={{ background: skin.accent, opacity: 0.7 }} />
      {dateLabel ? (
        <span
          className="absolute inset-x-0 top-3 text-center text-[0.48rem] font-semibold tracking-wide sm:text-[0.55rem]"
          style={{ color: skin.accent }}
        >
          {dateLabel}
        </span>
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display max-h-[62%] overflow-hidden text-[0.62rem] font-semibold tracking-wide whitespace-nowrap"
          style={{ color: skin.ink, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {title}
        </span>
      </div>
      {typeof photoCount === "number" ? (
        <span
          className="absolute inset-x-0 bottom-3 text-center text-[0.48rem] font-semibold tracking-wide sm:text-[0.55rem]"
          style={{ color: skin.accent }}
          aria-hidden
        >
          {photoCount}
        </span>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/30" />
    </div>
  );
}
