import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/siteSettings";
import { PrivacyPage as PrivacyContent } from "@/components/site/pages/PrivacyPage";
import { Overlays } from "@/components/site/overlays/Overlays";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { staticPageMetadata } from "@/lib/site/staticMeta";

/** SPA route for `/privacy` — renders the single-page app with the
 *  "privacy" section active (keeps the clean URL; section toggled on load). */
export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("privacy");
}

export default async function Page() {
  const settings = await getSiteSettings();

  return (
    <>
      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />
      <PrivacyContent privacy={settings.pages.privacy} />
      <SiteEnd footer={settings.footer} />
      <QuizModal />
    </>
  );
}
