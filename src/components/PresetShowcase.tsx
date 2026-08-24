import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "./CodeBlock";
import { PRESET_NAMES } from "../data/presetNames";
import { PRESET_PACKS, PRESET_TOTAL } from "../data/reference";
import { ensurePack, fireToast, iconFor, type ToastType } from "../lib/presetRuntime";

/**
 * Home-page preset section.
 *
 * Renders the *real* icons from the published preset packs. The palette
 * variables are keyed off `.toast-body-icon-container.tm-preset-<name>` and are
 * not scoped to a toast, so the colours here are exactly what an app renders.
 * The animations are scoped to `.toast-item.show`, so they play when a tile is
 * clicked and the real toast appears.
 *
 * Packs load only once the section nears the viewport, and again whenever the
 * visitor switches pack — so the landing page costs nothing up front.
 */

const TILE_COUNT = 10;

/** Presets worth leading with, where alphabetical order buries the good ones. */
const CURATED: Record<string, string[]> = {
  general: [
    "clipboard-copy",
    "email-sent",
    "download-complete",
    "connection-lost",
    "account-created",
    "api-key-generated",
    "upload-complete",
    "settings-saved",
    "link-shared",
    "goal-reached",
  ],
  commerce: [
    "cart-add",
    "order-placed",
    "payment-success",
    "payment-failed",
    "order-shipped",
    "order-delivered",
    "refund-issued",
    "coupon-applied",
    "back-in-stock",
    "wishlist-add",
  ],
  devops: [
    "deploy-succeeded",
    "deploy-failed",
    "build-passed",
    "build-failed",
    "branch-created",
    "cache-cleared",
    "container-crashed",
    "backup-complete",
    "bug-fixed",
    "certificate-renewed",
  ],
  saas: [
    "api-key-rotated",
    "beta-joined",
    "billing-updated",
    "api-quota-warning",
    "audit-log-exported",
    "billing-date-changed",
  ],
};

/** Colour the tile by what the preset name implies, so the grid reads at a glance. */
const ERROR_WORDS = /(fail|failed|lost|crash|declin|error|reject|cancel|overdue|missed|invalid)/;
const WARNING_WORDS = /(warn|expir|low|pending|retry|quota|delay|hold|overdue|reopen)/;
const INFO_WORDS = /(shipped|sync|migrat|scheduled|started|progress|queued|transfer|import|export)/;

function typeFor(preset: string): ToastType {
  if (ERROR_WORDS.test(preset)) return "error";
  if (WARNING_WORDS.test(preset)) return "warning";
  if (INFO_WORDS.test(preset)) return "info";
  return "success";
}

/** "cart-add" → "Cart add". */
function humanize(preset: string): string {
  const words = preset.replace(/[-_]/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const CODE = `// config/laravel-toaster-magic.php
'presets' => ['general', 'commerce'],

// Then anywhere in your app:
ToastMagic::success(
    'Added to cart',
    'Nike Air Max ×1',
    ['preset' => 'cart-add'],
);`;

export function PresetShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pack, setPack] = useState("commerce");
  const [loadedPacks, setLoadedPacks] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [fired, setFired] = useState<string | null>(null);

  const tiles = useMemo(() => {
    const all = PRESET_NAMES[pack] ?? [];
    const curated = (CURATED[pack] ?? []).filter((n) => all.includes(n));
    const rest = all.filter((n) => !curated.includes(n));
    return [...curated, ...rest].slice(0, TILE_COUNT);
  }, [pack]);

  // Defer all loading until the section is close to the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setVisible(true);
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || loadedPacks.includes(pack)) return;
    let cancelled = false;
    ensurePack(pack)
      .then(() => {
        if (!cancelled) setLoadedPacks((p) => (p.includes(pack) ? p : [...p, pack]));
      })
      .catch(() => {
        /* Tiles keep their placeholder glyph — never a hard failure. */
      });
    return () => {
      cancelled = true;
    };
  }, [visible, pack, loadedPacks]);

  const ready = loadedPacks.includes(pack);

  const fire = (preset: string) => {
    setFired(preset);
    fireToast(typeFor(preset), {
      heading: humanize(preset),
      description: `preset: '${preset}'`,
      preset,
    });
  };

  return (
    <div className="presets-hero" ref={rootRef}>
      <div className="presets-hero__chips" role="group" aria-label="Preset pack">
        {PRESET_PACKS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`presets-hero__chip${p.name === pack ? " is-active" : ""}`}
            onClick={() => setPack(p.name)}
            aria-pressed={p.name === pack}
          >
            {p.name}
            <span className="presets-hero__chip-count">{p.count}</span>
          </button>
        ))}
      </div>

      <div className="presets-hero__grid">
        {tiles.map((preset) => {
          const type = typeFor(preset);
          const svg = ready ? iconFor(preset) : null;
          return (
            <button
              key={preset}
              type="button"
              className={`presets-hero__tile presets-hero__tile--${type}${
                preset === fired ? " is-fired" : ""
              }`}
              onClick={() => fire(preset)}
              title={`Fire a ${type} toast with the ${preset} preset`}
            >
              <span
                className={`presets-hero__icon toast-body-icon-container tm-preset tm-preset-${preset}`}
                aria-hidden="true"
                // Markup comes from the preset packs vendored into public/demo —
                // static package files, never user input.
                {...(svg
                  ? { dangerouslySetInnerHTML: { __html: svg } }
                  : { children: <span className="presets-hero__skeleton" /> })}
              />
              <span className="presets-hero__name">{preset}</span>
            </button>
          );
        })}
      </div>

      <p className="presets-hero__hint">
        {ready
          ? "Click any icon to fire a real toast — bottom-right."
          : "Loading the pack’s real icons…"}
      </p>

      <div className="presets-hero__footer">
        <div className="presets-hero__code">
          <CodeBlock code={CODE} language="php" />
        </div>

        <div className="presets-hero__cta">
          <div className="presets-hero__stats">
            <div className="presets-hero__stat">
              <span className="presets-hero__stat-value">{PRESET_TOTAL}</span>
              <span className="presets-hero__stat-label">presets</span>
            </div>
            <div className="presets-hero__stat">
              <span className="presets-hero__stat-value">{PRESET_PACKS.length}</span>
              <span className="presets-hero__stat-label">opt-in packs</span>
            </div>
            <div className="presets-hero__stat">
              <span className="presets-hero__stat-value">0</span>
              <span className="presets-hero__stat-label">dependencies</span>
            </div>
          </div>
          <p className="presets-hero__blurb">
            Each pack is a separate script and stylesheet — the core runtime ships none of them, so
            you download only what you list. Animation is plain CSS, no Lottie player.
          </p>
          <Link className="btn btn--primary" to="/docs/presets">
            Browse all {PRESET_TOTAL} presets →
          </Link>
        </div>
      </div>
    </div>
  );
}
