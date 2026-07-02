"use client";

import { useEffect, useRef } from "react";

/**
 * Self-contained WYSIWYG editor for rich HTML fields (legal section bodies,
 * intro callouts). Uncontrolled contenteditable: the initial HTML is set once,
 * and edits are pushed up via `onChange(innerHTML)` — so React never rewrites
 * the node and the caret stays put. Toolbar uses `document.execCommand`, exactly
 * like the original legal editor, and reuses its `.legal-editor-*` styles.
 */
export function RichText({
  value,
  onChange,
  minHeight = 180,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The last HTML we emitted/synced. While typing, `value` equals this, so the
  // sync effect is a no-op and the caret never jumps. It only re-syncs when the
  // value changes from the outside (e.g. a section is removed and indices shift).
  const last = useRef(value);

  // Mount: seed the editor with the initial HTML (client-only contenteditable).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value;
    last.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External change: overwrite only when it didn't come from our own typing.
  useEffect(() => {
    if (ref.current && value !== last.current) {
      ref.current.innerHTML = value;
      last.current = value;
    }
  }, [value]);

  const emit = () => {
    if (ref.current) {
      last.current = ref.current.innerHTML;
      onChange(last.current);
    }
  };
  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };
  const heading = (tag: "h2" | "h3" | "p") => exec("formatBlock", tag);
  const link = () => {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  };

  const Btn = ({ on, title, children }: { on: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      className="le-btn"
      title={title}
      // Keep the editor's selection while clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
    >
      {children}
    </button>
  );

  return (
    <div className="legal-editor-wrap" style={{ border: "1.5px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
      <div
        className="legal-editor-toolbar"
        style={{ display: "flex", flexWrap: "wrap", gap: "2px", padding: "8px 10px", background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
      >
        <Btn on={() => exec("bold")} title="Bold"><b>B</b></Btn>
        <Btn on={() => exec("italic")} title="Italic"><i>I</i></Btn>
        <Btn on={() => exec("underline")} title="Underline"><u>U</u></Btn>
        <div className="le-sep"></div>
        <Btn on={() => heading("h2")} title="Heading 2">H2</Btn>
        <Btn on={() => heading("h3")} title="Heading 3">H3</Btn>
        <Btn on={() => heading("p")} title="Paragraph">¶</Btn>
        <div className="le-sep"></div>
        <Btn on={() => exec("insertOrderedList")} title="Numbered list">1.</Btn>
        <Btn on={() => exec("insertUnorderedList")} title="Bullet list">•</Btn>
        <div className="le-sep"></div>
        <Btn on={link} title="Insert link">🔗</Btn>
        <Btn on={() => exec("removeFormat")} title="Clear formatting">✕</Btn>
        <div className="le-sep"></div>
        <Btn on={() => exec("undo")} title="Undo">↩</Btn>
        <Btn on={() => exec("redo")} title="Redo">↪</Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="legal-editor-body"
        style={{ minHeight, padding: "16px 18px", fontSize: "13.5px", lineHeight: 1.8, color: "var(--text)", outline: "none" }}
        spellCheck
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
