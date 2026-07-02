// Public B2B directory layout (SSR). Loads the directory stylesheet + fonts.
// These routes render SEO-critical content fully on the server — no client
// fetching, no client hydration for the core content.
import "./directory.css";

export default function DirectoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="dir-shell">{children}</div>
    </>
  );
}
