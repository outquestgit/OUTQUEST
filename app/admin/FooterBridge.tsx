"use client";

import { useEffect } from "react";
import type { FooterColumnItem, FooterConfig } from "@/lib/site/chromeConfig";

/**
 * Wires the reference admin "Footer" page to the DB (no UI change). On mount it
 * fills every editable field — newsletter strip, branding (wordmark / tagline /
 * image logo / social glyphs + URLs), link columns, bottom bar, and footer
 * style (colours + layout) — and wires the "Save Footer" button to PUT
 * `/api/admin/site-settings`. Column + link rows are built by `public/admin.js`
 * (addFooterColumn / addFooterLink).
 *
 * Note: the standalone "Social Links" card (Instagram…Pinterest with dismiss
 * buttons) is legacy reference markup that doesn't map to the 4-glyph footer
 * design — social URLs are edited in the Branding card and left decorative there.
 */
export default function FooterBridge({ footer }: { footer: FooterConfig }) {
  useEffect(() => {
    const page = document.getElementById("page-footer");
    if (!page) return;
    type W = Window & Record<string, unknown>;
    const w = window as unknown as W;
    const cleanups: (() => void)[] = [];

    const get = (id: string) =>
      document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    const setId = (id: string, v: string) => {
      const el = get(id);
      if (el) el.value = v;
    };
    const valId = (id: string) => get(id)?.value.trim() ?? "";
    const setChk = (id: string, v: boolean) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.checked = v;
    };
    const getChk = (id: string) => !!(document.getElementById(id) as HTMLInputElement | null)?.checked;

    const SOCIAL_IDS = ["ft-social1", "ft-social2", "ft-social3", "ft-social4", "ft-social5"];
    const SOCIAL_URL_IDS = ["ft-social1-url", "ft-social2-url", "ft-social3-url", "ft-social4-url", "ft-social5-url"];
    // The footer-style colour pickers can't be empty; their reference defaults
    // double as "use stylesheet default" sentinels (see NavMenuBridge).
    const SENTINEL_BG = "#1a1814";
    const SENTINEL_TEXT = "#f5f3ef";

    // Saved image-logo URL; preserved across saves when no new file is picked.
    let currentLogoUrl = footer.logoUrl ?? "";

    const logoFileInput = () =>
      document.querySelector<HTMLInputElement>('#ft-logo-upload-area input[type="file"]');

    const uploadFile = async (file: File): Promise<string | null> => {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/quests/upload", { method: "POST", body: fd });
        const data = (await res.json().catch(() => ({}))) as { url?: string };
        return res.ok ? data.url ?? null : null;
      } catch {
        return null;
      }
    };

    const showAsset = (imgId: string, areaId: string, url: string) => {
      if (!url) return;
      const img = document.getElementById(imgId) as HTMLImageElement | null;
      const area = document.getElementById(areaId);
      if (img) {
        img.src = url;
        img.style.display = "block";
      }
      const icon = area?.querySelector<HTMLElement>(".img-upload-icon");
      const lbl = area?.querySelector<HTMLElement>(".img-upload-label");
      if (icon) icon.style.display = "none";
      if (lbl) lbl.style.display = "none";
    };

    const populate = () => {
      setId("ft-wordmark1", footer.wordmark1);
      setId("ft-wordmark2", footer.wordmark2);
      setId("ft-tagline", footer.tagline);
      SOCIAL_IDS.forEach((id, i) => setId(id, footer.socials[i] ?? ""));
      SOCIAL_URL_IDS.forEach((id, i) => setId(id, footer.socialUrls?.[i] ?? ""));
      showAsset("ft-logo-preview", "ft-logo-upload-area", currentLogoUrl);
      setId("ft-copyright", footer.copyright);
      setId("ft-bottom-tagline", footer.bottomTagline);
      setChk("ft-show-social-bottom", !!footer.showSocialBottom);

      const nl = footer.newsletter;
      if (nl) {
        setId("ft-nl-eyebrow", nl.eyebrow);
        setId("ft-nl-heading", nl.heading);
        setId("ft-nl-subtext", nl.subtext);
        setId("ft-nl-placeholder", nl.emailPlaceholder);
        setId("ft-nl-button", nl.buttonLabel);
        setId("ft-nl-disclaimer", nl.disclaimer);
        setChk("ft-nl-show", nl.show !== false);
      }

      const st = footer.style;
      if (st) {
        setId("ft-style-bg", st.bgColor || SENTINEL_BG);
        setId("ft-style-text", st.textColor || SENTINEL_TEXT);
        setId("ft-style-layout", st.layout || "4col");
      }

      const rep = document.getElementById("footer-cols-repeater");
      const addCol = w.addFooterColumn as (() => void) | undefined;
      const addLink = w.addFooterLink as ((btn: HTMLElement) => void) | undefined;
      if (!rep || typeof addCol !== "function" || typeof addLink !== "function") return;
      rep.innerHTML = "";
      (footer.columns ?? []).slice(0, 4).forEach((col) => {
        addCol();
        const colItem = rep.lastElementChild as HTMLElement | null;
        if (!colItem) return;
        const heading = colItem.querySelector<HTMLInputElement>(":scope > .field input");
        if (heading) heading.value = col.label ?? "";
        const addLinkBtn = colItem.querySelector<HTMLElement>(":scope > button");
        const list = colItem.querySelector<HTMLElement>(":scope > .repeater");
        if (addLinkBtn && list) {
          (col.links ?? []).forEach((link) => {
            addLink(addLinkBtn);
            const row = list.lastElementChild as HTMLElement | null;
            const inputs = row?.querySelectorAll<HTMLInputElement>("input");
            if (inputs && inputs[0]) inputs[0].value = link.label ?? "";
            if (inputs && inputs[1]) inputs[1].value = link.url ?? "";
          });
        }
      });
    };

    const readColumns = (): FooterColumnItem[] => {
      const out: FooterColumnItem[] = [];
      document
        .querySelectorAll<HTMLElement>("#footer-cols-repeater > .repeater-item")
        .forEach((colItem) => {
          const label =
            colItem.querySelector<HTMLInputElement>(":scope > .field input")?.value.trim() ?? "";
          const list = colItem.querySelector<HTMLElement>(":scope > .repeater");
          const links = list
            ? Array.from(list.querySelectorAll<HTMLElement>(":scope > .repeater-item"))
                .map((row) => {
                  const inputs = row.querySelectorAll<HTMLInputElement>("input");
                  return { label: inputs[0]?.value.trim() ?? "", url: inputs[1]?.value.trim() ?? "" };
                })
                .filter((l) => l.label)
            : [];
          if (label || links.length) out.push({ label, links });
        });
      return out;
    };

    // Build the footer payload, uploading a newly-picked image logo first.
    // Returns null if the upload failed (caller aborts the save).
    const readFooter = async (): Promise<FooterConfig | null> => {
      // Social glyphs + their URLs, kept index-aligned (skip empty glyphs).
      const socials: string[] = [];
      const socialUrls: string[] = [];
      SOCIAL_IDS.forEach((id, i) => {
        const sym = valId(id);
        if (!sym) return;
        socials.push(sym);
        socialUrls.push(valId(SOCIAL_URL_IDS[i]));
      });

      let logoUrl = currentLogoUrl;
      const file = logoFileInput()?.files?.[0];
      if (file) {
        const url = await uploadFile(file);
        if (!url) return null;
        logoUrl = url;
      }

      const bg = valId("ft-style-bg").toLowerCase();
      const text = valId("ft-style-text").toLowerCase();
      const LAYOUTS = ["4col", "3col", "2col", "centered"] as const;
      const layoutRaw = valId("ft-style-layout");
      const layout = (LAYOUTS as readonly string[]).includes(layoutRaw)
        ? (layoutRaw as (typeof LAYOUTS)[number])
        : "4col";

      return {
        wordmark1: valId("ft-wordmark1"),
        wordmark2: valId("ft-wordmark2"),
        tagline: valId("ft-tagline"),
        socials,
        socialUrls,
        logoUrl,
        columns: readColumns(),
        copyright: valId("ft-copyright"),
        bottomTagline: valId("ft-bottom-tagline"),
        showSocialBottom: getChk("ft-show-social-bottom"),
        newsletter: {
          show: getChk("ft-nl-show"),
          eyebrow: valId("ft-nl-eyebrow"),
          heading: valId("ft-nl-heading"),
          subtext: valId("ft-nl-subtext"),
          emailPlaceholder: valId("ft-nl-placeholder"),
          buttonLabel: valId("ft-nl-button"),
          disclaimer: valId("ft-nl-disclaimer"),
        },
        style: {
          bgColor: bg === SENTINEL_BG ? "" : bg,
          textColor: text === SENTINEL_TEXT ? "" : text,
          layout,
        },
      };
    };

    const save = async (btn: HTMLButtonElement) => {
      const orig = btn.textContent;
      btn.setAttribute("disabled", "true");
      btn.textContent = "Saving…";
      try {
        const footerPayload = await readFooter();
        if (!footerPayload) {
          window.alert(
            "Image upload failed. Make sure you're signed in and the 'quests' storage bucket exists. Nothing was saved."
          );
          btn.removeAttribute("disabled");
          btn.textContent = orig;
          return;
        }
        const res = await fetch("/api/admin/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ footer: footerPayload }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error || "Could not save the footer.");
        } else {
          currentLogoUrl = footerPayload.logoUrl ?? "";
          const lf = logoFileInput();
          if (lf) lf.value = "";
          // Re-enable for the next edit — without this the button stays
          // internally disabled after the first successful save even though the
          // label resets, so subsequent clicks silently do nothing.
          btn.removeAttribute("disabled");
          btn.textContent = "Saved ✓";
          window.setTimeout(() => (btn.textContent = orig), 1500);
          return;
        }
      } catch {
        window.alert("Network error — please try again.");
      }
      btn.removeAttribute("disabled");
      btn.textContent = orig;
    };

    page.querySelectorAll("button").forEach((b) => {
      if ((b.textContent ?? "").trim() === "Save Footer") {
        const h = (e: Event) => {
          e.preventDefault();
          void save(b as HTMLButtonElement);
        };
        b.addEventListener("click", h);
        cleanups.push(() => b.removeEventListener("click", h));
      }
    });

    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      if (typeof w.addFooterColumn === "function" || tries > 40) {
        window.clearInterval(poll);
        populate();
      }
    }, 100);
    cleanups.push(() => window.clearInterval(poll));

    return () => cleanups.forEach((fn) => fn());
  }, [footer]);

  return null;
}
