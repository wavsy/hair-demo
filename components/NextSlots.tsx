"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { nextAvailability } from "@/lib/slots";

export default function NextSlots({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [data, setData] = useState<ReturnType<typeof nextAvailability>>(null);

  useEffect(() => {
    setData(nextAvailability(3));
    const timer = setInterval(() => setData(nextAvailability(3)), 60_000);
    return () => clearInterval(timer);
  }, []);

  const when = data
    ? data.offset === 0
      ? t.hero.today
      : data.offset === 1
        ? t.hero.tomorrow
        : `${t.booking.weekdays[data.date.getDay()]}, ${data.date.getDate()} ${
            t.booking.months[data.date.getMonth()]
          }`
    : "";

  return (
    <div className={`glass rounded-3xl p-5 shadow-lift ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-white">
          <Icon name="clock" className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{t.hero.slotsTitle}</div>
          <span className="text-sm text-white/60">
            {data ? t.hero.slotsSoonest(when) : t.hero.slotsChecking}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {(data?.times ?? ["", "", ""]).map((time, i) => (
          <a
            key={time || i}
            href="#chas"
            className={`flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-center text-sm font-semibold transition hover:bg-white hover:text-ink ${
              time ? "" : "pointer-events-none text-transparent"
            }`}
          >
            {time || "--:--"}
          </a>
        ))}
      </div>
    </div>
  );
}
