"use client";

import Counter from "./Counter";
import Icon from "./Icon";
import NextSlots from "./NextSlots";
import Photo from "./Photo";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="grain cursor-glow ondes relative -mt-[76px] overflow-hidden bg-ink pt-[76px] text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/4 size-[46rem] rounded-full bg-accent/10 blur-[160px]"
      />

      {/* Full-bleed portrait that dissolves into the black instead of sitting in a box */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] overflow-hidden lg:block">
        <div
          data-parallax="0.06"
          className="absolute inset-x-0 -top-28 -bottom-28 [mask-image:linear-gradient(to_right,transparent_0%,#000_42%,#000_100%)]"
        >
          <Photo
            src="/images/hero.jpg"
            alt=""
            sizes="52vw"
            priority
            label="ONDÉ"
            className="ken-burns object-cover object-[45%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/40 to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 lg:pb-36 lg:pt-24">
        <div className="lg:max-w-[42rem]">
          <span className="rise inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
            <span className="size-1.5 rounded-full bg-accent dot-live" />
            {t.hero.badge}
          </span>

          <h1
            style={{ ["--d" as string]: "90ms" }}
            className="rise display mt-9 text-balance text-[3.1rem] sm:text-[4.6rem] lg:text-[5.4rem]"
          >
            {t.hero.title1}
            <br />
            <span className="italic text-accent-soft">{t.hero.title2}</span>
          </h1>

          <p
            style={{ ["--d" as string]: "200ms" }}
            className="rise mt-9 max-w-md text-[17px] font-light leading-relaxed text-muted"
          >
            {t.hero.lead}
          </p>

          <div style={{ ["--d" as string]: "300ms" }} className="rise mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#chas"
              className="magnetic sweep on-light group inline-flex items-center justify-center gap-3 rounded-full bg-bone px-8 py-4 text-[15px] font-medium text-ink transition hover:bg-accent-soft"
            >
              <Icon name="calendar" className="size-5" />
              {t.hero.ctaBook}
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#napravleniya"
              className="magnetic sweep inline-flex items-center justify-center gap-3 rounded-full border border-line px-8 py-4 text-[15px] font-light text-bone transition hover:border-accent hover:text-accent"
            >
              {t.hero.ctaPrices}
            </a>
          </div>

          {/* On small screens the photograph becomes its own plate */}
          <div className="relative mt-12 aspect-[4/5] overflow-hidden lg:hidden">
            <Photo
              src="/images/hero.jpg"
              alt={t.salonName}
              sizes="100vw"
              priority
              label="ONDÉ"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>

          <dl
            style={{ ["--d" as string]: "400ms" }}
            className="rise mt-14 grid max-w-lg grid-cols-3 gap-8 border-t border-line pt-8"
          >
            <div>
              <dt className="sr-only">{t.hero.statRating}</dt>
              <dd className="display flex items-baseline gap-2 text-[2.4rem] text-bone">
                <Counter to={SALON.rating} decimals={1} />
                <Icon name="star" className="size-4 fill-accent text-accent" />
              </dd>
              <p className="mt-2 text-[13px] font-light text-muted">{t.hero.statRating}</p>
            </div>
            <div>
              <dt className="sr-only">{t.hero.statMasters}</dt>
              <dd className="display text-[2.4rem] text-bone">{t.hero.statMastersValue}</dd>
              <p className="mt-2 text-[13px] font-light text-muted">{t.hero.statMasters}</p>
            </div>
            <div>
              <dt className="sr-only">{t.hero.statYears}</dt>
              <dd className="display text-[2.4rem] text-bone">{t.hero.statYearsValue}</dd>
              <p className="mt-2 text-[13px] font-light text-muted">{t.hero.statYears}</p>
            </div>
          </dl>
        </div>

        <NextSlots className="mt-10 w-full max-w-sm lg:absolute lg:bottom-36 lg:right-6 lg:mt-0 lg:w-[21rem]" />
      </div>
    </section>
  );
}
