import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { PageShell, PRIVACY_LINE } from "@/components/SiteChrome";

const TITLE = "Privacy & How It Works — Pioneer Photo Albums Library";
const DESC =
  "Your memories belong at home. How album organizing works, what we collect on the waitlist, and why your photos never leave your device in this demo.";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

const STATEMENTS = [
  "Your photos stay on your device. This demo does not upload or store your originals.",
  "Everything you see in the demo is either our own sample artwork or a temporary preview of a file you picked yourself.",
  "Local previews use in-browser object URLs. They exist only while the tab is open and are released when you leave.",
  "There is no permanent photo storage, no public gallery, and no social sharing of your private photos.",
  "A future native app would ask for photo library permission explicitly, on your device, and only for the folders you point it at.",
  "Clearing your browser data removes every demo preference and local preview this site has kept.",
];

function PrivacyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Your memories belong at home.</h1>
        <p className="text-muted-foreground mt-4 text-lg">{PRIVACY_LINE}</p>

        <section id="how-it-works" className="mt-14">
          <h2 className="text-2xl sm:text-3xl">How it works</h2>
          <ol className="mt-6 space-y-5">
            {[
              ["Choose photos from your device.", "Use the file chooser or drag files onto the Organize page. Nothing is sent anywhere."],
              ["Review demo smart suggestions.", "We group by date proximity, place text, and occasion patterns. These are demo groupings, not an AI claim, and you approve each one."],
              ["Place memories into beautiful albums.", "Pick a cover, arrange spreads, add captions and tags, then shelve it."],
            ].map(([t, d], i) => (
              <li key={t} className="card-parchment rounded-lg p-5">
                <span className="text-burgundy font-display text-sm">Step {i + 1}</span>
                <h3 className="mt-1 text-lg">{t}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl">Our privacy promises</h2>
          <ul className="mt-6 space-y-3">
            {STATEMENTS.map((s) => (
              <li key={s} className="text-foreground/90 flex gap-3 text-sm leading-relaxed">
                <CheckCircle2 className="text-forest mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="card-parchment rounded-lg p-6">
            <h2 className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="text-forest h-5 w-5" aria-hidden /> What we collect
            </h2>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm leading-relaxed">
              <li>Waitlist details you type: name, email, device, library size, and what you want to organize.</li>
              <li>Optional note you choose to write.</li>
              <li>Non-sensitive demo preferences (filters, sort order, chosen cover) kept in your browser's local storage.</li>
              <li>Product analytics only later, and only with your consent.</li>
            </ul>
          </div>
          <div className="card-parchment rounded-lg p-6">
            <h2 className="flex items-center gap-2 text-xl">
              <XCircle className="text-burgundy h-5 w-5" aria-hidden /> What we do not collect
            </h2>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm leading-relaxed">
              <li>Permanent copies of your original photos. We never receive them.</li>
              <li>Photo content for advertising, model training, or resale.</li>
              <li>Access to your photo library without an explicit action from you.</li>
              <li>Payment details — there is no billing anywhere in this prototype.</li>
            </ul>
          </div>
        </section>

        <section className="border-border mt-14 border-t pt-8">
          <h2 className="text-xl">Licensing note</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Official Pioneer Photo Albums marks and product photos in this demo come from
            pioneerphotoalbums.com and live in /pioneer/. Remaining covers and every sample
            “photograph” are original CSS/SVG artwork. No retailer images are used. The waitlist
            is a local demo — no billing, no server photo upload.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/library"
              className="bg-walnut text-primary-foreground tactile rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
            >
              Browse the demo library
            </Link>
            <Link
              to="/waitlist"
              className="bg-primary text-primary-foreground tactile rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
            >
              Join the waitlist
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
