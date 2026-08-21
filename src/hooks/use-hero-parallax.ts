import { useEffect } from "react";
import { useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Soft pointer + scroll parallax for the landing hero.
 * Returns zeroed transforms when the visitor prefers reduced motion.
 */
export function useHeroParallax(reduced: boolean | null): {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  textY: MotionValue<number>;
  previewX: MotionValue<number>;
  previewY: MotionValue<number>;
  previewRotate: MotionValue<number>;
  shelfY: MotionValue<number>;
  glowX: MotionValue<number>;
} {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 70, damping: 22, mass: 0.7 });
  const pointerY = useSpring(rawY, { stiffness: 70, damping: 22, mass: 0.7 });
  const { scrollY } = useScroll();

  useEffect(() => {
    if (reduced) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = Math.min(window.innerHeight, 720) / 2;
      rawX.set((e.clientX - cx) / Math.max(cx, 1));
      rawY.set((e.clientY - cy) / Math.max(cy, 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, rawX, rawY]);

  const textY = useTransform(scrollY, [0, 420], reduced ? [0, 0] : [0, -28]);
  const previewX = useTransform(pointerX, [-1, 1], reduced ? [0, 0] : [-22, 22]);
  const previewY = useTransform(
    [pointerY, scrollY],
    ([py, sy]) => (reduced ? 0 : (py as number) * 16 + Math.min(Number(sy), 420) * 0.08),
  );
  const previewRotate = useTransform(pointerX, [-1, 1], reduced ? [0, 0] : [-3.2, 3.2]);
  const shelfY = useTransform(scrollY, [0, 500], reduced ? [0, 0] : [0, 18]);
  const glowX = useTransform(pointerX, [-1, 1], reduced ? [0, 0] : [-40, 40]);

  return { pointerX, pointerY, textY, previewX, previewY, previewRotate, shelfY, glowX };
}
