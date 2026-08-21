import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, Rows3, Search } from "lucide-react";
import { PageShell, PrivacyBanner } from "@/components/SiteChrome";
import { Shelf } from "@/components/Shelf";
import { AlbumCover } from "@/components/AlbumCover";
import { getCover } from "@/data/covers";
import { ALBUMS, ALBUM_CATEGORIES, LIBRARY_STATS, type AlbumCategory } from "@/data/albums";
import { readPrefs, writePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const TITLE = "Your Memory Library — Pioneer Photo Albums Library";
const DESC =
  "Browse a demo memory library of twelve photo albums. Filter by family, travel, celebrations, kids and holidays, then open any album and turn the pages.";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const SORTS = ["Oldest", "Newest", "Recently updated", "Alphabetical"] as const;
type Sort = (typeof SORTS)[number];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function LibraryPage() {
  const reduced = useReducedMotion();
  const [firstName, setFirstName] = useState("Ellie");
  const [filter, setFilter] = useState<AlbumCategory | "All">("All");
  const [sort, setSort] = useState<Sort>("Recently updated");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"shelf" | "grid">("shelf");

  const [nudgeFirst, setNudgeFirst] = useState(false);

  useEffect(() => {
    const p = readPrefs();
    setFirstName(p.firstName);
    setFilter(p.lastFilter as AlbumCategory | "All");
    setSort(p.lastSort as Sort);
    setNudgeFirst(!p.hasOpenedSampleAlbum);
  }, []);

  const albums = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = ALBUMS.filter((a) => filter === "All" || a.categories.includes(filter));
    if (term) {
      list = list.filter((a) =>
        [a.title, a.dateRange, a.place, ...a.tags, ...a.people]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }
    const by: Record<Sort, (x: typeof ALBUMS) => typeof ALBUMS> = {
      Oldest: (x) => [...x].sort((a, b) => a.sortDate.localeCompare(b.sortDate)),
      Newest: (x) => [...x].sort((a, b) => b.sortDate.localeCompare(a.sortDate)),
      "Recently updated": (x) => [...x].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      Alphabetical: (x) => [...x].sort((a, b) => a.title.localeCompare(b.title)),
    };
    return by[sort](list);
  }, [filter, sort, q]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground text-sm">
          {greeting()}, {firstName}
        </p>
        <h1 className="mt-1 text-4xl sm:text-5xl">Your Memory Library</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {LIBRARY_STATS.albums} albums, {LIBRARY_STATS.photos.toLocaleString()} photos, last
          organized {LIBRARY_STATS.lastOrganized}{" "}
          <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs font-semibold">
            demo data
          </span>
        </p>
        <div className="mt-4">
          <PrivacyBanner />
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {ALBUM_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setFilter(c);
                  writePrefs({ lastFilter: c });
                }}
                aria-pressed={filter === c}
                className={cn(
                  "tactile rounded-full border px-3.5 py-1.5 text-sm font-medium active:translate-y-px",
                  filter === c
                    ? "bg-walnut text-primary-foreground border-walnut"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Search title, date, tags, people, place…"
                aria-label="Search albums"
                className="border-border bg-card w-full rounded-md border py-2 pr-3 pl-9 text-sm"
              />
            </div>
            <label className="text-muted-foreground flex items-center gap-2 text-sm">
              Sort
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as Sort);
                  writePrefs({ lastSort: e.target.value });
                }}
                className="border-border bg-card rounded-md border px-3 py-2 text-sm"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <div className="border-border flex overflow-hidden rounded-md border">
              <button
                type="button"
                onClick={() => setView("shelf")}
                aria-pressed={view === "shelf"}
                className={cn("px-3 py-2", view === "shelf" ? "bg-secondary" : "bg-card")}
                aria-label="Shelf view"
              >
                <Rows3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                className={cn("px-3 py-2", view === "grid" ? "bg-secondary" : "bg-card")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <Link
              to="/organize"
              className="bg-primary text-primary-foreground tactile rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
            >
              Organize photos
            </Link>
          </div>
        </div>

        {/* Results */}
        {albums.length === 0 ? (
          <p className="text-muted-foreground mt-16 text-center">
            Nothing matches that yet. Try a different word, or clear the filters.
          </p>
        ) : view === "shelf" ? (
          <div className="mt-12">
            <Shelf albums={albums} nudgeFirst={nudgeFirst} />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {albums.map((a, i) => (
              <motion.div
                key={a.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0.25 } : { type: "spring", stiffness: 140, damping: 16, delay: i * 0.04 }}
              >
                <Link to="/album/$id" params={{ id: a.id }} className="group block">
                  <AlbumCover
                    cover={getCover(a.coverId)}
                    title={a.title}
                    subtitle={a.dateRange}
                    className="tactile aspect-[3/4] w-full group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)]"
                  />
                  <h2 className="text-foreground mt-3 text-base">{a.title}</h2>
                  <p className="text-muted-foreground text-xs">
                    {a.dateRange} · {a.photoCount} photos
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
