import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, type RouteMeta } from "../data/routes";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

function score(route: RouteMeta, q: string): number {
  const haystack = [
    route.title,
    route.label ?? "",
    route.description,
    route.section,
    ...(route.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
  if (!haystack.includes(q)) return 0;
  let s = 1;
  if (route.title.toLowerCase().includes(q)) s += 3;
  if ((route.label ?? "").toLowerCase().includes(q)) s += 3;
  if (route.title.toLowerCase().startsWith(q)) s += 2;
  if ((route.keywords ?? []).some((k) => k.toLowerCase().includes(q))) s += 1;
  return s;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROUTES.slice(0, 7);
    return ROUTES.map((r) => ({ r, s: score(r, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.r);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Focus after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[active];
      if (target) go(target.path);
    }
  };

  return (
    <div
      className="search-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <div className="search-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="search-dialog__input-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="var(--text-faint)" strokeWidth="2" />
            <path
              d="m20 20-3.2-3.2"
              stroke="var(--text-faint)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            className="search-dialog__input"
            placeholder="Search the docs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search query"
          />
        </div>

        <div className="search-dialog__results">
          {results.length === 0 ? (
            <div className="search-empty">No results for “{query}”.</div>
          ) : (
            results.map((r, i) => (
              <a
                key={r.path}
                href={r.path}
                className={`search-result${i === active ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(r.path);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <div className="search-result__title">{r.label ?? r.title}</div>
                <div className="search-result__section">{r.section}</div>
                <div className="search-result__desc">{r.description}</div>
              </a>
            ))
          )}
        </div>

        <div className="search-dialog__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
