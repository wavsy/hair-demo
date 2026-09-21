"use client";

import Icon from "./Icon";
import { useI18n } from "./I18n";

export default function Marquee() {
  const { t } = useI18n();
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-6">
      <div className="marquee-track flex w-max items-center gap-12 pr-12">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex items-center gap-12" aria-hidden={pass === 1}>
            {t.marquee.map((w) => (
              <span
                key={w}
                className="display flex shrink-0 items-center gap-6 text-2xl font-light text-muted"
              >
                {w}
                <Icon name="wave" className="size-4 text-accent/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
