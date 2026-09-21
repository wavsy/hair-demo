"use client";

import Image from "next/image";
import Counter from "./Counter";
import Icon from "./Icon";
import NextSlots from "./NextSlots";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="grain cursor-glow relative -mt-[84px] overflow-hidden bg-ink pt-[84px] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(130%_100%_at_8%_-10%,#1b6157_0%,#0e3a33_45%,#071c18_100%)]"
      />
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-40 left-1/3 size-[42rem] rounded-full bg-brand-light/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-14rem] left-[-10rem] size-[32rem] rounded-full bg-accent/15 blur-[130px]"
      />
      <div aria-hidden className="absolute inset-0 grid-lines" />

      {/* Full-bleed portrait that dissolves into the background instead of sitting in a box */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] overflow-hidden lg:block">
        <div
          data-parallax="0.07"
          className="absolute inset-x-0 -top-28 -bottom-28 [mask-image:linear-gradient(to_right,transparent_0%,#000_38%,#000_100%)]"
        >
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="54vw"
            className="ken-burns object-cover object-[42%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/45 to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 lg:pb-32 lg:pt-20">
        <div className="lg:max-w-[44rem]">
          <span className="rise glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold text-white/90">
            <span className="size-1.5 rounded-full bg-emerald-300 dot-live" />
            {t.hero.badge}
          </span>

          <h1 style={{ ["--d" as string]: "90ms" }}
            className="rise mt-8 text-balance text-[2.75rem] font-extrabold leading-[1] tracking-[-0.04em] sm:text-[3.8rem] lg:text-[4.35rem]">
            {t.hero.title1}
            <br />
            <span className="text-glow">{t.hero.title2}</span>
          </h1>

          <p style={{ ["--d" as string]: "200ms" }} className="rise mt-7 max-w-lg text-lg leading-relaxed text-white/65">
            {t.hero.lead}
          </p>

          <div style={{ ["--d" as string]: "300ms" }} className="rise mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#chas"
              className="magnetic sweep on-light group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-lg font-semibold text-ink shadow-lift transition hover:bg-mint"
            >
              <Icon name="calendar" className="size-5" />
              {t.hero.ctaBook}
              <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="magnetic sweep glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-lg font-semibold text-white transition hover:border-alarm hover:bg-alarm"
            >
              <Icon name="alert" className="size-5" />
              {t.hero.ctaEmergency}
            </a>
          </div>

          {/* On small screens the photo becomes its own card */}
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-lift lg:hidden">
            <Image
              src="/images/hero.jpg"
              alt={t.clinicName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>

          <dl style={{ ["--d" as string]: "400ms" }} className="rise mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7 lg:mt-14">
            <div>
              <dt className="sr-only">{t.hero.statReviews}</dt>
              <dd className="flex items-baseline gap-1.5 text-3xl font-extrabold tracking-tight">
                <Counter to={4.9} decimals={1} />
                <Icon name="star" className="size-5 fill-accent text-accent" />
              </dd>
              <p className="mt-1 text-sm text-white/50">{t.hero.statReviews}</p>
            </div>
            <div>
              <dt className="sr-only">{t.hero.statYears}</dt>
              <dd className="text-3xl font-extrabold tracking-tight">{t.hero.statYearsValue}</dd>
              <p className="mt-1 text-sm text-white/50">{t.hero.statYears}</p>
            </div>
            <div>
              <dt className="sr-only">{t.hero.statEmergency}</dt>
              <dd className="text-3xl font-extrabold tracking-tight">24/7</dd>
              <p className="mt-1 text-sm text-white/50">{t.hero.statEmergency}</p>
            </div>
          </dl>
        </div>

        <NextSlots className="mt-8 w-full max-w-sm lg:absolute lg:right-6 lg:bottom-32 lg:mt-0 lg:w-[21rem]" />

        <div className="glass absolute right-6 top-8 hidden items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lift xl:flex">
          <span className="grid size-7 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
            <Icon name="check" className="size-4" />
          </span>
          {t.hero.instant}
        </div>
      </div>
    </section>
  );
}
