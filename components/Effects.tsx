"use client";

import { useEffect } from "react";

/**
 * Pointer-driven polish: magnetic buttons, card tilt, a glow that follows the
 * cursor across the dark sections, and hero parallax. All of it is additive —
 * with JavaScript off or motion reduced, the page simply sits still.
 */
export default function Effects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    if (fine) {
      for (const el of document.querySelectorAll<HTMLElement>(".magnetic")) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          el.style.setProperty("--tx", `${dx * 10}px`);
          el.style.setProperty("--ty", `${dy * 7}px`);
        };
        const leave = () => {
          el.style.setProperty("--tx", "0px");
          el.style.setProperty("--ty", "0px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      }

      for (const el of document.querySelectorAll<HTMLElement>(".tilt")) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--ry", `${px * 7}deg`);
          el.style.setProperty("--rx", `${-py * 7}deg`);
          el.style.setProperty("--lift", "-6px");
        };
        const leave = () => {
          el.style.setProperty("--ry", "0deg");
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--lift", "0px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      }

      for (const el of document.querySelectorAll<HTMLElement>(".cursor-glow")) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--gx", `${e.clientX - r.left}px`);
          el.style.setProperty("--gy", `${e.clientY - r.top}px`);
          el.style.setProperty("--glow", "1");
        };
        const leave = () => el.style.setProperty("--glow", "0");
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      }
    }

    // Hero photo drifts a little slower than the page.
    const parallax = document.querySelectorAll<HTMLElement>("[data-parallax]");
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const el of parallax) {
          const rate = Number(el.dataset.parallax) || 0.12;
          el.style.transform = `translate3d(0, ${Math.min(y, 1200) * rate}px, 0)`;
        }
      });
    };
    if (parallax.length) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
