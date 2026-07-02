import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { AboutHero } from "../sections/about/AboutHero";
import { AboutStory } from "../sections/about/AboutStory";
import { AboutPaths } from "../sections/about/AboutPaths";
import { AboutMap } from "../sections/about/AboutMap";
import { AboutHowItWorks } from "../sections/about/AboutHowItWorks";
import { AboutWhy } from "../sections/about/AboutWhy";
import { AboutCta } from "../sections/about/AboutCta";
import { DEFAULT_ABOUT, type AboutConfig } from "@/lib/site/data/about";

/** About page: mosaic hero, story, paths, personas world map, how-it-works, CTA —
 *  composed from reusable section components. All copy + cards come from the CMS
 *  (`about`), defaulting to the original. */
export function AboutPage({ about = DEFAULT_ABOUT }: { about?: AboutConfig }) {
  const { hero, whatWeDo, paths, map, howItWorks, why, cta } = about;
  return (
    <Page id="about">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="About" />
      <AboutHero hero={hero} />
      <AboutStory whatWeDo={whatWeDo} />
      <AboutPaths paths={paths} />
      <AboutMap map={map} />
      <AboutHowItWorks howItWorks={howItWorks} />
      <AboutWhy why={why} />
      <AboutCta cta={cta} />
    </Page>
  );
}
