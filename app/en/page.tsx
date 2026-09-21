import type { Metadata } from "next";
import Site from "@/components/Site";

export const metadata: Metadata = {
  title: "Lapa Veterinary Clinic — Sofia, Lozenets",
  description:
    "Veterinary clinic and pet shop in Sofia. Book online in under a minute, transparent prices, emergency care 24/7.",
  alternates: { canonical: "/en", languages: { bg: "/", en: "/en" } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Lapa Veterinary Clinic — Sofia",
    description: "Book online in under a minute. Transparent prices, emergency care 24/7, pet shop on site.",
    siteName: "Lapa Veterinary Clinic",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Lapa Veterinary Clinic" }],
  },
  robots: { index: false, follow: false },
};

export default function HomeEn() {
  return <Site lang="en" />;
}
