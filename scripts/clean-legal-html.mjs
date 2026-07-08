/**
 * One-time cleanup of Word markup in the CMS-stored legal pages.
 *
 * The privacy policy and TOS were pasted from Microsoft Word into the admin
 * rich-text editor before `PasteCleaner` existed, so `site_settings.pages`
 * holds `<p class="MsoNormal">`, `<o:p>`, `mso-*` inline styles and Word's
 * fake-list markup. That HTML is replayed verbatim through
 * `dangerouslySetInnerHTML` on every page of the site.
 *
 * Runs the stored HTML through the same sanitiser the editors now use on paste
 * (`lib/admin/pasteClean.ts`), so the cleaned output matches what a fresh paste
 * would produce today. Browser-only APIs are supplied by jsdom.
 *
 *   node scripts/clean-legal-html.mjs            # dry run — prints a diff, writes nothing
 *   node scripts/clean-legal-html.mjs --write    # applies the change
 *
 * Requires .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const { createClient } = require("@supabase/supabase-js");

// The sanitiser is written for the browser; give it a DOM.
const dom = new JSDOM("<!doctype html><body>");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.Node = dom.window.Node;
globalThis.NodeFilter = dom.window.NodeFilter;

const { cleanPastedHtml } = require("./.build/pasteClean.js");

const WRITE = process.argv.includes("--write");

/** Minimal .env.local reader — avoids pulling in dotenv for a one-off script. */
function loadEnv(path) {
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = /^([A-Z_]+)\s*=\s*(.*)$/.exec(line.trim());
    if (match) process.env[match[1]] ??= match[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv(".env.local");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/** Every rich-HTML field inside a LegalPageConfig. */
const HTML_PATHS = [["body"], ["contact", "body"]];

const WORD_MARKUP = /Mso|mso-|<o:|<v:|<w:|class=|style=/gi;

function get(obj, path) {
  return path.reduce((node, key) => node?.[key], obj);
}
function set(obj, path, value) {
  const parent = path.slice(0, -1).reduce((node, key) => node[key], obj);
  parent[path.at(-1)] = value;
}

function countWordMarkup(html) {
  return (html.match(WORD_MARKUP) ?? []).length;
}

const { data, error } = await supabase
  .from("site_settings")
  .select("pages")
  .eq("id", 1)
  .single();

if (error) {
  console.error("Could not read site_settings:", error.message);
  process.exit(1);
}

const pages = structuredClone(data.pages ?? {});
let touched = 0;

for (const pageKey of ["privacy", "terms"]) {
  const page = pages[pageKey];
  if (!page) {
    console.log(`\n${pageKey}: not present in site_settings.pages — skipping`);
    continue;
  }

  for (const path of HTML_PATHS) {
    const before = get(page, path);
    if (typeof before !== "string" || !before.trim()) continue;

    const after = cleanPastedHtml(before);
    const label = `${pageKey}.${path.join(".")}`;

    if (before === after) {
      console.log(`\n${label}: already clean (${before.length} chars)`);
      continue;
    }

    touched++;
    console.log(`\n${label}`);
    console.log(`  ${before.length} chars -> ${after.length} chars` +
      `  (-${Math.round((1 - after.length / before.length) * 100)}%)`);
    console.log(`  Word markers: ${countWordMarkup(before)} -> ${countWordMarkup(after)}`);
    console.log(`  BEFORE: ${before.slice(0, 220).replace(/\s+/g, " ")}…`);
    console.log(`  AFTER : ${after.slice(0, 220).replace(/\s+/g, " ")}…`);

    set(page, path, after);
  }
}

if (!touched) {
  console.log("\nNothing to clean.");
  process.exit(0);
}

if (!WRITE) {
  // A full backup is worth more than the diff above if anything looks off.
  writeFileSync("site_settings.pages.backup.json", JSON.stringify(data.pages, null, 2));
  console.log(`\n--- DRY RUN. ${touched} field(s) would change. Nothing written. ---`);
  console.log("Original saved to site_settings.pages.backup.json");
  console.log("Re-run with --write to apply.");
  process.exit(0);
}

const { error: writeError } = await supabase
  .from("site_settings")
  .update({ pages })
  .eq("id", 1);

if (writeError) {
  console.error("\nWrite failed:", writeError.message);
  process.exit(1);
}
console.log(`\n✓ Wrote ${touched} cleaned field(s) to site_settings.`);
console.log("The admin saves call revalidateTag(SITE_SETTINGS_TAG) — a direct DB");
console.log("write does not, so redeploy or touch a setting in /admin to bust the cache.");
