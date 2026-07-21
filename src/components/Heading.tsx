import type { ReactNode } from "react";

interface HeadingProps {
  id: string;
  children: ReactNode;
}

/** Section heading (h2) with a hover anchor link. DocPage discovers these by id
 *  to build the table of contents, so every h2/h3 in a page must carry an id. */
export function H2({ id, children }: HeadingProps) {
  return (
    <h2 id={id}>
      {children}
      <a className="heading-anchor" href={`#${id}`} aria-label="Link to this section">
        #
      </a>
    </h2>
  );
}

export function H3({ id, children }: HeadingProps) {
  return (
    <h3 id={id}>
      {children}
      <a className="heading-anchor" href={`#${id}`} aria-label="Link to this section">
        #
      </a>
    </h3>
  );
}
