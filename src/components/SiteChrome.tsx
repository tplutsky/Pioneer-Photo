import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyModal } from "@/components/PrivacyModal";

export const PRIVACY_LINE =
  "Your photos stay on your device. This demo does not upload or store your originals.";

/** Editable placeholder wordmark. Not an affiliation claim. */
export const WORDMARK = "Pioneer Photo Albums Library";

const NAV = [
  { to: "/library", label: "My Library" },
  { to: "/organize", label: "Organize" },
  { to: "/covers", label: "Cover Catalog" },
  { to: "/privacy", label: "How It Works" },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${WORDMARK} — home`}>
      <img
        src="/pioneer/logo-wagon.jpg"
        alt=""
        width={40}
        height={32}
        className="h-8 w-auto shrink-0 rounded-sm object-contain"
      />
      <span className="font-display text-foreground text-[0.95rem] leading-tight font-semibold sm:text-base">
        {WORDMARK}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-border/80 bg-parchment/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md px-3 py-2 text-sm font-medium transition-colors"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/waitlist"
            className="bg-primary text-primary-foreground tactile hover:shadow-lift ml-2 rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
          >
            Join Waitlist
          </Link>
        </nav>
        <button
          type="button"
          className="border-border tactile rounded-md border p-2 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-border bg-parchment border-t px-4 pb-4 md:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="text-foreground border-border/60 block border-b py-3 text-sm font-medium"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/waitlist"
            onClick={() => setOpen(false)}
            className="bg-primary text-primary-foreground mt-3 block rounded-md px-4 py-2 text-center text-sm font-semibold"
          >
            Join Waitlist
          </Link>
        </nav>
      )}
    </header>
  );
}

export function PrivacyBanner({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 text-xs sm:text-sm",
        className,
      )}
    >
      <ShieldCheck className="text-forest h-4 w-4 shrink-0" aria-hidden />
      {PRIVACY_LINE}
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-border bg-parchment/70 mt-20 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark />
          <h2 className="font-display text-foreground mt-5 text-lg">Why we built this</h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            We grew up opening albums on the living room floor, and we noticed that the last
            twenty years of our lives never made it onto a page. This is our attempt to give those
            photos somewhere to live.
          </p>
        </div>
        <div>
          <h2 className="font-display text-foreground text-lg">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/privacy" hash="how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
            </li>
            <li>
              <a href="mailto:hello@example.com" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </li>
            <li>
              <Link to="/waitlist" className="text-muted-foreground hover:text-foreground">
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <PrivacyBanner />
          <PrivacyModal />
          <p className="text-muted-foreground/80 text-xs leading-relaxed">
            Official Pioneer Photo Albums marks and product photos are first-party art from
            pioneerphotoalbums.com. Remaining covers are original CSS/SVG placeholders. The
            waitlist is a local demo — no billing, no server photo upload.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
