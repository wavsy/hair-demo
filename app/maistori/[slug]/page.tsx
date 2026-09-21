import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MasterPage from "@/components/MasterPage";
import Shell from "@/components/Shell";
import { MASTERS, masterBySlug, masterCopy } from "@/lib/masters";

export function generateStaticParams() {
  return MASTERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = masterBySlug(slug);
  if (!found) return {};
  const c = masterCopy("bg", found.index);
  return {
    title: `${c.name} — ${c.role} · ONDÉ`,
    description: c.line,
    alternates: { canonical: `/maistori/${slug}`, languages: { bg: `/maistori/${slug}`, en: `/en/stylists/${slug}` } },
    robots: { index: false, follow: false },
  };
}

export default async function Master({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = masterBySlug(slug);
  if (!found) notFound();
  return (
    <Shell lang="bg" page={{ kind: "master", slug }}>
      <MasterPage index={found.index} />
    </Shell>
  );
}
