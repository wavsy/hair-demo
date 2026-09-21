import type { Metadata } from "next";
import Courses from "@/components/Courses";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Courses — ONDÉ",
  description: "Three courses taught by the ONDÉ stylists. Programme, fee, certificate, dates and places left.",
  alternates: { canonical: "/en/courses", languages: { bg: "/kursove", en: "/en/courses" } },
  robots: { index: false, follow: false },
};

export default function CoursesPageEn() {
  return (
    <Shell lang="en" page={{ kind: "courses" }}>
      <Courses />
    </Shell>
  );
}
