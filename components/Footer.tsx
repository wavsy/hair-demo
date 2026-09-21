"use client";

import Logo from "./Logo";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function Footer() {
  const { t } = useI18n();
  const serviceLinks = ["#uslugi", "#uslugi", "#uslugi", "#magazin"];
  const clinicLinks = ["#ekip", "#otzivi", "#kontakti", "#chas"];

  return (
    <footer className="bg-brand-dark pb-28 pt-16 text-white/70 md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" name={t.brand.name} sub={t.brand.sub} />
            <p className="mt-4 text-[15px] leading-relaxed">{t.footer.about(CLINIC.founded)}</p>
          </div>

          <div>
            <h3 className="font-bold text-white">{t.footer.colServices}</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              {t.footer.services.map((s, i) => (
                <li key={s}>
                  <a href={serviceLinks[i]} className="transition hover:text-white">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white">{t.footer.colClinic}</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              {t.footer.clinic.map((s, i) => (
                <li key={s}>
                  <a href={clinicLinks[i]} className="transition hover:text-white">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white">{t.footer.colContact}</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li>
                <a href={`tel:${CLINIC.phoneHref}`} className="transition hover:text-white">
                  {CLINIC.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CLINIC.emergencyHref}`}
                  className="font-semibold text-white transition hover:text-accent-soft"
                >
                  {t.footer.emergencyShort} · {CLINIC.emergency}
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINIC.email}`} className="transition hover:text-white">
                  {CLINIC.email}
                </a>
              </li>
              <li>{t.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.clinicName}
          </p>
          <p>
            {t.footer.madeBy}{" "}
            <a
              href="https://wavsy.dev"
              target="_blank"
              rel="noopener"
              className="font-semibold text-white underline underline-offset-4"
            >
              Wavsy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
