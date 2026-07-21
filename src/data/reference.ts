// Structured reference data mirrored from the Laravel package
// (config/laravel-toaster-magic.php and the ToastMagic facade). Keep in sync
// with the package on each release.

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
    description: "One of the seven built-in visual themes.",
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
];

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
    name: "livewire_version",
    type: "string",
    default: `'v3'`,
    description: "Which Livewire major version to target: 'v3' or 'v4'.",
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
