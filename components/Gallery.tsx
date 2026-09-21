"use client";

import Photo from "./Photo";
import { useI18n } from "./I18n";
import { GALLERY_PHOTOS } from "@/lib/content";

export default function Gallery() {
  const { t } = useI18n();

  // Columns rather than a grid: plates of different heights stack without
  // leaving holes, which a row-spanning grid cannot do.
  const shapes = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

  return (
    <section id="galeriya" className="border-b border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.gallery.eyebrow}</span>
            <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
              {t.gallery.title}
            </h2>
          </div>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-muted">
            {t.gallery.lead}
          </p>
        </div>

        <div className="mt-16 columns-2 gap-3 sm:gap-4 lg:columns-3">
          {t.gallery.items.map((g, i) => (
            <figure
              key={g.caption}
              className={`reveal group relative mb-3 block break-inside-avoid overflow-hidden bg-ink-2 sm:mb-4 ${shapes[i]}`}
            >
              <Photo
                src={GALLERY_PHOTOS[i]}
                alt={g.caption}
                sizes="(max-width: 640px) 50vw, 33vw"
                label={g.caption}
                // Greyscale like the portraits, for the same reason: the work
                // comes from a dozen different cameras and lighting setups, and
                // left in colour the wall reads as stock, not as one salon.
                className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-[12px] uppercase tracking-[0.18em] text-bone opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
