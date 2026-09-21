"use client";

import Image from "next/image";
import { useState } from "react";
import { LogoMark } from "./Logo";

/**
 * A photograph that degrades honestly. The CC0 photographs are fetched with
 * `npm run photos` and are deliberately not committed; until they are on disk
 * the slot draws itself as a dark plate with the mark and the caption, so the
 * page still reads as designed instead of showing a broken image.
 */
export default function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  label,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);

  // A stable tilt per slot, so a wall of placeholders is not a wall of one plate.
  const shift = [...src].reduce((a, c) => a + c.charCodeAt(0), 0) % 40;

  if (failed) {
    return (
      <span
        aria-label={alt}
        role="img"
        className="absolute inset-0 grid place-items-center overflow-hidden bg-ink-2"
        style={{
          backgroundImage: `linear-gradient(${140 + shift}deg, #17171a 0%, #101012 48%, #1d1a17 100%)`,
        }}
      >
        <span className="flex flex-col items-center gap-3 px-6 text-center">
          <LogoMark className="size-10 text-accent/35" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted/55">
            {label ?? alt}
          </span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
