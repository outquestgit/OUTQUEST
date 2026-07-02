import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { PartnerHero } from "../sections/partner/PartnerHero";
import { PartnerWhat } from "../sections/partner/PartnerWhat";
import { PartnerWho } from "../sections/partner/PartnerWho";
import { PartnerWhy } from "../sections/partner/PartnerWhy";
import { PartnerFaq } from "../sections/partner/PartnerFaq";
import { PartnerForm } from "../sections/partner/PartnerForm";
import { DEFAULT_PARTNER, type PartnerConfig } from "@/lib/site/data/partner";

/** Partner-with-us marketing + application form page — composed from reusable
 *  section components. Content from CMS (`partner`), defaulting to the original. */
export function PartnerPage({ partner = DEFAULT_PARTNER }: { partner?: PartnerConfig }) {
  const { hero, whatWeDo, partnerWith, why, faq, form } = partner;
  return (
    <Page id="partner">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Partner With Us" />
      <PartnerHero hero={hero} />
      <PartnerWhat whatWeDo={whatWeDo} />
      <PartnerWho partnerWith={partnerWith} />
      <PartnerWhy why={why} />
      <PartnerFaq faq={faq} />
      <PartnerForm form={form} />
    </Page>
  );
}
