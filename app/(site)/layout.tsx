// Front (public) site layout — loads the verbatim extracted stylesheet plus the
// exact font (Cormorant Garamond) that FRONT REFERENCE.htm used.
//
// Font is served via next/font/google (self-hosted at build time) instead of
// a Google Fonts <link> tag. This eliminates the 750 ms render-blocking network
// request to fonts.googleapis.com / fonts.gstatic.com that was delaying FCP/LCP.
// The CSS variable --serif is injected via the font's `variable` option so all
// existing front.css rules that reference var(--serif) continue to work unchanged.
//
// Weights trimmed to 400 (body text) and 600 (headings/emphasis) only.
// Previously loaded 300 and 500 as well — each weight is a separate font file,
// so removing two unused weights cuts font payload by ~50%.
import "./front.css";
import { Cormorant_Garamond } from "next/font/google";
import { RecaptchaLoader } from "@/components/site/RecaptchaLoader";
import { MyQuestsProvider } from "@/components/site/state/MyQuestsProvider";
import { OverlayProvider } from "@/components/site/state/OverlayProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--serif",
});

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cormorant.variable}>
      <RecaptchaLoader />
      {/* Client state shared across all (site) routes; consumers wired in later
          migration phases. Until then front.js still drives behavior — these
          providers only supply context and touch no DOM, so they coexist. */}
      <OverlayProvider>
        <MyQuestsProvider>{children}</MyQuestsProvider>
      </OverlayProvider>
    </div>
  );
}
