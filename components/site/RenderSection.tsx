import type { CaseStudy, Content, Locale, SectionKey } from "@/lib/types";
import { BeforeAfter } from "./BeforeAfter";
import { Cases } from "./Cases";
import { Clients } from "./Clients";
import { Contact } from "./Contact";
import { Featured } from "./Featured";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { Services } from "./Services";
import { Team } from "./Team";

export function RenderSection({ k, content, locale, cases }: { k: SectionKey; content: Content; locale: Locale; cases?: CaseStudy[] }) {
  const items = cases ?? content.cases.items;
  switch (k) {
    case "hero":
      return <Hero data={content.hero} locale={locale} />;
    case "clients":
      return <Clients data={content.clients} locale={locale} />;
    case "featured":
      return content.featured ? <Featured data={content.featured} members={content.team.members} locale={locale} /> : null;
    case "team":
      return <Team data={content.team} locale={locale} />;
    case "cases":
      return items.length ? <Cases data={content.cases} items={items} locale={locale} /> : null;
    case "beforeAfter":
      return items.length ? <BeforeAfter data={content.beforeAfter} items={items} locale={locale} /> : null;
    case "manifesto":
      return <Manifesto data={content.manifesto} locale={locale} />;
    case "services":
      return <Services data={content.services} locale={locale} />;
    case "contact":
      return <Contact data={content.contact} settings={content.settings} locale={locale} />;
    default:
      return null;
  }
}
