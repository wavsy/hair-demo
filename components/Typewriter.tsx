"use client";

import { useEffect, useState } from "react";

/** Reveals an answer the way a person reads it, a few characters at a time. */
export default function Typewriter({
  text,
  onTick,
  speed = 9,
}: {
  text: string;
  onTick?: () => void;
  speed?: number;
}) {
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? text
      : ""
  );

  useEffect(() => {
    if (shown === text) return;
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 90));
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step);
      setShown(text.slice(0, i));
      onTick?.();
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={shown.length < text.length ? "caret" : undefined}>{shown}</span>;
}
