"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

export default function Counter({ to, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setValue(0);

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1400;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        setValue(to * eased);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("bg-BG", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
