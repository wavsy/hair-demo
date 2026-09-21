"use client";

import Advantages from "./Advantages";
import Assistant from "./Assistant";
import Booking from "./Booking";
import Contact from "./Contact";
import Effects from "./Effects";
import Emergency from "./Emergency";
import Faq from "./Faq";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HtmlLang from "./HtmlLang";
import { I18nProvider } from "./I18n";
import Marquee from "./Marquee";
import MobileBar from "./MobileBar";
import Reveal from "./Reveal";
import Reviews from "./Reviews";
import ScrollProgress from "./ScrollProgress";
import Services from "./Services";
import Shop from "./Shop";
import Team from "./Team";
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
        <Services />
        <Booking />
        <Advantages />
        <Emergency />
        <Team />
        <Reviews />
        <Shop />
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
