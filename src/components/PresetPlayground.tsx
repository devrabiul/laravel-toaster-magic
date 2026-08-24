import { useEffect, useMemo, useRef, useState } from "react";
import { ensurePack, fireToast, type ToastType } from "../lib/presetRuntime";
import { PRESET_NAMES } from "../data/presetNames";
import { PRESET_PACKS } from "../data/reference";

/**
 * Live preset demo.
 *
 * The npm `toaster-magic` runtime the rest of the site demos with predates
 * presets entirely, so this component loads the *real* v2.6 package assets from
 * public/demo/ on first use and fires through `window.toastMagic`. Everything a
 * visitor sees here is what a Laravel app running v2.6 would render.
 *
 * Its toasts are anchored bottom-end on purpose: the other demos on the page use
 * the npm runtime's own top-end container, so the two never overlap.
 */

const TYPES: ToastType[] = ["success", "error", "warning", "info"];

interface PackState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

/** "cart-add" → "Cart add" — a readable heading without shipping 517 more strings. */
function humanize(preset: string): string {
  const words = preset.replace(/[-_]/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

interface PresetPlaygroundProps {
  /** Start with this pack selected. */
  defaultPack?: string;
  /** Cap the preset grid; the search box still reaches everything. */
  visibleLimit?: number;
}

export function PresetPlayground({
  defaultPack = "general",
  visibleLimit = 48,
}: PresetPlaygroundProps) {
  const [pack, setPack] = useState(defaultPack);
  const [type, setType] = useState<ToastType>("success");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<PackState>({ loading: false, loaded: false, error: null });
  const [lastFired, setLastFired] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const names = useMemo(() => PRESET_NAMES[pack] ?? [], [pack]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? names.filter((n) => n.includes(q)) : names;
  }, [names, query]);

  const shown = matches.slice(0, visibleLimit);

  // The grid scrolls, so it needs an explicit "there is more below" affordance —
  // without one a clipped final row just reads as a rendering glitch. Tracked in
  // state rather than a permanent CSS fade so a short, fully-visible list stays
  // clean.
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const syncScrollHint = () => {
    const el = gridRef.current;
    if (!el) return;
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    setHasMore(remaining > 4);
  };

  useEffect(syncScrollHint, [shown.length, pack]);

  const fire = async (preset: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await ensurePack(pack);
      if (!mounted.current) return;
      setState({ loading: false, loaded: true, error: null });
      fireToast(type, {
        heading: humanize(preset),
        description: `preset: '${preset}'`,
        preset,
      });
      setLastFired(preset);
    } catch {
      if (!mounted.current) return;
      setState({
        loading: false,
        loaded: false,
        error: "Could not load the preset pack. Check your connection and try again.",
      });
    }
  };

  return (
    <div className="preset-lab">
      <div className="preset-lab__controls">
        <div className="preset-lab__field">
          <span className="preset-lab__label">Pack</span>
          <div className="preset-lab__chips">
            {PRESET_PACKS.map((p) => (
              <button
                key={p.name}
                type="button"
                className={`preset-lab__chip${p.name === pack ? " is-active" : ""}`}
                onClick={() => {
                  setPack(p.name);
                  setQuery("");
                }}
                aria-pressed={p.name === pack}
              >
                {p.name}
                <span className="preset-lab__chip-count">{p.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="preset-lab__row">
          <div className="preset-lab__field">
            <span className="preset-lab__label">Type</span>
            <div className="preset-lab__chips">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`preset-lab__chip preset-lab__chip--${t}${t === type ? " is-active" : ""}`}
                  onClick={() => setType(t)}
                  aria-pressed={t === type}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="preset-lab__field preset-lab__field--grow">
            <label className="preset-lab__label" htmlFor="preset-search">
              Search {names.length} presets
            </label>
            <input
              id="preset-search"
              className="preset-lab__search"
              type="search"
              placeholder="cart, deploy, invoice…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className="preset-lab__results">
        {state.error && (
          <p className="preset-lab__error" role="alert">
            {state.error}
          </p>
        )}

        <p className="preset-lab__hint">
          {state.loading
            ? "Loading the pack…"
            : matches.length === 0
              ? `No preset in ${pack} matches “${query}”.`
              : `Click any preset to fire a real ${type} toast — bottom-right.`}
        </p>

        {matches.length > 0 && (
          <div className={`preset-lab__scroll${hasMore ? " has-more" : ""}`}>
            <div className="preset-lab__grid" ref={gridRef} onScroll={syncScrollHint}>
              {shown.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-lab__preset${preset === lastFired ? " is-fired" : ""}`}
                  onClick={() => fire(preset)}
                  disabled={state.loading}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {matches.length > shown.length && (
          <p className="preset-lab__hint preset-lab__hint--after">
            Showing {shown.length} of {matches.length} — search to narrow it down.
          </p>
        )}

        <p className="preset-lab__note">
          This runs the real v2.6 runtime and the actual preset packs, loaded on demand — the same
          files a Laravel app publishes. Animation is plain CSS.
        </p>
      </div>
    </div>
  );
}
