import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Film, X } from "lucide-react";
import { AlbumCover, coverSkin } from "@/components/AlbumCover";
import { CurlBook, CurlPage } from "@/components/PageTurn";
import { SamplePhoto } from "@/components/SamplePhoto";
import { WORDMARK } from "@/components/SiteChrome";
import type { DemoAlbum } from "@/data/albums";
import { getCover } from "@/data/covers";
import { photoById } from "@/data/photos";
import {
  downloadBlob,
  exportAlbumRevealMovie,
  type RevealMovieFrame,
} from "@/lib/export-reveal-video";
import { toast } from "sonner";

function spreadPairs(album: DemoAlbum) {
  const pages = album.pages.filter((p) => p.photoIds.length > 0);
  const pairs: { left: string[]; right: string[]; caption: string }[] = [];
  for (let i = 0; i < pages.length; i += 2) {
    pairs.push({
      left: pages[i]?.photoIds ?? [],
      right: pages[i + 1]?.photoIds ?? [],
      caption: pages[i]?.caption || pages[i + 1]?.caption || album.title,
    });
  }
  return pairs.slice(0, 3);
}

export function AlbumReveal({
  album,
  title,
  dateRange,
  onClose,
}: {
  album: DemoAlbum;
  title: string;
  dateRange: string;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const cover = getCover(album.coverId);
  const pairs = useMemo(() => spreadPairs(album), [album]);
  const scenes = 2 + pairs.length + 1;
  const [scene, setScene] = useState(0);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = window.setInterval(
      () => {
        setScene((s) => (s + 1 >= scenes ? s : s + 1));
      },
      reduced ? 3200 : 2000,
    );
    return () => window.clearInterval(t);
  }, [scenes, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function saveMovie() {
    setSaving(true);
    setProgress(0);
    try {
      const skin = coverSkin(cover.id);
      const frames: RevealMovieFrame[] = pairs.map((p, i) => ({
        title: `Spread ${i + 1}`,
        caption: p.caption,
        hues: [...p.left, ...p.right]
          .map((id) => photoById(id)?.hue)
          .filter((h): h is number => typeof h === "number"),
      }));
      const { blob, filename } = await exportAlbumRevealMovie({
        albumTitle: title,
        dateRange,
        photoCount: album.photoCount,
        coverBase: skin.base,
        coverShade: skin.shade,
        coverInk: skin.ink,
        frames,
        reducedMotion: Boolean(reduced),
        onProgress: setProgress,
      });
      downloadBlob(blob, filename);
      toast.success("Short movie saved on this device", {
        description: "Demo content only. Nothing was sent anywhere.",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the movie");
    } finally {
      setSaving(false);
    }
  }

  const pair = scene >= 2 && scene < scenes - 1 ? pairs[scene - 2] : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Album Reveal for ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.22_0.03_50/0.88)] px-4 py-8 backdrop-blur-sm"
    >
      <div className="border-gold/40 relative w-full max-w-4xl overflow-hidden rounded-xl border bg-[oklch(0.94_0.02_86)] shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between gap-3 border-b border-[oklch(0.82_0.03_80)] px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/pioneer/logo-wagon.jpg"
              alt=""
              width={40}
              height={32}
              className="h-8 w-auto rounded-sm object-contain"
            />
            <div>
              <p className="font-display text-sm font-semibold">{WORDMARK}</p>
              <p className="text-muted-foreground text-xs">Album Reveal · sample album, demo content</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Album Reveal"
            className="border-border tactile rounded-md border p-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative min-h-[360px] px-5 py-8 sm:min-h-[440px] sm:px-10">
          <AnimatePresence mode="wait" initial={false}>
            {scene === 0 && (
              <motion.div
                key="intro"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
              >
                <img
                  src="/pioneer/logo-left.png"
                  alt="Pioneer Photo Albums"
                  className="mb-5 h-16 w-auto object-contain"
                />
                <p className="text-gold text-xs tracking-[0.2em] uppercase">Album Reveal</p>
                <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  {dateRange} · {album.photoCount} photos
                </p>
              </motion.div>
            )}

            {scene === 1 && (
              <CurlPage pageKey="cover" dir={1} reduced={reduced} className="mx-auto max-w-xs">
                <AlbumCover
                  cover={cover}
                  title={title}
                  subtitle={dateRange}
                  className="aspect-[3/4] w-full"
                />
              </CurlPage>
            )}

            {pair && (
              <CurlBook className="mx-auto max-w-3xl">
                <CurlPage pageKey={`pair-${scene}`} dir={1} reduced={reduced}>
                  <div className="bg-card paper-grain grid min-h-[280px] grid-cols-1 gap-2 rounded-sm p-4 sm:grid-cols-2 sm:p-6">
                    {[pair.left[0], pair.right[0]].filter(Boolean).map((id) => {
                      const photo = photoById(id);
                      return photo ? (
                        <figure key={id} className="flex flex-col items-center">
                          <SamplePhoto photo={photo} className="aspect-[4/3] w-full shadow-md" />
                          <figcaption className="hand text-muted-foreground mt-2 text-sm">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      ) : null;
                    })}
                  </div>
                </CurlPage>
              </CurlBook>
            )}

            {scene === scenes - 1 && (
              <motion.div
                key="end"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[320px] flex-col items-center justify-center text-center"
              >
                <img
                  src="/pioneer/logo-wagon.jpg"
                  alt=""
                  className="mb-4 h-12 w-auto rounded-sm object-contain"
                />
                <h2 className="text-2xl sm:text-3xl">Your photos stay on your device.</h2>
                <p className="text-muted-foreground mt-2 max-w-md text-sm">
                  This demo does not upload or store your originals. {WORDMARK} keeps the album on
                  the shelf, and the pictures in your hands.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[oklch(0.82_0.03_80)] px-5 py-4">
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {scene + 1} of {scenes}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveMovie}
              disabled={saving}
              className="bg-walnut text-primary-foreground tactile inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              <Film className="h-4 w-4" aria-hidden />
              {saving
                ? `Saving… ${Math.round(progress * 100)}%`
                : "Save as a short movie (demo)"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border-border tactile rounded-md border px-4 py-2 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
