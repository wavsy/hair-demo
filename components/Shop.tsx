"use client";

import Image from "next/image";
import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Shop() {
  const { t } = useI18n();
  return (
    <section id="magazin" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="reveal text-sm font-bold uppercase tracking-[0.18em] text-brand">
              {t.shop.eyebrow}
            </span>
            <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {t.shop.title1}
              <br />
              {t.shop.title2}
            </h2>
            <p className="reveal mt-5 max-w-lg text-lg text-ink-soft">{t.shop.lead}</p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {t.shop.items.map((i) => (
                <div key={i.title} className="reveal flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-soft">
                    <Icon name="cart" className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold tracking-tight">{i.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{i.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal zoom relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-lift">
            <Image
              src="/images/shop.jpg"
              alt={t.shop.eyebrow}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
