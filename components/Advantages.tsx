"use client";

import Image from "next/image";
import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Advantages() {
  const { t } = useI18n();
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div className="reveal relative">
            <div className="reveal zoom relative aspect-[4/3] overflow-hidden rounded-[2.25rem] shadow-lift">
              <Image
                src="/images/care.jpg"
                alt={t.advantages.title1}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 w-56 rounded-3xl bg-brand p-5 text-white shadow-lift sm:-right-8">
              <div className="text-4xl font-extrabold tracking-tight">{t.advantages.badgeValue}</div>
              <p className="mt-1 text-sm text-white/75">{t.advantages.badgeText}</p>
            </div>
          </div>

          <div>
            <span className="reveal text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
              {t.advantages.eyebrow}
            </span>
            <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {t.advantages.title1}
              <br />
              {t.advantages.title2}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {t.advantages.items.map((a) => (
                <div key={a.title} className="reveal">
                  <span className="grid size-12 place-items-center rounded-2xl bg-mint text-brand">
                    <Icon name={a.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{a.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
