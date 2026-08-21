import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AlbumSpine } from "@/components/AlbumCover";
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
}: {
  albums: DemoAlbum[];
  startIndex: number;
  reduced: boolean | null;
  linkAlbums: boolean;
  nudgeFirst: boolean;
}) {
  return (
    <div className="relative">
      <div className="relative px-1 pt-7 sm:px-3 sm:pt-8">
        <div className="light-sweep pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
        <div className="relative flex items-end justify-center gap-[0.3rem] sm:gap-1.5">
          {albums.map((album, i) => {
            const index = startIndex + i;
            const last = i === albums.length - 1;
            const first = index === 0;
            const rest = last && !reduced ? -8 : 0;
            const spine = (
              <AlbumSpine
                cover={getCover(album.coverId)}
                title={album.title}
                dateRange={album.dateRange}
                photoCount={album.photoCount}
                className="h-[148px] w-full min-w-0 max-w-none sm:h-[200px]"
              />
            );
            return (
              <motion.div
                key={album.id}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: -70, rotate: index % 2 ? 9 : -9 }
                }
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: rest }}
                transition={
                  reduced
                    ? { duration: 0.3, delay: index * 0.02 }
                    : { type: "spring", stiffness: 160, damping: 11, mass: 0.6, delay: 0.08 + index * 0.06 }
                }
                {...(reduced ? {} : { whileHover: { y: -14, rotate: rest - 1.5 } })}
                className={cn(
                  "origin-bottom min-w-0 flex-1 basis-0",
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
      </div>
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

/** Wooden shelf: every album stays visible. Mobile uses two boards of six. */
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
      <div className="space-y-5 sm:hidden">
        {mobileRows.map((row, r) => (
          <ShelfRow
            key={`m-${r}`}
            albums={row}
            startIndex={r * 6}
            reduced={reduced}
            linkAlbums={linkAlbums}
            nudgeFirst={nudgeFirst}
          />
        ))}
      </div>
      <div className="hidden space-y-6 sm:block">
        {wideRows.map((row, r) => (
          <ShelfRow
            key={`d-${r}`}
            albums={row}
            startIndex={r * 12}
            reduced={reduced}
            linkAlbums={linkAlbums}
            nudgeFirst={nudgeFirst}
          />
        ))}
      </div>
    </div>
  );
}
