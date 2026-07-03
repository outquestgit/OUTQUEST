"use client";

import { useEffect } from "react";
import type { JournalPost } from "@/lib/journal";

const EXCERPT_PH = "Short summary shown in listings and previews…";
const FOCUS_PH = "e.g. southeast asia travel budget";
const CANONICAL_PH = "https://joinoutquest.com/journal/…";

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "2026-06-22" → "June 2026" (the human label shown on cards). */
function monthLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
/** "2026-06-22" → "22/06/2026" (the picker's display text). */
function ddmmyyyy(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/**
 * Makes the reference admin's Journal editor create + update posts (no UI
 * change). Mirrors DealsBridge/QuestEditorBridge: reads/writes the existing
 * fields by id / placeholder / label, drives the rich-text body, and wires the
 * list's Edit/Del/New buttons. Fields the reference form doesn't expose (emoji,
 * gradient, author, read time, related…) are preserved from the loaded post so
 * editing never wipes them.
 */
export default function JournalBridge({
  posts,
  categories = [],
}: {
  posts: JournalPost[];
  /** Journal Category taxonomy term names — drive the editor's category select. */
  categories?: string[];
}) {
  useEffect(() => {
    const root = document.getElementById("page-journal-edit");
    const list = document.getElementById("page-journal-list");
    if (!root) return;

    let currentEditId: string | null = null;
    let currentPost: JournalPost | null = null;
    const postById = new Map(posts.map((p) => [p.id, p]));

    // ── readers / writers ────────────────────────────────────────────────
    const val = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      return el ? el.value.trim() : "";
    };
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = v;
    };
    const phEl = (ph: string) =>
      root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `input[placeholder="${ph}"], textarea[placeholder="${ph}"]`
      );
    const readPh = (ph: string) => phEl(ph)?.value.trim() ?? "";
    const setPh = (ph: string, v: string) => {
      const el = phEl(ph);
      if (el) el.value = v;
    };

    // Body rich-text (contenteditable #journal-body).
    const bodyEl = () => document.getElementById("journal-body");
    const readBody = () => {
      const a = bodyEl();
      if (!a) return "";
      if ((a.textContent ?? "").trim() === "" && !a.querySelector("img")) return "";
      return a.innerHTML.trim();
    };
    const setBody = (html: string) => {
      const a = bodyEl();
      if (a) a.innerHTML = html ?? "";
    };

    const urlInput = () =>
      root.querySelector<HTMLInputElement>(`input[type="url"][placeholder="${CANONICAL_PH}"]`) ??
      root.querySelector<HTMLInputElement>('input[type="url"]');

    // The two SEO toggles (index, then follow).
    const seoToggles = () =>
      Array.from(root.querySelectorAll<HTMLInputElement>('.toggle-wrap input[type="checkbox"]'));

    // Status toggle (#j-status: button[0]=Draft, button[1]=Published).
    const setStatusToggle = (published: boolean) => {
      const sw = document.getElementById("j-status");
      if (!sw) return;
      Array.from(sw.querySelectorAll("button")).forEach((b, i) => {
        b.className = i === 0 ? (published ? "" : "active-draft") : published ? "active-published" : "";
      });
    };

    // Publish date (hidden #pub-date-value + display #pub-date-text).
    const setPubDate = (iso: string | null) => {
      const hidden = document.getElementById("pub-date-value") as HTMLInputElement | null;
      const text = document.getElementById("pub-date-text");
      if (iso) {
        if (hidden) hidden.value = iso;
        if (text) text.textContent = ddmmyyyy(iso);
      }
    };
    const getPubDate = () =>
      (document.getElementById("pub-date-value") as HTMLInputElement | null)?.value.trim() ?? "";

    // ── schedule (auto-publish at a future date/time) ──────────────────────
    const pad = (n: number) => String(n).padStart(2, "0");
    const setSchedUI = (on: boolean) => {
      const t = document.getElementById("sched-toggle") as HTMLInputElement | null;
      if (t) t.checked = on;
      document.getElementById("sched-fields")?.classList.toggle("hidden", !on);
    };
    // Selected schedule timezone, in minutes east of UTC (from #sched-tz).
    const tzOffsetMin = () =>
      Number((document.getElementById("sched-tz") as HTMLSelectElement | null)?.value ?? "0") || 0;
    // Build the chosen schedule as an absolute UTC timestamp: the picked
    // date+time is read as wall-clock in the selected timezone, then converted to
    // UTC — so it publishes at that moment everywhere. "" when off / no date.
    const getScheduledAt = (): string => {
      const on = (document.getElementById("sched-toggle") as HTMLInputElement | null)?.checked;
      if (!on) return "";
      const date = (document.getElementById("sched-date-value") as HTMLInputElement | null)?.value.trim() ?? "";
      if (!date) return "";
      const hour = Number((document.getElementById("sched-hour") as HTMLSelectElement | null)?.value ?? "0");
      const min = Number((document.getElementById("sched-min") as HTMLSelectElement | null)?.value ?? "0");
      const [y, mo, d] = date.split("-").map(Number);
      if (!y || !mo || !d) return "";
      const utcMs = Date.UTC(y, mo - 1, d, hour, min) - tzOffsetMin() * 60000;
      return Number.isNaN(utcMs) ? "" : new Date(utcMs).toISOString();
    };
    // Restore the schedule UI from a saved scheduled_at (on Edit) — shown as the
    // wall-clock in the zone it was scheduled in (`tz`, minutes east of UTC) — or
    // clear it.
    const setScheduledAt = (iso: string | null, tz?: number | null) => {
      const t = iso ? Date.parse(iso) : NaN;
      if (Number.isNaN(t)) {
        setSchedUI(false);
        return;
      }
      // Re-select the stored zone so the displayed time matches what was entered.
      const tzSel = document.getElementById("sched-tz") as HTMLSelectElement | null;
      if (tzSel && tz != null && Array.from(tzSel.options).some((o) => Number(o.value) === tz)) {
        tzSel.value = String(tz);
      }
      // Shift the UTC instant into that zone, then read via getUTC* so the
      // displayed wall-clock matches it.
      const d = new Date(t + tzOffsetMin() * 60000);
      const dv = document.getElementById("sched-date-value") as HTMLInputElement | null;
      const dtext = document.getElementById("sched-date-text");
      const h = document.getElementById("sched-hour") as HTMLSelectElement | null;
      const m = document.getElementById("sched-min") as HTMLSelectElement | null;
      if (dv) dv.value = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
      if (dtext) dtext.textContent = `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
      if (h) h.value = pad(d.getUTCHours());
      if (m) m.value = pad(d.getUTCMinutes());
      setSchedUI(true);
    };

    // Category <select>, driven by the Journal Category taxonomy (plus any
    // category an existing post already uses, for back-compat). `liveCategories`
    // is mutable so the `admin:taxonomy-changed` event can refresh it live.
    let liveCategories = categories;
    const categorySelect = () => document.getElementById("j-category") as HTMLSelectElement | null;
    // The visible "Journal Categories" list — reflect the taxonomy (was a static
    // hardcoded list). Read-only here; managed under Taxonomies → Journal Category.
    const JCAT_COLORS = ["#e8440a", "#4a6cf7", "#2a9d6f", "#8a8278", "#c026d3", "#d97706"];
    const rebuildJcatList = () => {
      const el = document.getElementById("jcat-list");
      if (!el) return;
      el.innerHTML = liveCategories.length
        ? liveCategories
            .map(
              (name, i) =>
                `<div class="jcat-item"><span style="width:22px;height:22px;border-radius:6px;flex-shrink:0;background:${JCAT_COLORS[i % JCAT_COLORS.length]}"></span><span style="flex:1;font-size:13.5px">${esc(name)}</span></div>`
            )
            .join("")
        : `<div style="font-size:12px;color:var(--muted);padding:2px 0">No categories yet — add them under Taxonomies → Journal Category.</div>`;
    };
    const rebuildCategories = () => {
      const sel = categorySelect();
      // Only the Journal Category taxonomy terms — not categories scraped from
      // existing posts (which could be stale / non-taxonomy values).
      if (sel) {
        const cur = sel.value;
        sel.innerHTML =
          `<option value="">Select…</option>` +
          liveCategories.map((n) => `<option>${esc(n)}</option>`).join("");
        if (cur) sel.value = cur;
      }
      rebuildJcatList();
    };

    // ── images (upload on save; preview saved ones on edit) ──────────────
    const fileByLabel = (text: string): HTMLInputElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        if ((field.querySelector("label")?.textContent?.trim() ?? "").startsWith(text)) {
          const f = field.querySelector<HTMLInputElement>('input[type="file"]');
          if (f) return f;
        }
      }
      return null;
    };
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

    // ── populate / clear ─────────────────────────────────────────────────
    // Primary button label reflects the action: "Schedule" when a schedule is
    // set, otherwise "Save" (editing) / "Publish" (new). Call after the schedule
    // toggle is set.
    const setSaveLabel = () => {
      const b = document.getElementById("j-save-publish");
      if (!b) return;
      const scheduled = (document.getElementById("sched-toggle") as HTMLInputElement | null)?.checked;
      b.textContent = scheduled ? "Schedule" : currentEditId ? "Save" : "Publish";
    };

    const populate = (p: JournalPost) => {
      currentPost = p;
      setVal("j-title", p.title);
      setVal("j-slug", p.slug);
      setPh(EXCERPT_PH, p.excerpt ?? "");
      setBody(p.body ?? "");
      setVal("j-seo-title", p.seo_title ?? "");
      setVal("j-meta-desc", p.meta_description ?? "");
      setPh(FOCUS_PH, p.focus_keyword ?? "");
      const u = urlInput();
      if (u) u.value = p.canonical_url ?? "";
      const [idxT, folT] = seoToggles();
      if (idxT) idxT.checked = !p.noindex;
      if (folT) folT.checked = !p.nofollow;
      setStatusToggle(["published", "featured", "coming_soon"].includes(p.visibility));
      if (p.published_at) setPubDate(p.published_at);
      setScheduledAt(p.scheduled_at, p.scheduled_tz);
      setSaveLabel();
      rebuildCategories();
      const sel = categorySelect();
      if (sel) sel.value = p.category ?? "";
      previewImg(fileByLabel("Featured Image"), p.featured_image_path);
      previewImg(fileByLabel("OG Image"), p.og_image_url);
    };

    const clearEditor = () => {
      currentPost = null;
      ["j-title", "j-slug", "j-seo-title", "j-meta-desc"].forEach((id) => setVal(id, ""));
      setPh(EXCERPT_PH, "");
      setPh(FOCUS_PH, "");
      setBody("");
      const u = urlInput();
      if (u) u.value = "";
      const [idxT, folT] = seoToggles();
      if (idxT) idxT.checked = true;
      if (folT) folT.checked = true;
      setStatusToggle(false);
      setScheduledAt(null);
      // Default a new post's publish date to today (it was stuck on the editor's
      // hardcoded reference date — or the previously-edited post's date).
      const now = new Date();
      const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      setPubDate(todayIso);
      rebuildCategories();
      const sel = categorySelect();
      if (sel) sel.value = "";
      previewImg(fileByLabel("Featured Image"), null);
      previewImg(fileByLabel("OG Image"), null);
      setSaveLabel();
    };

    // ── save (create or update) ──────────────────────────────────────────
    // `useSchedule` only applies the future publish time when the user explicitly
    // schedules (the Confirm Schedule button). Publish / Save Draft ignore it and
    // publish/save immediately (so "Publish" appears right away).
    const save = async (status: "published" | "draft", btn: HTMLButtonElement, useSchedule = false) => {
      const title = val("j-title");
      if (!title) {
        window.alert("Please enter a post title.");
        return;
      }
      const scheduledAt = useSchedule ? getScheduledAt() : "";
      if (useSchedule && !scheduledAt) {
        window.alert("Turn on “Schedule for later” and pick a date & time first.");
        return;
      }
      // The chosen wall-clock time is read in the selected timezone — in a zone
      // ahead of yours it can resolve to a moment that has already passed, which
      // would publish the post immediately instead of scheduling it. Warn first.
      if (useSchedule && scheduledAt && Date.parse(scheduledAt) <= Date.now()) {
        window.alert(
          "That date & time is already in the past for the selected timezone, so it would publish right away. Pick a later time (or a different timezone)."
        );
        return;
      }
      const orig = btn.textContent;
      btn.setAttribute("disabled", "true");
      btn.textContent = "Saving…";

      let featured_image_path = "";
      let og_image_url = "";
      let uploadFailed = false;
      const tryUpload = async (file: File) => {
        const url = await uploadFile(file);
        if (!url) uploadFailed = true;
        return url ?? "";
      };
      const fFile = fileByLabel("Featured Image")?.files?.[0];
      const oFile = fileByLabel("OG Image")?.files?.[0];
      if (fFile) featured_image_path = await tryUpload(fFile);
      if (oFile) og_image_url = await tryUpload(oFile);
      if (uploadFailed) {
        window.alert("Image upload failed — make sure you're signed in and the 'quests' bucket exists. Post NOT saved.");
        btn.removeAttribute("disabled");
        btn.textContent = orig;
        return;
      }

      const pubDate = getPubDate();
      const dateLabel = pubDate ? monthLabel(pubDate) : currentPost?.date_label ?? "";
      const [idxT, folT] = seoToggles();

      // A scheduled post is saved as a finished (published) post held back by
      // `scheduled_at` until its time; otherwise it goes live / drafts now.
      const effectiveStatus = scheduledAt ? "published" : status;

      const payload: Record<string, unknown> = {
        title,
        slug: val("j-slug"),
        status: effectiveStatus,
        scheduled_at: scheduledAt,
        scheduled_tz: scheduledAt ? tzOffsetMin() : null,
        category: categorySelect()?.value ?? "",
        excerpt: readPh(EXCERPT_PH),
        body: readBody(),
        seo_title: val("j-seo-title"),
        meta_description: val("j-meta-desc"),
        focus_keyword: readPh(FOCUS_PH),
        canonical_url: urlInput()?.value.trim() ?? "",
        noindex: idxT ? !idxT.checked : false,
        nofollow: folT ? !folT.checked : false,
        published_at: pubDate,
        date_label: dateLabel,
        // Preserved from the loaded post (no form field exposes these).
        emoji: currentPost?.emoji ?? "",
        card_gradient: currentPost?.card_gradient ?? "",
        hero_bg: currentPost?.hero_bg ?? "",
        author: currentPost?.author ?? "",
        read_time: currentPost?.read_time ?? "",
        category_color: currentPost?.category_color ?? "",
        related: currentPost?.related ?? [],
        featured: currentPost?.featured ?? false,
        display_order: currentPost?.display_order ?? 0,
      };
      if (featured_image_path) payload.featured_image_path = featured_image_path;
      if (og_image_url) payload.og_image_url = og_image_url;

      const url = currentEditId ? `/api/admin/journal/${currentEditId}` : "/api/admin/journal";
      const method = currentEditId ? "PUT" : "POST";
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error || "Could not save the post.");
          btn.removeAttribute("disabled");
          btn.textContent = orig;
          return;
        }
        window.location.href = "/admin?p=journal-list";
      } catch {
        window.alert("Network error — please try again.");
        btn.removeAttribute("disabled");
        btn.textContent = orig;
      }
    };

    // ── wire buttons ─────────────────────────────────────────────────────
    const cleanups: (() => void)[] = [];
    const on = (el: Element, ev: string, h: (e: Event) => void) => {
      el.addEventListener(ev, h);
      cleanups.push(() => el.removeEventListener(ev, h));
    };

    // Live taxonomy sync: when Journal Category terms are added/renamed/removed
    // in the Taxonomies section, refresh the category <select> without a reload.
    const onTaxonomyChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail as { kind: string; name: string }[] | undefined;
      if (!Array.isArray(detail)) return;
      liveCategories = detail.filter((t) => t.kind === "journal_category").map((t) => t.name);
      rebuildCategories();
    };
    window.addEventListener("admin:taxonomy-changed", onTaxonomyChanged);
    cleanups.push(() => window.removeEventListener("admin:taxonomy-changed", onTaxonomyChanged));

    // Wire the save buttons by id (their labels are dynamic — see setSaveLabel).
    const pubBtn = document.getElementById("j-save-publish") as HTMLButtonElement | null;
    const draftBtn = document.getElementById("j-save-draft") as HTMLButtonElement | null;
    const schedToggle = document.getElementById("sched-toggle");
    const isScheduling = () =>
      (document.getElementById("sched-toggle") as HTMLInputElement | null)?.checked ?? false;
    if (pubBtn)
      on(pubBtn, "click", (e) => {
        e.preventDefault();
        // Schedule on → hold until its time; otherwise publish now (instant).
        void save("published", pubBtn, isScheduling());
      });
    if (draftBtn)
      on(draftBtn, "click", (e) => {
        e.preventDefault();
        void save("draft", draftBtn);
      });
    // Keep the primary label in sync as "Schedule for later" is toggled.
    if (schedToggle) on(schedToggle, "change", () => setSaveLabel());

    list?.querySelectorAll<HTMLButtonElement>("button[data-journal-id]").forEach((b) => {
      const id = b.getAttribute("data-journal-id");
      on(b, "click", () => {
        currentEditId = id;
        const p = id ? postById.get(id) : undefined;
        if (p) populate(p);
      });
    });

    list?.querySelectorAll<HTMLButtonElement>("button[data-journal-del]").forEach((b) => {
      const id = b.getAttribute("data-journal-del");
      on(b, "click", async (e) => {
        e.preventDefault();
        if (!id || !window.confirm("Delete this post? This can't be undone.")) return;
        b.setAttribute("disabled", "true");
        try {
          const res = await fetch(`/api/admin/journal/${id}`, { method: "DELETE" });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            window.alert(data.error || "Could not delete the post.");
            b.removeAttribute("disabled");
            return;
          }
          window.location.href = "/admin?p=journal-list";
        } catch {
          window.alert("Network error — please try again.");
          b.removeAttribute("disabled");
        }
      });
    });

    // "New Post" / "New Journal Post" → start a blank editor.
    document.querySelectorAll("button").forEach((b) => {
      if (/New (Journal )?Post/.test(b.textContent ?? "")) {
        on(b, "click", () => {
          currentEditId = null;
          clearEditor();
        });
      }
    });

    // Show an instant preview the moment an image is picked, so it's clear the
    // selection registered before saving.
    const wirePreview = (input: HTMLInputElement | null) => {
      if (!input) return;
      on(input, "change", () => {
        const f = input.files?.[0];
        previewImg(input, f ? URL.createObjectURL(f) : null);
      });
    };
    wirePreview(fileByLabel("Featured Image"));
    wirePreview(fileByLabel("OG Image"));

    // Reflect live categories in the select on load.
    rebuildCategories();

    // Default the schedule timezone to the admin's own browser zone when it's one
    // of the options, so a new post schedules in their local time unless changed.
    const tzSel = document.getElementById("sched-tz") as HTMLSelectElement | null;
    if (tzSel) {
      const browserOff = String(-new Date().getTimezoneOffset());
      if (Array.from(tzSel.options).some((o) => o.value === browserOff)) tzSel.value = browserOff;
    }

    return () => cleanups.forEach((fn) => fn());
  }, [posts, categories]);

  return null;
}
