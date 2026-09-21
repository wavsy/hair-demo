"use client";

import { useEffect } from "react";

/** Adds scroll-reveal ONLY after JS is ready, so nothing starts invisible
 *  on first paint — a blank first frame is what kills mobile LCP. */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!items.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (const el of items) {
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight) el.classList.add("is-in");
      else io.observe(el);
    }

    // Failsafe: whatever is still hidden after a moment gets shown anyway.
    // A blank section is far worse than a missing animation.
    const failsafe = window.setTimeout(() => {
      for (const el of items) el.classList.add("is-in");
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
