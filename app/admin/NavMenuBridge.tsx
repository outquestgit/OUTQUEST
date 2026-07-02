"use client";

import { useEffect } from "react";
import type { NavConfig, NavLinkItem, NavBrand } from "@/lib/site/chromeConfig";

/**
 * Wires the reference admin "Nav Menu" page to the DB (no UI change). On mount it
 * rebuilds the `#nav-links-repeater` from the saved nav config — including each
 * link's dropdown children when "Has dropdown" is on — and wires the "Save Nav
 * Menu" button to PUT `/api/admin/site-settings`. The repeater rows + dropdown
 * builder live in `public/admin.js` (addNavLink / toggleNavDropdown /
 * addNavDropdownItem).
 */
export default function NavMenuBridge({ nav }: { nav: NavConfig }) {
  useEffect(() => {
    const page = document.getElementById("page-nav-menu");
    if (!page) return;
    type W = Window & Record<string, unknown>;
    const w = window as unknown as W;
    const cleanups: (() => void)[] = [];

    const val = (el: Element | null | undefined) =>
      (el as HTMLInputElement | HTMLSelectElement | null)?.value.trim() ?? "";

    // ── Branding (logo image + favicon + alt + link) ─────────────────────────
    // Saved baseline; preserved across saves when no new file is picked.
    const currentBrand: NavBrand = {
      logoUrl: nav.brand?.logoUrl ?? "",
      logoAlt: nav.brand?.logoAlt ?? "",
      logoLink: nav.brand?.logoLink ?? "",
      faviconUrl: nav.brand?.faviconUrl ?? "",
    };

    const fileInput = (areaId: string) =>
      document.querySelector<HTMLInputElement>(`#${areaId} input[type="file"]`);

    // Reuse the existing admin image-upload endpoint (public `quests` bucket).
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

    // Show a saved image in its dropzone (file inputs can't be pre-filled).
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

    const populateBranding = () => {
      showAsset("logo-preview", "logo-upload-area", currentBrand.logoUrl);
      showAsset("fav-preview", "fav-upload-area", currentBrand.faviconUrl);
      const alt = document.getElementById("nav-logo-alt") as HTMLInputElement | null;
      const link = document.getElementById("nav-logo-link") as HTMLInputElement | null;
      if (alt) alt.value = currentBrand.logoAlt;
      // Keep the reference default ("/") when nothing custom was saved.
      if (link && currentBrand.logoLink) link.value = currentBrand.logoLink;
    };

    // ── CTA button / Display options / Nav style ─────────────────────────────
    // The two <input type="color"> fields can't be empty, so the reference
    // defaults double as "use stylesheet default" sentinels: a saved empty
    // colour shows the sentinel, and picking exactly the sentinel saves empty
    // (keeps the site's translucent default bar instead of forcing a colour).
    const SENTINEL_BG = "#ffffff";
    const SENTINEL_TEXT = "#1a1814";
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      if (el) el.value = v;
    };
    const setChk = (id: string, v: boolean) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.checked = v;
    };
    const getVal = (id: string) =>
      ((document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "").trim();
    const getChk = (id: string) =>
      !!(document.getElementById(id) as HTMLInputElement | null)?.checked;

    const populateExtras = () => {
      const cta = nav.cta;
      if (cta) {
        setVal("nav-cta-label", cta.label ?? "");
        setVal("nav-cta-url", cta.url ?? "");
        setVal("nav-cta-style", cta.style === "ghost" ? "ghost" : "primary");
        setChk("nav-cta-show", cta.show !== false);
      }
      const d = nav.display;
      if (d) {
        setChk("nav-disp-sticky", d.sticky !== false);
        setChk("nav-disp-allpages", d.showOnAllPages !== false);
        setChk("nav-disp-transparent", !!d.transparentOnHero);
      }
      const s = nav.style;
      if (s) {
        setVal("nav-style-bg", s.bgColor || SENTINEL_BG);
        setVal("nav-style-text", s.textColor || SENTINEL_TEXT);
        setChk("nav-style-border", s.showBorder !== false);
      }
    };

    const readExtras = () => {
      const bg = getVal("nav-style-bg").toLowerCase();
      const text = getVal("nav-style-text").toLowerCase();
      return {
        cta: {
          label: getVal("nav-cta-label"),
          url: getVal("nav-cta-url"),
          style: getVal("nav-cta-style") === "ghost" ? "ghost" : "primary",
          show: getChk("nav-cta-show"),
        } as NavConfig["cta"],
        display: {
          sticky: getChk("nav-disp-sticky"),
          showOnAllPages: getChk("nav-disp-allpages"),
          transparentOnHero: getChk("nav-disp-transparent"),
        } as NavConfig["display"],
        style: {
          bgColor: bg === SENTINEL_BG ? "" : bg,
          textColor: text === SENTINEL_TEXT ? "" : text,
          showBorder: getChk("nav-style-border"),
        } as NavConfig["style"],
      };
    };

    const populate = () => {
      const rep = document.getElementById("nav-links-repeater");
      const addNavLink = w.addNavLink as (() => HTMLElement) | undefined;
      const addDD = w.addNavDropdownItem as ((btn: HTMLElement) => HTMLElement) | undefined;
      const toggleDD = w.toggleNavDropdown as ((cb: HTMLElement) => void) | undefined;
      if (!rep || typeof addNavLink !== "function") return;
      rep.innerHTML = "";
      (nav.links ?? []).forEach((link) => {
        const item = addNavLink();
        const set = (sel: string, v: string) => {
          const el = item.querySelector<HTMLInputElement | HTMLSelectElement>(sel);
          if (el) el.value = v;
        };
        set(".nav-label", link.label ?? "");
        set(".nav-url", link.url ?? "");
        set(".nav-target", link.target ?? "_self");
        if (link.dropdown && link.dropdown.length) {
          const cb = item.querySelector<HTMLInputElement>(".nav-has-dd");
          if (cb && typeof toggleDD === "function") {
            cb.checked = true;
            toggleDD(cb); // reveal block (+ auto-adds one blank row)
          }
          const list = item.querySelector<HTMLElement>(".nav-dd-list");
          // Must be the "＋ Add Dropdown Item" button specifically. After
          // toggleDD() auto-adds a blank row, a `.repeater-remove` (×) button
          // exists first inside `.nav-dd-block`, so a plain `button` selector
          // would grab the wrong one — `addNavDropdownItem` then appends rows
          // to the wrong node and they never show up.
          const addBtn = item.querySelector<HTMLElement>(".nav-dd-block > .add-repeater-btn");
          if (list && addBtn && typeof addDD === "function") {
            list.innerHTML = ""; // drop the auto-added blank
            link.dropdown.forEach((c) => {
              const row = addDD(addBtn);
              const l = row.querySelector<HTMLInputElement>(".nav-dd-label");
              const u = row.querySelector<HTMLInputElement>(".nav-dd-url");
              if (l) l.value = c.label ?? "";
              if (u) u.value = c.url ?? "";
            });
          }
        }
      });
    };

    const readLinks = (): NavLinkItem[] => {
      const out: NavLinkItem[] = [];
      document.querySelectorAll<HTMLElement>("#nav-links-repeater > .nav-link-item").forEach((item) => {
        const label = val(item.querySelector(".nav-label"));
        if (!label) return;
        const link: NavLinkItem = {
          label,
          url: val(item.querySelector(".nav-url")),
          target:
            (item.querySelector<HTMLSelectElement>(".nav-target")?.value as NavLinkItem["target"]) ??
            "_self",
        };
        if (item.querySelector<HTMLInputElement>(".nav-has-dd")?.checked) {
          const dd = Array.from(item.querySelectorAll<HTMLElement>(".nav-dd-list > .nav-dd-item"))
            .map((row) => ({
              label: val(row.querySelector(".nav-dd-label")),
              url: val(row.querySelector(".nav-dd-url")),
            }))
            .filter((c) => c.label);
          if (dd.length) link.dropdown = dd;
        }
        out.push(link);
      });
      return out;
    };

    // ── drag-to-reorder for the top-level nav links ──────────────────────────
    // Native HTML5 drag, delegated on the repeater container so dynamically
    // added rows ("＋ Add Link") work too. The order isn't persisted on drop —
    // readLinks() reads DOM order when "Save Nav Menu" is pressed. Items hold
    // text inputs, so dragging is armed only via mousedown on the ⠿ handle
    // (otherwise `draggable` would block selecting text inside the inputs).
    const wireDrag = () => {
      const rep = document.getElementById("nav-links-repeater");
      if (!rep) return;
      let dragEl: HTMLElement | null = null;

      const topItem = (el: EventTarget | null) => {
        const item = (el as HTMLElement | null)?.closest<HTMLElement>(".nav-link-item");
        return item && item.parentElement === rep ? item : null;
      };
      const itemAfter = (y: number): HTMLElement | null => {
        const items = Array.from(
          rep.querySelectorAll<HTMLElement>(":scope > .nav-link-item:not(.nav-dragging)")
        );
        for (const it of items) {
          const box = it.getBoundingClientRect();
          if (y < box.top + box.height / 2) return it;
        }
        return null;
      };

      const onMouseDown = (e: Event) => {
        const handle = (e.target as HTMLElement).closest(".repeater-drag");
        if (!handle) return;
        const item = topItem(handle);
        if (item) item.setAttribute("draggable", "true");
      };
      const onDragStart = (e: DragEvent) => {
        const item = topItem(e.target);
        if (!item || item.getAttribute("draggable") !== "true") return;
        dragEl = item;
        item.classList.add("nav-dragging");
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      };
      const onDragOver = (e: DragEvent) => {
        if (!dragEl) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        const after = itemAfter(e.clientY);
        if (after == null) rep.appendChild(dragEl);
        else rep.insertBefore(dragEl, after);
      };
      const onDrop = (e: DragEvent) => e.preventDefault();
      const onDragEnd = () => {
        if (!dragEl) return;
        dragEl.classList.remove("nav-dragging");
        dragEl.removeAttribute("draggable"); // re-enable input text selection
        dragEl = null;
      };

      rep.addEventListener("mousedown", onMouseDown);
      rep.addEventListener("dragstart", onDragStart);
      rep.addEventListener("dragover", onDragOver);
      rep.addEventListener("drop", onDrop);
      rep.addEventListener("dragend", onDragEnd);
      cleanups.push(() => {
        rep.removeEventListener("mousedown", onMouseDown);
        rep.removeEventListener("dragstart", onDragStart);
        rep.removeEventListener("dragover", onDragOver);
        rep.removeEventListener("drop", onDrop);
        rep.removeEventListener("dragend", onDragEnd);
      });
    };

    // Build the brand payload, uploading any newly-picked logo / favicon first.
    // Returns null if an upload failed (so the caller can abort the save).
    const readBrand = async (): Promise<NavBrand | null> => {
      const brand: NavBrand = { ...currentBrand };
      brand.logoAlt = val(document.getElementById("nav-logo-alt"));
      const link = val(document.getElementById("nav-logo-link"));
      brand.logoLink = link === "/" ? "" : link; // "/" is the default → store empty

      const logoFile = fileInput("logo-upload-area")?.files?.[0];
      if (logoFile) {
        const url = await uploadFile(logoFile);
        if (!url) return null;
        brand.logoUrl = url;
      }
      const favFile = fileInput("fav-upload-area")?.files?.[0];
      if (favFile) {
        const url = await uploadFile(favFile);
        if (!url) return null;
        brand.faviconUrl = url;
      }
      return brand;
    };

    const save = async (btn: HTMLButtonElement) => {
      const orig = btn.textContent;
      btn.setAttribute("disabled", "true");
      btn.textContent = "Saving…";
      try {
        const brand = await readBrand();
        if (!brand) {
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
          body: JSON.stringify({ nav: { links: readLinks(), brand, ...readExtras() } }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error || "Could not save the navigation.");
        } else {
          // Promote the uploaded URLs to the new baseline and clear the file
          // inputs so a follow-up save doesn't re-upload the same files.
          Object.assign(currentBrand, brand);
          const lf = fileInput("logo-upload-area");
          const ff = fileInput("fav-upload-area");
          if (lf) lf.value = "";
          if (ff) ff.value = "";
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

    // Wire the "Save Nav Menu" button.
    page.querySelectorAll("button").forEach((b) => {
      if ((b.textContent ?? "").trim() === "Save Nav Menu") {
        const h = (e: Event) => {
          e.preventDefault();
          void save(b as HTMLButtonElement);
        };
        b.addEventListener("click", h);
        cleanups.push(() => b.removeEventListener("click", h));
      }
    });

    // admin.js declares addNavLink globally; wait for it before rebuilding.
    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      if (typeof w.addNavLink === "function" || tries > 40) {
        window.clearInterval(poll);
        populate();
        populateBranding();
        populateExtras();
        wireDrag();
      }
    }, 100);
    cleanups.push(() => window.clearInterval(poll));

    return () => cleanups.forEach((fn) => fn());
  }, [nav]);

  return null;
}
