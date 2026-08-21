import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Film,
  Pencil,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AlbumReveal } from "@/components/AlbumReveal";
import { PageShell, WORDMARK } from "@/components/SiteChrome";
import { AlbumCover } from "@/components/AlbumCover";
import { CurlBook, CurlPage } from "@/components/PageTurn";
import { SamplePhoto } from "@/components/SamplePhoto";
import { albumById, type AlbumPage, type PageLayout } from "@/data/albums";
import { getCover } from "@/data/covers";
import { photoById } from "@/data/photos";
import { writePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export type AlbumSearch = {
  open?: boolean;
  reveal?: boolean;
};

function parseFlag(value: unknown): boolean {
  return value === true || value === "1" || value === "true";
}

export const Route = createFileRoute("/album/$id")({
  validateSearch: (search: Record<string, unknown>): AlbumSearch => ({
    ...(parseFlag(search.open) ? { open: true } : {}),
    ...(parseFlag(search.reveal) ? { reveal: true } : {}),
  }),
  loader: ({ params }) => {
    const album = albumById(params.id);
    if (!album) throw notFound();
    return { album };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Album unavailable — Pioneer Photo Albums Library" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `${loaderData.album.title} (${loaderData.album.dateRange}) — Pioneer Photo Albums Library`;
    const d = `Turn the pages of the demo album “${loaderData.album.title}”. ${loaderData.album.memoryNote}`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AlbumViewer,
  notFoundComponent: AlbumMissing,
});

function AlbumMissing() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl">That album isn't on the shelf.</h1>
        <Link to="/library" className="text-primary mt-4 inline-block underline underline-offset-4">
          Back to your library
        </Link>
      </div>
    </PageShell>
  );
}

const LAYOUTS: PageLayout[] = ["1-up", "2-up", "4-up", "collage"];

function PhotoFrame({
  photoId,
  caption,
  className,
  onCaption,
}: {
  photoId: string;
  caption?: string;
  className?: string;
  onCaption?: (v: string) => void;
}) {
  const photo = photoById(photoId);
  if (!photo) return null;
  return (
    <figure className={cn("relative flex flex-col", className)}>
      <div className="relative">
        <SamplePhoto photo={photo} className="aspect-[4/3] w-full shadow-[0_6px_14px_-8px_rgba(0,0,0,0.6)]" />
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={cn("border-walnut/50 absolute h-4 w-4 border-t-2 border-l-2", pos, {
              "rotate-90": pos.includes("right") && pos.includes("top"),
              "-rotate-90": pos.includes("left") && pos.includes("bottom"),
              "rotate-180": pos.includes("right") && pos.includes("bottom"),
            })}
          />
        ))}
      </div>
      <figcaption className="hand text-secondary-foreground mt-2 text-center text-base">
        {onCaption ? (
          <input
            value={caption ?? photo.caption}
            onChange={(e) => onCaption(e.target.value)}
            aria-label="Edit caption"
            className="hand w-full bg-transparent text-center text-base focus-visible:outline-2"
          />
        ) : (
          (caption ?? photo.caption)
        )}
      </figcaption>
    </figure>
  );
}

function PageFace({
  page,
  editing,
  onCaption,
}: {
  page: AlbumPage | undefined;
  editing: boolean;
  onCaption: (pageId: string, v: string) => void;
}) {
  if (!page) {
    return <div className="bg-card paper-grain h-full rounded-sm" aria-hidden />;
  }
  const cols =
    page.layout === "1-up"
      ? "grid-cols-1"
      : page.layout === "2-up"
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-2";
  return (
    <div className="bg-card paper-grain relative h-full rounded-sm p-4 shadow-inner sm:p-6">
      <div className={cn("grid h-full content-center gap-4", cols)}>
        {page.photoIds.map((pid, i) => (
          <PhotoFrame
            key={pid}
            photoId={pid}
            {...(i === 0 && page.caption ? { caption: page.caption } : {})}
            {...(editing && i === 0 ? { onCaption: (v: string) => onCaption(page.id, v) } : {})}
            className={page.layout === "collage" && i === 0 ? "col-span-2" : ""}
          />
        ))}
        {page.photoIds.length === 0 && (
          <p className="hand text-muted-foreground text-center text-lg">
            Room for one more memory.
          </p>
        )}
      </div>
      <span className="text-muted-foreground/40 pointer-events-none absolute right-3 bottom-2 text-[0.6rem] tracking-widest">
        {WORDMARK}
      </span>
    </div>
  );
}

