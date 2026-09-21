"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18n";

function sofiaNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sofia",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return {
    dayIndex: order.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

export default function OpenStatus({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const { dayIndex, minutes } = sofiaNow();
      if (dayIndex < 0) return;
      const today = t.contact.hours[dayIndex];
      if (minutes >= toMin(today.from) && minutes < toMin(today.to)) {
        setState({ open: true, text: t.status.openUntil(today.to) });
      } else if (minutes < toMin(today.from)) {
        setState({ open: false, text: t.status.opensAt(today.from) });
      } else {
        const next = t.contact.hours[(dayIndex + 1) % 7];
        setState({ open: false, text: t.status.opensTomorrow(next.from) });
      }
    };
    compute();
    const timer = setInterval(compute, 60_000);
    return () => clearInterval(timer);
  }, [t]);

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}
      suppressHydrationWarning
    >
      <span
        className={`size-2 rounded-full dot-live ${
          state === null ? "bg-current opacity-40" : state.open ? "bg-emerald-400" : "bg-accent"
        }`}
      />
      {state === null ? t.status.label : state.text}
    </span>
  );
}
