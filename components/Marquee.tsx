"use client";

import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Marquee() {
  const { t } = useI18n();
  return (
    <div className="relative overflow-hidden border-y border-ink/8 bg-white py-5">
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex items-center gap-10" aria-hidden={pass === 1}>
            {t.marquee.map((w) => (
              <span
                key={w}
                className="flex shrink-0 items-center gap-4 text-lg font-semibold tracking-tight text-ink-soft"
              >
                {w}
                <Icon name="paw" className="size-4 text-brand-light" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
