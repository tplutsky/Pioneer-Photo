import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Perspective stage so page leaves can curl instead of spinning like cards. */
export function CurlBook({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative [perspective:1600px]", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        aria-hidden
        className="bg-walnut-dark/25 pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-sm"
        style={{ background: "oklch(0.88 0.03 85)" }}
      />
      {children}
    </div>
  );
}

function CurlSheen({ dir }: { dir: number }) {
  return (
    <>
      <div
        aria-hidden
        className="page-curl-sheen pointer-events-none absolute inset-y-0 w-[32%]"
        style={dir > 0 ? { right: 0 } : { left: 0 }}
      />
      <div
        aria-hidden
        className="page-curl-fold pointer-events-none absolute inset-y-2 w-8"
        style={dir > 0 ? { left: 0 } : { right: 0 }}
      />
      <div
        aria-hidden
        className="page-curl-edge pointer-events-none absolute inset-y-0 w-[7px]"
        style={dir > 0 ? { right: -2 } : { left: -2 }}
      />
    </>
  );
}

/**
 * A paper leaf that peels from the gutter with a highlight and fold shadow.
 * Reduced motion: a simple fade, no 3D.
 */
export function CurlPage({
  pageKey,
  dir = 1,
  reduced,
  children,
  className,
}: {
  pageKey: string;
  dir?: number;
  reduced?: boolean | null;
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const quiet = reduced ?? prefersReduced;
  const origin = dir >= 0 ? "left center" : "right center";
  const incoming = dir >= 0 ? -102 : 102;
  const outgoing = dir >= 0 ? 86 : -86;

  return (
    <motion.div
      key={pageKey}
      initial={
        quiet
          ? { opacity: 0 }
          : { rotateY: incoming, opacity: 0.55, scaleX: 0.82, z: 24 }
      }
      animate={quiet ? { opacity: 1 } : { rotateY: 0, opacity: 1, scaleX: 1, z: 0 }}
      exit={
        quiet
          ? { opacity: 0 }
          : { rotateY: outgoing, opacity: 0.35, scaleX: 0.84, z: 18 }
      }
      transition={
        quiet
          ? { duration: 0.28 }
          : { type: "spring", stiffness: 72, damping: 16, mass: 0.85 }
      }
      style={{
        transformOrigin: origin,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {!quiet && <CurlSheen dir={dir} />}
    </motion.div>
  );
}
