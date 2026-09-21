"use client";

import Assistant from "./Assistant";
import Booking from "./Booking";
import Contact from "./Contact";
import Courses from "./Courses";
import Directions from "./Directions";
import Effects from "./Effects";
import Faq from "./Faq";
import Footer from "./Footer";
import Gallery from "./Gallery";
import Header from "./Header";
import Hero from "./Hero";
import HtmlLang from "./HtmlLang";
import { I18nProvider } from "./I18n";
import Marquee from "./Marquee";
import MobileBar from "./MobileBar";
import Reveal from "./Reveal";
import Reviews from "./Reviews";
import ScrollProgress from "./ScrollProgress";
import Team from "./Team";
import Why from "./Why";
import { getContent, type Lang } from "@/lib/content";

export default function Site({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  return (
    <I18nProvider t={t} lang={lang}>
      <HtmlLang lang={lang} />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Directions />
        <Booking />
        <Why />
        <Team />
        <Courses />
        <Gallery />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Assistant />
      <Reveal />
      <Effects />
    </I18nProvider>
  );
}
