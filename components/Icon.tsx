type IconProps = { name: string; className?: string };

const P: Record<string, React.ReactNode> = {
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M4 3h3M13 3h3" />
      <path d="M10 12v3a5 5 0 0 0 10 0v-1" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  syringe: (
    <>
      <path d="m14 4 6 6" />
      <path d="m17.5 6.5 2.5-2.5" />
      <path d="M13 5 5.5 12.5a2 2 0 0 0 0 2.8l2.2 2.2a2 2 0 0 0 2.8 0L18 10" />
      <path d="m7 15-3 3v2h2l3-3" />
      <path d="m11 9 1.5 1.5M14 6l1.5 1.5" />
    </>
  ),
  tooth: (
    <>
      <path d="M12 6c-1.5-1.3-3-2-4.6-2C5 4 3.5 6 3.5 8.6c0 2 .7 3.4 1.3 5.6.5 1.9.5 5.8 2.2 5.8 1.5 0 1.6-3.4 2.6-5.3.5-1 1-1.4 2.4-1.4s1.9.4 2.4 1.4c1 1.9 1.1 5.3 2.6 5.3 1.7 0 1.7-3.9 2.2-5.8.6-2.2 1.3-3.6 1.3-5.6C20.5 6 19 4 16.6 4 15 4 13.5 4.7 12 6Z" />
    </>
  ),
  scan: (
    <>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
      <path d="M7 12h2l1.5-3 2 6 1.5-3h3" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6.5L5.3 17a2 2 0 0 0 1.7 3h10a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  scalpel: (
    <>
      <path d="M4 20 14 10l6-6 0 4-9 9-7 3Z" />
      <path d="m9.5 14.5 2 2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  phone: (
    <>
      <path d="M7 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2.2 2C10.6 18.4 5.6 13.4 5 5.2A2 2 0 0 1 7 3Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
      <path d="M10.5 19a2 2 0 0 0 3 0" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5a1 1 0 0 1 .7.3l7.5 7.5a1 1 0 0 1 0 1.4l-8.5 8.5a1 1 0 0 1-1.4 0L3.3 13.2a1 1 0 0 1-.3-.7Z" />
      <circle cx="8" cy="8" r="1.6" />
    </>
  ),
  star: (
    <>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 9.5l6.1-.9L12 3Z" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="7" cy="9" rx="2" ry="2.6" />
      <ellipse cx="12" cy="7" rx="2" ry="2.8" />
      <ellipse cx="17" cy="9" rx="2" ry="2.6" />
      <path d="M12 12c-2.8 0-5 2-5 4.3C7 18.4 8.6 20 11 20h2c2.4 0 4-1.6 4-3.7 0-2.3-2.2-4.3-5-4.3Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 10v4.5M12 17.4v.2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L20 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2.5" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
};

export default function Icon({ name, className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name] ?? P.paw}
    </svg>
  );
}
