"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Emergency() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="cursor-glow relative overflow-hidden bg-ink py-20 text-white md:py-28">
      <Image src="/images/cat-dark.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full bg-alarm px-4 py-2 text-sm font-bold">
              <Icon name="alert" className="size-4" />
              {t.emergency.badge}
            </span>
            <h2 className="reveal wipe mt-6 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              {t.emergency.title1}
              <br />
              {t.emergency.title2}
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/70">{t.emergency.lead}</p>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-alarm px-7 py-4 text-xl font-bold text-white shadow-lift transition hover:brightness-110"
            >
              <Icon name="phone" className="size-6" />
              {CLINIC.emergency}
            </a>

            <dl className="mt-10 grid max-w-md grid-cols-2 gap-4">
              {t.emergency.stats.map((s) => (
                <div key={s.k} className="glass rounded-2xl p-4">
                  <dt className="text-2xl font-extrabold tracking-tight text-white">{s.k}</dt>
                  <dd className="mt-1 text-sm leading-snug text-white/60">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="reveal">
            <h3 className="text-lg font-bold text-white/80">{t.emergency.listTitle}</h3>
            <div className="mt-5 space-y-2">
              {t.emergency.cases.map((c, i) => (
                <div
                  key={c.title}
                  className="overflow-hidden rounded-2xl border border-white/12 bg-white/5 backdrop-blur-sm"
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                  >
                    {c.title}
                    <Icon
                      name="chevron"
                      className={`size-5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-white/70">{c.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/45">{t.emergency.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
