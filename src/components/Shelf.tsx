import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AlbumSpine, spineBoxSize, spineLeanDegrees } from "@/components/AlbumCover";
import { getCover } from "@/data/covers";
import type { DemoAlbum } from "@/data/albums";
import { cn } from "@/lib/utils";

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

function ShelfRow({
  albums,
  startIndex,
  reduced,
  linkAlbums,
  nudgeFirst,
  compact,
}: {
  albums: DemoAlbum[];
  startIndex: number;
  reduced: boolean | null;
  linkAlbums: boolean;
  nudgeFirst: boolean;
  compact: boolean;
}) {
  const quiet = Boolean(reduced);

  return (
    <div className="relative px-2 sm:px-4">
      <div className="light-sweep pointer-events-none absolute inset-x-6 top-6 bottom-8 overflow-hidden" aria-hidden />
      <div
        className="relative flex items-end justify-center gap-[2px] pt-5 pb-0 sm:gap-[3px] sm:pt-6"
        style={
          quiet
            ? undefined
            : {
                perspective: 1200,
                perspectiveOrigin: "50% 8%",
              }
        }
      >
        {albums.map((album, i) => {
          const index = startIndex + i;
          const last = i === albums.length - 1;
          const first = index === 0;
          const cover = getCover(album.coverId);
          const lean = quiet ? 0 : spineLeanDegrees(album.id, last);
          const { width, height } = spineBoxSize(cover, album.id, compact);
          const spine = (
            <AlbumSpine
              cover={cover}
              title={album.title}
              dateRange={album.dateRange}
              photoCount={album.photoCount}
              albumId={album.id}
              compact={compact}
              reducedMotion={quiet}
            />
          );
          return (
            <motion.div
              key={album.id}
              initial={quiet ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={quiet ? { opacity: 1 } : { opacity: 1, y: 0, rotate: lean }}
              transition={
                quiet
                  ? { duration: 0.25, delay: index * 0.02 }
                  : { type: "spring", stiffness: 180, damping: 18, mass: 0.7, delay: 0.04 + index * 0.035 }
              }
              {...(quiet ? {} : { whileHover: { y: -8 } })}
              className="origin-bottom shrink-0"
              style={{ width: width + (quiet ? 0 : 6), minHeight: height }}
            >
              <div
                className={cn(
                  first && nudgeFirst && !quiet && "spine-nudge",
                  first && nudgeFirst && "gold-pulse",
                )}
              >
                {linkAlbums ? (
                  <Link
                    to="/album/$id"
                    params={{ id: album.id }}
                    search={{ open: true }}
                    aria-label={`Open ${album.title}, ${album.dateRange}, ${album.photoCount} photos`}
                    className="block"
                  >
                    {spine}
                  </Link>
                ) : (
                  spine
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={quiet ? { opacity: 0 } : { scaleX: 0.86, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={quiet ? { duration: 0.3 } : { type: "spring", stiffness: 120, damping: 18 }}
        className="relative mx-auto w-full max-w-4xl"
      >
        <div
          className="wood-texture relative h-[13px] w-full rounded-sm sm:h-[15px]"
          style={{ boxShadow: "var(--shadow-shelf)" }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[5px] rounded-t-sm bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="wood-texture mx-auto h-[7px] w-[96%] rounded-b-md opacity-75" />
      </motion.div>
    </div>
  );
}

/** Wooden shelf: thin upright albums, same height, all twelve visible. */
export function Shelf({
  albums,
  className,
  linkAlbums = true,
  nudgeFirst = false,
}: {
  albums: DemoAlbum[];
  className?: string;
  linkAlbums?: boolean;
  nudgeFirst?: boolean;
}) {
  const reduced = useReducedMotion();
  const mobileRows = chunk(albums, 6);
  const wideRows = albums.length > 12 ? chunk(albums, 12) : [albums];

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-6 sm:hidden">
        {mobileRows.map((row, r) => (
          <ShelfRow
            key={`m-${r}`}
            albums={row}
            startIndex={r * 6}
            reduced={reduced}
            linkAlbums={linkAlbums}
            nudgeFirst={nudgeFirst}
            compact
          />
        ))}
      </div>
      <div className="hidden space-y-7 sm:block">
        {wideRows.map((row, r) => (
          <ShelfRow
            key={`d-${r}`}
            albums={row}
            startIndex={r * 12}
            reduced={reduced}
            linkAlbums={linkAlbums}
            nudgeFirst={nudgeFirst}
            compact={false}
          />
        ))}
      </div>
    </div>
  );
}
