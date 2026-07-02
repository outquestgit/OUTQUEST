"use client";

import { useEffect } from "react";
import type { QuestContent } from "@/lib/quests";

type Term = { id: string; kind: string; name: string };

/** Serializable quest data the bridge uses to populate the editor on Edit. */
export type EditQuest = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  level: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  card_icon: string | null;
  card_color: string | null;
  card_gradient: string | null;
  timeline_label: string | null;
  difficulty_label: string | null;
  monthly_budget: string | null;
  best_time: string | null;
  location_label: string | null;
  duration: string | null;
  featured_image_path: string | null;
  card_image_path: string | null;
  og_image_url: string | null;
  slides: string[];
  arts: string[];
  content: QuestContent;
  visibility: string;
  featured: boolean;
  hide_frontend: boolean;
  display_order: number;
  terms: { kind: string; name: string }[];
};

/** Chip-group `<label>` text → taxonomy kind. */
const GROUP_KIND: Record<string, string> = {
  Budget: "budget",
  Timeline: "duration",
  Difficulty: "difficulty",
  "Delivery Mode": "delivery",
  "Life Direction": "life_direction",
  "Outcome Goal": "outcome_goal",
};

// Placeholders that uniquely identify the editor's free-text display-label inputs.
const PH = {
  timeline: "e.g. 1–6 Months",
  difficulty: "e.g. easy / moderate / hard",
  monthly: "e.g. $800–$1,400 / mo",
  bestTime: "e.g. Apr–Oct",
  location: "e.g. Bali, Indonesia",
};
const key = (kind: string, name: string) => `${kind}::${name.trim().toLowerCase()}`;

// Placeholders that uniquely identify the editor's no-id hero / content fields.
const TAGLINE_PH = "Short punchy headline for the hero…";
const INTRO_PH = "2–3 sentence intro shown below the hero…";
const UNLOCKS_INTRO_PH = "e.g. This quest is designed to help you…";
const COMP_HEAD_PH = "e.g. Better with a companion";
const COMP_BODY_PH = "Supporting line…";
const COMP_BTN_PH = "e.g. Send this quest to a friend";

/**
 * Makes the reference admin's Quest editor create AND update quests — WITHOUT
 * changing the design. On "Edit" it loads the clicked quest into the existing
 * fields; on Save it reads them back (by stable ids / chip selections /
 * placeholders) and POSTs (create) or PUTs (update). No markup or styles are
 * altered; we only attach handlers to the editor's existing buttons.
 */
