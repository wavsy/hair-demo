import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Салонът — ONDÉ",
  description: "ул. „Шишман“ 18, София. Работно време, телефон и карта.",
  alternates: { canonical: "/salona", languages: { bg: "/salona", en: "/en/the-salon" } },
  robots: { index: false, follow: false },
};

export default function SalonPage() {
  return (
    <Shell lang="bg" page={{ kind: "contact" }}>
      <Contact />
    </Shell>
  );
}
