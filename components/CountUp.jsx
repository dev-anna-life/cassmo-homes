"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from 0 to target when it enters the viewport.
 * Parses values like "6+", "100%", "24/7", "FCT" automatically.
 */
export default function CountUp({ value }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    // Parse leading number + trailing suffix, e.g. "6+" -> [6, "+"]
    const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      // Non-numeric (FCT, 24/7) — just show as-is immediately
      setDisplay(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2];

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          const current = Math.round(eased * target);
          setDisplay(`${current}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
