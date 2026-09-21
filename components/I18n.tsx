"use client";

import { createContext, useContext } from "react";
import type { Content, Lang } from "@/lib/content";

const Ctx = createContext<{ t: Content; lang: Lang; other: string } | null>(null);

export function I18nProvider({
  t,
  lang,
  children,
}: {
  t: Content;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ t, lang, other: lang === "bg" ? "/en" : "/" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
