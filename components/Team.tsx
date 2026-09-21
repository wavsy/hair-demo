"use client";

import Image from "next/image";
import { useI18n } from "./I18n";
import { TEAM_PHOTOS } from "@/lib/content";

export default function Team() {
  const { t } = useI18n();
  return (
    <section id="ekip" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
              {t.team.eyebrow}
            </span>
            <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {t.team.title}
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">{t.team.lead}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.team.members.map((m, i) => (
            <article key={m.name} className="reveal group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-soft">
                <Image
                  src={TEAM_PHOTOS[i]}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{m.name}</h3>
              <p className="text-sm font-semibold text-brand">{m.role}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{m.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
