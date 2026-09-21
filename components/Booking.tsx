"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import Photo from "./Photo";
import { useI18n } from "./I18n";
import { MASTER_META, SALON, priceLabel, rangeLabel } from "@/lib/content";
import { DIRECTIONS } from "@/lib/pricing";
import { isClosed, slotsFor, ymd } from "@/lib/slots";

export function icsFile(opts: {
  date: Date;
  time: string;
  minutes: number;
  summary: string;
  description: string;
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
    "PRODID:-//ONDE Salon//BG//",
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
    `UID:${Date.now()}@onde.bg`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=Europe/Sofia:${stamp(startMin)}`,
    `DTEND;TZID=Europe/Sofia:${stamp(endMin)}`,
    `SUMMARY:${opts.summary}`,
    `DESCRIPTION:${opts.description}\\n${opts.phoneLabel}: ${SALON.phone}`,
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
  const [direction, setDirection] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [master, setMaster] = useState(-1);
  const [dayIndex, setDayIndex] = useState(0);
  // Whether the visitor has picked a day themselves. Once they have, the
  // choice stands: only a day with nothing free at all is overridden.
  const [dayPicked, setDayPicked] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => setMounted(true), []);

  // The price list hands the choice over rather than making it a second time.
  useEffect(() => {
    const onPick = (e: Event) => {
      const detail = (e as CustomEvent<{ direction: number; keys: string[] }>).detail;
      if (detail?.keys?.length) {
        setDirection(detail.direction);
        setPicked(detail.keys);
        setMaster(-1);
        setDir(1);
        setStep(1);
      }
    };
    // "Book with Irina" from the team section: the person is already chosen,
    // so booking opens on the service step with her diary already attached.
    const onMaster = (e: Event) => {
      const detail = (e as CustomEvent<{ master: number; direction: number }>).detail;
      if (detail && detail.master >= 0) {
        setDirection(detail.direction);
        setMaster(detail.master);
        setPicked([]);
        setDir(1);
        setStep(0);
      }
    };
    window.addEventListener("onde:select", onPick);
    window.addEventListener("onde:master", onMaster);
    return () => {
      window.removeEventListener("onde:select", onPick);
      window.removeEventListener("onde:master", onMaster);
    };
  }, []);

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /** Only the masters who actually work this direction. */
  const crew = useMemo(
    () =>
      MASTER_META.map((m, i) => ({ index: i, ...m })).filter((m) =>
        (m.directions as readonly string[]).includes(DIRECTIONS[direction].slug)
      ),
    [direction]
  );

  const day = days[dayIndex];
  const slots = useMemo(
    () => (day ? slotsFor(day, master < 0 ? undefined : master) : []),
    [day, master]
  );

  // Land on the first day this master still has room, and drop a time that the
  // chosen master cannot actually take.
  useEffect(() => {
    if (!mounted) return;
    const pick = master < 0 ? undefined : master;
    const free = (d: Date) => slotsFor(d, pick).filter((s) => s.free).length;
    // Prefer a day that still offers a choice. Late in the afternoon today can
    // be down to its last hour, and opening on it makes a working salon look
    // shut; a day with one hour left is only used if nothing better exists.
    const any = days.findIndex((d) => free(d) >= 1);
    const roomy = days.findIndex((d) => free(d) >= 2);
    const want = dayPicked ? 1 : 2;
    const first = want === 2 && roomy >= 0 ? roomy : any;
    if (first >= 0 && free(days[dayIndex]) < want && free(days[first]) > free(days[dayIndex])) {
      setDayIndex(first);
    }
    setTime((current) =>
      current && slotsFor(days[dayIndex], pick).some((s) => s.free && s.time === current)
        ? current
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, master, dayIndex, days, dayPicked]);

  // Changing direction can strand a master who does not work it.
  useEffect(() => {
    if (master >= 0 && !crew.some((m) => m.index === master)) setMaster(-1);
  }, [crew, master]);

  const chosen = DIRECTIONS[direction].items
    .map((item, ii) => ({
      ...item,
      key: `${DIRECTIONS[direction].slug}/${item.slug}`,
      title: t.directions.items[direction].prices[ii].title,
    }))
    .filter((s) => picked.includes(s.key));

  const totalFrom = chosen.reduce((a, s) => a + s.from, 0);
  const totalTo = chosen.reduce((a, s) => a + (s.to ?? s.from), 0);
  const totalMin = chosen.reduce((a, s) => a + s.duration, 0) || 30;
  const price =
    totalFrom === totalTo ? priceLabel(totalFrom, lang) : rangeLabel(totalFrom, totalTo, lang);

  const masterName = master < 0 ? b.anyMaster : t.team.members[master].name;

  const canNext = [picked.length > 0, true, !!time, name.trim().length > 1 && phone.trim().length > 5][
    step
  ];

  const download = () => {
    const blob = new Blob(
      [
        icsFile({
          date: day,
          time: time!,
          minutes: totalMin,
          summary: b.icsSummary(chosen.map((c) => c.title).join(", ")),
          description: `${masterName} · ${chosen.map((c) => c.title).join(", ")}`,
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
    a.download = "onde.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepStyle = { ["--from" as string]: dir === 1 ? "28px" : "-28px" } as React.CSSProperties;
  const dayLabel = (d: Date) => `${b.weekdays[d.getDay()]}, ${d.getDate()} ${b.months[d.getMonth()]}`;

  return (
    <section id="chas" className="cursor-glow ondes relative overflow-hidden border-b border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <span className="eyebrow">{b.eyebrow}</span>
          <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">{b.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] font-light leading-relaxed text-muted">
            {b.lead}
          </p>
        </div>

        <div className="reveal mt-14 overflow-hidden rounded-2xl border border-line bg-ink-2">
          {!done && (
            <div className="flex border-b border-line">
              {b.steps.map((s, i) => (
                <div
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-2.5 px-2 py-4 text-[13px] font-light transition ${
                    i === step ? "bg-ink-3 text-accent" : i < step ? "text-bone" : "text-muted/50"
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] ${
                      i <= step ? "bg-accent text-ink" : "border border-line"
                    }`}
                  >
                    {i < step ? <Icon name="check" className="size-2.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-10 md:min-h-[32rem]">
            {done ? (
              <div className="pop-in text-center">
                <span className="check-ring mx-auto grid size-20 place-items-center rounded-full border border-accent text-accent">
                  <svg viewBox="0 0 48 48" className="size-10" fill="none" aria-hidden="true">
                    <path
                      className="check-path"
                      d="m13 25 8 8 15-17"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="display mt-8 text-3xl text-bone">{b.doneTitle}</h3>
                <p className="mt-3 font-light text-muted">{b.doneLead(phone)}</p>

                <div className="mx-auto mt-10 max-w-md rounded-2xl border border-line bg-ink p-6 text-left">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      {b.cardTitle}
                    </span>
                    <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-ink">
                      {b.confirmed}
                    </span>
                  </div>
                  <dl className="mt-5 space-y-3.5 text-[14px] font-light">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">{b.when}</dt>
                      <dd className="text-right text-bone">
                        {dayLabel(day)} · {time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">{b.master}</dt>
                      <dd className="text-right text-bone">{masterName}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">{b.servicesLabel}</dt>
                      <dd className="text-right text-bone">{chosen.map((c) => c.title).join(", ")}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-line pt-3.5">
                      <dt className="text-muted">{b.approx}</dt>
                      <dd className="text-right">
                        <span className="display text-lg text-bone">{price.eur}</span>
                        <span className="ml-2 text-[12px] text-muted">{price.bgn}</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={download}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-bone px-7 py-3.5 text-[15px] font-medium text-ink transition hover:bg-accent-soft"
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
                      setMaster(-1);
                      setName("");
                      setPhone("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 text-[15px] font-light text-bone transition hover:border-accent hover:text-accent"
                  >
                    {b.newBooking}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div key="s0" className="step-in" style={stepStyle}>
                    <h3 className="display text-2xl text-bone">{b.q1}</h3>
                    <p className="mt-2 text-[14px] font-light text-muted">{b.q1sub}</p>

                    <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {DIRECTIONS.map((d, di) => (
                        <button
                          key={d.slug}
                          onClick={() => {
                            setDirection(di);
                            setPicked([]);
                            setMaster(-1);
                          }}
                          className={`rounded-xl border px-3 py-4 text-center transition ${
                            direction === di
                              ? "border-accent bg-ink-3 text-accent"
                              : "border-line text-muted hover:border-accent/50"
                          }`}
                        >
                          <Icon name={d.icon} className="mx-auto size-5" />
                          <span className="mt-2.5 block text-[14px] font-light">
                            {t.directions.items[di].title}
                          </span>
                        </button>
                      ))}
                    </div>

                    <ul className="mt-8 divide-y divide-line border-y border-line">
                      {DIRECTIONS[direction].items.map((item, ii) => {
                        const key = `${DIRECTIONS[direction].slug}/${item.slug}`;
                        const copy = t.directions.items[direction].prices[ii];
                        const p = rangeLabel(item.from, item.to, lang);
                        const on = picked.includes(key);
                        return (
                          <li key={key}>
                            <button
                              onClick={() =>
                                setPicked((v) =>
                                  v.includes(key) ? v.filter((x) => x !== key) : [...v, key]
                                )
                              }
                              className="group flex w-full items-center gap-4 py-4 text-left"
                            >
                              <span
                                className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
                                  on
                                    ? "border-accent bg-accent text-ink"
                                    : "border-line text-transparent group-hover:border-accent"
                                }`}
                              >
                                <Icon name="check" className="size-2.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className={`block text-[15px] font-light ${on ? "text-accent-soft" : "text-bone"}`}>
                                  {copy.title}
                                </span>
                                <span className="text-[12px] font-light text-muted">
                                  ~{item.duration} {t.directions.min}
                                </span>
                              </span>
                              <span className="display shrink-0 text-[17px] text-bone">{p.eur}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {step === 1 && (
                  <div key="s1" className="step-in" style={stepStyle}>
                    <h3 className="display text-2xl text-bone">{b.q2}</h3>
                    <p className="mt-2 text-[14px] font-light text-muted">{b.q2sub}</p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setMaster(-1)}
                        className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                          master === -1 ? "border-accent bg-ink-3" : "border-line hover:border-accent/50"
                        }`}
                      >
                        <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line text-muted">
                          <Icon name="user" className="size-5" />
                        </span>
                        <span>
                          <span className={`block text-[15px] font-light ${master === -1 ? "text-accent" : "text-bone"}`}>
                            {b.anyMaster}
                          </span>
                          <span className="text-[12px] font-light text-muted">
                            {t.directions.items[direction].title}
                          </span>
                        </span>
                      </button>

                      {crew.map((m) => {
                        const member = t.team.members[m.index];
                        const on = master === m.index;
                        return (
                          <button
                            key={m.index}
                            onClick={() => setMaster(m.index)}
                            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                              on ? "border-accent bg-ink-3" : "border-line hover:border-accent/50"
                            }`}
                          >
                            <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
                              <Photo
                                src={m.photo}
                                alt={member.name}
                                sizes="56px"
                                label={member.name}
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className={`block text-[15px] font-light ${on ? "text-accent" : "text-bone"}`}>
                                {member.name}
                              </span>
                              <span className="block truncate text-[12px] font-light text-muted">
                                {member.role}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {master >= 0 && (
                      <p className="mt-6 text-[13px] font-light text-muted">
                        {b.masterHint(t.team.members[master].name)}
                      </p>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div key="s2" className="step-in" style={stepStyle}>
                    <h3 className="display text-2xl text-bone">{b.q3}</h3>

                    {!mounted ? (
                      <div className="mt-7 h-24 animate-pulse rounded-xl bg-ink-3" />
                    ) : (
                      <>
                        <div className="no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-2">
                          {days.map((d, i) => {
                            const closed = isClosed(d);
                            return (
                              <button
                                key={i}
                                disabled={closed}
                                onClick={() => {
                                  setDayIndex(i);
                                  setDayPicked(true);
                                  setTime(null);
                                }}
                                className={`min-w-[5.2rem] shrink-0 rounded-xl border px-3 py-3 text-center transition ${
                                  closed
                                    ? "cursor-not-allowed border-transparent bg-ink-3/40 text-muted/30"
                                    : i === dayIndex
                                      ? "border-accent bg-ink-3 text-accent"
                                      : "border-line text-bone hover:border-accent/50"
                                }`}
                              >
                                <span className="block text-[10px] uppercase tracking-[0.14em] opacity-70">
                                  {i === 0 ? t.hero.today : i === 1 ? t.hero.tomorrow : b.weekdays[d.getDay()]}
                                </span>
                                <span className="display mt-1 block text-xl">{d.getDate()}</span>
                                <span className="block text-[10px] opacity-60">
                                  {b.months[d.getMonth()].slice(0, 3)}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {day && isClosed(day) ? (
                          <p className="mt-7 rounded-xl border border-line bg-ink px-5 py-4 text-[14px] font-light text-muted">
                            {b.closedDay}
                          </p>
                        ) : (
                          <>
                            {slots.every((s) => !s.free) && (
                              <p className="mt-7 rounded-xl border border-line bg-ink px-5 py-4 text-[14px] font-light text-muted">
                                {b.noSlots}
                              </p>
                            )}
                            <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-5">
                              {slots.map((s) => (
                                <button
                                  key={s.time}
                                  disabled={!s.free}
                                  onClick={() => setTime(s.time)}
                                  className={`rounded-lg border py-3 text-[14px] font-light transition ${
                                    time === s.time
                                      ? "border-accent bg-accent text-ink"
                                      : s.free
                                        ? "border-line text-bone hover:border-accent hover:text-accent"
                                        : "cursor-not-allowed border-transparent bg-ink-3/50 text-muted/25 line-through"
                                  }`}
                                >
                                  {s.time}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div key="s3" className="step-in" style={stepStyle}>
                    <h3 className="display text-2xl text-bone">{b.q4}</h3>
                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                          {b.yourName}
                        </span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={b.namePlaceholder}
                          className="mt-2.5 w-full rounded-xl border border-line bg-ink px-5 py-4 text-[16px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                          {b.phone}
                        </span>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder={b.phonePlaceholder}
                          className="mt-2.5 w-full rounded-xl border border-line bg-ink px-5 py-4 text-[16px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
                        />
                      </label>
                    </div>

                    <div className="mt-7 rounded-xl border border-line bg-ink p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="text-[14px] font-light text-muted">
                          {day && (
                            <>
                              {dayLabel(day)} · <span className="text-bone">{time}</span> ·{" "}
                              {masterName} · {chosen.map((c) => c.title).join(", ")}
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="display text-2xl text-bone">{price.eur}</div>
                          <div className="text-[12px] font-light text-muted">{price.bgn}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-7">
                  <button
                    onClick={() => {
                      setDir(-1);
                      setStep((s) => Math.max(0, s - 1));
                    }}
                    className={`rounded-full px-5 py-3 text-[14px] font-light text-muted transition hover:text-bone ${
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
                    className="magnetic sweep on-light inline-flex items-center gap-2 rounded-full bg-bone px-8 py-3.5 text-[15px] font-medium text-ink transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:bg-ink-3 disabled:text-muted/40"
                  >
                    {step === 3 ? b.confirm : b.next}
                    <Icon name="arrow" className="size-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="reveal mt-8 text-center text-[13px] font-light text-muted">
          {b.phonePrefer}{" "}
          <a href={`tel:${SALON.phoneHref}`} className="text-accent underline underline-offset-4">
            {SALON.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
