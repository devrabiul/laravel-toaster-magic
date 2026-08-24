/**
 * Loads the real v2.6 package assets from public/demo/ on demand.
 *
 * The npm `toaster-magic` runtime the rest of the site demos with predates
 * presets entirely, so anything preset-related has to run the actual published
 * files. Shared by the home showcase and the docs playground so both load the
 * same assets once.
 */

export interface PresetDef {
  icon: string;
  anim: string;
}

declare global {
  interface Window {
    toastMagic?: {
      success: (o: Record<string, unknown>) => void;
      error: (o: Record<string, unknown>) => void;
      warning: (o: Record<string, unknown>) => void;
      info: (o: Record<string, unknown>) => void;
    };
    toastMagicConfig?: Record<string, unknown>;
    ToastMagicPresets?: {
      register: (
        icons: Record<string, string>,
        presets: Record<string, PresetDef>,
        pack: string,
      ) => void;
    };
    ToastMagicInternals?: {
      TOAST_PRESETS: Record<string, PresetDef>;
    };
  }
}

const BASE = import.meta.env.BASE_URL;

/** icon name → raw SVG markup, captured as packs register themselves. */
const iconMarkup: Record<string, string> = {};
/** preset name → its {icon, anim} definition. */
const presetDefs: Record<string, PresetDef> = {};

const loadedUrls = new Set<string>();
const inFlight = new Map<string, Promise<void>>();

function injectOnce(url: string, kind: "script" | "style"): Promise<void> {
  if (loadedUrls.has(url)) return Promise.resolve();
  const existing = inFlight.get(url);
  if (existing) return existing;

  const p = new Promise<void>((resolve, reject) => {
    const el =
      kind === "script"
        ? Object.assign(document.createElement("script"), { src: url })
        : Object.assign(document.createElement("link"), { rel: "stylesheet", href: url });

    el.addEventListener("load", () => {
      loadedUrls.add(url);
      resolve();
    });
    el.addEventListener("error", () => reject(new Error(`Failed to load ${url}`)));
    document.head.appendChild(el);
  });

  inFlight.set(url, p);
  return p;
}

let runtimePromise: Promise<void> | null = null;

function ensureRuntime(): Promise<void> {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    await injectOnce(`${BASE}demo/laravel-toaster-magic.min.css`, "style");

    // Read lazily by the runtime on every access, so setting it first is safe —
    // and keeps demo toasts out of the npm runtime's top-end corner.
    window.toastMagicConfig = {
      ...(window.toastMagicConfig ?? {}),
      positionClass: "toast-bottom-end",
      closeButton: true,
      timeOut: 6000,
      maxVisible: 4,
      stagger: 400,
    };

    await injectOnce(`${BASE}demo/laravel-toaster-magic.js`, "script");

    // The runtime keeps its icon table private, so wrap register() to mirror
    // what each pack hands over. Packs are static files we vendored ourselves,
    // so the markup is trusted.
    const presets = window.ToastMagicPresets;
    if (presets && !(presets as { _captured?: boolean })._captured) {
      const original = presets.register.bind(presets);
      presets.register = (icons, defs, pack) => {
        Object.assign(iconMarkup, icons);
        Object.assign(presetDefs, defs);
        original(icons, defs, pack);
      };
      (presets as { _captured?: boolean })._captured = true;
    }
  })();

  return runtimePromise;
}

export async function ensurePack(pack: string): Promise<void> {
  await ensureRuntime();
  await injectOnce(`${BASE}demo/presets/laravel-toaster-magic-presets-${pack}.min.css`, "style");
  await injectOnce(`${BASE}demo/presets/toast-magic-presets-${pack}.js`, "script");
}

/**
 * Raw SVG markup for a preset's icon, or null before its pack has loaded.
 *
 * The palette custom properties are keyed off `.toast-body-icon-container
 * .tm-preset-<name>`, which is not scoped to a toast — so an icon rendered
 * outside one still gets its real colours. The *animations* are scoped to
 * `.toast-container .toast-item.show`, so they only play in an actual toast.
 */
export function iconFor(preset: string): string | null {
  const def = presetDefs[preset] ?? window.ToastMagicInternals?.TOAST_PRESETS?.[preset];
  if (!def) return null;
  return iconMarkup[def.icon] ?? null;
}

export type ToastType = "success" | "error" | "warning" | "info";

export function fireToast(type: ToastType, options: Record<string, unknown>): void {
  window.toastMagic?.[type](options);
}
