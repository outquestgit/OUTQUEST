"use client";

import { useEffect } from "react";
import { cleanPastedHtml, textToHtml } from "@/lib/admin/pasteClean";

/**
 * Intercepts pastes into *every* rich-text surface in the admin and scrubs the
 * clipboard HTML before it reaches the DOM (see `lib/admin/pasteClean.ts` for
 * what Word actually puts on the clipboard).
 *
 * One capture-phase listener on `document` rather than an `onPaste` per editor:
 * the editors are a mix of React components (`RichText`, the journal/quest/deal
 * RTEs, the legal editor) and raw `contenteditable` nodes owned by the legacy
 * `/public/admin.js` runtime, and only delegation reaches both. Any editor added
 * later is covered for free.
 *
 * `insertHTML` is what the toolbars already use, and it fires the `input` event
 * the editors listen on — so `onChange` still runs and undo still works.
 */
const EDITABLE = '[contenteditable=""], [contenteditable="true"]';

export default function PasteCleaner() {
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(EDITABLE)) return;

      const clipboard = event.clipboardData;
      if (!clipboard) return;

      const html = clipboard.getData("text/html");
      const text = clipboard.getData("text/plain");
      // Image-only pastes carry neither — leave those to the editor's own handling.
      if (!html && !text) return;

      event.preventDefault();
      const clean = html ? cleanPastedHtml(html) : textToHtml(text);
      if (clean) document.execCommand("insertHTML", false, clean);
    };

    document.addEventListener("paste", onPaste, true);
    return () => document.removeEventListener("paste", onPaste, true);
  }, []);

  return null;
}
