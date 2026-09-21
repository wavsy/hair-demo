"use client";

import Icon from "./Icon";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function Reviews() {
  const { t, lang } = useI18n();
  return (
    <section id="otzivi" className="border-b border-line bg-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
          <div className="reveal">
            <span className="eyebrow">{t.reviews.eyebrow}</span>
            <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
              {t.reviews.title1}
              <br />
              <span className="italic text-accent-soft">{t.reviews.title2}</span>
            </h2>

            <div className="mt-10 flex items-center gap-5 border-y border-line py-6">
              <div className="display text-6xl text-bone">
                {SALON.rating.toLocaleString(lang === "bg" ? "bg-BG" : "en-GB", {
                  minimumFractionDigits: 1,
                })}
              </div>
              <div>
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="size-3.5 fill-accent" />
                  ))}
                </div>
                <p className="mt-2 text-[13px] font-light text-muted">{t.reviews.ratingNote}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {t.reviews.items.map((r, i) => (
              <figure
                key={r.author}
                className={`reveal border border-line p-8 ${i === 1 ? "bg-ink lg:ml-16" : "bg-ink/40"} lg:max-w-2xl`}
              >
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="star" className="size-3 fill-accent" />
                  ))}
                </div>
                <blockquote className="display mt-5 text-[1.35rem] leading-snug text-bone">
                  „{r.text}“
                </blockquote>
                <figcaption className="mt-6 text-[13px] font-light">
                  <span className="text-bone">{r.author}</span>
                  <span className="text-muted"> · {r.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
