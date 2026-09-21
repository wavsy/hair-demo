"use client";

import Logo from "./Logo";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function Footer() {
  const { t } = useI18n();
  const salonLinks = ["#ekip", "#kursove", "#galeriya", "#kontakti"];

  return (
    <footer className="border-t border-line bg-ink pb-28 pt-20 text-muted md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 border-b border-line pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo name={t.brand.name} sub={t.brand.sub} />
            <p className="mt-6 text-[14px] font-light leading-relaxed">
              {t.footer.about(SALON.founded)}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-bone">
              {t.footer.colDirections}
            </h3>
            <ul className="mt-5 space-y-2.5 text-[14px] font-light">
              {t.directions.items.map((d) => (
                <li key={d.title}>
                  <a href="#napravleniya" className="transition hover:text-accent">
                    {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-bone">
              {t.footer.colSalon}
            </h3>
            <ul className="mt-5 space-y-2.5 text-[14px] font-light">
              {t.footer.salon.map((s, i) => (
                <li key={s}>
                  <a href={salonLinks[i]} className="transition hover:text-accent">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-bone">
              {t.footer.colContact}
            </h3>
            <ul className="mt-5 space-y-2.5 text-[14px] font-light">
              <li>
                <a href={`tel:${SALON.phoneHref}`} className="transition hover:text-accent">
                  {SALON.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SALON.email}`} className="transition hover:text-accent">
                  {SALON.email}
                </a>
              </li>
              <li>{t.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[13px] font-light sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.brand.name} · {t.footer.demo}
          </p>
          <p>
            {t.footer.madeBy}{" "}
            <a
              href="https://wavsy.dev"
              target="_blank"
              rel="noopener"
              className="text-bone underline underline-offset-4 transition hover:text-accent"
            >
              Wavsy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
