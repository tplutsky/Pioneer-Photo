import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlbumCover } from "@/components/AlbumCover";
import { SamplePhoto } from "@/components/SamplePhoto";
import { getCover } from "@/data/covers";
import { PHOTOS } from "@/data/photos";
import { cn } from "@/lib/utils";

const SPREADS = [
  ["p02", "p01"],
  ["p16", "p14"],
  ["p08", "p18"],
  ["p28", "p34"],
];

/** Looping flip-through: cover opens, then 3–4 pages turn. No waitlist wall. */
export function FlipPreview({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0); // 0 = cover, 1..4 = spreads

  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => (s + 1) % (SPREADS.length + 1)), reduced ? 4200 : 2600);
    return () => window.clearInterval(t);
  }, [reduced]);

  const spread = SPREADS[Math.max(0, step - 1)] ?? SPREADS[0]!;

  return (
    <div
      className={cn("relative", className)}
      aria-label="Looping preview of a sample album being opened"
      role="img"
    >
      <div className="bg-walnut-dark/10 absolute -inset-6 rounded-[2rem] blur-2xl" aria-hidden />
      <div className="card-parchment paper-grain relative overflow-hidden rounded-lg p-3 sm:p-4">
        <div className="relative aspect-[4/3] w-full">
          <AnimatePresence initial={false} mode="popLayout">
            {step === 0 ? (
              <motion.div
                key="cover"
                initial={reduced ? { opacity: 0 } : { rotateY: -75, opacity: 0 }}
                animate={reduced ? { opacity: 1 } : { rotateY: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotateY: 72, opacity: 0 }}
                transition={reduced ? { duration: 0.25 } : { type: "spring", stiffness: 120, damping: 16 }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <AlbumCover
                  cover={getCover("warm-brown-family")}
                  title="The Early Years"
                  subtitle="1987–1992"
                  className="h-full w-[72%]"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`s-${step}`}
                initial={reduced ? { opacity: 0 } : { rotateY: -62, opacity: 0.4, x: 24 }}
                animate={reduced ? { opacity: 1 } : { rotateY: 0, opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { rotateY: 48, opacity: 0 }}
                transition={reduced ? { duration: 0.25 } : { type: "spring", stiffness: 90, damping: 15 }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                className="absolute inset-0 grid grid-cols-2 gap-1"
              >
                {spread.map((pid) => {
                  const photo = PHOTOS.find((p) => p.id === pid)!;
                  return (
                    <div
                      key={pid}
                      className="bg-card paper-grain flex flex-col items-center justify-center rounded-sm p-3 shadow-inner"
                    >
                      <SamplePhoto photo={photo} className="aspect-[4/3] w-full shadow-md" />
                      <span className="hand text-muted-foreground mt-2 text-sm">{photo.caption}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="via-walnut-dark/25 pointer-events-none absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent" />
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Looping preview · sample album, demo content
        </p>
      </div>
    </div>
  );
}
