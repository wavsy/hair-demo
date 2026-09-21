"use client";

import Icon from "./Icon";
import OpenStatus from "./OpenStatus";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function Contact() {
  const { t } = useI18n();
  return (
    <section id="kontakti" className="bg-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
            {t.contact.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="reveal space-y-4">
            <div className="border border-line bg-ink p-7">
              <OpenStatus className="text-accent" />
              <dl className="mt-6 space-y-3 text-[14px] font-light">
                {t.contact.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className={h.from ? "text-bone" : "text-muted/50"}>
                      {h.from ? `${h.from} – ${h.to}` : t.contact.closed}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={`tel:${SALON.phoneHref}`}
                className="flex items-center gap-5 border border-line bg-ink p-5 transition hover:border-accent"
              >
                <span className="grid size-10 shrink-0 place-items-center border border-line text-accent">
                  <Icon name="phone" className="size-4" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-muted/70">
                    {t.contact.reception}
                  </span>
                  <span className="mt-1 block text-[15px] font-light text-bone">{SALON.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${SALON.email}`}
                className="flex items-center gap-5 border border-line bg-ink p-5 transition hover:border-accent"
              >
                <span className="grid size-10 shrink-0 place-items-center border border-line text-accent">
                  <Icon name="mail" className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-muted/70">
                    {t.contact.email}
                  </span>
                  <span className="mt-1 block truncate text-[15px] font-light text-bone">
                    {SALON.email}
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-5 border border-line bg-ink p-5 sm:col-span-2 lg:col-span-1">
                <span className="grid size-10 shrink-0 place-items-center border border-line text-accent">
                  <Icon name="pin" className="size-4" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-muted/70">
                    {t.contact.address}
                  </span>
                  <span className="mt-1 block text-[15px] font-light text-bone">{t.address}</span>
                </span>
              </div>
            </div>

            <p className="text-[13px] font-light leading-relaxed text-muted/70">{t.contact.note}</p>
          </div>

          <div className="reveal overflow-hidden border border-line bg-ink">
            {/* OpenStreetMap rather than the Google embed: it needs no key and
                no cookie consent, so the map is actually on screen in Bulgaria
                instead of a blocked frame behind a banner. */}
            <iframe
              title={t.contact.map}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${SALON.bbox}&layer=mapnik&marker=${SALON.lat},${SALON.lon}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[28rem] w-full border-0 opacity-80 grayscale invert-[0.92] hue-rotate-180"
            />
            <a
              href={`https://www.openstreetmap.org/?mlat=${SALON.lat}&mlon=${SALON.lon}#map=17/${SALON.lat}/${SALON.lon}`}
              target="_blank"
              rel="noreferrer"
              className="block border-t border-line px-5 py-4 text-[13px] font-light text-muted transition hover:text-accent"
            >
              {t.contact.openMap}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
