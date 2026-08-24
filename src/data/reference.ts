// Structured reference data mirrored from the Laravel package
// (config/laravel-toaster-magic.php and the ToastMagic facade). Keep in sync
// with the package on each release.

import type { ToastMagicConfig } from "toaster-magic";

export interface PropRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

/** config/laravel-toaster-magic.php → 'options' array. */
export const CONFIG_OPTIONS: PropRow[] = [
  {
    name: "positionClass",
    type: "string",
    default: `'toast-top-end'`,
    description: "Corner or edge the toast stack is anchored to.",
  },
  {
    name: "theme",
    type: "string",
    default: `'default'`,
    description: "One of the nine built-in visual themes.",
  },
  {
    name: "animation",
    type: "string",
    default: `'default'`,
    description: "Entrance / exit animation for each toast (default, slide, fade, pop, bounce).",
  },
  {
    name: "closeButton",
    type: "bool",
    default: "true",
    description: "Show a close button on every toast unless overridden per toast.",
  },
  {
    name: "preventDuplicates",
    type: "bool",
    default: "false",
    description: "Skip a toast when an identical one (type + heading + description) is already visible.",
  },
  {
    name: "showDuration",
    type: "int",
    default: "300",
    description: "Delay in milliseconds before the entrance animation plays.",
  },
  {
    name: "timeOut",
    type: "int",
    default: "5000",
    description: "Auto-dismiss timeout in milliseconds.",
  },
  {
    name: "pauseOnHover",
    type: "bool",
    default: "true",
    description: "Pause the auto-dismiss timer while the pointer is over the toast.",
  },
  {
    name: "gradient_enable",
    type: "bool",
    default: "false",
    description: "Subtle gradient accent styling (best with default, material, and neon themes).",
  },
  {
    name: "color_mode",
    type: "bool",
    default: "false",
    description: "Colored toast background matching the toast type.",
  },
  {
    name: "stagger",
    type: "int",
    default: "800",
    description:
      "Gap in milliseconds between consecutive queued toasts. The entrance animation runs for 500ms, so this staggers them into a cascade rather than a burst. Was 250 before v2.6.",
  },
  {
    name: "maxVisible",
    type: "int",
    default: "15",
    description:
      "Most toasts on screen at once; the oldest is dismissed to make room. Use 0 for no limit. Added in v2.6.",
  },
  {
    name: "escape_html",
    type: "bool",
    default: "true",
    description:
      "Escape toast text. Leave this on — turning it off makes every toast render raw HTML.",
  },
  {
    name: "spacing",
    type: "array",
    default: "[...]",
    description:
      "Padding and gaps for any theme: enable, container, icon_gap, content_gap, close_gap.",
  },
  {
    name: "typography",
    type: "array",
    default: "[...]",
    description:
      "Font sizes and weights for any theme: enable, title_size, description_size, plus optional title_weight, description_weight and line_height.",
  },
  {
    name: "closeButtonLabel",
    type: "string",
    default: `'Close notification'`,
    description: "Accessible name for the close button.",
  },
  {
    name: "containerLabel",
    type: "string",
    default: `'Notifications'`,
    description: "Accessible name for the toast region.",
  },
];

export interface PresetPack {
  name: string;
  covers: string;
  count: number;
}

/** config/laravel-toaster-magic.php → 'presets'. Mirrors src/presets.php. */
export const PRESET_PACKS: PresetPack[] = [
  { name: "general", covers: "Loading, connectivity, auth, clipboard, preferences", count: 76 },
  {
    name: "commerce",
    covers: "Carts, orders, payments, shipping, catalogue, promotions, stock",
    count: 121,
  },
  { name: "devops", covers: "Builds, deploys, source control, infrastructure, incidents", count: 61 },
  { name: "saas", covers: "Subscriptions, workspaces, seats, usage, integrations", count: 44 },
  { name: "social", covers: "Messages, posts, connections, moderation", count: 38 },
  { name: "files", covers: "Documents, storage, backups", count: 37 },
  { name: "media", covers: "Capture, encoding, publishing, playback", count: 36 },
  { name: "health", covers: "Appointments, prescriptions, vitals, lab work", count: 28 },
  { name: "travel", covers: "Flights, stays, transport", count: 26 },
  { name: "education", covers: "Courses, assignments, grading", count: 25 },
  { name: "crm", covers: "Leads, deals, accounts, calls", count: 25 },
];

export const PRESET_TOTAL = PRESET_PACKS.reduce((sum, p) => sum + p.count, 0);

/** Top-level keys in config/laravel-toaster-magic.php. */
export const ROOT_CONFIG: PropRow[] = [
  {
    name: "options",
    type: "array",
    default: "[...]",
    description: "The toast option defaults listed above.",
  },
  {
    name: "livewire_enabled",
    type: "bool",
    default: "false",
    description: "Enable event-based Livewire dispatching.",
  },
  {
    name: "presets",
    type: "array|string",
    default: `['general']`,
    description:
      "Animated icon packs to load. Each pack is a separate script and stylesheet. Use 'all' for every pack, or [] for none. Added in v2.6.",
  },
  {
    name: "csp_nonce",
    type: "string|null",
    default: "null",
    description:
      "Content-Security-Policy nonce applied to the inline script blocks. Or call ToastMagic::nonce($nonce) when it is only known at request time.",
  },
  {
    name: "asset_path_prefix",
    type: "string|null",
    default: "null",
    description: "Explicit path prefix for the published assets.",
  },
];

