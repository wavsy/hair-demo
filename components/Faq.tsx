"use client";

import { useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="reveal text-center">
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">{t.faq.title}</h2>
        </div>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {t.faq.items.map((f, i) => (
            <div key={f.q} className="reveal">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-8 py-7 text-left"
              >
                <span className="display text-xl text-bone sm:text-2xl">{f.q}</span>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border transition ${
                    open === i ? "rotate-180 border-accent text-accent" : "border-line text-muted"
                  }`}
                >
                  <Icon name="chevron" className="size-3.5" />
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl text-[15px] font-light leading-relaxed text-muted">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
