/**
 * Every address on the site, in one place.
 *
 * The two languages do not share a path: a Bulgarian visitor gets Bulgarian
 * words in the address bar and an English one gets English. That means the
 * mapping has to be written down somewhere, and a link built by hand in a
 * component is a link that goes stale. This is that somewhere.
 */
import type { Lang } from "./content";

export const home = (lang: Lang) => (lang === "bg" ? "/" : "/en");

export const masterHref = (lang: Lang, slug: string) =>
  lang === "bg" ? `/maistori/${slug}` : `/en/stylists/${slug}`;

export const coursesHref = (lang: Lang) => (lang === "bg" ? "/kursove" : "/en/courses");

export const contactHref = (lang: Lang) => (lang === "bg" ? "/salona" : "/en/the-salon");

/** Which page the chrome is sitting on, so the language switch knows where to go. */
export type PageId =
  | { kind: "home" }
  | { kind: "master"; slug: string }
  | { kind: "courses" }
  | { kind: "contact" };

/** Where the language switch on a given page should land. */
export function otherLangHref(lang: Lang, page: PageId) {
  const other: Lang = lang === "bg" ? "en" : "bg";
  switch (page.kind) {
    case "master":
      return masterHref(other, page.slug);
    case "courses":
      return coursesHref(other);
    case "contact":
      return contactHref(other);
    default:
      return home(other);
  }
}
