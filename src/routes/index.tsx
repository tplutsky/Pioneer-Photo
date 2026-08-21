import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, FolderHeart, Lock, Sparkles } from "lucide-react";
import { PageShell, PrivacyBanner, WORDMARK } from "@/components/SiteChrome";
import { Shelf } from "@/components/Shelf";
import { FlipPreview } from "@/components/FlipPreview";
import { ALBUMS } from "@/data/albums";
import { useHeroParallax } from "@/hooks/use-hero-parallax";
import { readPrefs, writePrefs } from "@/lib/prefs";

const TITLE = "Pioneer Photo Albums Library — Bring your photo library back to life";
const DESC =
  "Turn years of digital pictures into beautiful, familiar photo albums organized by date, moments, and the people you love. Join the 30-day free trial waitlist.";

export const Route = createFileRoute("/")({
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
  component: Landing,
});

const VALUES = [
  {
    icon: FolderHeart,
    title: "Organize by memory, not folder.",
    body: "Dates, moments, and people — the way you actually remember a year, not the way a hard drive files it.",
  },
  {
    icon: Lock,
    title: "Private by design.",
    body: "Your photos stay on your device. No uploads, no public galleries, no quiet sharing behind your back.",
  },
  {
    icon: BookOpen,
    title: "Made to be opened and enjoyed.",
    body: "Cream pages, photo corners, handwritten captions. Albums that earn a spot on the shelf.",
  },
];

const STEPS = [
  { n: "1", t: "Choose photos from your device.", d: "Browser file-select or drag-and-drop. Previews are temporary and stay local." },
  { n: "2", t: "Review smart date and theme suggestions.", d: "Demo groupings by week, place, and occasion — you approve every one." },
  { n: "3", t: "Place memories into beautiful albums.", d: "Pick a cover, arrange the spreads, name the chapter." },
];

function Landing() {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [hasOpened, setHasOpened] = useState(true);
  const shelfAlbums = ALBUMS.slice(0, 12);
  const { textY, previewX, previewY, previewRotate, shelfY, glowX } = useHeroParallax(reduced);

  useEffect(() => {
    setHasOpened(readPrefs().hasOpenedSampleAlbum);
  }, []);

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          className="from-gold/20 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ x: glowX }}
          transition={{ duration: 1.2 }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div style={{ y: textY }}>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.3 } : { type: "spring", stiffness: 70, damping: 16 }}
          >
            <img
              src="/pioneer/logo-left.png"
              alt="Pioneer Photo Albums"
              className="mb-5 h-14 w-auto object-contain sm:h-16"
            />
            <span className="border-gold/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-[0.14em] uppercase">
              <Sparkles className="text-gold h-3.5 w-3.5" aria-hidden />
              A home library for your photos
            </span>
            <h1 className="text-foreground mt-5 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              Bring your photo library back to life.
            </h1>
            <p className="text-secondary-foreground mt-4 font-display text-lg sm:text-xl">
              The albums grandma kept, reimagined for the photos you never printed.
            </p>
            <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed">
              {WORDMARK} turns years of digital pictures into beautiful, familiar albums, organized
              by date, moments, and the people you love.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/album/$id"
                params={{ id: "early-years" }}
                search={{ open: true }}
                onClick={() => writePrefs({ hasOpenedSampleAlbum: true })}
                className="bg-primary text-primary-foreground tactile hover:shadow-lift inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold active:translate-y-0.5"
              >
                <BookOpen className="h-5 w-5" aria-hidden />
                Open an album
              </Link>
              <Link
                to="/library"
                className="border-walnut/50 text-foreground tactile hover:bg-secondary inline-flex items-center rounded-md border px-6 py-3 text-base font-semibold active:translate-y-0.5"
              >
                Try the Album Library
              </Link>
              <Link
                to="/waitlist"
                className="text-muted-foreground hover:text-foreground text-sm font-semibold underline underline-offset-4"
              >
                Join the 30-Day Free Trial Waitlist
              </Link>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              {hasOpened
                ? "One tap, no form. Browse the whole demo without signing in."
                : "Start with The Early Years — pages turn on the first tap. No form."}
            </p>
            <div className="mt-5">
              <PrivacyBanner />
            </div>
          </motion.div>
          </motion.div>

          <motion.div
            style={{ x: previewX, y: previewY, rotate: previewRotate }}
            className="lg:justify-self-end lg:w-[520px]"
          >
            <FlipPreview />
          </motion.div>
        </div>

        <motion.div style={{ y: shelfY }} className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
          <Shelf albums={shelfAlbums} nudgeFirst={!hasOpened} />
          <p className="text-muted-foreground mt-4 text-center text-sm">
            {hasOpened
              ? "Twelve demo albums, already shelved. Pick a spine to open one."
              : "Twelve demo albums, already shelved. The first spine is waiting — tap it to open an album."}
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl px-4 pb-14 text-center sm:px-6">
          <p className="text-muted-foreground text-sm">
            14 people have brought their photo library back to life this week{" "}
            <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs font-semibold">
              placeholder / demo data
            </span>
          </p>
        </div>
      </section>

      <section className="bg-parchment/70 border-border border-y py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl sm:text-4xl">Open one before you decide anything.</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
            No form, no account. Turn a few pages of a sample album and see how it feels.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/album/$id"
              params={{ id: "summer-coast" }}
              search={{ open: true }}
              onClick={() => {
                writePrefs({ hasOpenedSampleAlbum: true });
                setOpened(true);
              }}
              className="bg-walnut text-primary-foreground tactile hover:shadow-lift rounded-md px-6 py-3 font-semibold active:translate-y-0.5"
            >
              Open “Summer on the Coast”
            </Link>
            <Link
              to="/album/$id"
              params={{ id: "mias-first-year" }}
              search={{ open: true }}
              onClick={() => {
                writePrefs({ hasOpenedSampleAlbum: true });
                setOpened(true);
              }}
              className="border-walnut/50 tactile hover:bg-secondary rounded-md border px-6 py-3 font-semibold active:translate-y-0.5"
            >
              Open “Mia's First Year”
            </Link>
          </div>
          {opened && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-foreground mt-6 text-lg"
            >
              Loved it? <Link to="/waitlist" className="text-primary underline underline-offset-4">Be first to organize your own.</Link>
            </motion.p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card-parchment paper-grain rounded-lg p-6">
              <v.icon className="text-burgundy h-6 w-6" aria-hidden />
              <h3 className="mt-4 text-xl">{v.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative pl-14">
              <span className="border-gold text-burgundy font-display absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-semibold">
                {s.n}
              </span>
              <h3 className="text-lg">{s.t}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-border bg-parchment/60 border-y py-10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-muted-foreground text-xs tracking-[0.22em] uppercase">
            Inspired by decades of family photo albums
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
            {["Corner-mounted prints", "Cream pages", "Linen covers", "Gold spine titles", "Handwritten captions"].map(
              (t) => (
                <span key={t} className="text-secondary-foreground font-display">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl sm:text-3xl">What comes later</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          We plan to offer a 30-day free trial, followed by simple plans, before anyone is asked to
          pay for anything. Nothing on this site takes payment today — the waitlist is just a
          waitlist.
        </p>
        <Link
          to="/waitlist"
          className="bg-primary text-primary-foreground tactile hover:shadow-lift mt-6 inline-flex rounded-md px-6 py-3 font-semibold active:translate-y-0.5"
        >
          Join the 30-Day Free Trial Waitlist
        </Link>
      </section>
    </PageShell>
  );
}
