import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "The salon — ONDÉ",
  description: "18 Shishman Street, Sofia. Opening hours, phone and map.",
  alternates: { canonical: "/en/the-salon", languages: { bg: "/salona", en: "/en/the-salon" } },
  robots: { index: false, follow: false },
};

export default function SalonPageEn() {
  return (
    <Shell lang="en" page={{ kind: "contact" }}>
      <Contact />
    </Shell>
  );
}
