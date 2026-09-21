type Props = {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  name?: string;
  sub?: string;
};

/** Three waves — "ondé" is French for wavy, and the mark says it without a word. */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M4 10c2.6-3.2 5.2-3.2 7.8 0s5.2 3.2 7.8 0 5.2-3.2 7.8 0" opacity=".55" />
        <path d="M4 16c2.6-3.2 5.2-3.2 7.8 0s5.2 3.2 7.8 0 5.2-3.2 7.8 0" />
        <path d="M4 22c2.6-3.2 5.2-3.2 7.8 0s5.2 3.2 7.8 0 5.2-3.2 7.8 0" opacity=".55" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  tone = "light",
  compact = false,
  name = "ONDÉ",
  sub = "Салон за красота",
}: Props) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className={`shrink-0 ${light ? "text-accent" : "text-accent"}`}>
        <LogoMark className="size-8" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block text-[1.5rem] font-light tracking-[0.18em] ${
              light ? "text-bone" : "text-ink"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </span>
          <span
            // Hidden on a narrow screen: at 390px it wraps onto two lines and
            // walks into the navigation.
            className={`mt-1.5 hidden text-[9px] font-medium uppercase tracking-[0.26em] sm:block ${
              light ? "text-muted" : "text-ink/55"
            }`}
          >
            {sub}
          </span>
        </span>
      )}
    </span>
  );
}
