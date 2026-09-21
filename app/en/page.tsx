import type { Metadata } from "next";
import Faces from "@/components/Faces";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "ONDÉ — a beauty salon of five, Sofia",
  description:
    "Five stylists on Shishman Street. Pick the person, see their work and their prices, and book their own hours online.",
  alternates: { canonical: "/en", languages: { bg: "/", en: "/en" } },
  robots: { index: false, follow: false },
};

export default function HomeEn() {
  return (
    <Shell lang="en" page={{ kind: "home" }}>
      <Faces />
    </Shell>
  );
}
