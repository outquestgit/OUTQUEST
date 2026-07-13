/**
 * IndexNow — notifies Bing (and other participating search engines) whenever
 * a URL is published or updated, so it gets crawled immediately rather than
 * waiting for the next sitemap poll.
 *
 * Spec: https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = "4ac1c85815b04e93a2dff815c82c4bd5";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";
const BING_ENDPOINT = "https://www.bing.com/indexnow";

/**
 * Ping Bing IndexNow with one or more URLs.
 * Fire-and-forget — never throws, logs failures silently so it never
 * blocks the admin save response.
 */
export async function pingIndexNow(urls: string | string[]): Promise<void> {
  const list = Array.isArray(urls) ? urls : [urls];
  if (!list.length) return;

  try {
    const res = await fetch(BING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: list,
      }),
    });

    if (!res.ok) {
      console.warn(`[IndexNow] Bing returned ${res.status} for`, list);
    } else {
      console.log(`[IndexNow] Pinged ${list.length} URL(s):`, list);
    }
  } catch (err) {
    console.warn("[IndexNow] Ping failed (non-fatal):", err);
  }
}