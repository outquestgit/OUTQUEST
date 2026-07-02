import { Fragment } from "react";

/** Render a string with "\n" as <br/> line breaks (shared by section components). */
export function multiline(s: string) {
  const lines = s.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}
