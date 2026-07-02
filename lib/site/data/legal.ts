/**
 * Shared CMS model + defaults for the legal pages (Privacy, Terms). Mirrors the
 * reference admin's single-box editor: a hero (eyebrow / heading / sub /
 * last-updated), one rich-HTML `body` (author the numbered sections inline), and
 * a contact box. Older saved configs that used a structured `toc` + `sections`
 * array are migrated into `body` on read (see `normalizeLegal`), so no content
 * is lost. The legacy item shapes are kept for that migration's typing.
 */

export interface LegalTocItem {
  anchor: string;
  label: string;
}
export interface LegalSectionItem {
  anchor: string;
  title: string;
  /** Rich HTML body (paragraphs, lists, callouts). */
  body: string;
}
export interface LegalPageConfig {
  hero: { label: string; heading: string; sub: string; lastUpdated: string };
  /** Full policy content as rich HTML — the single editor box. */
  body: string;
  contact: { heading: string; body: string; email: string };
}

/** Build a single HTML `body` from a legacy intro callout + numbered sections.
 *  Used to seed the defaults and to migrate older saved configs on read. */
export function legalSectionsToBody(intro: string | undefined, sections: LegalSectionItem[]): string {
  const parts: string[] = [];
  if (intro && intro.trim()) parts.push(`<div class="legal-callout">${intro}</div>`);
  sections.forEach((s, i) =>
    parts.push(`<h2${s.anchor ? ` id="${s.anchor}"` : ""}>${i + 1}. ${s.title}</h2>${s.body}`)
  );
  return parts.join("\n");
}

const PRIVACY_INTRO =
  "<strong>Short version:</strong> We only collect what we need to match you to quests and help you get started. We don't sell your data. We don't spam. We keep things simple.";
const PRIVACY_SECTIONS: LegalSectionItem[] = [
  { anchor: "priv-1", title: "Information We Collect", body: "<p>When you use OutQuest, we may collect the following types of information:</p><ul><li><strong>Contact details</strong> — your first name, email address, or WhatsApp/phone number when you submit a quest interest form.</li><li><strong>Quest preferences</strong> — the quests you've viewed or expressed interest in, your desired timeline, and any notes you provide.</li><li><strong>Usage data</strong> — pages visited, clicks, and general browsing behaviour on the platform (via cookies and analytics).</li><li><strong>Device information</strong> — browser type, operating system, IP address, and approximate location (country level).</li></ul><p>We do not require you to create an account to browse OutQuest. Contact information is only collected when you voluntarily submit it through our quest interest forms.</p>" },
  { anchor: "priv-2", title: "How We Use Your Information", body: "<p>We use the information we collect to:</p><ul><li>Respond to your quest enquiries and match you with the right quest guide or partner.</li><li>Send you quest updates, follow-up information, and relevant resources you've requested.</li><li>Improve the platform — understanding how people navigate OutQuest helps us build better quests.</li><li>Send occasional newsletters or product updates (only if you've opted in).</li><li>Comply with legal obligations.</li></ul><p>We will never use your information for purposes materially different from those listed here without asking for your consent first.</p>" },
  { anchor: "priv-3", title: "Sharing Your Information", body: "<p>We do not sell, rent, or trade your personal information. We may share limited data in the following circumstances:</p><ul><li><strong>Quest partners</strong> — when you express interest in a specific quest, we may share your name and contact details with the relevant partner (e.g. a visa service, housing provider, or co-working space) to facilitate your enquiry. You'll always know this is happening.</li><li><strong>Service providers</strong> — we work with trusted third-party tools (e.g. email platforms, analytics) that process data on our behalf under strict confidentiality agreements.</li><li><strong>Legal compliance</strong> — we may disclose information if required by law or to protect the safety of our users or platform.</li></ul><div class=\"legal-callout\">Affiliate links on OutQuest may track clicks for commission purposes. These trackers are operated by third-party vendors and are subject to their own privacy policies.</div>" },
  { anchor: "priv-4", title: "Cookies & Tracking", body: "<p>OutQuest uses cookies and similar technologies to improve your experience. These include:</p><ul><li><strong>Essential cookies</strong> — needed for the platform to function (e.g. session management).</li><li><strong>Analytics cookies</strong> — help us understand how visitors use the site (e.g. Google Analytics, with IP anonymisation enabled).</li><li><strong>Preference cookies</strong> — remember your settings and choices during a session.</li></ul><p>You can control cookie settings through your browser preferences. Disabling cookies may affect some platform functionality.</p>" },
  { anchor: "priv-5", title: "Data Retention", body: "<p>We retain your contact information for as long as necessary to fulfil the purpose it was collected for, or as required by law. Specifically:</p><ul><li>Quest enquiry data is retained for up to 24 months from your last interaction.</li><li>Analytics data is retained in aggregated, anonymised form indefinitely.</li><li>You may request deletion of your data at any time (see Your Rights below).</li></ul>" },
  { anchor: "priv-6", title: "Your Rights", body: "<p>Depending on your location, you may have the following rights regarding your personal data:</p><ul><li><strong>Access</strong> — request a copy of the personal data we hold about you.</li><li><strong>Correction</strong> — ask us to correct inaccurate or incomplete information.</li><li><strong>Deletion</strong> — request that we delete your personal data (\"right to be forgotten\").</li><li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li><li><strong>Objection</strong> — object to certain types of processing, including direct marketing.</li><li><strong>Withdrawal of consent</strong> — unsubscribe or withdraw consent at any time.</li></ul><p>To exercise any of these rights, email us at <strong>privacy@outquest.com</strong>. We'll respond within 30 days.</p>" },
  { anchor: "priv-7", title: "Children's Privacy", body: "<p>OutQuest is not directed at children under the age of 16. We do not knowingly collect personal information from minors. If you believe a child has submitted personal information to us, please contact us and we will delete it promptly.</p>" },
  { anchor: "priv-8", title: "Changes to This Policy", body: "<p>We may update this Privacy Policy from time to time. When we do, we'll update the \"Last updated\" date at the top of this page. Continued use of OutQuest after changes constitutes your acceptance of the updated policy.</p>" },
];