function AlbumViewer() {
  const { album } = Route.useLoaderData();
  const search = Route.useSearch();
  const reduced = useReducedMotion();
  const cover = getCover(album.coverId);

  const [opened, setOpened] = useState(() => Boolean(search.open || search.reveal));
  const [spread, setSpread] = useState(0);
  const [dir, setDir] = useState(1);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(album.title);
  const [dateRange, setDateRange] = useState(album.dateRange);
  const [tags, setTags] = useState(album.tags.join(", "));
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [layoutOverride, setLayoutOverride] = useState<Record<string, PageLayout>>({});
  const [reveal, setReveal] = useState(() => Boolean(search.reveal));

  const pages = useMemo(
    () =>
      album.pages.map((p) => ({
        ...p,
        layout: layoutOverride[p.id] ?? p.layout,
        caption: captions[p.id] ?? p.caption ?? "",
      })),
    [album.pages, layoutOverride, captions],
  );
  const spreadCount = Math.ceil(pages.length / 2);
  const left = pages[spread * 2];
  const right = pages[spread * 2 + 1];

  useEffect(() => {
    writePrefs({ hasOpenedSampleAlbum: true });
  }, []);

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setSpread((s) => Math.min(spreadCount - 1, Math.max(0, s + d)));
    },
    [spreadCount],
  );

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, go]);

  useEffect(() => {
    if (search.open || search.reveal) setOpened(true);
    if (search.reveal) setReveal(true);
  }, [search.open, search.reveal]);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: `${title} — ${WORDMARK}`, text: "Your memories, made beautiful. Show someone.", url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Demo link copied", { description: "This links to the sample album, not your photos." });
    } catch {
      toast.error("Couldn't copy the link");
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/library" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to library
            </Link>
            {editing ? (
              <div className="mt-3 space-y-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label="Album title"
                  className="border-border bg-card font-display w-full rounded-md border px-3 py-2 text-2xl"
                />
                <input
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  aria-label="Album date range"
                  className="border-border bg-card rounded-md border px-3 py-1.5 text-sm"
                />
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  aria-label="Album tags, comma separated"
                  className="border-border bg-card ml-2 rounded-md border px-3 py-1.5 text-sm"
                />
              </div>
            ) : (
              <>
                <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {dateRange} · {album.photoCount} photos ·{" "}
                  {tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled
              title="Sharing private albums is a future feature and is disabled in this demo."
              className="border-border text-muted-foreground inline-flex cursor-not-allowed items-center gap-2 rounded-md border px-4 py-2 text-sm opacity-60"
            >
              <Share2 className="h-4 w-4" aria-hidden /> Share (coming later)
            </button>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="bg-walnut text-primary-foreground tactile inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
            >
              <Pencil className="h-4 w-4" aria-hidden /> {editing ? "Done editing" : "Edit Album"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              {!opened ? (
                <motion.div
                  key="cover"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { rotateY: -85, opacity: 0 }}
                  transition={reduced ? { duration: 0.25 } : { type: "spring", stiffness: 90, damping: 15 }}
                  style={{ transformOrigin: "left center" }}
                  className="mx-auto max-w-md"
                >
                  <AlbumCover cover={cover} title={title} subtitle={dateRange} className="aspect-[3/4] w-full" />
                  <button
                    type="button"
                    onClick={() => setOpened(true)}
                    className="bg-primary text-primary-foreground tactile hover:shadow-lift mt-6 w-full rounded-md px-6 py-3 font-semibold active:translate-y-0.5"
                  >
                    Open this album
                  </button>
                  <button
                    type="button"
                    onClick={() => setReveal(true)}
                    className="border-border tactile mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border px-6 py-2.5 text-sm font-semibold active:translate-y-px"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden /> Play Album Reveal
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="pages"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduced ? { duration: 0.25 } : { type: "spring", stiffness: 80, damping: 16 }}
                  className="relative"
                >
                  <div
                    className="relative rounded-lg p-3 sm:p-5"
                    style={{ background: "linear-gradient(160deg, oklch(0.42 0.05 55), oklch(0.3 0.04 50))", boxShadow: "var(--shadow-lift)" }}
                  >
                    <CurlBook className="relative min-h-[320px] sm:min-h-[420px]">
                      <div className="relative grid min-h-[320px] gap-1 sm:min-h-[420px] sm:grid-cols-2">
                        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
                          <CurlPage
                            pageKey={`l-${spread}`}
                            dir={dir}
                            reduced={reduced}
                          >
                            <PageFace
                              page={left}
                              editing={editing}
                              onCaption={(id, v) => setCaptions((c) => ({ ...c, [id]: v }))}
                            />
                          </CurlPage>
                          <CurlPage
                            pageKey={`r-${spread}`}
                            dir={dir}
                            reduced={reduced}
                            className="hidden sm:block"
                          >
                            <PageFace
                              page={right}
                              editing={editing}
                              onCaption={(id, v) => setCaptions((c) => ({ ...c, [id]: v }))}
                            />
                          </CurlPage>
                        </AnimatePresence>
                        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-4 -translate-x-1/2 bg-gradient-to-r from-black/0 via-black/35 to-black/0 sm:block" />
                      </div>
                    </CurlBook>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        disabled={spread === 0}
                        aria-label="Previous spread"
                        className="border-border tactile rounded-md border px-3 py-2 disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-muted-foreground text-sm" aria-live="polite">
                        Spread {spread + 1} of {spreadCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        disabled={spread >= spreadCount - 1}
                        aria-label="Next spread"
                        className="border-border tactile rounded-md border px-3 py-2 disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <label className="text-muted-foreground flex items-center gap-2 text-sm">
                      Layout for this page
                      <select
                        value={left?.layout ?? "1-up"}
                        onChange={(e) =>
                          left && setLayoutOverride((o) => ({ ...o, [left.id]: e.target.value as PageLayout }))
                        }
                        className="border-border bg-card rounded-md border px-2 py-1.5 text-sm"
                      >
                        {LAYOUTS.map((l) => (
                          <option key={l} value={l}>
                            {l === "collage" ? "collage captioned" : l}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => setOpened(false)}
                      className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                    >
                      Close the album
                    </button>
                  </div>

                  <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                    {Array.from({ length: spreadCount }).map((_, i) => {
                      const first = pages[i * 2]?.photoIds[0];
                      const ph = first ? photoById(first) : undefined;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setDir(i > spread ? 1 : -1);
                            setSpread(i);
                          }}
                          aria-label={`Go to spread ${i + 1}`}
                          aria-current={i === spread}
                          className={cn(
                            "tactile shrink-0 rounded-sm border-2 p-0.5",
                            i === spread ? "border-gold" : "border-transparent",
                          )}
                        >
                          {ph ? (
                            <SamplePhoto photo={ph} className="h-12 w-16" />
                          ) : (
                            <span className="bg-muted block h-12 w-16 rounded-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="card-parchment mt-8 rounded-lg p-5">
                    <h2 className="text-xl">Your memories, made beautiful. Show someone.</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      This shares a link to the demo album only — never your own photos.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={share}
                        className="bg-walnut text-primary-foreground tactile inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
                      >
                        <Copy className="h-4 w-4" aria-hidden /> Copy demo link
                      </button>
                    <button
                      type="button"
                      onClick={() => setReveal(true)}
                      className="border-border tactile inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold active:translate-y-px"
                    >
                      <Film className="h-4 w-4" aria-hidden /> Play Album Reveal
                    </button>
                      <Link
                        to="/waitlist"
                        className="bg-primary text-primary-foreground tactile inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
                      >
                        Loved it? Be first to organize your own.
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="card-parchment h-fit rounded-lg p-5">
            <h2 className="text-lg">Memory note</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Written by the album's owner. Not generated, not analyzed.
            </p>
            <p className="hand text-secondary-foreground mt-3 text-lg leading-snug">
              {album.memoryNote}
            </p>
            <dl className="text-muted-foreground mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt>Place</dt>
                <dd className="text-foreground">{album.place}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>People</dt>
                <dd className="text-foreground text-right">{album.people.join(", ") || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Cover</dt>
                <dd className="text-foreground text-right">{cover.name}</dd>
              </div>
            </dl>
            <Link to="/covers" className="text-primary mt-5 inline-block text-sm underline underline-offset-4">
              Change the cover
            </Link>
            <p className="text-muted-foreground/80 mt-6 text-xs">
              Sample album, demo content only. Your photos stay on your device.
            </p>
          </aside>
        </div>
      </div>
      {reveal ? (
        <AlbumReveal
          album={album}
          title={title}
          dateRange={dateRange}
          onClose={() => setReveal(false)}
        />
      ) : null}
    </PageShell>
  );
}
