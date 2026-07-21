// Canonical route table — the single source of truth for the sidebar, search
// index, prev/next navigation, and the build-time sitemap. Keep it free of React
// imports so vite.config.ts can read it under Node during the build.

export interface RouteMeta {
  path: string;
  title: string;
  /** Sidebar label (defaults to title). */
  label?: string;
  description: string;
  section: string;
  keywords?: string[];
}

export const ROUTES: RouteMeta[] = [
  {
    path: "/",
    title: "Laravel Toaster Magic — Elegant toast notifications for Laravel",
    label: "Introduction",
    description:
      "A lightweight, dependency-free toast notification package for Laravel with 7 beautiful themes, smooth animations, and first-class Livewire v3 & v4 support.",
    section: "Overview",
    keywords: ["laravel", "toast", "notification", "livewire", "intro", "overview", "home"],
  },

  {
    path: "/docs/getting-started",
    title: "Getting Started",
    description: "Add Laravel Toaster Magic to your application in under a minute.",
    section: "Getting Started",
    keywords: ["start", "setup", "begin", "composer"],
  },
  {
    path: "/docs/installation",
    title: "Installation",
    description: "Install via Composer, publish the assets, and wire up the Blade styles and scripts.",
    section: "Getting Started",
    keywords: ["install", "composer", "vendor:publish", "assets", "setup"],
  },
  {
    path: "/docs/quick-start",
    title: "Quick Start",
    description: "Fire your first toast from a controller in three lines of PHP.",
    section: "Getting Started",
    keywords: ["quick", "first toast", "controller", "facade"],
  },
  {
    path: "/docs/basic-usage",
    title: "Basic Usage",
    description: "The four toast types, headings, descriptions, and per-toast options.",
    section: "Getting Started",
    keywords: ["usage", "success", "error", "warning", "info", "facade"],
  },

  {
    path: "/docs/themes",
    title: "Themes",
    description: "Seven built-in themes: default, material, iOS, glassmorphism, neon, minimal, and neumorphism.",
    section: "Guides",
    keywords: ["theme", "material", "ios", "glassmorphism", "neon", "minimal", "neumorphism", "style"],
  },
  {
    path: "/docs/animations",
    title: "Animations",
    description: "Entrance and exit animations plus the smooth FLIP stack reflow.",
    section: "Guides",
    keywords: ["animation", "slide", "fade", "pop", "bounce", "motion", "flip"],
  },
  {
    path: "/docs/positioning",
    title: "Positioning",
    description: "Anchor the toast stack to any of the six screen corners and edges.",
    section: "Guides",
    keywords: ["position", "top", "bottom", "corner", "placement"],
  },
  {
    path: "/docs/configuration",
    title: "Configuration",
    description: "The full config/laravel-toaster-magic.php reference and every option.",
    section: "Guides",
    keywords: ["configure", "config", "defaults", "options", "publish"],
  },
  {
    path: "/docs/color-gradient-mode",
    title: "Color & Gradient Mode",
    label: "Color & Gradient",
    description: "Colorize toast backgrounds by type and add subtle gradient accents.",
    section: "Guides",
    keywords: ["color mode", "gradient", "color_mode", "gradient_enable", "background"],
  },
  {
    path: "/docs/dark-mode",
    title: "Dark Mode",
    description: "Enable dark mode globally with a single HTML attribute.",
    section: "Guides",
    keywords: ["dark", "light", "color scheme", "theme attribute"],
  },
  {
    path: "/docs/examples",
    title: "Examples",
    description: "Copy-paste recipes: validation errors, action buttons, avatars, custom timeouts, and more.",
    section: "Guides",
    keywords: ["examples", "recipes", "validation", "action button", "avatar", "messagebag"],
  },
  {
    path: "/docs/security",
    title: "Security",
    description: "How toast content is rendered, XSS safety, and sanitized button links.",
    section: "Guides",
    keywords: ["security", "xss", "escape", "sanitize", "html"],
  },
  {
    path: "/docs/best-practices",
    title: "Best Practices",
    description: "Guidance on security, accessibility, timing, and UX for great notifications.",
    section: "Guides",
    keywords: ["best practices", "security", "accessibility", "ux"],
  },
  {
    path: "/docs/migration",
    title: "Migration & Upgrade",
    label: "Migration",
    description: "Upgrade between major versions and move from other Laravel notification packages.",
    section: "Guides",
    keywords: ["migration", "upgrade", "legacy", "versions"],
  },

  {
    path: "/docs/integration/controllers",
    title: "Controllers & Redirects",
    label: "Controllers",
    description: "Trigger toasts from controllers with the ToastMagic facade and flash them across redirects.",
    section: "Integration",
    keywords: ["controller", "facade", "redirect", "flash", "back"],
  },
  {
    path: "/docs/integration/livewire",
    title: "Livewire (v3 & v4)",
    label: "Livewire",
    description: "Dispatch toast notifications from Livewire components with event-based dispatching.",
    section: "Integration",
    keywords: ["livewire", "dispatch", "event", "v3", "v4"],
  },
  {
    path: "/docs/integration/javascript",
    title: "JavaScript & AJAX",
    label: "JavaScript",
    description: "Fire toasts client-side from AJAX responses and custom events.",
    section: "Integration",
    keywords: ["javascript", "ajax", "js", "client", "fetch"],
  },
  {
    path: "/docs/integration/blade",
    title: "Blade Setup",
    label: "Blade",
    description: "Render the required styles and scripts in your Blade layout.",
    section: "Integration",
    keywords: ["blade", "styles", "scripts", "layout", "assets"],
  },

  {
    path: "/docs/api",
    title: "API Reference",
    description: "The ToastMagic facade, the fluent dispatch() builder, and the JavaScript class.",
    section: "API Reference",
    keywords: ["api", "reference", "facade", "ToastMagic", "dispatch"],
  },
  {
    path: "/docs/methods",
    title: "Methods",
    description: "Every method: success, error, warning, info, dispatch, styles, scripts.",
    section: "API Reference",
    keywords: ["methods", "success", "error", "dispatch", "styles", "scripts"],
  },
  {
    path: "/docs/options",
    title: "Options",
    description: "All toast options and configuration options with types and defaults.",
    section: "API Reference",
    keywords: ["options", "config options", "toast options", "parameters"],
  },

  {
    path: "/docs/faq",
    title: "FAQ",
    description: "Common questions about assets, Livewire, security, dark mode, and themes.",
    section: "Help",
    keywords: ["faq", "questions", "help"],
  },
  {
    path: "/docs/troubleshooting",
    title: "Troubleshooting",
    description: "Fixes for the most common issues: missing styles, no toast, wrong position.",
    section: "Help",
    keywords: ["troubleshooting", "issues", "not working", "debug", "problem"],
  },
  {
    path: "/docs/changelog",
    title: "Changelog",
    description: "Release history for Laravel Toaster Magic.",
    section: "Help",
    keywords: ["changelog", "releases", "history", "versions"],
  },
  {
    path: "/docs/contributing",
    title: "Contributing",
    description: "How to report issues, run the tests, and open a pull request.",
    section: "Help",
    keywords: ["contributing", "contribute", "development", "pull request"],
  },
  {
    path: "/docs/license",
    title: "License",
    description: "Laravel Toaster Magic is released under the MIT license.",
    section: "Help",
    keywords: ["license", "mit", "legal", "treeware"],
  },
];

export const SECTION_ORDER = [
  "Overview",
  "Getting Started",
  "Guides",
  "Integration",
  "API Reference",
  "Help",
];

export interface NavSection {
  title: string;
  items: RouteMeta[];
}

export const NAV_SECTIONS: NavSection[] = SECTION_ORDER.map((title) => ({
  title,
  items: ROUTES.filter((r) => r.section === title),
}));

/** Flattened order used for prev/next paging (skips the Overview landing page). */
export const PAGE_ORDER: RouteMeta[] = ROUTES.filter((r) => r.path !== "/");

export function routeByPath(path: string): RouteMeta | undefined {
  return ROUTES.find((r) => r.path === path);
}
