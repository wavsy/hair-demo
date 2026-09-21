import type { Metadata } from "next";
import Site from "@/components/Site";

export const metadata: Metadata = {
  title: "ONDÉ — beauty salon in Sofia",
  description:
    "Beauty salon in Sofia. Hair, colour, nails and skin. Book with the stylist you choose, online, in under a minute.",
  alternates: { canonical: "/en", languages: { bg: "/", en: "/en" } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "ONDÉ — beauty salon in Sofia",
    description: "Hair, colour, nails and skin. Pick your stylist, see the price, book online.",
    siteName: "ONDÉ",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ONDÉ" }],
  },
  robots: { index: false, follow: false },
};

export default function HomeEn() {
  return <Site lang="en" />;
}
