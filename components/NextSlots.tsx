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
    <div className={`glass rounded-2xl p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-accent">
          <Icon name="clock" className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium tracking-wide text-bone">{t.hero.slotsTitle}</div>
          <span className="text-[13px] font-light text-muted">
            {data ? t.hero.slotsSoonest(when) : t.hero.slotsChecking}
          </span>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        {(data?.times ?? ["", "", ""]).map((time, i) => (
          <a
            key={time || i}
            href="#chas"
            className={`flex-1 rounded-full border border-line py-2.5 text-center text-[13px] font-light transition hover:border-accent hover:text-accent ${
              time ? "text-bone" : "pointer-events-none text-transparent"
            }`}
          >
            {time || "--:--"}
          </a>
        ))}
      </div>
    </div>
  );
}
