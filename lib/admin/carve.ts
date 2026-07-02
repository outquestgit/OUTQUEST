/**
 * Cut a single `<div … id="page-X">…</div>` section out of the admin content
 * HTML so it can be replaced by a real component while the surrounding (not yet
 * converted) markup is passed through untouched.
 *
 * Returns `[before, section, after]`, or `null` if the id isn't found. Matching
 * is by `<div>` depth counting from the section's opening tag; the admin content
 * has no `<div` substrings inside text/attributes, so this is reliable. (Verify
 * with the build + the id-parity check after adding a section.)
 */
export function carveSection(html: string, id: string): [string, string, string] | null {
  const idIdx = html.indexOf(`id="${id}"`);
  if (idIdx === -1) return null;
  const openStart = html.lastIndexOf("<div", idIdx);
  if (openStart === -1) return null;
  return carveFrom(html, openStart);
}

/**
 * Like `carveSection` but keyed on the first `<div …>` opening tag that matches
 * `openMarker` (e.g. `<div class="pcms-section-card">`). Used to split a known
 * sub-block (the homepage Hero card / the sections grid) out of a larger blob.
 */
export function carveFirst(html: string, openMarker: string): [string, string, string] | null {
  const openStart = html.indexOf(openMarker);
  if (openStart === -1) return null;
  return carveFrom(html, openStart);
}

/**
 * Drop `.pcms-section-card` blocks whose `.pcms-section-name` is in `dropNames`.
 * Used to remove editor-only homepage sections that have no front-end section.
 */
export function filterSectionCards(html: string, dropNames: string[]): string {
  let out = "";
  let rem = html;
  for (;;) {
    const c = carveFirst(rem, '<div class="pcms-section-card">');
    if (!c) {
      out += rem;
      break;
    }
    const [before, card, after] = c;
    out += before;
    const m = card.match(/pcms-section-name">([^<]+)/);
    if (!dropNames.includes((m?.[1] ?? "").trim())) out += card;
    rem = after;
  }
  return out;
}

/** Depth-count `<div>`/`</div>` from `openStart` to find the balanced close. */
function carveFrom(html: string, openStart: number): [string, string, string] | null {
  let depth = 0;
  let i = openStart;
  while (i < html.length) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return null;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      i = nextClose + 6;
      if (depth === 0) {
        return [html.slice(0, openStart), html.slice(openStart, i), html.slice(i)];
      }
    }
  }
  return null;
}
