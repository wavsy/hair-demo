"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";
import { contactHref, coursesHref, home, otherLangHref, type PageId } from "@/lib/routes";

/**
 * The bar at the top and the line at the bottom, and deliberately nothing else.
 *
 * The old site carried a full navigation, a phone pill, a booking button and a
 * status strip above the fold. Here the page below is five faces; anything
 * stacked on top of them competes with the only decision on the screen.
 */
export function TopBar({ page }: { page: PageId }) {
  const { t, lang } = useI18n();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <div className="pointer-events-auto mx-auto flex max-w-[110rem] items-center justify-between gap-6 px-6 py-6 md:px-10">
        <Link href={home(lang)} aria-label={t.salonName}>
          <Logo />
        </Link>

        <nav className="flex items-center gap-5 text-[12px] uppercase tracking-[0.2em] text-bone/70 sm:gap-7">
          {page.kind !== "home" && (
            <Link href={home(lang)} className="hidden transition hover:text-accent sm:inline">
              {t.nav.masters}
            </Link>
          )}
          <Link href={coursesHref(lang)} className="transition hover:text-accent">
            {t.nav.courses}
          </Link>
          <Link href={contactHref(lang)} className="transition hover:text-accent">
            {t.nav.salon}
          </Link>
          <Link
            href={otherLangHref(lang, page)}
            className="transition hover:text-accent"
            hrefLang={lang === "bg" ? "en" : "bg"}
          >
            {t.nav.otherLang}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BottomLine() {
  const { t, lang } = useI18n();

  return (
    <footer className="border-t border-line bg-ink px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-8 text-[13px] font-light text-muted md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href={contactHref(lang)} className="text-bone transition hover:text-accent">
            {t.address}
          </Link>
          <a href={`tel:${SALON.phoneHref}`} className="transition hover:text-accent">
            {SALON.phone}
          </a>
          <span>{t.footer.hoursLine}</span>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted/60">
            {t.footer.demoNote}
          </span>
          <span>
            {t.footer.madeBy}{" "}
            <a
              href="https://wavsy.dev"
              target="_blank"
              rel="noreferrer"
              className="text-bone transition hover:text-accent"
            >
              Wavsy
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
