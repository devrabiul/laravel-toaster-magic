import { useState } from "react";
import { toastMagic, type ToastMagicConfig } from "toaster-magic";
import { TYPES } from "../data/reference";

const SAMPLE: Record<string, { heading: string; description: string }> = {
  success: { heading: "Success!", description: "Your changes have been saved." },
  error: { heading: "Something went wrong", description: "We couldn't reach the server." },
  warning: { heading: "Heads up", description: "Your storage is almost full." },
  info: { heading: "New update available", description: "Version 2.0 is ready to install." },
};

const LABEL: Record<string, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

function fire(type: string, config?: Partial<ToastMagicConfig>) {
  if (config) toastMagic.configure(config);
  const sample = SAMPLE[type];
  (toastMagic as any)[type](sample.heading, sample.description);
}

/** Four type buttons. Any passed config is applied to the shared singleton
 *  before firing so the demo reflects the settings being documented. */
export function TypeButtons({ config }: { config?: Partial<ToastMagicConfig> }) {
  return (
    <div className="demo">
      <div className="demo__label">Try it — click to fire a toast</div>
      <div className="demo__row">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`chip chip--${type}`}
            onClick={() => fire(type, config)}
          >
            {LABEL[type]}
          </button>
        ))}
        <button
          type="button"
          className="chip"
          onClick={() => toastMagic.clear()}
          style={{ marginLeft: "auto" }}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

const THEME_OPTIONS = [
  "default",
  "material",
  "ios",
  "glassmorphism",
  "neon",
  "minimal",
  "neumorphism",
] as const;
const ANIMATION_OPTIONS = ["default", "slide", "fade", "pop", "bounce"] as const;
const POSITION_OPTIONS = [
  { id: "toast-top-start", label: "Top Left" },
  { id: "toast-top-center", label: "Top Center" },
  { id: "toast-top-end", label: "Top Right" },
  { id: "toast-bottom-start", label: "Bottom Left" },
  { id: "toast-bottom-center", label: "Bottom Center" },
  { id: "toast-bottom-end", label: "Bottom Right" },
] as const;

/** Full interactive playground: pick theme, animation, and position, then fire
 *  any toast type. Used on the home page. */
export function Playground() {
  const [theme, setTheme] = useState<(typeof THEME_OPTIONS)[number]>("default");
  const [animation, setAnimation] = useState<(typeof ANIMATION_OPTIONS)[number]>("slide");
  const [position, setPosition] = useState<string>("toast-top-end");

  const config: Partial<ToastMagicConfig> = {
    theme,
    animation,
    positionClass: position as ToastMagicConfig["positionClass"],
    closeButton: true,
  };

  return (
    <div className="playground">
      <div className="playground__group">
        <div className="playground__legend">Theme</div>
        <div className="playground__chips">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              data-active={theme === t}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="playground__group">
        <div className="playground__legend">Animation</div>
        <div className="playground__chips">
          {ANIMATION_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              data-active={animation === a}
              onClick={() => setAnimation(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="playground__group">
        <div className="playground__legend">Position</div>
        <div className="playground__chips">
          {POSITION_OPTIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              data-active={position === p.id}
              onClick={() => setPosition(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="playground__group">
        <div className="playground__legend">Fire a toast</div>
        <div className="playground__chips">
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`chip chip--${type}`}
              onClick={() => fire(type, config)}
            >
              {LABEL[type]}
            </button>
          ))}
          <button type="button" className="chip" onClick={() => toastMagic.clear()}>
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
