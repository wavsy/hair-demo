"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import OpenStatus from "./OpenStatus";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Header() {
  const { t, other } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const nav = [
    { href: "#uslugi", label: t.nav.services },
    { href: "#ekip", label: t.nav.team },
    { href: "#otzivi", label: t.nav.reviews },
    { href: "#magazin", label: t.nav.shop },
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
      <div className="hidden bg-brand-dark text-white/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <OpenStatus />
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="size-4" />
              {t.address}
            </span>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="flex items-center gap-2 font-semibold text-white transition hover:text-accent-soft"
            >
              <Icon name="alert" className="size-4" />
              {t.topbar.emergency} · {CLINIC.emergency}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-cream/85 shadow-soft backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="#" aria-label={t.clinicName}>
            <Logo tone={scrolled ? "dark" : "light"} name={t.brand.name} sub={t.brand.sub} />
          </a>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
                  scrolled
                    ? "text-ink-soft hover:bg-mint hover:text-brand"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              href={other}
              className={`hidden size-11 place-items-center rounded-full border text-sm font-bold transition sm:grid ${
                scrolled
                  ? "border-brand/15 text-brand hover:bg-mint"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
              aria-label={t.nav.otherLang}
            >
              {t.nav.otherLang}
            </Link>
            <a
              href={`tel:${CLINIC.phoneHref}`}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition xl:flex ${
                scrolled
                  ? "border-brand/15 text-brand hover:bg-mint"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <Icon name="phone" className="size-4" />
              {CLINIC.phone}
            </a>
            <a
              href="#chas"
              className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold shadow-soft transition sm:flex ${
                scrolled ? "bg-brand text-white hover:bg-brand-dark" : "bg-white text-ink hover:bg-mint"
              }`}
            >
              {t.nav.book}
              <Icon name="arrow" className="size-4" />
            </a>
            <button
              onClick={() => setMenu(true)}
              className={`grid size-11 place-items-center rounded-full border transition lg:hidden ${
                scrolled ? "border-brand/15 text-brand" : "border-white/20 text-white"
              }`}
              aria-label={t.nav.menu}
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-cream p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo name={t.brand.name} sub={t.brand.sub} />
            <button
              onClick={() => setMenu(false)}
              className="grid size-11 place-items-center rounded-full border border-brand/15 text-brand"
              aria-label={t.nav.close}
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="rounded-2xl px-4 py-3.5 text-2xl font-semibold tracking-tight transition hover:bg-mint"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <a
              href="#chas"
              onClick={() => setMenu(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-lg font-semibold text-white"
            >
              {t.nav.book}
            </a>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="flex items-center justify-center gap-2 rounded-full border border-alarm/25 px-6 py-4 text-lg font-semibold text-alarm"
            >
              <Icon name="alert" className="size-5" />
              {t.topbar.emergency}
            </a>
            <Link
              href={other}
              className="flex items-center justify-center gap-2 rounded-full border border-brand/15 px-6 py-4 text-lg font-semibold text-brand"
            >
              {t.nav.otherLang}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
