import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vet-lapa.vercel.app"),
  title: {
    default: "Ветеринарна клиника Лапа — София, Лозенец",
    template: "%s · Ветеринарна клиника Лапа",
  },
  description:
    "Ветеринарна клиника и зоомагазин в София. Запишете час онлайн за минута, прозрачни цени, спешен прием 24/7.",
  keywords: [
    "ветеринарна клиника София",
    "ветеринар Лозенец",
    "спешен ветеринар София",
    "ваксинация куче",
    "кастрация котка цена",
  ],
  openGraph: {
    type: "website",
    locale: "bg_BG",
    title: "Ветеринарна клиника Лапа — София",
    description:
      "Запишете час онлайн за минута. Прозрачни цени, спешен прием 24/7, зоомагазин на място.",
    siteName: "Ветеринарна клиника Лапа",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Ветеринарна клиника Лапа" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ветеринарна клиника Лапа — София",
    description: "Запишете час онлайн за минута. Прозрачни цени, спешен прием 24/7.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/", languages: { bg: "/", en: "/en" } },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg" className={`${onest.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
