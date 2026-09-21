"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { CLINIC, SERVICE_META, priceLabel } from "@/lib/content";
import { slotsFor, ymd } from "@/lib/slots";

function icsFile(opts: {
  date: Date;
  time: string;
  minutes: number;
  summary: string;
  services: string;
  phoneLabel: string;
  alarm: string;
  location: string;
}) {
  const [h, m] = opts.time.split(":").map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + Math.max(opts.minutes, 30);
  const stamp = (mins: number) =>
    `${ymd(opts.date).replace(/-/g, "")}T${String(Math.floor(mins / 60)).padStart(2, "0")}${String(
      mins % 60
    ).padStart(2, "0")}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lapa Vet//BG//",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Sofia",
    "BEGIN:STANDARD",
    "DTSTART:19701025T040000",
    "TZOFFSETFROM:+0300",
    "TZOFFSETTO:+0200",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "TZNAME:EET",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700329T030000",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0300",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "TZNAME:EEST",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@lapa-vet.bg`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=Europe/Sofia:${stamp(startMin)}`,
    `DTEND;TZID=Europe/Sofia:${stamp(endMin)}`,
    `SUMMARY:${opts.summary}`,
    `DESCRIPTION:${opts.services}\\n${opts.phoneLabel}: ${CLINIC.phone}`,
    `LOCATION:${opts.location}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${opts.alarm}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function Booking() {
  const { t, lang } = useI18n();
  const b = t.booking;

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [animal, setAnimal] = useState("dog");
  const [pet, setPet] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [vet, setVet] = useState(-1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onPick = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (detail?.length) {
        setPicked(detail);
        setDir(1);
        setStep(1);
      }
    };
    window.addEventListener("lapa:select-services", onPick);
    return () => window.removeEventListener("lapa:select-services", onPick);
  }, []);

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [mounted]);

  const day = days[dayIndex];
  const slots = useMemo(() => (day ? slotsFor(day, vet < 0 ? undefined : vet) : []), [day, vet]);

  // Land on the first day this vet still has room, and drop a time that the
  // chosen vet cannot actually take.
  useEffect(() => {
    if (!mounted) return;
    const pick = vet < 0 ? undefined : vet;
    const first = days.findIndex((d) => slotsFor(d, pick).some((s) => s.free));
    if (first >= 0 && !slotsFor(days[dayIndex], pick).some((s) => s.free)) setDayIndex(first);
    setTime((current) =>
      current && slotsFor(days[dayIndex], pick).some((s) => s.free && s.time === current)
        ? current
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, vet, dayIndex, days]);

  const chosen = SERVICE_META.map((m, i) => ({ ...m, title: t.services.items[i].title })).filter(
    (s) => picked.includes(s.slug)
  );
  const totalEur = chosen.reduce((a, s) => a + s.price, 0);
  const totalMin = chosen.reduce((a, s) => a + s.duration, 0) || 30;
  const price = priceLabel(totalEur, lang);

  const animalLabel = b.animals.find((a) => a.id === animal)?.label ?? "";
  const canNext = [true, picked.length > 0, !!time, name.trim().length > 1 && phone.trim().length > 5][step];

  const download = () => {
    const blob = new Blob(
      [
        icsFile({
          date: day,
          time: time!,
          minutes: totalMin,
          summary: b.icsSummary(pet || animalLabel.toLowerCase()),
          services: chosen.map((c) => c.title).join(", "),
          phoneLabel: b.icsPhone,
          alarm: b.icsAlarm,
          location: t.address,
        }),
      ],
      { type: "text/calendar;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lapa-vet.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepStyle = { ["--from" as string]: dir === 1 ? "28px" : "-28px" } as React.CSSProperties;

  const vets = t.team.members.slice(0, 3);
  const vetName = vet < 0 ? b.anyVet : vets[vet].name;
  const shortName = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 2 ? `${parts[0]} ${parts[parts.length - 1]}` : name;
  };

  const dayLabel = (d: Date) => `${b.weekdays[d.getDay()]}, ${d.getDate()} ${b.months[d.getMonth()]}`;

  return (
    <section id="chas" className="cursor-glow relative overflow-hidden bg-brand-dark py-20 text-white md:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">{b.eyebrow}</span>
          <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">{b.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">{b.lead}</p>
        </div>

        <div className="reveal mt-12 overflow-hidden rounded-[2rem] bg-white text-ink shadow-lift">
          {!done && (
            <div className="flex border-b border-ink/8">
              {b.steps.map((s, i) => (
                <div
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-2 px-2 py-4 text-sm font-semibold transition ${
                    i === step ? "bg-mint text-brand" : i < step ? "text-brand" : "text-ink-soft/60"
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                      i <= step ? "bg-brand text-white" : "bg-ink/8"
                    }`}
                  >
                    {i < step ? <Icon name="check" className="size-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-10 md:min-h-[32rem]">
            {done ? (
              <div className="pop-in text-center">
                <span className="check-ring mx-auto grid size-20 place-items-center rounded-full bg-mint text-brand">
                  <svg viewBox="0 0 48 48" className="size-11" fill="none" aria-hidden="true">
                    <path
                      className="check-path"
                      d="m13 25 8 8 15-17"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-6 text-3xl font-extrabold tracking-tight">{b.doneTitle}</h3>
                <p className="mt-2 text-ink-soft">{b.doneLead(phone)}</p>

                <div className="mx-auto mt-8 max-w-md rounded-[1.5rem] border border-ink/8 bg-cream p-6 text-left">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                      {b.cardTitle}
                    </span>
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                      {b.confirmed}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 text-[15px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{b.when}</dt>
                      <dd className="text-right font-semibold">
                        {dayLabel(day)} · {time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{b.patient}</dt>
                      <dd className="text-right font-semibold">
                        {pet ? `${pet} (${animalLabel.toLowerCase()})` : animalLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{b.servicesLabel}</dt>
                      <dd className="text-right font-semibold">{chosen.map((c) => c.title).join(", ")}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{b.vet}</dt>
                      <dd className="text-right font-semibold">{vetName}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-ink/8 pt-3">
                      <dt className="text-ink-soft">{b.approx}</dt>
                      <dd className="text-right">
                        <span className="text-lg font-extrabold">{price.eur}</span>
                        <span className="ml-2 text-sm text-ink-soft">{price.bgn}</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={download}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
                  >
                    <Icon name="calendar" className="size-5" />
                    {b.addCalendar}
                  </button>
                  <button
                    onClick={() => {
                      setDone(false);
                      setStep(0);
                      setTime(null);
                      setPicked([]);
                      setPet("");
                      setName("");
                      setPhone("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/12 px-6 py-3.5 font-semibold text-ink transition hover:bg-mint"
                  >
                    {b.newBooking}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div key="s0" className="step-in" style={stepStyle}>
                    <h3 className="text-2xl font-bold tracking-tight">{b.q1}</h3>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {b.animals.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAnimal(a.id)}
                          className={`rounded-2xl border p-5 text-center transition ${
                            animal === a.id
                              ? "border-brand bg-mint text-brand shadow-soft"
                              : "border-ink/10 hover:border-brand/40"
                          }`}
                        >
                          <span className="block text-3xl">{a.emoji}</span>
                          <span className="mt-2 block font-semibold">{a.label}</span>
                        </button>
                      ))}
                    </div>
                    <label className="mt-6 block">
                      <span className="text-sm font-semibold text-ink-soft">{b.petName}</span>
                      <input
                        value={pet}
                        onChange={(e) => setPet(e.target.value)}
                        placeholder={b.petPlaceholder}
                        className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                      />
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div key="s1" className="step-in" style={stepStyle}>
                    <h3 className="text-2xl font-bold tracking-tight">{b.q2}</h3>
                    <p className="mt-1 text-ink-soft">{b.q2sub}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {SERVICE_META.map((meta, i) => {
                        const copy = t.services.items[i];
                        const on = picked.includes(meta.slug);
                        const p = priceLabel(meta.price, lang);
                        return (
                          <button
                            key={meta.slug}
                            onClick={() =>
                              setPicked((v) =>
                                v.includes(meta.slug) ? v.filter((x) => x !== meta.slug) : [...v, meta.slug]
                              )
                            }
                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                              on ? "border-brand bg-mint" : "border-ink/10 hover:border-brand/40"
                            }`}
                          >
                            <span
                              className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                                on ? "bg-brand text-white" : "bg-cream text-brand"
                              }`}
                            >
                              <Icon name={meta.icon} className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold">{copy.title}</span>
                              <span className="block text-sm text-ink-soft">
                                {t.services.from} {p.eur} · ~{meta.duration} {t.services.min}
                              </span>
                            </span>
                            <span
                              className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                                on ? "border-brand bg-brand text-white" : "border-ink/15 text-transparent"
                              }`}
                            >
                              <Icon name="check" className="size-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div key="s2" className="step-in" style={stepStyle}>
                    <h3 className="text-2xl font-bold tracking-tight">{b.q3}</h3>

                    {!mounted ? (
                      <div className="mt-6 h-24 animate-pulse rounded-2xl bg-cream" />
                    ) : (
                      <>
                        <div className="mt-6">
                          <span className="text-sm font-semibold text-ink-soft">{b.vetLabel}</span>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {[{ i: -1, label: b.anyVet }, ...vets.map((m, i) => ({ i, label: shortName(m.name) }))].map(
                              (option) => (
                                <button
                                  key={option.i}
                                  onClick={() => setVet(option.i)}
                                  className={`rounded-2xl border px-3 py-3 text-[15px] font-semibold transition ${
                                    vet === option.i
                                      ? "border-brand bg-mint text-brand shadow-soft"
                                      : "border-ink/10 text-ink-soft hover:border-brand/40"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              )
                            )}
                          </div>
                          {vet >= 0 && (
                            <p className="mt-2 text-sm text-ink-soft">{b.vetHint(vets[vet].name)}</p>
                          )}
                        </div>

                        <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2">
                          {days.map((d, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setDayIndex(i);
                                setTime(null);
                              }}
                              className={`min-w-[5.4rem] shrink-0 rounded-2xl border px-3 py-3 text-center transition ${
                                i === dayIndex
                                  ? "border-brand bg-brand text-white shadow-soft"
                                  : "border-ink/10 hover:border-brand/40"
                              }`}
                            >
                              <span className="block text-xs uppercase tracking-wide opacity-70">
                                {i === 0 ? t.hero.today : i === 1 ? t.hero.tomorrow : b.weekdays[d.getDay()]}
                              </span>
                              <span className="mt-0.5 block text-xl font-bold">{d.getDate()}</span>
                              <span className="block text-xs opacity-70">
                                {b.months[d.getMonth()].slice(0, 3)}
                              </span>
                            </button>
                          ))}
                        </div>

                        {slots.every((s) => !s.free) && (
                          <p className="mt-6 rounded-2xl bg-cream px-5 py-4 text-[15px] text-ink-soft">
                            {b.noSlots}
                          </p>
                        )}

                        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {slots.map((s) => (
                            <button
                              key={s.time}
                              disabled={!s.free}
                              onClick={() => setTime(s.time)}
                              className={`rounded-xl border py-3 text-[15px] font-semibold transition ${
                                time === s.time
                                  ? "border-brand bg-brand text-white"
                                  : s.free
                                    ? "border-ink/10 hover:border-brand hover:text-brand"
                                    : "cursor-not-allowed border-transparent bg-cream text-ink-soft/35 line-through"
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>

                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div key="s3" className="step-in" style={stepStyle}>
                    <h3 className="text-2xl font-bold tracking-tight">{b.q4}</h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-semibold text-ink-soft">{b.yourName}</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={b.namePlaceholder}
                          className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-ink-soft">{b.phone}</span>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder={b.phonePlaceholder}
                          className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                        />
                      </label>
                    </div>

                    <div className="mt-6 rounded-2xl bg-cream p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[15px] text-ink-soft">
                          {day && (
                            <>
                              {dayLabel(day)} · <strong className="text-ink">{time}</strong> ·{" "}
                              {chosen.map((c) => c.title).join(", ")}
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-extrabold">{price.eur}</div>
                          <div className="text-sm text-ink-soft">{price.bgn}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/8 pt-6">
                  <button
                    onClick={() => {
                      setDir(-1);
                      setStep((s) => Math.max(0, s - 1));
                    }}
                    className={`rounded-full px-5 py-3 font-semibold text-ink-soft transition hover:text-ink ${
                      step === 0 ? "invisible" : ""
                    }`}
                  >
                    {b.back}
                  </button>
                  <button
                    disabled={!canNext}
                    onClick={() => {
                      if (step === 3) return setDone(true);
                      setDir(1);
                      setStep((s) => s + 1);
                    }}
                    className="magnetic sweep on-light inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/12 disabled:text-ink-soft"
                  >
                    {step === 3 ? b.confirm : b.next}
                    <Icon name="arrow" className="size-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="reveal mt-6 text-center text-sm text-white/50">
          {b.phonePrefer}{" "}
          <a href={`tel:${CLINIC.phoneHref}`} className="font-semibold text-white underline">
            {CLINIC.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
