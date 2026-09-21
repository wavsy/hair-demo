"use client";

import Icon from "./Icon";
import Photo from "./Photo";
import { useI18n } from "./I18n";

export default function Why() {
  const { t } = useI18n();
  return (
    <section className="border-b border-line bg-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-24">
          <div className="reveal relative">
            <div className="reveal zoom relative aspect-[4/5] overflow-hidden">
              <Photo
                src="/images/salon.jpg"
                alt={t.why.title1}
                sizes="(max-width: 1024px) 100vw, 44vw"
                label={t.why.eyebrow}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-7 -right-4 w-48 border border-accent-dim bg-ink p-6 sm:-right-8">
              <div className="display text-5xl text-accent">{t.why.badgeValue}</div>
              <p className="mt-2 text-[13px] font-light leading-relaxed text-muted">
                {t.why.badgeText}
              </p>
            </div>
          </div>

          <div>
            <span className="reveal eyebrow">{t.why.eyebrow}</span>
            <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
              {t.why.title1}
              <br />
              <span className="italic text-accent-soft">{t.why.title2}</span>
            </h2>
            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {t.why.items.map((a) => (
                <div key={a.title} className="reveal">
                  <span className="text-accent">
                    <Icon name={a.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-light text-bone">{a.title}</h3>
                  <p className="mt-2.5 text-[14px] font-light leading-relaxed text-muted">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
