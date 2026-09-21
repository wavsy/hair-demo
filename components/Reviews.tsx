"use client";

import Image from "next/image";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Reviews() {
  const { t } = useI18n();
  return (
    <section id="otzivi" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <div className="reveal">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
              {t.reviews.eyebrow}
            </span>
            <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {t.reviews.title1}
              <br />
              {t.reviews.title2}
            </h2>

            <div className="mt-8 flex items-center gap-4 rounded-3xl border border-ink/8 bg-cream p-5">
              <div className="text-5xl font-extrabold tracking-tight">{CLINIC.rating}</div>
              <div>
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="size-5 fill-accent" />
                  ))}
                </div>
                <p className="mt-1 text-sm text-ink-soft">{t.reviews.ratingNote}</p>
              </div>
            </div>

            <div className="reveal zoom relative mt-8 aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-soft">
              <Image
                src="/images/friends.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {t.reviews.items.map((r, i) => (
              <figure
                key={r.author}
                className={`reveal rounded-[1.75rem] border border-ink/8 p-7 shadow-soft ${
                  i === 1 ? "bg-mint lg:ml-12" : "bg-cream"
                } lg:max-w-2xl`}
              >
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="star" className="size-4 fill-accent" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">„{r.text}“</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-bold text-ink">{r.author}</span>
                  <span className="text-ink-soft"> · {r.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
