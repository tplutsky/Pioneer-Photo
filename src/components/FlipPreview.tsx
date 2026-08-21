import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { AlbumCover } from "@/components/AlbumCover";
import { CurlBook, CurlPage } from "@/components/PageTurn";
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

/** Looping flip-through: cover opens, then pages curl. No waitlist wall. */
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
        <CurlBook className="relative aspect-[4/3] w-full">
          <AnimatePresence initial={false} mode="wait">
            {step === 0 ? (
              <CurlPage pageKey="cover" dir={1} reduced={reduced} className="absolute inset-0 flex items-center justify-center">
                <AlbumCover
                  cover={getCover("da200sf-bn")}
                  title="The Early Years"
                  subtitle="1987–1992"
                  className="h-full w-[72%]"
                />
              </CurlPage>
            ) : (
              <CurlPage
                pageKey={`s-${step}`}
                dir={1}
                reduced={reduced}
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
              </CurlPage>
            )}
          </AnimatePresence>
          <div className="via-walnut-dark/25 pointer-events-none absolute inset-y-0 left-1/2 z-10 w-3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent" />
        </CurlBook>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Looping preview · sample album, demo content
        </p>
      </div>
    </div>
  );
}
