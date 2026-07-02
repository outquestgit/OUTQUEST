/**
 * Renders a not-yet-converted run of admin markup inside a `display:contents`
 * wrapper (generates no box, so the DOM the runtime + bridges see is unchanged;
 * the admin's `.page` styling is class-based, not a `#content >` combinator).
 * Used for the sections still living in `_reference/admin-body.html`.
 */
export function RawHtml({ html }: { html: string }) {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}