export const DEFAULT_PRIVACY: LegalPageConfig = {
  hero: {
    label: "Legal",
    heading: "Privacy Policy",
    sub: "How OutQuest collects, uses, and protects your information.",
    lastUpdated: "April 2026",
  },
  body: legalSectionsToBody(PRIVACY_INTRO, PRIVACY_SECTIONS),
  contact: {
    heading: "Questions about privacy?",
    body: "We're a small team and we take this seriously. Reach out directly and a real person will respond.",
    email: "privacy@outquest.com",
  },
};

const TERMS_INTRO =
  "<strong>Short version:</strong> OutQuest provides information and inspiration to help you plan life experiences. We don't guarantee outcomes, we're not a travel agency, and you're responsible for your own visa, legal, and financial decisions. Use good judgment.";
const TERMS_SECTIONS: LegalSectionItem[] = [
  { anchor: "tos-1", title: "Who We Are & What This Is", body: "<p>OutQuest (\"we\", \"us\", \"our\") is an online platform that curates immersive life experience guides — we call them \"quests\" — to help people explore new directions: moving abroad, trying a new career, or upgrading their life.</p><p>By accessing or using OutQuest (the \"Platform\"), you agree to be bound by these Terms of Service. If you don't agree, please don't use the Platform.</p><p>These terms apply to all visitors, users, and anyone else who accesses or uses the Platform.</p>" },
  { anchor: "tos-2", title: "Using the Platform", body: "<p>You may use OutQuest for personal, non-commercial purposes. When using the Platform, you agree not to:</p><ul><li>Scrape, copy, or redistribute our quest content without written permission.</li><li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li><li>Attempt to interfere with, disrupt, or damage the Platform or its infrastructure.</li><li>Submit false, misleading, or fraudulent information through our forms.</li><li>Impersonate any person or entity, or misrepresent your affiliation with any organisation.</li></ul><p>We reserve the right to restrict or terminate access for any user who violates these terms.</p>" },
  { anchor: "tos-3", title: "Quest Content & Information", body: "<p>The quest guides, cost estimates, visa information, and recommendations on OutQuest are provided for general informational purposes only. While we make every effort to keep information accurate and up to date:</p><ul><li>Visa rules, costs, and entry requirements change frequently. Always verify information with official government sources before making decisions.</li><li>Cost estimates are approximate and based on research at time of publication. Actual costs may vary significantly.</li><li>Quest content reflects the experiences and research of our team — it is not professional legal, financial, or immigration advice.</li><li>OutQuest is not a licensed travel agent, visa consultant, or financial advisor.</li></ul><div class=\"legal-callout\"><strong>Important:</strong> Before making any significant life decision based on OutQuest content (relocating, quitting a job, applying for a visa), consult the relevant official sources and, where appropriate, a qualified professional.</div>" },
  { anchor: "tos-4", title: "Affiliate Links & Third Parties", body: "<p>Some links on OutQuest are affiliate links — meaning we may earn a commission if you make a purchase or sign up through them, at no additional cost to you. We only recommend products and services we genuinely believe are useful for our community.</p><ul><li>Affiliate relationships do not influence our editorial recommendations or quest content.</li><li>Third-party websites linked from OutQuest have their own terms and privacy policies. We are not responsible for their content or practices.</li><li>Any transactions you make with third-party providers are solely between you and them.</li></ul>" },
  { anchor: "tos-5", title: "Intellectual Property", body: "<p>All content on OutQuest — including quest guides, copy, design, graphics, and code — is owned by or licensed to OutQuest and protected by applicable intellectual property laws.</p><ul><li>You may share links to OutQuest content freely.</li><li>You may not reproduce, distribute, or create derivative works from our content without prior written permission.</li><li>The OutQuest name, logo, and brand marks are trademarks of OutQuest and may not be used without permission.</li></ul>" },
  { anchor: "tos-6", title: "Disclaimers & Limitation of Liability", body: "<p>OutQuest is provided \"as is\" and \"as available\" without warranties of any kind, express or implied. We do not warrant that:</p><ul><li>The Platform will be uninterrupted, error-free, or free of viruses or other harmful components.</li><li>Any information on the Platform is complete, accurate, or current.</li><li>Results described in quest content will be achievable for any individual user.</li></ul><p>To the maximum extent permitted by law, OutQuest and its team will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or reliance on any content.</p><p>Our total liability to you for any claim arising from use of the Platform will not exceed the amount you have paid to us in the 12 months preceding the claim (which, given the Platform is currently free, is zero).</p>" },
  { anchor: "tos-7", title: "Termination", body: "<p>We may suspend or terminate your access to the Platform at any time, for any reason, with or without notice — particularly if we believe you've violated these Terms of Service.</p><p>You may stop using the Platform at any time. Sections of these Terms that by their nature should survive termination (including intellectual property, disclaimers, and limitation of liability) will remain in effect.</p>" },
  { anchor: "tos-8", title: "Governing Law", body: "<p>These Terms are governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law principles. Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the courts of England and Wales.</p><p>If you are accessing OutQuest from outside the UK, you are responsible for compliance with local laws.</p>" },
  { anchor: "tos-9", title: "Changes to These Terms", body: "<p>We may update these Terms of Service from time to time. We'll update the \"Last updated\" date at the top of this page. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised terms.</p><p>For material changes, we'll make reasonable efforts to notify users via the Platform or by email (if you've provided one).</p>" },
  { anchor: "tos-10", title: "Contact", body: "<p>If you have questions about these Terms, want to report a concern, or need to reach us for any legal reason, please get in touch:</p><ul><li><strong>Email:</strong> legal@outquest.com</li><li><strong>Response time:</strong> We aim to respond within 5 business days.</li></ul>" },
];

export const DEFAULT_TERMS: LegalPageConfig = {
  hero: {
    label: "Legal",
    heading: "Terms of Service",
    sub: "The rules of the road for using OutQuest. Plain language, no surprises.",
    lastUpdated: "April 2026",
  },
  body: legalSectionsToBody(TERMS_INTRO, TERMS_SECTIONS),
  contact: {
    heading: "Questions about these terms?",
    body: "We keep things straightforward. If something's unclear, just ask — we'll explain it in plain English.",
    email: "legal@outquest.com",
  },
};
