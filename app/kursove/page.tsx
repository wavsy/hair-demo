import type { Metadata } from "next";
import Courses from "@/components/Courses";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Курсове — ONDÉ",
  description:
    "Три курса, водени от майсторите на ONDÉ. Програма, такса, документ, дати и свободни места.",
  alternates: { canonical: "/kursove", languages: { bg: "/kursove", en: "/en/courses" } },
  robots: { index: false, follow: false },
};

export default function CoursesPage() {
  return (
    <Shell lang="bg" page={{ kind: "courses" }}>
      <Courses />
    </Shell>
  );
}
