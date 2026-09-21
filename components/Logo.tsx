type Props = {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  name?: string;
  sub?: string;
};

/** Paw whose central pad is a heart, cut by a pulse line — vet + care in one mark. */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lapa-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity=".78" />
        </linearGradient>
      </defs>
      <g fill="url(#lapa-mark)">
        <ellipse cx="13.6" cy="17.4" rx="4.1" ry="5.4" transform="rotate(-16 13.6 17.4)" />
        <ellipse cx="24" cy="13.2" rx="4.2" ry="5.8" />
        <ellipse cx="34.4" cy="17.4" rx="4.1" ry="5.4" transform="rotate(16 34.4 17.4)" />
      </g>
      <path
        fill="url(#lapa-mark)"
        d="M24 24.4c-5.9 0-10.7 4.3-10.7 9.3 0 3.7 2.8 6.2 7.1 6.2h7.2c4.3 0 7.1-2.5 7.1-6.2 0-5-4.8-9.3-10.7-9.3Z"
      />
      <path
        d="M14.6 33.2h4.3l2-4.1 2.8 8 2.5-5.3 1.5 2.2h5.7"
        fill="none"
        stroke="var(--logo-pulse, #faf6f0)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  className = "",
  tone = "dark",
  compact = false,
  name = "Лапа",
  sub = "Ветеринарна клиника",
}: Props) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-[0.95rem] transition ${
          light ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-brand text-white"
        }`}
        style={{ ["--logo-pulse" as string]: light ? "#0c2b26" : "#faf6f0" }}
      >
        <LogoMark className="size-7" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block text-[1.35rem] font-extrabold tracking-[-0.03em] ${
              light ? "text-white" : "text-ink"
            }`}
          >
            {name}
          </span>
          <span
            className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] ${
              light ? "text-white/50" : "text-ink-soft"
            }`}
          >
            {sub}
          </span>
        </span>
      )}
    </span>
  );
}
