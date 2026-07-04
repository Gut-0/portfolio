import { useEffect, useRef } from "react";
import { CURSOR_GLOW } from "../config";

/**
 * Fixed ambient layer behind everything: two radial gradients (accent + warm)
 * that ease toward the pointer at different rates. Skipped entirely under
 * prefers-reduced-motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CURSOR_GLOW) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 };
    const a = { ...target };
    const b = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      a.x += (target.x - a.x) * 0.12;
      a.y += (target.y - a.y) * 0.12;
      b.x += (target.x - b.x) * 0.055;
      b.y += (target.y - b.y) * 0.055;
      el.style.setProperty("--gx", `${a.x}px`);
      el.style.setProperty("--gy", `${a.y}px`);
      el.style.setProperty("--gx2", `${b.x}px`);
      el.style.setProperty("--gy2", `${b.y}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!CURSOR_GLOW) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