export default function QuestEditorBridge({
  terms,
  quests,
}: {
  terms: Term[];
  quests: EditQuest[];
}) {
  useEffect(() => {
    const root = document.getElementById("page-quests-edit");
    const list = document.getElementById("page-quests-list");
    if (!root) return;

    let currentEditId: string | null = null;

    // Mutable so the editor can pick up taxonomy changes (added/renamed/removed
    // terms) broadcast by the Taxonomies section without a full page reload.
    let liveTerms: Term[] = terms;
    const termId = new Map<string, string>();
    const indexTerms = () => {
      termId.clear();
      liveTerms.forEach((t) => termId.set(key(t.kind, t.name), t.id));
    };
    indexTerms();
    const questById = new Map<string, EditQuest>();
    quests.forEach((q) => questById.set(q.id, q));

    // ── readers ──────────────────────────────────────────────────────────
    const val = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      return el ? el.value.trim() : "";
    };
    const isChecked = (id: string) =>
      !!(document.getElementById(id) as HTMLInputElement | null)?.checked;
    const phInput = (ph: string) =>
      root.querySelector<HTMLInputElement>(`input[placeholder="${ph}"]`);
    const readPh = (ph: string) => phInput(ph)?.value.trim() ?? "";
    // Find the Country / Category select by its field label (robust even after
    // the options are regenerated from the DB).
    const selectByLabel = (labelText: string): HTMLSelectElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        if (field.querySelector("label")?.textContent?.trim() === labelText) {
          const s = field.querySelector("select");
          if (s) return s;
        }
      }
      return null;
    };

    const escHtml = (s: string) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    // The link: rebuild the editor's taxonomy chips + Country/Category options
    // from the live taxonomy (same markup), so taxonomy edits are reflected here.
    // Mid-session additions arrive via the `admin:taxonomy-changed` event below.
    const regenTaxonomy = () => {
      const byKind: Record<string, Term[]> = {};
      liveTerms.forEach((t) => (byKind[t.kind] ??= []).push(t));
      const fillSelect = (sel: HTMLSelectElement | null, kind: string) => {
        if (!sel) return;
        const cur = sel.value;
        sel.innerHTML =
          `<option value="">Select…</option>` +
          (byKind[kind] ?? []).map((t) => `<option>${escHtml(t.name)}</option>`).join("");
        if (cur) sel.value = cur;
      };
      fillSelect(selectByLabel("Country"), "country");
      fillSelect(selectByLabel("Category"), "category");
      root.querySelectorAll(".multi-options").forEach((group) => {
        const label = group.closest(".field")?.querySelector("label")?.textContent?.trim() ?? "";
        const kind = GROUP_KIND[label];
        if (!kind) return;
        // No inline onclick — a single delegated listener (wired below) toggles
        // any .ms-chip, so React- and DB-rendered chips behave identically.
        group.innerHTML = (byKind[kind] ?? [])
          .map((t) => `<span class="ms-chip">${escHtml(t.name)}</span>`)
          .join("");
      });
    };

    const collectTermIds = (): string[] => {
      const ids: string[] = [];
      root.querySelectorAll(".multi-options").forEach((group) => {
        const label = group.closest(".field")?.querySelector("label")?.textContent?.trim() ?? "";
        const kind = GROUP_KIND[label];
        if (!kind) return;
        group.querySelectorAll(".ms-chip.selected").forEach((chip) => {
          const id = termId.get(key(kind, chip.textContent ?? ""));
          if (id) ids.push(id);
        });
      });
      const country = selectByLabel("Country")?.value.trim() ?? "";
      const category = selectByLabel("Category")?.value.trim() ?? "";
      const cId = termId.get(key("country", country));
      const catId = termId.get(key("category", category));
      if (cId) ids.push(cId);
      if (catId) ids.push(catId);
      return [...new Set(ids)];
    };

    // ── writers (populate / clear) ───────────────────────────────────────
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = v;
    };
    const setChecked = (id: string, v: boolean) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.checked = v;
    };
    const setPh = (ph: string, v: string) => {
      const el = phInput(ph);
      if (el) el.value = v;
    };
    const setSelect = (sel: HTMLSelectElement | null, v: string) => {
      if (sel) sel.value = v;
    };
    // Mirror admin.js setStatus: button[0]=Draft, button[1]=Published.
    const setStatusToggle = (published: boolean) => {
      const sw = document.getElementById("q-status");
      if (!sw) return;
      Array.from(sw.querySelectorAll("button")).forEach((b, i) => {
        b.className =
          i === 0 ? (published ? "" : "active-draft") : i === 1 ? (published ? "active-published" : "") : "";
      });
    };

    const setChips = (q: EditQuest | null) => {
      const wanted = new Set((q?.terms ?? []).map((t) => key(t.kind, t.name)));
      root.querySelectorAll(".multi-options").forEach((group) => {
        const label = group.closest(".field")?.querySelector("label")?.textContent?.trim() ?? "";
        const kind = GROUP_KIND[label];
        group.querySelectorAll(".ms-chip").forEach((chip) => {
          const on = !!kind && wanted.has(key(kind, chip.textContent ?? ""));
          chip.classList.toggle("selected", on);
        });
      });
    };

    // ── extra readers/writers for the full editor ────────────────────────
    const phTextarea = (ph: string) =>
      root.querySelector<HTMLTextAreaElement>(`textarea[placeholder="${ph}"]`);
    const setPhTextarea = (ph: string, v: string) => {
      const el = phTextarea(ph);
      if (el) el.value = v;
    };
    const urlInput = () => root.querySelector<HTMLInputElement>('input[type="url"]');
    const fileByLabel = (text: string): HTMLInputElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        const lbl = field.querySelector("label")?.textContent?.trim() ?? "";
        if (lbl.startsWith(text)) {
          const f = field.querySelector<HTMLInputElement>('input[type="file"]');
          if (f) return f;
        }
      }
      return null;
    };
    // Card thumbnail file input, found by its field label. (The editor wires its
    // live preview via React's onChange, which renders no `onchange` attribute,
    // so an attribute selector would never match.)
    const cardThumbInput = () => fileByLabel("Card Thumbnail");

    // Rich-text (contenteditable .rte-area) fields, found by their field label.
    const rteArea = (label: string): HTMLElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        if (field.querySelector("label")?.textContent?.trim() === label) {
          const a = field.querySelector<HTMLElement>(".rte-area");
          if (a) return a;
        }
      }
      return null;
    };
    const readRte = (label: string): string => {
      const a = rteArea(label);
      if (!a) return "";
      if ((a.textContent ?? "").trim() === "" && !a.querySelector("img")) return "";
      return a.innerHTML.trim();
    };
    const setRte = (label: string, html: string) => {
      const a = rteArea(label);
      if (a) a.innerHTML = html ?? "";
    };
    const companionToggle = () =>
      phInput(COMP_HEAD_PH)
        ?.closest(".end-cta-block")
        ?.querySelector<HTMLInputElement>('input[type="checkbox"]') ?? null;

    // Show a saved image inside its `.img-upload` dropzone on Edit (file inputs
    // can't be pre-filled), and clear it back on reset.
    const previewImg = (input: HTMLInputElement | null, url: string | null) => {
      const box = input?.closest<HTMLElement>(".img-upload");
      if (!box) return;
      const label = box.querySelector<HTMLElement>(".img-upload-label");
      if (label && !label.dataset.orig) label.dataset.orig = label.textContent ?? "";
      if (url) {
        box.style.backgroundImage = `url(${url})`;
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.minHeight = "120px";
        if (label) label.textContent = "Image set — click to replace";
      } else {
        box.style.backgroundImage = "";
        if (label) label.textContent = label.dataset.orig ?? label.textContent ?? "";
      }
    };

    // ── repeater helpers (read all rows / rebuild from data) ─────────────
    type Cell = HTMLInputElement | HTMLTextAreaElement;
    const cellsOf = (item: Element): Cell[] =>
      Array.from(item.querySelectorAll("input, textarea")) as Cell[];
    const readRepeater = (repId: string): string[][] => {
      const rep = document.getElementById(repId);
      if (!rep) return [];
      return (Array.from(rep.querySelectorAll(":scope > .repeater-item")) as HTMLElement[]).map(
        (item) => cellsOf(item).map((c) => c.value.trim())
      );
    };
    const fillRepeater = (repId: string, rows: string[][]) => {
      const rep = document.getElementById(repId);
      if (!rep) return;
      const items = Array.from(rep.querySelectorAll(":scope > .repeater-item")) as HTMLElement[];
      const template = items[0];
      if (!template) return;
      const make = (idx: number, values: string[] | null) => {
        const clone = template.cloneNode(true) as HTMLElement;
        const titleEl = clone.querySelector(".repeater-item-title");
        if (titleEl) titleEl.textContent = (titleEl.textContent ?? "").replace(/\d+/, String(idx + 1));
        cellsOf(clone).forEach((c, i) => {
          if (c.type === "checkbox") return;
          c.value = values ? values[i] ?? "" : "";
        });
        return clone;
      };
      items.forEach((it) => it.remove());
      if (rows.length === 0) rep.appendChild(make(0, null));
      else rows.forEach((r, i) => rep.appendChild(make(i, r)));
    };

    // Gallery: already-saved image URLs + newly-picked files awaiting upload.
    let currentGallery: string[] = [];
    let pendingGalleryFiles: File[] = [];

    const galleryInput = () => fileByLabel("Gallery Images");
    // A thumbnail strip injected under the Gallery dropzone so saved + pending
    // images are visible and removable (the reference markup has no such list).
    const galleryStrip = (): HTMLElement | null => {
      const field = galleryInput()?.closest<HTMLElement>(".field");
      if (!field) return null;
      let strip = field.querySelector<HTMLElement>(".q-gallery-strip");
      if (!strip) {
        strip = document.createElement("div");
        strip.className = "q-gallery-strip";
        strip.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-top:10px";
        field.appendChild(strip);
      }
      return strip;
    };
    const renderGallery = () => {
      const strip = galleryStrip();
      if (!strip) return;
      strip.innerHTML = "";
      const addThumb = (src: string, remove: () => void) => {
        const cell = document.createElement("div");
        cell.style.cssText =
          "position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid var(--border)";
        const img = document.createElement("div");
        img.style.cssText = `width:100%;height:100%;background:url("${src}") center/cover`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "×";
        btn.title = "Remove image";
        btn.style.cssText =
          "position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;cursor:pointer;font-size:13px;line-height:1;display:flex;align-items:center;justify-content:center";
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          remove();
          renderGallery();
        });
        cell.append(img, btn);
        strip.appendChild(cell);
      };
      currentGallery.forEach((url, i) =>
        addThumb(url, () => (currentGallery = currentGallery.filter((_, j) => j !== i)))
      );
      pendingGalleryFiles.forEach((file, i) =>
        addThumb(URL.createObjectURL(file), () => (pendingGalleryFiles = pendingGalleryFiles.filter((_, j) => j !== i)))
      );
    };

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

    // Build the editor-managed `content` object from the current form state.
    const readContent = (): QuestContent => {
      const content: QuestContent = {};
      const intro = phTextarea(INTRO_PH)?.value.trim() ?? "";
      const immersive = readRte("Immersive Narrative");
      const unlocksIntro = readPh(UNLOCKS_INTRO_PH);
      const why = readRte("Why Do This");
      if (intro) content.intro = intro;
      if (immersive) content.immersive = immersive;
      if (why) content.why = why;
      if (unlocksIntro) content.unlocksIntro = unlocksIntro;

      const unlocks = readRepeater("unlocks-repeater")
        .map((r) => ({ i: r[0] ?? "", t: r[1] ?? "", p: r[2] ?? "" }))
        .filter((u) => u.i || u.t || u.p);
      if (unlocks.length) content.unlocks = unlocks;

      const embark = readRepeater("embark-repeater")
        .map((r) => ({ t: r[0] ?? "", p: r[1] ?? "" }))
        .filter((s) => s.t || s.p);
      if (embark.length) content.embark = embark;

      const faq = readRepeater("faq-repeater")
        .map((r) => ({ q: r[0] ?? "", a: r[1] ?? "" }))
        .filter((f) => f.q || f.a);
      if (faq.length) content.faq = faq;

      const head = phInput(COMP_HEAD_PH)?.value.trim() ?? "";
      const body = phTextarea(COMP_BODY_PH)?.value.trim() ?? "";
      const btn = phInput(COMP_BTN_PH)?.value.trim() ?? "";
      if (head || body) {
        const tog = companionToggle();
        content.companion = { heading: head, body, button: btn, show: tog ? tog.checked : true };
      }

      if (currentGallery.length) content.gallery = currentGallery;
      return content;
    };

    const populate = (q: EditQuest) => {
      const c = q.content ?? {};
      setVal("q-title", q.title);
      setVal("q-slug", q.slug);
      setVal("q-seo-title", q.seo_title ?? "");
      setVal("q-meta-desc", q.meta_description ?? "");
      setVal("q-card-icon", q.card_icon ?? "");
      setVal("q-card-color", q.card_color ?? "");
      setVal("q-display-order", String(q.display_order ?? 1));
      setVal("q-level", q.level ?? "");
      setVal("q-duration-display", q.duration ?? "");
      setVal("q-monthly-budget", q.monthly_budget ?? "");
      setVal("q-best-time", q.best_time ?? "");
      setRte("Immersive Narrative", c.immersive ?? "");
      setRte("Why Do This", c.why ?? "");
      setChecked("q-featured", q.featured);
      setChecked("q-popular", q.featured); // mirror — same flag as q-featured
      setChecked("q-hide-frontend", q.hide_frontend);
      setPh(PH.timeline, q.timeline_label ?? "");
      setPh(PH.difficulty, q.difficulty_label ?? "");
      setPh(PH.monthly, q.monthly_budget ?? "");
      setPh(PH.bestTime, q.best_time ?? "");
      setPh(PH.location, q.location_label ?? "");
      setPh(TAGLINE_PH, q.tagline ?? "");
      setPhTextarea(INTRO_PH, c.intro ?? "");
      setPh(UNLOCKS_INTRO_PH, c.unlocksIntro ?? "");
      const urlEl = urlInput();
      if (urlEl) urlEl.value = q.canonical_url ?? "";
      setPh(COMP_HEAD_PH, c.companion?.heading ?? "");
      setPhTextarea(COMP_BODY_PH, c.companion?.body ?? "");
      setPh(COMP_BTN_PH, c.companion?.button ?? "");
      const tog = companionToggle();
      if (tog) tog.checked = c.companion?.show !== false;
      setSelect(selectByLabel("Country"), q.terms.find((t) => t.kind === "country")?.name ?? "");
      setSelect(selectByLabel("Category"), q.terms.find((t) => t.kind === "category")?.name ?? "");
      setStatusToggle(["published", "featured", "coming_soon"].includes(q.visibility));
      setChips(q);

      const slides = q.slides ?? [];
      const arts = q.arts ?? [];
      fillRepeater("hero-slides-repeater", slides.map((g, i) => [g, arts[i] ?? ""]));
      fillRepeater("unlocks-repeater", (c.unlocks ?? []).map((u) => [u.i, u.t, u.p]));
      fillRepeater("embark-repeater", (c.embark ?? []).map((s) => [s.t, s.p]));
      fillRepeater("faq-repeater", (c.faq ?? []).map((f) => [f.q, f.a]));
      currentGallery = c.gallery ?? [];
      pendingGalleryFiles = [];
      renderGallery();

      // Show the already-saved images in their dropzones.
      previewImg(fileByLabel("Featured Image"), q.featured_image_path);
      previewImg(fileByLabel("OG Image"), q.og_image_url);
      previewImg(cardThumbInput(), q.card_image_path);
      const cardMock = document.getElementById("q-card-mock-img");
      if (cardMock && q.card_image_path) {
        cardMock.style.backgroundImage = `url(${q.card_image_path})`;
        cardMock.style.backgroundSize = "cover";
        cardMock.style.backgroundPosition = "center";
      }
    };

    const clearEditor = () => {
      [
        "q-title", "q-slug", "q-seo-title", "q-meta-desc", "q-card-icon", "q-card-color",
        "q-level", "q-duration-display", "q-monthly-budget", "q-best-time",
      ].forEach((id) => setVal(id, ""));
      setVal("q-display-order", "1");
      setChecked("q-featured", false);
      setChecked("q-popular", false);
      setChecked("q-hide-frontend", false);
      Object.values(PH).forEach((ph) => setPh(ph, ""));
      setPh(TAGLINE_PH, "");
      setPhTextarea(INTRO_PH, "");
      setPh(UNLOCKS_INTRO_PH, "");
      setPh(COMP_HEAD_PH, "");
      setPhTextarea(COMP_BODY_PH, "");
      setPh(COMP_BTN_PH, "");
      setRte("Immersive Narrative", "");
      setRte("Why Do This", "");
      const urlEl = urlInput();
      if (urlEl) urlEl.value = "";
      setSelect(selectByLabel("Country"), "");
      setSelect(selectByLabel("Category"), "");
      setStatusToggle(false);
      setChips(null);
      ["hero-slides-repeater", "unlocks-repeater", "embark-repeater", "faq-repeater"].forEach(
        (id) => fillRepeater(id, [])
      );
      currentGallery = [];
      pendingGalleryFiles = [];
      renderGallery();
      previewImg(fileByLabel("Featured Image"), null);
      previewImg(fileByLabel("OG Image"), null);
      previewImg(cardThumbInput(), null);
      const cardMock = document.getElementById("q-card-mock-img");
      if (cardMock) cardMock.style.backgroundImage = "";
    };

    // Reflect the live DB taxonomy in the editor's chips/selects on load.
    regenTaxonomy();

    // ── save (create or update) ──────────────────────────────────────────
    const save = async (status: "published" | "draft", btn: HTMLButtonElement) => {
      const title = val("q-title");
      if (!title) {
        window.alert("Please enter a quest title.");
        return;
      }

      const orig = btn.textContent;
      btn.setAttribute("disabled", "true");
      btn.textContent = "Saving…";

      // Upload any newly-chosen images first (preserved on the server otherwise).
      let featured_image_path = "";
      let card_image_path = "";
      let og_image_url = "";
      let uploadFailed = false;
      const tryUpload = async (file: File) => {
        const url = await uploadFile(file);
        if (!url) uploadFailed = true;
        return url ?? "";
      };
      const fFile = fileByLabel("Featured Image")?.files?.[0];
      const cFile = cardThumbInput()?.files?.[0];
      const oFile = fileByLabel("OG Image")?.files?.[0];
      if (fFile) featured_image_path = await tryUpload(fFile);
      if (cFile) card_image_path = await tryUpload(cFile);
      if (oFile) og_image_url = await tryUpload(oFile);
      if (pendingGalleryFiles.length) {
        const urls = (await Promise.all(pendingGalleryFiles.map(tryUpload))).filter(Boolean);
        currentGallery = [...currentGallery, ...urls];
        pendingGalleryFiles = [];
      }
      if (uploadFailed) {
        window.alert(
          "Image upload failed. Make sure you're signed in and the 'quests' storage bucket exists (run migration 0002). The quest was NOT saved."
        );
        btn.removeAttribute("disabled");
        btn.textContent = orig;
        return;
      }
      if (!og_image_url && featured_image_path) og_image_url = featured_image_path;

      // Hero slides → parallel slides[] (gradients) + arts[] (emoji), aligned.
      const slideRows = readRepeater("hero-slides-repeater").filter((r) => (r[0] ?? "").trim());
      const slides = slideRows.map((r) => r[0]);
      const arts = slideRows.map((r) => r[1] ?? "");

      const payload: Record<string, unknown> = {
        title,
        slug: val("q-slug"),
        status,
        tagline: readPh(TAGLINE_PH),
        level: val("q-level"),
        seo_title: val("q-seo-title"),
        meta_description: val("q-meta-desc"),
        canonical_url: urlInput()?.value.trim() ?? "",
        card_icon: val("q-card-icon"),
        card_color: val("q-card-color"),
        display_order: val("q-display-order"),
        featured: isChecked("q-featured") || isChecked("q-popular"),
        hide_frontend: isChecked("q-hide-frontend"),
        timeline_label: readPh(PH.timeline),
        difficulty_label: readPh(PH.difficulty),
        monthly_budget: readPh(PH.monthly) || val("q-monthly-budget"),
        best_time: readPh(PH.bestTime) || val("q-best-time"),
        location_label: readPh(PH.location),
        duration: val("q-duration-display"),
        slides,
        arts,
        content: readContent(),
        termIds: collectTermIds(),
      };
      if (featured_image_path) payload.featured_image_path = featured_image_path;
      if (card_image_path) payload.card_image_path = card_image_path;
      if (og_image_url) payload.og_image_url = og_image_url;

      const url = currentEditId ? `/api/admin/quests/${currentEditId}` : "/api/admin/quests";
      const method = currentEditId ? "PUT" : "POST";
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error || "Could not save the quest.");
          btn.removeAttribute("disabled");
          btn.textContent = orig;
          return;
        }
        window.location.href = "/admin?p=quests-list";
      } catch {
        window.alert("Network error — please try again.");
        btn.removeAttribute("disabled");
        btn.textContent = orig;
      }
    };

    // ── wire up the editor's existing buttons ────────────────────────────
    const cleanups: (() => void)[] = [];
    const on = (el: Element, ev: string, h: (e: Event) => void) => {
      el.addEventListener(ev, h);
      cleanups.push(() => el.removeEventListener(ev, h));
    };

    // Single delegated toggle for every meta chip (.ms-chip), attached once to
    // the editor root — so a click toggles exactly once whether the chip was
    // rendered by React or regenerated from the DB taxonomy.
    on(root, "click", (e) => {
      const chip = (e.target as HTMLElement).closest<HTMLElement>(".ms-chip");
      if (chip && root.contains(chip)) chip.classList.toggle("selected");
    });

    // Live taxonomy sync: when a term is added / renamed / removed / reordered in
    // the Taxonomies section, rebuild the editor's chips + Country/Category
    // selects so the change shows up without a full reload. The user's current
    // selections and select values are preserved across the rebuild.
    const onTaxonomyChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail as Term[] | undefined;
      if (!Array.isArray(detail)) return;
      const selected = new Set<string>();
      root.querySelectorAll<HTMLElement>(".multi-options .ms-chip.selected").forEach((chip) => {
        const label = chip.closest(".field")?.querySelector("label")?.textContent?.trim() ?? "";
        const kind = GROUP_KIND[label];
        if (kind) selected.add(key(kind, chip.textContent ?? ""));
      });
      liveTerms = detail;
      indexTerms();
      regenTaxonomy(); // preserves the <select> values internally
      // Re-apply chip selections (regen rebuilds the chip markup from scratch).
      root.querySelectorAll(".multi-options").forEach((group) => {
        const label = group.closest(".field")?.querySelector("label")?.textContent?.trim() ?? "";
        const kind = GROUP_KIND[label];
        group.querySelectorAll<HTMLElement>(".ms-chip").forEach((chip) => {
          chip.classList.toggle("selected", !!kind && selected.has(key(kind, chip.textContent ?? "")));
        });
      });
    };
    window.addEventListener("admin:taxonomy-changed", onTaxonomyChanged);
    cleanups.push(() => window.removeEventListener("admin:taxonomy-changed", onTaxonomyChanged));

    // Wire the Save buttons by stable id (robust); fall back to text match only
    // if the ids are ever missing.
    const wireSave = (el: Element | null, status: "published" | "draft") => {
      if (!el) return;
      on(el, "click", (e) => {
        e.preventDefault();
        void save(status, el as HTMLButtonElement);
      });
    };
    const pubBtn = document.getElementById("q-save-publish");
    const draftBtn = document.getElementById("q-save-draft");
    if (pubBtn || draftBtn) {
      wireSave(pubBtn, "published");
      wireSave(draftBtn, "draft");
    } else {
      root.querySelectorAll("button").forEach((b) => {
        const txt = (b.textContent ?? "").trim();
        const status = txt === "Save & Publish" ? "published" : txt === "Save Draft" ? "draft" : null;
        if (status) wireSave(b, status);
      });
    }

    list?.querySelectorAll<HTMLButtonElement>("button[data-quest-id]").forEach((b) => {
      const id = b.getAttribute("data-quest-id");
      on(b, "click", () => {
        currentEditId = id;
        const q = id ? questById.get(id) : undefined;
        if (q) populate(q);
      });
    });

    list?.querySelectorAll<HTMLButtonElement>("button[data-quest-del]").forEach((b) => {
      const id = b.getAttribute("data-quest-del");
      on(b, "click", async (e) => {
        e.preventDefault();
        if (!id) return;
        if (!window.confirm("Delete this quest? This can't be undone.")) return;
        b.setAttribute("disabled", "true");
        try {
          const res = await fetch(`/api/admin/quests/${id}`, { method: "DELETE" });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            window.alert(data.error || "Could not delete the quest.");
            b.removeAttribute("disabled");
            return;
          }
          window.location.href = "/admin?p=quests-list";
        } catch {
          window.alert("Network error — please try again.");
          b.removeAttribute("disabled");
        }
      });
    });

    list?.querySelectorAll("button").forEach((b) => {
      if ((b.textContent ?? "").includes("New Quest")) {
        on(b, "click", () => {
          currentEditId = null;
          clearEditor();
        });
      }
    });

    // Show an instant preview the moment an image is picked, so it's clear the
    // selection registered before saving. (Card thumbnail previews via the
    // editor's own extPreviewCardImg onChange.)
    const wirePreview = (input: HTMLInputElement | null) => {
      if (!input) return;
      on(input, "change", () => {
        const f = input.files?.[0];
        previewImg(input, f ? URL.createObjectURL(f) : null);
      });
    };
    wirePreview(fileByLabel("Featured Image"));
    wirePreview(fileByLabel("OG Image"));

    // Gallery: accumulate picked files into the pending list + thumbnail strip,
    // then clear the input so the same file can be re-picked and so the strip is
    // the single source of truth at save time.
    const gIn = galleryInput();
    if (gIn) {
      on(gIn, "change", () => {
        pendingGalleryFiles.push(...Array.from(gIn.files ?? []));
        gIn.value = "";
        renderGallery();
      });
    }
    renderGallery();

    return () => cleanups.forEach((fn) => fn());
  }, [terms, quests]);

  return null;
}
