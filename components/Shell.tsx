"use client";

import { I18nProvider } from "./I18n";
import { BottomLine, TopBar } from "./Chrome";
import Effects from "./Effects";
import HtmlLang from "./HtmlLang";
import Reveal from "./Reveal";
import { getContent, type Lang } from "@/lib/content";
import type { PageId } from "@/lib/routes";

/**
 * Everything every page shares: the dictionary, the bar, the line, and the
 * two behaviour helpers. A page component below this is only its own content.
 */
export default function Shell({
  lang,
  page,
  children,
}: {
  lang: Lang;
  page: PageId;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider t={getContent(lang)} lang={lang}>
      <HtmlLang lang={lang} />
      <TopBar page={page} />
      <main className="flex-1">{children}</main>
      <BottomLine />
      <Reveal />
      <Effects />
    </I18nProvider>
  );
}
