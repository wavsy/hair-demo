import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://onde-salon.vercel.app"),
  title: {
    default: "ONDÉ — салон за красота в София",
    template: "%s · ONDÉ",
  },
  description:
    "Салон за красота в София. Коса, цвят, нокти и лице. Записвате час при избрания от вас майстор онлайн, за под минута.",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    title: "ONDÉ — салон за красота в София",
    description:
      "Коса, цвят, нокти и лице. Избирате майстора, виждате цената и запазвате часа онлайн.",
    siteName: "ONDÉ",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ONDÉ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONDÉ — салон за красота в София",
    description: "Коса, цвят, нокти и лице. Избирате майстора и запазвате часа онлайн.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/", languages: { bg: "/", en: "/en" } },
  // The salon is invented, so it must never turn up in a search result.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
