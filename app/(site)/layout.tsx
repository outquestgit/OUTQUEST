// Front (public) site layout — loads the verbatim extracted stylesheet plus the
// exact font (Cormorant Garamond) that FRONT REFERENCE.htm used.
import "./front.css";
import { RecaptchaLoader } from "@/components/site/RecaptchaLoader";
import { MyQuestsProvider } from "@/components/site/state/MyQuestsProvider";
import { OverlayProvider } from "@/components/site/state/OverlayProvider";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
        rel="stylesheet"
      />
      <RecaptchaLoader />
      {/* Client state shared across all (site) routes; consumers wired in later
          migration phases. Until then front.js still drives behavior — these
          providers only supply context and touch no DOM, so they coexist. */}
      <OverlayProvider>
        <MyQuestsProvider>{children}</MyQuestsProvider>
      </OverlayProvider>
    </>
  );
}
