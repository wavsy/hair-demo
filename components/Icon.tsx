type IconProps = { name: string; className?: string };

const P: Record<string, React.ReactNode> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <path d="M8.3 7.6 20 18M8.3 16.4 20 6" />
    </>
  ),
  drop: (
    <>
      <path d="M12 3.5c3.6 4.2 6 7.2 6 10a6 6 0 0 1-12 0c0-2.8 2.4-5.8 6-10Z" />
      <path d="M9.4 13.8a2.8 2.8 0 0 0 2.6 3.4" />
    </>
  ),
  nail: (
    <>
      <path d="M8.4 9.3C8.4 5.8 9.8 3 12 3s3.6 2.8 3.6 6.3v7.4c0 2.4-1.5 4.3-3.6 4.3s-3.6-1.9-3.6-4.3V9.3Z" />
      <path d="M8.6 12.6h6.8" />
    </>
  ),
  face: (
    <>
      <path d="M5 11a7 7 0 0 1 14 0v1.5a7 7 0 0 1-7 7 7 7 0 0 1-7-7V11Z" />
      <path d="M9.4 11v1.2M14.6 11v1.2" />
      <path d="M10.3 15.4a2.6 2.6 0 0 0 3.4 0" />
      <path d="M4.6 8.6C6.5 5.4 9 3.8 12 3.8s5.5 1.6 7.4 4.8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5a1 1 0 0 1 .7.3l7.5 7.5a1 1 0 0 1 0 1.4l-8.5 8.5a1 1 0 0 1-1.4 0L3.3 13.2a1 1 0 0 1-.3-.7Z" />
      <circle cx="8" cy="8" r="1.6" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </>
  ),
  cap: (
    <>
      <path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z" />
      <path d="M6.8 10.8V16c0 1.4 2.3 2.6 5.2 2.6s5.2-1.2 5.2-2.6v-5.2" />
      <path d="M21 8.5V14" />
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
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 9.5l6.1-.9L12 3Z" />,
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
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  wave: <path d="M3 12c2.2-3 4.5-3 6.7 0s4.5 3 6.7 0 4.5-3 6.6 0" />,
  sparkle: (
    <>
      <path d="M12 3.5 13.6 9l5.5 1.6-5.5 1.6L12 17.7l-1.6-5.5L4.9 10.6 10.4 9 12 3.5Z" />
      <path d="M18.5 16.5 19.2 19l2.5.7-2.5.7-.7 2.5-.7-2.5-2.5-.7 2.5-.7.7-2.5Z" />
    </>
  ),
};

export default function Icon({ name, className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name] ?? P.wave}
    </svg>
  );
}
