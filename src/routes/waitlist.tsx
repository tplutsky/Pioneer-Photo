import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PageShell, PrivacyBanner } from "@/components/SiteChrome";
import { saveWaitlistEntry, type WaitlistEntry } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const TITLE = "Join the Waitlist — Pioneer Photo Albums Library";
const DESC =
  "Be first to open your memory library. Join the waitlist for the 30-day free trial. No payment, no card, just a place in line.";

export const Route = createFileRoute("/waitlist")({
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
  component: WaitlistPage,
});

const DEVICES = ["iPhone / iPad", "Android", "Mac", "Windows", "Other"];
const SIZES = ["Under 1,000", "1,000–5,000", "5,000–20,000", "More than 20,000"];
const FOCUS = ["Family history", "Children", "Travel", "Holidays", "Everyday life", "Other"];

const field =
  "border-border bg-card w-full rounded-md border px-3 py-2.5 text-sm focus-visible:outline-2";

function WaitlistPage() {
  const [done, setDone] = useState(false);
  const [focus, setFocus] = useState<string[]>([]);
  const [ackNotAvailable, setAck] = useState(false);
  const [agreeUpdates, setAgree] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    if (!ackNotAvailable || !agreeUpdates) {
      setError("Please tick both boxes so we know you understand what happens next.");
      return;
    }
    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      first_name: String(form.get("first_name") ?? ""),
      last_name: String(form.get("last_name") ?? ""),
      email,
      device: String(form.get("device") ?? ""),
      library_size: String(form.get("library_size") ?? ""),
      organize_focus: focus,
      note: String(form.get("note") ?? ""),
      agreed_updates: agreeUpdates,
      acknowledged_not_available: ackNotAvailable,
      created_at: new Date().toISOString(),
      trial_started_at: null,
      trial_ends_at: null,
      subscription_status: "waitlisted",
      plan_name: null,
      stripe_customer_id: null,
    };
    saveWaitlistEntry(entry);
    setError("");
    setDone(true);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Be first to open your memory library.</h1>
        <p className="text-muted-foreground mt-3">
          No payment, no card, no account. Just a place in line for the 30-day free trial when it
          opens.
        </p>
        <div className="mt-4">
          <PrivacyBanner />
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            className="card-parchment paper-grain mt-10 rounded-lg p-8 text-center"
          >
            <CheckCircle2 className="text-forest mx-auto h-10 w-10" aria-hidden />
            <h2 className="mt-4 text-2xl">You're on the shelf list.</h2>
            <p className="text-muted-foreground mt-2">
              We'll invite you to start your 30-day free trial when your library is ready.
            </p>
            <p className="text-muted-foreground/80 mt-4 text-xs">
              Saved as demo data in this browser only. No payment method was collected.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/library"
                className="bg-walnut text-primary-foreground tactile rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
              >
                Keep browsing the demo
              </Link>
              <Link
                to="/covers"
                className="border-border tactile rounded-md border px-5 py-2.5 text-sm font-semibold active:translate-y-px"
              >
                Pick a cover you like
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="card-parchment mt-10 space-y-6 rounded-lg p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                First name
                <input name="first_name" required autoComplete="given-name" className={cn(field, "mt-1.5")} />
              </label>
              <label className="block text-sm font-medium">
                Last name
                <input name="last_name" required autoComplete="family-name" className={cn(field, "mt-1.5")} />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Email
              <input name="email" type="email" required autoComplete="email" className={cn(field, "mt-1.5")} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Device
                <select name="device" required defaultValue="" className={cn(field, "mt-1.5")}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {DEVICES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Photo library size
                <select name="library_size" required defaultValue="" className={cn(field, "mt-1.5")}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-medium">What do you most want to organize?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {FOCUS.map((f) => {
                  const on = focus.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFocus((prev) => (on ? prev.filter((x) => x !== f) : [...prev, f]))}
                      className={cn(
                        "tactile rounded-full border px-3.5 py-1.5 text-sm active:translate-y-px",
                        on
                          ? "bg-walnut text-primary-foreground border-walnut"
                          : "border-border text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="block text-sm font-medium">
              Anything you'd like us to know? <span className="text-muted-foreground">(optional)</span>
              <textarea name="note" rows={3} className={cn(field, "mt-1.5")} />
            </label>

            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={ackNotAvailable}
                  onChange={(e) => setAck(e.target.checked)}
                  className="accent-walnut mt-1 h-4 w-4"
                />
                <span className="text-muted-foreground">
                  I understand early access is not available yet and this prototype does not organize
                  my real photo library.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeUpdates}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="accent-walnut mt-1 h-4 w-4"
                />
                <span className="text-muted-foreground">
                  I'd like occasional launch updates about the 30-day free trial.
                </span>
              </label>
            </div>

            {error && (
              <p role="alert" className="text-destructive text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="bg-primary text-primary-foreground tactile hover:shadow-lift w-full rounded-md px-6 py-3 font-semibold active:translate-y-0.5"
            >
              Save my place on the shelf
            </button>
            <p className="text-muted-foreground/80 text-center text-xs">
              No payments, no card, no billing integration anywhere in this prototype.
            </p>
          </form>
        )}
      </div>
    </PageShell>
  );
}
