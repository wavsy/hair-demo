"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/content";

/** The root layout owns <html>, so the English route sets the attribute itself. */
export default function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
