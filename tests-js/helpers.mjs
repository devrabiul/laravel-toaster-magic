/**
 * Shared harness for the runtime tests.
 *
 * The runtime is an IIFE that installs itself onto `window`, so it is evaluated
 * into the current jsdom global rather than imported. `loadRuntime()` clears the
 * previous installation first so each test starts from a known state.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { vi } from "vitest";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const RUNTIME = join(root, "assets/js/laravel-toaster-magic.js");
const BRIDGE = join(root, "assets/js/livewire-v3/livewire-toaster-magic-v3.js");

/** Preset packs, in the order ToastMagic::PRESET_PACKS emits them. */
export const PACKS = [
    "general", "commerce", "saas", "social", "devops", "media", "files",
    "health", "travel", "education", "crm",
];

export const runtimeSource = () => readFileSync(RUNTIME, "utf8");
export const bridgeSource = () => readFileSync(BRIDGE, "utf8");
export const packSource = (pack) =>
    readFileSync(join(root, `assets/js/presets/toast-magic-presets-${pack}.js`), "utf8");
export const packStylesheet = (pack) =>
    readFileSync(join(root, `assets/css/presets/laravel-toaster-magic-presets-${pack}.css`), "utf8");
export const coreSource = () => readFileSync(RUNTIME, "utf8");
export const coreStylesheet = () =>
    readFileSync(join(root, "assets/css/laravel-toaster-magic.css"), "utf8");

/**
 * Evaluate a source file in the current jsdom window.
 */
function evaluate(source) {
    new Function(source).call(window);
}

/**
 * Reset the DOM and globals, then (re)install the runtime.
 *
 * @param {object} config Value for `window.toastMagicConfig`.
 * @param {object} styleVars Value for `window.toastMagicStyleVars`.
 * @param {string} bodyHtml Markup to place in the body *before* the runtime is
 *   evaluated, for testing what it does with pre-existing DOM.
 * @param {string[]} packs Preset packs to register after the runtime. Defaults
 *   to all of them, mirroring `'presets' => 'all'`.
 */
export function loadRuntime(config = {}, styleVars = {}, bodyHtml = "", packs = PACKS) {
    document.body.innerHTML = bodyHtml;
    document.head.innerHTML = "";

    delete window.ToastMagic;
    delete window.toastMagic;
    delete window.ToastMagicInternals;
    delete window._toastQueue;
    delete window._toastProcessing;

    // `_toastMagicListenersBound` and `_toastMagicBound` are deliberately NOT
    // cleared. The delegated document handlers and the bridge's window listener
    // survive between tests in a file, so clearing their guards would stack a
    // second set of listeners and every event would be handled twice. Leaving
    // them set mirrors the real page, where each script is evaluated once. Both
    // resolve `window.toastMagic` and the queue at call time, so they follow
    // each reload.

    window.toastMagicConfig = config;
    window.toastMagicStyleVars = styleVars;

    // matchMedia is not implemented in jsdom; default to "motion is fine" so
    // the FLIP path is exercised unless a test opts into reduced motion.
    if (!window.matchMedia) {
        window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    }

    delete window.ToastMagicPresets;

    evaluate(runtimeSource());

    // Packs register into the runtime, so they must follow it — exactly the
    // order ToastMagic::scriptsPath() emits the tags in.
    for (const pack of packs) {
        evaluate(packSource(pack));
    }

    return window.toastMagic;
}

/**
 * Install the Livewire bridge on top of an already-loaded runtime.
 */
export function loadBridge() {
    evaluate(bridgeSource());
}

/** All toast elements currently in the container, newest-first order as rendered. */
export function toasts() {
    return Array.from(document.querySelectorAll(".toast-item"));
}

/** The most recently rendered toast element. */
export function lastToast() {
    const all = toasts();
    return all[all.length - 1];
}

/** The single toast on screen — throws when the count is not exactly one. */
export function onlyToast() {
    const all = toasts();
    if (all.length !== 1) {
        throw new Error(`expected exactly 1 toast, found ${all.length}`);
    }
    return all[0];
}

/**
 * Serialize a toast's rendered HTML, for assertions about what did *not* end up
 * in the DOM.
 */
export function html(el = document.body) {
    return el.innerHTML;
}

/** Advance fake timers and flush the microtask queue. */
export async function tick(ms = 0) {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
}

/**
 * jsdom does not run rAF callbacks on a real frame clock under fake timers.
 * The runtime uses rAF only inside flipReflow, so tests stub it to run inline.
 */
export function stubAnimationFrame() {
    window.requestAnimationFrame = (cb) => {
        cb(0);
        return 1;
    };
}
