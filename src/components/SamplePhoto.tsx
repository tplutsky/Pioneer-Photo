import type { SamplePhotoDef } from "@/data/photos";
import { cn } from "@/lib/utils";

/**
 * Renders an ORIGINAL abstract, photo-like scene with layered SVG.
 * No real people, no third-party imagery.
 */
export function SamplePhoto({
  photo,
  className,
  rounded = true,
}: {
  photo: SamplePhotoDef;
  className?: string;
  rounded?: boolean;
}) {
  const h = photo.hue;
  const s = photo.seed;
  const id = `g-${photo.id}`;
  const sky = `hsl(${h} 42% 78%)`;
  const mid = `hsl(${(h + 18) % 360} 34% 58%)`;
  const deep = `hsl(${(h + 200) % 360} 28% 32%)`;
  const warm = `hsl(${(h + 340) % 360} 55% 68%)`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        rounded && "rounded-[3px]",
        className,
      )}
      role="img"
      aria-label={`Sample illustration: ${photo.caption}`}
    >
      <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky} />
            <stop offset="100%" stopColor={mid} />
          </linearGradient>
          <radialGradient id={`${id}-l`} cx="0.7" cy="0.2" r="0.8">
            <stop offset="0%" stopColor="hsl(45 90% 88%)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="hsl(45 90% 88%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="120" height="80" fill={`url(#${id})`} />

        {photo.category === "landscape" && (
          <>
            <path d={`M0 ${52 + (s % 6)} L28 ${34 + (s % 9)} L52 ${54} L78 ${30 + (s % 12)} L120 ${56} L120 80 L0 80 Z`} fill={deep} opacity="0.85" />
            <circle cx={22 + (s % 70)} cy={20} r={7} fill={warm} opacity="0.9" />
            <rect y="66" width="120" height="14" fill={deep} opacity="0.4" />
          </>
        )}

        {photo.category === "outdoor" && (
          <>
            <rect y="50" width="120" height="30" fill={`hsl(${(h + 10) % 360} 38% 40%)`} />
            <circle cx={30 + (s % 40)} cy={44} r={14} fill={`hsl(${(h + 15) % 360} 40% 34%)`} />
            <rect x={34 + (s % 40)} y={52} width="4" height="14" fill={deep} />
            <circle cx={92} cy={18} r={8} fill={warm} opacity="0.8" />
          </>
        )}

        {photo.category === "family-moment" && (
          <>
            <rect y="56" width="120" height="24" fill={deep} opacity="0.7" />
            {[0, 1, 2].map((k) => (
              <g key={k} opacity={0.85}>
                <circle cx={34 + k * 26 + (s % 6)} cy={40 - k * 3} r={9} fill={`hsl(${(h + k * 14) % 360} 45% 62%)`} />
                <path
                  d={`M${20 + k * 26 + (s % 6)} 72 q${14} -22 ${28} 0 Z`}
                  fill={`hsl(${(h + k * 14) % 360} 40% 48%)`}
                />
              </g>
            ))}
          </>
        )}

        {photo.category === "holiday" && (
          <>
            <rect y="58" width="120" height="22" fill={deep} opacity="0.75" />
            <path d="M60 12 L78 62 L42 62 Z" fill={`hsl(${(h + 130) % 360} 40% 34%)`} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <circle key={k} cx={48 + ((k * 13 + s) % 26)} cy={26 + k * 6} r={2.4} fill="hsl(48 90% 70%)" />
            ))}
          </>
        )}

        {photo.category === "travel" && (
          <>
            <rect y="54" width="120" height="26" fill={deep} opacity="0.7" />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={8 + k * 30} y={26 + ((k + s) % 4) * 5} width="20" height="30" fill={`hsl(${(h + k * 20) % 360} 32% ${44 + k * 5}%)`} />
            ))}
            <circle cx={100} cy={16} r={9} fill={warm} opacity="0.85" />
          </>
        )}

        {photo.category === "food" && (
          <>
            <rect width="120" height="80" fill={`hsl(${h} 30% 72%)`} />
            <ellipse cx="60" cy="46" rx="34" ry="24" fill="hsl(40 40% 94%)" />
            <ellipse cx="60" cy="46" rx="22" ry="15" fill={`hsl(${(h + 8) % 360} 55% 55%)`} />
            <ellipse cx={52 + (s % 8)} cy={42} rx="5" ry="4" fill={warm} />
          </>
        )}

        {photo.category === "baby" && (
          <>
            <rect width="120" height="80" fill={`hsl(${h} 40% 86%)`} />
            <circle cx="60" cy="42" r="22" fill={`hsl(${(h + 20) % 360} 40% 76%)`} />
            <circle cx="60" cy="36" r="11" fill="hsl(35 45% 88%)" />
            <path d="M32 74 q28 -20 56 0 Z" fill={`hsl(${(h + 40) % 360} 35% 68%)`} />
          </>
        )}

        <rect width="120" height="80" fill={`url(#${id}-l)`} />
        <rect width="120" height="80" fill="hsl(38 60% 60%)" opacity="0.08" />
      </svg>
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-30" />
    </div>
  );
}
