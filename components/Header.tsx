"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import OpenStatus from "./OpenStatus";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function Header() {
  const { t, other } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const nav = [
    { href: "#napravleniya", label: t.nav.directions },
    { href: "#ekip", label: t.nav.team },
    { href: "#kursove", label: t.nav.courses },
    { href: "#galeriya", label: t.nav.gallery },
    { href: "#kontakti", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="hidden border-b border-line bg-ink text-muted md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 text-[13px] font-light">
          <OpenStatus />
          <div className="flex items-center gap-7">
            <span className="tracking-wide text-accent-soft/70">{t.topbar.tagline}</span>
            <span className="flex items-center gap-2">
              <Icon name="pin" className="size-3.5" />
              {t.address}
            </span>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-line bg-ink/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="#" aria-label={t.salonName}>
            <Logo name={t.brand.name} sub={t.brand.sub} />
          </a>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-[14px] font-light tracking-wide text-muted transition hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              href={other}
              className="hidden size-10 place-items-center rounded-full border border-line text-[13px] font-medium tracking-wider text-muted transition hover:border-accent hover:text-accent sm:grid"
              aria-label={t.nav.otherLang}
            >
              {t.nav.otherLang}
            </Link>
            <a
              href={`tel:${SALON.phoneHref}`}
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14px] font-light text-muted transition hover:border-accent hover:text-accent xl:flex"
            >
              <Icon name="phone" className="size-4" />
              {SALON.phone}
            </a>
            <a
              href="#chas"
              className="magnetic sweep on-light hidden items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-[14px] font-medium text-ink transition hover:bg-accent-soft sm:flex"
            >
              {t.nav.book}
              <Icon name="arrow" className="size-4" />
            </a>
            <button
              onClick={() => setMenu(true)}
              className="grid size-10 place-items-center rounded-full border border-line text-bone lg:hidden"
              aria-label={t.nav.menu}
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo name={t.brand.name} sub={t.brand.sub} />
            <button
              onClick={() => setMenu(false)}
              className="grid size-10 place-items-center rounded-full border border-line text-bone"
              aria-label={t.nav.close}
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <nav className="mt-12 flex flex-col">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="display border-b border-line py-5 text-3xl text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-10 space-y-3">
            <a
              href="#chas"
              onClick={() => setMenu(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-bone px-6 py-4 text-base font-medium text-ink"
            >
              {t.nav.book}
            </a>
            <a
              href={`tel:${SALON.phoneHref}`}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-6 py-4 text-base font-light text-bone"
            >
              <Icon name="phone" className="size-5" />
              {SALON.phone}
            </a>
            <Link
              href={other}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-6 py-4 text-base font-light text-muted"
            >
              {t.nav.otherLang}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
