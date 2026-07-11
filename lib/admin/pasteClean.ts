/**
 * Sanitiser for content pasted into the admin's rich-text editors.
 *
 * Word (and Outlook, and to a lesser extent Google Docs) puts a `text/html`
 * flavour on the clipboard that is *its own* document format, not web HTML:
 * `<p class=MsoNormal>`, hundreds of `mso-*` CSS properties, `<o:p>` and
 * `<v:shape>` namespaced tags, a multi-kilobyte `<style>` block, conditional
 * comments, and lists faked as paragraphs with a literal bullet glyph in a
 * `mso-list:Ignore` span. A bare `contenteditable` accepts all of it, and this
 * admin then persists `innerHTML` and replays it through
 * `dangerouslySetInnerHTML` — so the junk is permanent and the `href`s are
 * unvalidated.
 *
 * `cleanPastedHtml` reduces a paste to the tag set the toolbars can actually
 * produce, which is also the tag set the front-end has styles for. Everything
 * else is unwrapped (keep the text, drop the wrapper) or dropped outright.
 *
 * Browser-only: uses DOMParser. Import from client components.
 */

/** Kept, stripped of every attribute except those in `ALLOWED_ATTRS`. */
const KEEP = new Set([
  "P", "BR", "H2", "H3", "B", "STRONG", "I", "EM", "U", "S", "A", "UL", "OL", "LI",
  "BLOCKQUOTE", "CODE", "PRE", "IMG", "HR",
  // The editors have no table toolbar, but silently deleting a pasted table
  // loses data. Keep the structure; it inherits whatever the page styles it as.
  "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TD", "TH", "CAPTION",
]);

/** Wrapper discarded, children kept. */
const UNWRAP = new Set([
  "SPAN", "FONT", "SECTION", "ARTICLE", "MAIN", "BODY", "CENTER", "SMALL",
  "ABBR", "TIME", "LABEL", "MARK", "NOBR",
]);

/** Removed with everything inside. */
const DROP = new Set(["STYLE", "SCRIPT", "META", "LINK", "TITLE", "HEAD", "XML", "COL", "COLGROUP"]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  A: ["href", "target"],
  IMG: ["src", "alt"],
};

/** No `javascript:` / `data:text/html` — this HTML lands in dangerouslySetInnerHTML. */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;
/** Word images are `file:///C:/…/clip_image001.png` — broken everywhere but the author's PC. */
const SAFE_SRC = /^(?:https?:\/\/|data:image\/)/i;

const BLOCK_CHILD = "p,div,ul,ol,h1,h2,h3,h4,h5,h6,table,blockquote,pre";

/**
 * Google Docs wraps its whole clipboard payload in
 * `<b id="docs-internal-guid-…" style="font-weight:normal">` — stripping the style
 * but keeping the tag would bold the entire paste. Word's genuine bold carries
 * `mso-bidi-font-weight:normal`, so anchor on the property name to tell them apart.
 */
const FAUX_BOLD = /(?:^|[;\s])font-weight\s*:\s*(?:normal|400)\b/i;
const FAUX_ITALIC = /(?:^|[;\s])font-style\s*:\s*normal\b/i;

/**
 * The mirror image: Google Docs encodes emphasis purely as `<span>` styles, so
 * unwrapping spans blindly would silently drop every bold and italic in the paste.
 * Recover them as the real tags the toolbars produce. Anchoring on the property
 * name again keeps Word's `mso-bidi-font-weight:bold` from matching.
 */
const STYLED_EMPHASIS: [RegExp, string][] = [
  [/(?:^|[;\s])font-weight\s*:\s*(?:bold(?:er)?|[6-9]00)\b/i, "b"],
  [/(?:^|[;\s])font-style\s*:\s*italic\b/i, "i"],
  [/(?:^|[;\s])text-decoration[^;]*\bunderline\b/i, "u"],
];

export function cleanPastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  if (!body) return "";

  stripOfficeJunk(body);
  rebuildWordLists(body);

  const out = doc.createElement("div");
  for (const child of Array.from(body.childNodes)) appendClean(out, child, doc);
  pruneEmpty(out);

  return out.innerHTML.trim();
}

/** Fallback for plain-text pastes: blank lines become paragraphs, single newlines `<br>`. */
export function textToHtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Conditional comments, the `<style>` dump, and Office's namespaced tags. */
function stripOfficeJunk(root: HTMLElement) {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  for (const c of comments) c.parentNode?.removeChild(c);

  for (const el of Array.from(root.getElementsByTagName("*"))) {
    // `<o:p>`, `<w:sdt>`, `<v:shape>` — no HTML tag name contains a colon.
    if (el.tagName.includes(":") || DROP.has(el.tagName)) el.remove();
  }
}

const MSO_LIST = /mso-list\s*:/i;
const MSO_LEVEL = /level(\d+)/i;
/** A `1.` / `a)` / `iv.` marker means ordered; `·`, `o`, `§` (Symbol font) mean bullet. */
const ORDERED_MARKER = /^\s*(?:\d+|[a-z]|[ivxlcdm]+)\s*[.)]/i;

/**
 * Word exports every list item as `<p style='mso-list:l0 level1 lfo1'>` with the
 * bullet character hard-coded in a `<span style='mso-list:Ignore'>` — there is no
 * `<ul>`. Reassemble consecutive runs of those paragraphs into real nested lists.
 */
