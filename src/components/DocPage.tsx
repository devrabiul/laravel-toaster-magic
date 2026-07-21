import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PAGE_ORDER, type RouteMeta } from "../data/routes";
import { useActiveHeading } from "../hooks/useActiveHeading";
import { Seo } from "./Seo";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface DocPageProps {
  page: RouteMeta;
  children: ReactNode;
}

export function DocPage({ page, children }: DocPageProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  // Discover the page's own h2/h3 headings after render to build the TOC —
  // keeps the contents list in lockstep with the actual content, no manual list.
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("h2[id], h3[id]"));
    setToc(
      nodes.map((el) => ({
        id: el.id,
        text: el.textContent?.replace(/#$/, "").trim() ?? "",
        level: el.tagName === "H3" ? 3 : 2,
      })),
    );
  }, [page.path]);

  const ids = useMemo(() => toc.map((t) => t.id), [toc]);
  const activeId = useActiveHeading(ids);

  const index = PAGE_ORDER.findIndex((r) => r.path === page.path);
  const prev = index > 0 ? PAGE_ORDER[index - 1] : undefined;
  const next = index >= 0 && index < PAGE_ORDER.length - 1 ? PAGE_ORDER[index + 1] : undefined;

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        keywords={page.keywords}
      />
      <div className="content-wrap">
        <article className="content prose" ref={articleRef}>
          <div className="page-meta">
            <span className="page-meta__section">{page.section}</span>
          </div>
          {children}

          <nav className="page-nav" aria-label="Pagination">
            {prev ? (
              <Link className="page-nav__link page-nav__link--prev" to={prev.path}>
                <div className="page-nav__dir">← Previous</div>
                <div className="page-nav__title">{prev.label ?? prev.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="page-nav__link page-nav__link--next" to={next.path}>
                <div className="page-nav__dir">Next →</div>
                <div className="page-nav__title">{next.label ?? next.title}</div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="toc" aria-label="On this page">
          {toc.length > 0 && (
            <>
              <div className="toc__title">On this page</div>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`toc__link${item.level === 3 ? " toc__link--h3" : ""}${
                    activeId === item.id ? " active" : ""
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </>
          )}
        </aside>
      </div>
    </>
  );
}
