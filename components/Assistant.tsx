"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { LogoMark } from "./Logo";
import { useI18n } from "./I18n";
import Typewriter from "./Typewriter";
import { answer, type Answer } from "@/lib/assistant";

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  actions?: Answer["actions"];
  /** Older messages are already on screen and must not retype themselves. */
  settled?: boolean;
};

let seq = 0;

export default function Assistant() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Greeting is rebuilt when the language changes, so the panel is never mixed.
  useEffect(() => {
    setMsgs([{ id: ++seq, from: "bot", text: t.assistant.greeting, settled: true }]);
  }, [t]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const settle = (id: number) =>
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, settled: true } : x)));

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    setInput("");
    setMsgs((m) => [...m, { id: ++seq, from: "user", text: q }]);
    setThinking(true);

    const a = answer(q, t, lang);
    const delay = 420 + Math.min(900, a.text.length * 4);
    setTimeout(() => {
      setThinking(false);
      const id = ++seq;
      setMsgs((m) => [...m, { id, from: "bot", text: a.text, actions: a.actions }]);
      setTimeout(() => settle(id), 120 + a.text.length * 1.2);
    }, delay);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group fixed bottom-24 right-4 z-[55] flex items-center gap-0 rounded-full border border-line bg-ink-2 p-3 text-[14px] font-light text-bone shadow-lift transition-all duration-300 hover:gap-2.5 hover:border-accent focus-visible:gap-2.5 md:bottom-6 ${
          open ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label={t.assistant.open}
      >
        <span className="relative grid size-8 place-items-center rounded-full bg-ink-3 text-accent">
          <LogoMark className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent ring-2 ring-ink-2 dot-live" />
        </span>
        {/* Closed, this stays a circle that fits the page gutter — a wide pill
            parked here lands on whatever control happens to be in the corner.
            The word appears when the visitor reaches for it. */}
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[10rem] group-hover:pr-1.5 group-focus-visible:max-w-[10rem] group-focus-visible:pr-1.5 md:inline">
          {t.assistant.open}
        </span>
      </button>

      <div
        className={`fixed inset-x-3 bottom-3 z-[56] origin-bottom-right transition-all duration-300 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[25rem] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex h-[min(34rem,80vh)] flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-lift">
          <div className="flex items-center gap-3 border-b border-line bg-ink px-5 py-4 text-bone">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-accent">
              <LogoMark className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-light leading-tight">{t.assistant.title}</div>
              <div className="flex items-center gap-1.5 text-[12px] font-light text-muted">
                <span className="size-1.5 rounded-full bg-accent dot-live" />
                {t.assistant.subtitle}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-full text-muted transition hover:text-bone"
              aria-label={t.nav.close}
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-ink px-4 py-4">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`pop-in flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14px] font-light leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-md bg-accent text-ink"
                      : "rounded-bl-md border border-line bg-ink-2 text-bone"
                  }`}
                >
                  {m.from === "bot" && !m.settled ? (
                    <Typewriter
                      text={m.text}
                      onTick={() =>
                        listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
                      }
                    />
                  ) : (
                    m.text
                  )}
                  {m.actions && (
                    <div
                      className={`mt-3 flex flex-wrap gap-2 transition-opacity duration-500 ${
                        m.from === "bot" && !m.settled ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {m.actions.map((a) => (
                        <a
                          key={a.label + a.href}
                          href={a.href}
                          onClick={() => a.href.startsWith("#") && setOpen(false)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13px] font-light text-accent transition hover:border-accent"
                        >
                          {a.label}
                          <Icon name="arrow" className="size-3.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-ink-2 px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 rounded-full bg-accent/60 dot-live"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-ink-2 px-4 pb-3 pt-3">
            <div className="no-scrollbar -mx-1 mb-2.5 flex gap-2 overflow-x-auto px-1">
              {t.assistant.chips.map((c) => (
                <button
                  key={c}
                  onClick={() => ask(c)}
                  className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-light text-muted transition hover:border-accent hover:text-accent"
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                className="min-w-0 flex-1 rounded-full border border-line bg-ink px-4 py-3 text-[14px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-bone text-ink transition hover:bg-accent-soft disabled:bg-ink-3 disabled:text-muted/40"
                aria-label={t.assistant.send}
              >
                <Icon name="arrow" className="size-5" />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] font-light leading-snug text-muted/60">
              {t.assistant.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
