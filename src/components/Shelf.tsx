import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AlbumSpine } from "@/components/AlbumCover";
import { getCover } from "@/data/covers";
import type { DemoAlbum } from "@/data/albums";
import { cn } from "@/lib/utils";

/** Wooden shelf that assembles on load: albums slide in, tilt, settle with overshoot. */
export function Shelf({
  albums,
  className,
  linkAlbums = true,
  nudgeFirst = false,
}: {
  albums: DemoAlbum[];
  className?: string;
  linkAlbums?: boolean;
  /** First-visit hint: lift and pulse the first spine. */
  nudgeFirst?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div className="light-sweep relative flex items-end justify-center gap-1.5 overflow-hidden px-3 pt-8 sm:gap-2.5 sm:px-6">
        {albums.map((album, i) => {
          const last = i === albums.length - 1;
          const first = i === 0;
          const spine = (
            <AlbumSpine
              cover={getCover(album.coverId)}
              title={album.title}
              dateRange={album.dateRange}
              photoCount={album.photoCount}
              className="h-[150px] w-8 sm:h-[210px] sm:w-11"
            />
          );
          const rest = last && !reduced ? -11 : 0;
          return (
            <motion.div
              key={album.id}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: -70, rotate: i % 2 ? 9 : -9 }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, rotate: rest }
              }
              transition={
                reduced
                  ? { duration: 0.3, delay: i * 0.02 }
                  : { type: "spring", stiffness: 160, damping: 11, mass: 0.6, delay: 0.12 + i * 0.09 }
              }
              {...(reduced ? {} : { whileHover: { y: -14, rotate: rest - 1.5 } })}
              className={cn(
                "origin-bottom",
                first && nudgeFirst && !reduced && "spine-nudge",
                first && nudgeFirst && "gold-pulse",
              )}
            >
              {linkAlbums ? (
                <Link
                  to="/album/$id"
                  params={{ id: album.id }}
                  search={{ open: true }}
                  aria-label={`Open ${album.title}, ${album.dateRange}, ${album.photoCount} photos`}
                  className="block rounded-sm"
                >
                  {spine}
                </Link>
              ) : (
                spine
              )}
            </motion.div>
          );
        })}
      </div>
      {/* shelf board */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { scaleX: 0.7, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={reduced ? { duration: 0.3 } : { type: "spring", stiffness: 120, damping: 18 }}
        className="wood-texture relative h-4 w-full rounded-sm sm:h-5"
        style={{ boxShadow: "var(--shadow-shelf)" }}
      />
      <div className="wood-texture mx-auto h-2 w-[92%] rounded-b-md opacity-70" />
    </div>
  );
}