function rebuildWordLists(body: HTMLElement) {
  const doc = body.ownerDocument;
  const items = Array.from(body.querySelectorAll("p")).filter((p) =>
    MSO_LIST.test(p.getAttribute("style") || "")
  );
  if (!items.length) return;

  const meta = new Map<Element, { ordered: boolean; level: number }>();
  for (const p of items) {
    const style = p.getAttribute("style") || "";
    const marker = p.querySelector('span[style*="mso-list"]');
    const markerText = marker?.textContent || "";
    marker?.remove();
    meta.set(p, {
      ordered: ORDERED_MARKER.test(markerText),
      level: Math.max(1, Number(MSO_LEVEL.exec(style)?.[1] ?? 1)),
    });
  }

  let i = 0;
  while (i < items.length) {
    const run = [items[i]];
    let j = i + 1;
    while (j < items.length && followsDirectly(run[run.length - 1], items[j])) run.push(items[j++]);
    buildList(run, meta, doc);
    i = j;
  }
}

/** True when `b` is `a`'s next element sibling, ignoring whitespace between them. */
function followsDirectly(a: Element, b: Element): boolean {
  if (a.parentNode !== b.parentNode) return false;
  let n = a.nextSibling;
  while (n && n.nodeType === Node.TEXT_NODE && !n.nodeValue?.trim()) n = n.nextSibling;
  return n === b;
}

function buildList(
  run: Element[],
  meta: Map<Element, { ordered: boolean; level: number }>,
  doc: Document
) {
  const first = meta.get(run[0])!;
  const root = doc.createElement(first.ordered ? "ol" : "ul");
  run[0].parentNode!.insertBefore(root, run[0]);

  const stack = [{ list: root, level: first.level }];
  for (const p of run) {
    const { ordered, level } = meta.get(p)!;
    while (stack.length > 1 && level < stack[stack.length - 1].level) stack.pop();

    if (level > stack[stack.length - 1].level) {
      const parentList = stack[stack.length - 1].list;
      // A nested list hangs off the preceding <li>, or its own if the run starts deep.
      const host = parentList.lastElementChild ?? parentList.appendChild(doc.createElement("li"));
      const sub = doc.createElement(ordered ? "ol" : "ul");
      host.appendChild(sub);
      stack.push({ list: sub, level });
    }

    const li = doc.createElement("li");
    while (p.firstChild) li.appendChild(p.firstChild);
    stack[stack.length - 1].list.appendChild(li);
    p.remove();
  }
}

function appendClean(parent: Node, node: Node, doc: Document) {
  if (node.nodeType === Node.TEXT_NODE) {
    parent.appendChild(doc.createTextNode(node.nodeValue ?? ""));
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const el = node as Element;
  const tag = mapTag(el);

  if (tag === null) return;
  if (tag === "") {
    // Unwrapped, but re-apply any emphasis the wrapper carried only as CSS.
    let host = parent;
    if (el.tagName === "SPAN" || el.tagName === "FONT") {
      const style = el.getAttribute("style") || "";
      for (const [pattern, emphasis] of STYLED_EMPHASIS) {
        if (!pattern.test(style)) continue;
        const wrapper = doc.createElement(emphasis);
        host.appendChild(wrapper);
        host = wrapper;
      }
    }
    for (const child of Array.from(el.childNodes)) appendClean(host, child, doc);
    return;
  }

  const out = doc.createElement(tag);
  for (const name of ALLOWED_ATTRS[out.tagName] ?? []) {
    const value = el.getAttribute(name);
    if (value) out.setAttribute(name, value);
  }
  if (out.tagName === "A" && out.getAttribute("target") === "_blank") {
    out.setAttribute("rel", "noopener noreferrer");
  }

  for (const child of Array.from(el.childNodes)) appendClean(out, child, doc);
  parent.appendChild(out);
}

/** `null` = drop subtree, `""` = unwrap, otherwise the tag name to emit. */
function mapTag(el: Element): string | null {
  const t = el.tagName;
  if (t.includes(":") || DROP.has(t)) return null;
  if (UNWRAP.has(t)) return "";

  // Word's `<div class=WordSection1>` only wraps blocks; a Gmail/Outlook `<div>`
  // *is* a line. Keep the distinction rather than guessing one way for both.
  if (t === "DIV") return el.querySelector(BLOCK_CHILD) ? "" : "p";

  // The toolbars only offer H2 and H3, and the page already owns the H1.
  if (t === "H1") return "h2";
  if (t === "H4" || t === "H5" || t === "H6") return "h3";

  const style = el.getAttribute("style") || "";
  if (t === "B" || t === "STRONG") return FAUX_BOLD.test(style) ? "" : t.toLowerCase();
  if (t === "I" || t === "EM") return FAUX_ITALIC.test(style) ? "" : t.toLowerCase();

  if (t === "A") return SAFE_HREF.test(el.getAttribute("href") || "") ? "a" : "";
  if (t === "IMG") return SAFE_SRC.test(el.getAttribute("src") || "") ? "img" : null;

  return KEEP.has(t) ? t.toLowerCase() : "";
}

/** Word pads documents with `<p>&nbsp;</p>` and `<p><o:p></o:p></p>` spacers. */
function pruneEmpty(root: HTMLElement) {
  // Emphasis wrappers first: a `<span style="font-weight:bold">` holding only a
  // Word spacer run would otherwise leave an empty `<b>` behind.
  for (const el of Array.from(root.querySelectorAll("b,i,u,s,strong,em,a"))) {
    if (!el.textContent && !el.querySelector("img")) el.remove();
  }
  for (const el of Array.from(root.querySelectorAll("p,h2,h3,li,blockquote"))) {
    if (el.querySelector("img,table")) continue;
    if (!el.textContent?.replace(/[\s\u00a0]/g, "")) el.remove();
  }
  for (const list of Array.from(root.querySelectorAll("ul,ol"))) {
    if (!list.querySelector("li")) list.remove();
  }
}
