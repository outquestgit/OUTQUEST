// Admin dashboard layout — loads the verbatim extracted stylesheet plus the
// exact fonts the original ADMIN REFERENCE.htm used (DM Serif Display + Inter Tight).
import type { Metadata } from "next";
import "./admin.css";
import PasteCleaner from "./PasteCleaner";

export const metadata: Metadata = {
  title: "OutQuest — Admin",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <PasteCleaner />
      {children}
    </>
  );
}
