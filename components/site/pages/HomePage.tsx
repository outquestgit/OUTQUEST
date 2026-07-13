import { Page } from "../Page";
import { HeroSection } from "../sections/HeroSection";
import { WhySection } from "../sections/WhySection";
import { PersonaSection } from "../sections/PersonaSection";
import { ProgramsSection } from "../sections/ProgramsSection";
import { FeaturedQuestsSection } from "../sections/FeaturedQuestsSection";
import { SocialProofSection } from "../sections/SocialProofSection";
import { ReelSection } from "../sections/ReelSection";
import { JournalSection } from "../sections/JournalSection";
import type { Program } from "@/lib/site/questMapping";
import type { Quest } from "../cards/QCard";
import { DEFAULT_HOMEPAGE, type HomepageConfig } from "@/lib/site/data/homepage";
import { journalCards, type JournalCard as JournalCardData } from "@/lib/site/data/home";

/**
 * The marketing home page — a composition of reusable section components. Each
 * `<*Section>` owns its markup + runtime wiring; this file only routes the
 * CMS/DB data into them. `programs` + `posts` come from the DB; `homepage` is the
 * admin-editable CMS content (defaults to the original copy/cards so the page is
 * unchanged until an admin edits a section).
 */
export function HomePage({
  programs,
  featuredQuests = [],
  posts = journalCards,
  homepage = DEFAULT_HOMEPAGE,
  showJournal = true,
}: {
  programs: Program[];
  featuredQuests?: Quest[];
  posts?: JournalCardData[];
  homepage?: HomepageConfig;
  showJournal?: boolean;
}) {
  const { hero, why, whoUsesUs, popularPrograms, socialProof, destination, goals, journal } =
    homepage;
  return (
    <Page id="home" active>
      <HeroSection hero={hero} />
      <WhySection why={why} />
      <PersonaSection whoUsesUs={whoUsesUs} />
      <ProgramsSection popularPrograms={popularPrograms} programs={programs} />
      <FeaturedQuestsSection quests={featuredQuests} />
      {!socialProof.hide && <SocialProofSection socialProof={socialProof} />}
      <ReelSection reel={destination} bg="var(--bg)" />
      <ReelSection reel={goals} bg="var(--bg2)" />
      {showJournal && <JournalSection journal={journal} posts={posts} />}
    </Page>
  );
}
