import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPublishedQuests } from "@/lib/quests";
import { questCategorySlug } from "@/lib/site/questMapping";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { MyQuestsProvider } from "@/components/site/state/MyQuestsProvider";
import { OverlayProvider } from "@/components/site/state/OverlayProvider";

/**
 * Custom 404 page — rendered by Next.js whenever notFound() is called or a
 * route simply doesn't exist. Sits outside the (site) layout so providers are
 * included directly. FrontBoot is omitted — the SPA runtime isn't needed here.
 */
export default async function NotFound() {
  const [settings, quests] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPublishedQuests().catch(() => []),
  ]);

  const suggested = quests.slice(0, 3).map((q) => {
    const cat = questCategorySlug(q);
    return {
      title: q.title,
      tagline: q.tagline ?? "Explore this quest",
      href: cat ? `/${cat}/${q.slug}` : `/quests/${q.slug}`,
      color: q.card_color ?? "linear-gradient(135deg,#F5A623,#F76B1C)",
      icon: q.card_icon ?? "🗺️",
    };
  });

  return (
    <OverlayProvider>
      <MyQuestsProvider>
        {settings && <Nav nav={settings.nav} />}
        {settings && <MobileMenu nav={settings.nav} />}

        <main
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 5%",
            background: "var(--bg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(80px, 15vw, 160px)",
              fontFamily: "var(--serif)",
              fontWeight: 400,
              lineHeight: 1,
              color: "var(--text)",
              marginBottom: "8px",
            }}
          >
            404
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 400,
              color: "var(--text)",
              margin: "0 0 16px",
            }}
          >
            This quest doesn&apos;t exist
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text2)",
              maxWidth: "420px",
              lineHeight: 1.6,
              marginBottom: "36px",
            }}
          >
            The page you&apos;re looking for may have moved or been removed. Try one of
            these instead, or head back home.
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: suggested.length ? "64px" : "0" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--orange)",
                color: "#fff",
                borderRadius: "12px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/quests"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--text)",
                color: "#fff",
                borderRadius: "12px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Browse Quests
            </Link>
          </div>

          {suggested.length > 0 && (
            <div style={{ width: "100%", maxWidth: "860px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text3)",
                  marginBottom: "20px",
                }}
              >
                Popular Quests
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${suggested.length}, 1fr)`,
                  gap: "16px",
                }}
              >
                {suggested.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    style={{
                      background: q.color,
                      borderRadius: "18px",
                      padding: "28px 20px 22px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      minHeight: "140px",
                    }}
                  >
                    <span style={{ fontSize: "32px", marginBottom: "12px" }}>{q.icon}</span>
                    <span
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#fff",
                        lineHeight: 1.2,
                        marginBottom: "6px",
                      }}
                    >
                      {q.title}
                    </span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>
                      {q.tagline}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {settings && <SiteEnd footer={settings.footer} />}
      </MyQuestsProvider>
    </OverlayProvider>
  );
}