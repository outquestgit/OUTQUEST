/**
 * Contact page CMS model + defaults. Editable: hero copy, the enquiry cards
 * (icon / title / body / link), and the message form's labels, placeholders,
 * button, and success message. The form's submit wiring stays in the component.
 * Defaults reproduce the current page exactly.
 */

export type ContactLinkType = "email" | "page" | "url";

export interface ContactCard {
  icon: string;
  title: string;
  body: string;
  /** email → mailto:, page → SPA showPage(), url → href. */
  linkType: ContactLinkType;
  linkValue: string;
  linkLabel: string;
}

export interface ContactConfig {
  hero: { label: string; heading: string; sub: string };
  cards: ContactCard[];
  form: {
    heading: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
    successHeading: string;
    /** Use {name} for the sender's first name. */
    successBody: string;
  };
}

export const DEFAULT_CONTACT: ContactConfig = {
  hero: {
    label: "Get in Touch",
    heading: "Contact Us",
    sub: "Whether you have a question, partnership idea, or just want to say hello — we'd love to hear from you.",
  },
  cards: [
    {
      icon: "💬",
      title: "General Enquiries",
      body: "Questions about quests, the platform, or anything else.",
      linkType: "email",
      linkValue: "hello@outquest.com",
      linkLabel: "hello@outquest.com",
    },
    {
      icon: "🤝",
      title: "Partnerships",
      body: "Interested in listing your service or partnering with us?",
      linkType: "page",
      linkValue: "partner",
      linkLabel: "View partner info",
    },
  ],
  form: {
    heading: "Send a message",
    nameLabel: "YOUR NAME",
    emailLabel: "EMAIL ADDRESS",
    subjectLabel: "SUBJECT",
    messageLabel: "MESSAGE",
    namePlaceholder: "Jane Smith",
    emailPlaceholder: "jane@email.com",
    subjectPlaceholder: "What's on your mind?",
    messagePlaceholder: "Tell us more...",
    submitLabel: "Send message",
    successHeading: "Message sent!",
    successBody: "Thanks {name} — we'll get back to you soon.",
  },
};
