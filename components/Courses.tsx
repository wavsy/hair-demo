"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import Photo from "./Photo";
import { icsFile } from "./Booking";
import { useI18n } from "./I18n";
import { MASTER_META, priceLabel } from "@/lib/content";
import { COURSES } from "@/lib/pricing";
import { intakesFor } from "@/lib/courses";

/**
 * Decision three: the courses are a selling page of their own, not a bullet
 * under "services" — programme, dates, places left and enrolment online. The
 * school we measured against takes 2 550 € and books only by telephone.
 */
export default function Courses() {
  const { t, lang } = useI18n();
  const c = t.courses;

  const [mounted, setMounted] = useState(false);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrolled, setEnrolled] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => setMounted(true), []);

  // Intakes are derived from today, so a stale date can never be shown.
  const intakes = useMemo(
    () => (mounted ? COURSES.map((_, i) => intakesFor(i, 3)) : COURSES.map(() => [])),
    [mounted]
  );

  const teacherFor = (courseIndex: number) =>
    MASTER_META.findIndex((m) => m.course === courseIndex);

  const dateLabel = (d: Date) =>
    `${d.getDate()} ${t.booking.months[d.getMonth()]} ${d.getFullYear()}`;

  const download = (courseIndex: number, date: Date) => {
    const blob = new Blob(
      [
        icsFile({
          date,
          time: "10:00",
          minutes: 180,
          summary: c.icsSummary(c.items[courseIndex].title),
          description: `${c.items[courseIndex].title} · ${t.address}`,
          phoneLabel: t.booking.icsPhone,
          alarm: c.icsSummary(c.items[courseIndex].title),
          location: t.address,
        }),
      ],
      { type: "text/calendar;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onde-kurs.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const canSend = name.trim().length > 1 && phone.trim().length > 5;

  return (
    <section id="kursove" className="border-b border-line bg-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-3xl">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
            {c.title1}
            <br />
            <span className="italic text-accent-soft">{c.title2}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-muted">{c.lead}</p>
        </div>

        <div className="mt-16 space-y-6">
          {c.items.map((item, ci) => {
            const meta = COURSES[ci];
            const teacher = teacherFor(ci);
            const price = priceLabel(meta.price, lang);
            const list = intakes[ci];
            const open = list.find((i) => i.left > 0) ?? null;

            return (
              <article
                key={item.title}
                className="reveal grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-[1.4fr_1fr]"
              >
                <div className="bg-ink p-7 sm:p-10">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="display text-3xl text-bone sm:text-4xl">{item.title}</h3>
                    {meta.hours && (
                      <span className="text-[12px] uppercase tracking-[0.16em] text-accent">
                        {meta.hours} {c.hours}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-muted">
                    {item.blurb}
                  </p>

                  <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                        {c.forWhom}
                      </dt>
                      <dd className="mt-2 text-[14px] font-light text-bone">{item.forWhom}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                        {c.certificate}
                      </dt>
                      <dd className="mt-2 text-[14px] font-light text-bone">{item.certificate}</dd>
                    </div>
                  </dl>

                  <div className="mt-8">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                      {c.programme}
                    </span>
                    <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {item.modules.map((mod, mi) => (
                        <li key={mod} className="flex gap-3 text-[14px] font-light text-muted">
                          <span className="display shrink-0 text-accent">{mi + 1}</span>
                          {mod}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {meta.practice && meta.theory && (
                    <p className="mt-7 border-t border-line pt-5 text-[13px] font-light text-muted/80">
                      {meta.practice} {c.hours} {c.practice} · {meta.theory} {c.hours} {c.theory}
                    </p>
                  )}
                </div>

                <div className="flex flex-col bg-ink-3 p-7 sm:p-10">
                  {teacher >= 0 && (
                    <div className="flex items-center gap-4 border-b border-line pb-6">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
                        <Photo
                          src={MASTER_META[teacher].photo}
                          alt={t.team.members[teacher].name}
                          sizes="48px"
                          label={t.team.members[teacher].name}
                          className="object-cover grayscale"
                        />
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted/70">
                          {c.leadBy}
                        </span>
                        <span className="mt-1 block text-[15px] font-light text-bone">
                          {t.team.members[teacher].name}
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="border-b border-line py-6">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                      {c.price}
                    </span>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="display text-4xl text-bone">{price.eur}</span>
                      <span className="text-[13px] font-light text-muted">{price.bgn}</span>
                    </div>
                  </div>

                  {enrolled === ci ? (
                    <div className="pop-in flex-1 py-8 text-center">
                      <span className="check-ring mx-auto grid size-14 place-items-center rounded-full border border-accent text-accent">
                        <svg viewBox="0 0 48 48" className="size-7" fill="none" aria-hidden="true">
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
                      <h4 className="display mt-5 text-2xl text-bone">{c.doneTitle}</h4>
                      <p className="mt-2 text-[14px] font-light text-muted">{c.doneLead(phone)}</p>
                      {open && (
                        <button
                          onClick={() => download(ci, open.date)}
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[13px] font-light text-bone transition hover:border-accent hover:text-accent"
                        >
                          <Icon name="calendar" className="size-4" />
                          {c.addCalendar}
                        </button>
                      )}
                    </div>
                  ) : enrolling === ci ? (
                    <div className="step-in flex-1 py-6">
                      <h4 className="text-[15px] font-light text-bone">
                        {c.enrollTitle(item.title)}
                      </h4>
                      {open && (
                        <p className="mt-2 text-[13px] font-light leading-relaxed text-muted">
                          {c.enrollLead(dateLabel(open.date))}
                        </p>
                      )}
                      <div className="mt-5 space-y-3">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.booking.namePlaceholder}
                          aria-label={t.booking.yourName}
                          className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-[15px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
                        />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder={t.booking.phonePlaceholder}
                          aria-label={t.booking.phone}
                          className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-[15px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
                        />
                      </div>
                      <div className="mt-5 flex gap-2">
                        <button
                          disabled={!canSend}
                          onClick={() => setEnrolled(ci)}
                          className="flex-1 rounded-full bg-bone px-5 py-3.5 text-[14px] font-medium text-ink transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:bg-ink-2 disabled:text-muted/40"
                        >
                          {c.enroll}
                        </button>
                        <button
                          onClick={() => setEnrolling(null)}
                          className="rounded-full border border-line px-5 py-3.5 text-[14px] font-light text-muted transition hover:text-bone"
                        >
                          {c.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 py-6">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                          {c.nextIntake}
                        </span>
                        <ul className="mt-4 space-y-3" suppressHydrationWarning>
                          {!mounted ? (
                            <li className="h-6 animate-pulse rounded bg-ink-2" />
                          ) : (
                            list.map((intake) => (
                              <li
                                key={intake.date.toISOString()}
                                className="flex items-baseline justify-between gap-4 text-[14px] font-light"
                              >
                                <span className="text-bone">{dateLabel(intake.date)}</span>
                                <span
                                  className={intake.left > 0 ? "text-accent" : "text-muted/50"}
                                >
                                  {intake.left > 0 ? c.seatsLeft(intake.left) : c.soldOut}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      <button
                        disabled={mounted && !open}
                        onClick={() => {
                          setEnrolling(ci);
                          setEnrolled(null);
                        }}
                        className="magnetic sweep on-light inline-flex items-center justify-center gap-2 rounded-full bg-bone px-6 py-3.5 text-[15px] font-medium text-ink transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:bg-ink-2 disabled:text-muted/40"
                      >
                        {mounted && !open ? c.soldOut : c.enroll}
                        <Icon name="arrow" className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl text-[13px] font-light leading-relaxed text-muted/70">
          {c.note}
        </p>
      </div>
    </section>
  );
}
