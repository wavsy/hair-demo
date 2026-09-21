"use client";

import Icon from "./Icon";
import OpenStatus from "./OpenStatus";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Contact() {
  const { t } = useI18n();
  return (
    <section id="kontakti" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
            {t.contact.eyebrow}
          </span>
          <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            {t.contact.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="reveal space-y-4">
            <div className="rounded-[1.75rem] border border-ink/8 bg-white p-7 shadow-soft">
              <OpenStatus className="text-brand" />
              <dl className="mt-5 space-y-3 text-[15px]">
                {t.contact.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4">
                    <dt className="text-ink-soft">{h.day}</dt>
                    <dd className="font-semibold">
                      {h.from} – {h.to}
                    </dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t border-ink/8 pt-3">
                  <dt className="font-semibold text-alarm">{t.contact.emergencyRow}</dt>
                  <dd className="font-bold text-alarm">{t.contact.allDay}</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={`tel:${CLINIC.phoneHref}`}
                className="flex items-center gap-4 rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-soft transition hover:border-brand/30"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-brand">
                  <Icon name="phone" className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-ink-soft">{t.contact.reception}</span>
                  <span className="block font-bold">{CLINIC.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${CLINIC.email}`}
                className="flex items-center gap-4 rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-soft transition hover:border-brand/30"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-brand">
                  <Icon name="mail" className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-ink-soft">{t.contact.email}</span>
                  <span className="block truncate font-bold">{CLINIC.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-soft sm:col-span-2 lg:col-span-1">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-brand">
                  <Icon name="pin" className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-ink-soft">{t.contact.address}</span>
                  <span className="block font-bold">{t.address}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="reveal overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-soft">
            <iframe
              title={t.contact.map}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(CLINIC.mapsQuery)}&z=16&hl=${
                t.lang
              }&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[26rem] w-full border-0 grayscale-[35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
