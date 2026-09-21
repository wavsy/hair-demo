"use client";

import { useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="reveal text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
            {t.faq.eyebrow}
          </span>
          <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            {t.faq.title}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-ink/8 border-y border-ink/8">
          {t.faq.items.map((f, i) => (
            <div key={f.q} className="reveal">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-bold tracking-tight sm:text-xl">{f.q}</span>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border border-ink/12 transition ${
                    open === i ? "rotate-180 border-brand bg-brand text-white" : "text-brand"
                  }`}
                >
                  <Icon name="chevron" className="size-4" />
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