/** Per-toast options passed as the third argument to a facade call. */
export const TOAST_OPTIONS: PropRow[] = [
  {
    name: "showCloseBtn",
    type: "bool",
    default: "config closeButton",
    description: "Show a close button on this toast.",
  },
  {
    name: "customBtnText",
    type: "string",
    default: "—",
    description: "Label for an action link button. Rendered only together with customBtnLink.",
  },
  {
    name: "customBtnLink",
    type: "string",
    default: "—",
    description: "URL for the action link button. Only http(s), /, and # URLs are allowed.",
  },
  {
    name: "timeOut",
    type: "int",
    default: "config timeOut",
    description: "Auto-dismiss timeout in ms for this toast only.",
  },
  {
    name: "showDuration",
    type: "int",
    default: "config showDuration",
    description: "Entrance-animation delay in ms for this toast only.",
  },
  {
    name: "avatar",
    type: "string",
    default: "—",
    description: "Image URL rendered in place of the type icon.",
  },
  {
    name: "preset",
    type: "string",
    default: "—",
    description:
      "Animated icon layered on top of the toast type. Its pack must be enabled in config, otherwise the toast falls back to the type icon. Added in v2.6.",
  },
  {
    name: "html",
    type: "bool",
    default: "false",
    description:
      "Render this toast's text as HTML instead of escaping it. You own the safety of the string.",
  },
];

export interface MethodRow {
  signature: string;
  returns: string;
  description: string;
}

export const METHODS: MethodRow[] = [
  {
    signature: "ToastMagic::success(heading, description?, options?)",
    returns: "void",
    description: "Flash a success toast (green check icon).",
  },
  {
    signature: "ToastMagic::error(heading, description?, options?)",
    returns: "void",
    description: "Flash an error toast. Accepts a validation MessageBag as the first argument.",
  },
  {
    signature: "ToastMagic::warning(heading, description?, options?)",
    returns: "void",
    description: "Flash a warning toast (amber icon).",
  },
  {
    signature: "ToastMagic::info(heading, description?, options?)",
    returns: "void",
    description: "Flash an info toast (blue icon).",
  },
  {
    signature: "ToastMagic::dispatch()",
    returns: "ToastMagic",
    description: "Return the fluent builder so you can chain ->success(...) etc.",
  },
  {
    signature: "ToastMagic::styles()",
    returns: "string",
    description: "Render the required <link> stylesheet tags. Call inside <head>.",
  },
  {
    signature: "ToastMagic::scripts()",
    returns: "string",
    description: "Render the required <script> tags. Call before </body>.",
  },
];

/**
 * The theme union accepted by the live demos.
 *
 * The standalone `toaster-magic` JS build's own union predates the `neumorphic`
 * theme, whose CSS the docs vendor in src/styles/toast-neumorphic.css. Widen it
 * here so the playground can offer the theme; drop this alias — and the vendored
 * stylesheet — once the JS build ships it.
 */
export type DocsTheme = ToastMagicConfig["theme"] | "neumorphic" | "compact";

export interface ThemeInfo {
  id: string;
  name: string;
  blurb: string;
}

export const THEMES: ThemeInfo[] = [
  { id: "default", name: "Default", blurb: "Clean, classic card with a colored accent — the everyday choice." },
  { id: "material", name: "Material", blurb: "Material Design — flat, bold, and elevated." },
  { id: "ios", name: "iOS", blurb: "Apple-style banner with a frosted backdrop blur." },
  { id: "glassmorphism", name: "Glassmorphism", blurb: "Heavy blur, semi-transparent, modern aesthetic." },
  { id: "neon", name: "Neon", blurb: "Dark background with glowing borders — ideal for dark UIs." },
  { id: "minimal", name: "Minimal", blurb: "Clean design with a colored left-side accent." },
  { id: "neumorphism", name: "Neumorphism", blurb: "Soft UI with extruded dual-shadow styling." },
  {
    id: "neumorphic",
    name: "Neumorphic",
    blurb:
      "Refined soft UI — dual-direction shadows, raised controls that press in on click, and a recessed progress groove.",
  },
  {
    id: "compact",
    name: "Compact",
    blurb:
      "Smaller and denser — tighter padding, controls on a single row, a slimmer progress bar and a 320px track. Deliberately plain, with no gradients or blur.",
  },
];

export interface AnimationInfo {
  id: string;
  name: string;
  blurb: string;
}

export const ANIMATIONS: AnimationInfo[] = [
  { id: "default", name: "Default", blurb: "Slide in from the toast's anchored position." },
  { id: "slide", name: "Slide", blurb: "Same as default — an explicit slide." },
  { id: "fade", name: "Fade", blurb: "Fade in and out with no movement." },
  { id: "pop", name: "Pop", blurb: "Scale up from slightly smaller, with a soft overshoot." },
  { id: "bounce", name: "Bounce", blurb: "Slide in with a springy overshoot." },
];

export interface PositionInfo {
  id: string;
  name: string;
}

export const POSITIONS: PositionInfo[] = [
  { id: "toast-top-start", name: "Top Left" },
  { id: "toast-top-center", name: "Top Center" },
  { id: "toast-top-end", name: "Top Right" },
  { id: "toast-bottom-start", name: "Bottom Left" },
  { id: "toast-bottom-center", name: "Bottom Center" },
  { id: "toast-bottom-end", name: "Bottom Right" },
];

export const TYPES = ["success", "error", "warning", "info"] as const;
