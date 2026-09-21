"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/content";

/**
 * The root layout can only declare one language, and this site serves two from
 * the same tree. Without this, every English page tells a screen reader and a
 * translation prompt that it is written in Bulgarian.
 */
export default function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
