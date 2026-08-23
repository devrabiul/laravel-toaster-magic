# Changelog

All notable changes to `laravel-toaster-magic` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-08-23

A **"Safe by default"** release. It adds the compact theme and global spacing/typography
options — and fixes a cross-site scripting vulnerability, makes message
escaping the default, removes a per-request filesystem loop and consolidates the two JavaScript
runtimes into one.

**Upgrading:** republish the assets — the CSS and JS both changed.

```bash
php artisan vendor:publish --tag=toast-magic-assets --force
```

---

### Security

- **Fixed a cross-site scripting vulnerability in `sanitizeUrl()`** *(high severity)*.
  The sanitiser validated only the URL prefix and never escaped quotes, and the result
  was interpolated into an `innerHTML` string. A URL such as `/a" onerror="alert(1)`
  closed the `src`/`href` attribute and injected an event handler. Reachable through
  the `avatar` option (the README's own example passes a user profile field),
  `customBtnLink`, Livewire event options, and `data-toast-btn-link`.
  URLs are now parsed with `new URL()`, checked against a protocol allowlist, and
  applied with `setAttribute()` — which makes attribute breakout structurally
  impossible rather than merely filtered.
- **Message content is now escaped by default.** Headings, descriptions and action
  button labels are written with `textContent`. Newlines still become real `<br>`
  elements, inserted *after* escaping. See *Changed* below for the compatibility note.
- **Config values are validated against allowlists** before reaching the page.
  `theme`, `positionClass` and `animation` outside the known sets fall back to their
  defaults instead of being concatenated into generated output.
- **The emitted JSON is hardened** with `JSON_HEX_TAG`/`HEX_AMP`/`HEX_APOS`/`HEX_QUOT`,
  and `JSON_UNESCAPED_SLASHES` has been removed, so a `</script>` in any value cannot
  terminate the script block early.
- **Added Content-Security-Policy support** — `ToastMagic::nonce($nonce)` or the
  `csp_nonce` config value applies a nonce to both inline script blocks. The package
  previously offered no way to work under a policy without `'unsafe-inline'`.

### Fixed

- **Assets are no longer deleted and re-copied on every request.** When the installed
  version could not be resolved — a `dev-*` constraint, a branch alias, a path
  repository — the version check treated "unknown" as "republish", wrote a marker that
  was itself unresolvable, and so never converged. Every request deleted and re-copied
  the whole asset directory, and concurrent requests served 404s for the package's own
  CSS out of the gap. Publishing now converges, and dev installs identify by their
  commit reference so they still get fresh assets on update.
- **`composer.lock` is no longer read on every request.** The installed version comes
  from Composer's in-memory runtime API, and the result is cached.
- **Asset publishing is atomic.** The new tree is staged and swapped into place with
  renames, so the public directory is never momentarily missing.
- **Published configs now receive new options.** `mergeConfigFrom()` plus a recursive
  merge against the packaged defaults replaces the previous "load defaults only when no
  published config exists" behaviour, which silently withheld every option added after
  a user published their config.
- **The runtime now reads its configuration.** The config object was emitted *after*
  the runtime `<script>`, so the constructor always saw an empty object and every
  configured value — theme, position, close button — stayed on its built-in default.
- **`showCloseBtn` works server-side.** The README has documented this key since v2.2
  while only `closeButton` was read.
- **`vendor:publish --tag=toast-magic-assets` exists.** Documented as the upgrade step
  for several releases without the tag ever being registered.
- **The `slide` animation exists.** Offered in the config and the README with no CSS
  behind it, so selecting it silently fell through to the default.
- **The progress bar tracks the real dismiss time.** It was hardcoded to 3s regardless
  of `timeOut`, and kept running while the timer was paused.
- **The Livewire build renders avatars correctly.** Its copy of the runtime had drifted
  and omitted the `toast-body-avatar` class.
- **Asset URLs no longer branch on the client's IP address.** `request()->ip()` reported
  `127.0.0.1` in production behind any reverse proxy, producing the wrong asset path.
- **`toast-top-end` no longer left-aligns on small screens.** A mobile rule set an
  inline-start inset that overrode the position's own anchor.
- **`data-toast-type` is validated.** Any truthy property name — `constructor`, `show`,
  `clear` — was previously invoked, throwing an uncaught `TypeError`.
- **Fixed a jsdom-visible leak in the FLIP reflow**: an interrupted transition left
  inline `transition`/`translate` styles on the element permanently. There is now a
  timeout fallback.
- Removed a dead `<div>` rendered on every toast, a duplicated iOS rule, and the
  `.toast-item.hide` rules that nothing ever applied (the class is now applied on close,
  which also fixes the RTL exit direction).

### Accessibility

- **Announcements now work.** Toasts were given `role="alert"` and inserted with their
  content already present, which assistive technology frequently does not announce.
  Announcements are now written into persistent live regions — polite for
  success/info/warning, assertive for errors.
- **The close button has an accessible name** (`closeButtonLabel`, default
  *"Close notification"*). It previously announced as "button". Icons are `aria-hidden`.
- **<kbd>Esc</kbd> dismisses the most recent toast**, so dismissal no longer depends on
  the close button being enabled.
- **Keyboard focus pauses the dismiss timer**, regardless of `pauseOnHover`.
- **`timeOut => 0` keeps a toast until dismissed** (WCAG 2.2.1).
- **`prefers-reduced-motion` is honoured throughout.** Only the stack reflow respected it
  before; entrances, exits, the iOS bounce and the progress bars all kept moving.
- **Fixed WCAG AA contrast failures.** Color mode forced white text onto every accent —
  white on the amber measured **1.63:1** and on the cyan **1.96:1** against a 4.5:1
  requirement. Warning and info now take a dark foreground. The `neumorphism` theme
  inherited white text onto its hardcoded light surface in dark mode (**1.27:1**) and now
  pins its own foreground.
- **Close-button touch targets** are at least 24×24 px, and 32×32 px on coarse pointers.
- Added dark-mode treatments for `glassmorphism` and `minimal`, and raised the
  glassmorphism surface opacity so text is not left floating over the page behind it.

### Added

- **Compact theme.** A new `'theme' => 'compact'` option: a smaller, denser take on the default
  toast. Padding, the icon-to-text gap, the title/description gap and the space around the close and
  action controls are all pulled in, the controls share a single row, the progress bar is slimmed to
  2px and the track narrows from 370px to 320px. Deliberately plain — a solid surface, a hairline
  border and semantic accents, with no gradients, blur or glass effects. Supports every toast type,
  avatar toasts, color mode, animations, dark mode and RTL.
- **Global spacing options.** A new `'spacing'` section (`enable`, `container`, `icon_gap`,
  `content_gap`, `close_gap`) controls the toast's padding, the icon-to-text gap, the
  title-to-description gap and the space around the close/action controls — for any theme, not just
  `compact`. Each value is resolved into a CSS custom property that every theme declares as the
  *fallback* of its own value, so `enable => false` (or an omitted value) falls back to the theme's
  spacing while a set value overrides every theme without `!important` overrides.
- **Global typography options.** A new `'typography'` section (`enable`, `title_size`,
  `description_size`, plus optional `title_weight`, `description_weight` and `line_height`) works
  the same way, with the same per-value fallback behavior.
- **Test coverage** for the compact theme and for the spacing/typography options across every
  built-in theme, including their interaction with color mode and gradient mode.
- **`html` option per toast** — `['html' => true]` renders that toast's text as HTML.
  The global `escape_html` option turns escaping off everywhere, but is not recommended.
- **`stagger` option** — the delay between consecutive queued toasts, previously a
  hardcoded 1000 ms which meant the fifth flashed message appeared four seconds after
  page load, by which time the first had already dismissed. Now configurable, and 800 ms
  by default.
- **`maxVisible` option** (default `15`) — the most toasts on screen at once; the oldest is
  dismissed to make room. The container is `position: fixed` with no scrolling and
  `pointer-events: none`, so without a cap a burst of flashed messages pushed toasts past
  the bottom of the viewport, where they could be neither read nor closed and simply waited
  out their timers off-screen. Roughly six toasts fit on a phone. Use `0` for no limit.
- **`closeButtonLabel` and `containerLabel`** options for accessible names.
- **`asset_path_prefix`** option, replacing the IP-address heuristic.
- **A JavaScript test suite** — 148 tests covering rendering, escaping, URL sanitising,
  timers, the data-attribute API, the Livewire bridge and accessibility. The runtime
  holds essentially all of the package's behaviour and previously had no tests at all.
- **A reproducible asset build** — `npm run build` regenerates the minified stylesheet
  and `npm run build:check` fails CI if the committed file does not match the source.
  There was previously no build tooling of any kind in the repository.
- **ESLint**, and CI jobs for the JavaScript suite, the build check, and a PHP 8.0
  syntax gate.

### Changed

- **One JavaScript runtime.** `assets/js/livewire-v3/laravel-toaster-magic.js` was a
  343-line hand-maintained copy that had already drifted from the standard build in four
  places. It has been **removed**; the Livewire build now loads the shared runtime plus a
  ~90-line event bridge. Tests assert the two paths produce byte-identical markup.
- **`MessageBag` flattening uses newlines instead of `<br>`.** With escaping on, a
  literal `<br>` would be displayed as text. Toasts using `['html' => true]` still get
  `<br>`. This changes the string stored in the session; it does not change what renders.
- **Removed the dead `livewire_version` config key.** Nothing ever read it — one bridge
  serves both Livewire v3 and v4, which dispatch browser events identically.
- **Removed the `version` field from `composer.json`** so the git tag is authoritative.
- **Declared the previously implicit dependencies** on `illuminate/config`,
  `illuminate/session`, `illuminate/filesystem` and `illuminate/cache`.
- **`useVite()` and `nonce()` return `$this`** for chaining.
- **Marketing images moved out of `assets/`** into `art/`. They were being copied into
  every consuming application's public directory — 1.5 MB of the 1.6 MB published.
  The published payload is now ~140 KB.
- **`.gitattributes` excludes development files** from the Composer dist tarball.
- **CI now covers the declared floor** (PHP 8.0 / Laravel 8) rather than starting at
  PHP 8.1 / Laravel 10 while advertising lower.
- The generic `.position-relative` utility class the package leaked globally — a
  Bootstrap name — is now `.toast-magic-relative`.

### Compatibility notes

- **Toast text that intentionally contained HTML will now render as text.** Add
  `['html' => true]` to those calls. This is the one behavioural change likely to be
  noticed, and it is deliberate: the previous default turned any user-supplied value
  into an XSS hole.
- **Installs from a branch or path repository no longer auto-publish assets.** Run
  `vendor:publish --tag=toast-magic-assets --force` after updating. Tagged releases are
  unaffected.
- **`asset_path_prefix` may need setting** on a shared host whose document root is the
  project root *and* whose entry script is not at the project root. Auto-detection covers
  the standard layouts.

### Notes on the new defaults

- The shipped `spacing`/`typography` defaults are enabled and slightly tighter than the historical
  `default` theme (10px 12px padding instead of 1.25rem, a 2px title/description gap instead of
  4px). Published configs are merged over the packaged defaults, so this applies on upgrade too —
  set `'spacing' => ['enable' => false]` and `'typography' => ['enable' => false]` to keep each
  theme's original spacing and font sizes.
- Republish the assets after upgrading — the CSS and JS both changed:
  `php artisan vendor:publish --tag=toast-magic-assets --force`

## [2.4.0] - 2026-08-13

A **"Soft UI"** release: one new theme, no API changes, and no change to any existing theme.

### Added

- **Neumorphic theme.** A new `'theme' => 'neumorphic'` option: a soft-UI surface built from
  dual-direction shadows (light highlight + soft dark shadow) and a hairline inner bevel instead of
  borders. The icon puck, close button and action button are raised controls that lift on hover and
  press into the surface on `:active`, and the progress bar sits in a recessed groove. Ships with a
  dedicated dark-mode treatment, RTL support, mobile-tuned depth and touch targets, focus-visible
  rings, and `prefers-reduced-motion` handling. Customizable through `--tm-neu-*` CSS variables
  scoped to `.toast-container.theme-neumorphic`. Existing themes — including `neumorphism` — are
  unchanged.
- **Theme test coverage.** A new test suite verifies theme selection for every built-in theme, all
  toast types under the neumorphic theme, its interaction with color mode, gradient mode, positions,
  animations and per-toast options, and that no neumorphic rule leaks into another theme.

## [2.3.0] - 2026-06-18

A **"Motion & Avatars"** release. See [release.md](release.md) for the full notes.

### Added

- **Avatar / notification-style toasts.** Pass an `avatar` image URL in the options array (or via
  Livewire event options) to render an image in place of the type icon — ideal for "new message" /
  "new follower" style notifications. The URL is sanitized before rendering.
- **Entrance/exit animations.** A new `animation` config option (`default`, `slide`, `fade`, `pop`,
  `bounce`) controls how toasts enter and leave the screen. `default` preserves the current behavior.
- **Smooth stack reflow.** When a toast is added or dismissed, the remaining toasts now glide
  smoothly into their new positions (FLIP technique) instead of jumping. Respects
  `prefers-reduced-motion`.

### Fixed

- **Stack teleport during overlapping animations.** A stale animation-cleanup race and a
  double-counted offset in the reflow logic made the stack jump when entrances and exits overlapped.
- **Inconsistent Livewire stacking.** The Livewire runtime used hard-coded position checks that
  handled some positions differently from the standard build; both runtimes now share one rule.

## [2.2.0] - 2026-06-17

A **"Trust & Polish"** release: no change to the package's scope, focused on correctness,
reliability, compatibility, and developer experience. All changes are backward compatible.

### Added

- **Fluent `dispatch()` entry point.** `ToastMagic::dispatch()->success(...)` now works as
  documented (previously the README example referenced a method that did not exist).
- **Per-toast duration overrides.** `timeOut` and `showDuration` can now be set per toast via
  the options array (and via Livewire event options), falling back to the global config when omitted.
- **Pause-on-hover.** The auto-dismiss timer now pauses while a toast is hovered. Enabled by
  default; disable with `'pauseOnHover' => false` in the config.
- **Programmatic dismiss API.** `toastMagic.clear()` / `toastMagic.dismissAll()` dismiss all
  visible toasts from JavaScript.
- **Validation `MessageBag` support.** Passing a `MessageBag` (e.g. `$validator->errors()`) to any
  toast type now flattens it into a single toast, one message per line.
- **Automated test suite.** Pest + Orchestra Testbench, covering message flashing, all toast types,
  unknown-type fallback, ordering, `dispatch()`, `clear()`, `MessageBag` flattening, `scripts()`
  output, newline normalization, per-toast options, and `normalizeVersion()`.
- **Continuous integration.** GitHub Actions workflow running the suite across PHP 8.0–8.5 and
  Laravel 8–13, plus a build-status badge in the README.

### Changed

- **Declared dependency constraints** in `composer.json`: `php: ^8.0` and
  `illuminate/support: ^8.0 || ^9.0 || ^10.0 || ^11.0 || ^12.0 || ^13.0`. Composer can now warn
  about installation on an unsupported stack.
- **Corrected the facade docblock** to match the real public API (`styles`, `scripts`, `scriptsPath`,
  `dispatch`, `useVite`, accurate `MessageBag` parameter types) for reliable IDE autocompletion.
- **Refactored** the duplicated `MessageBag` handling across the four toast methods into a single
  `normalizeMessage()` helper.
- **Clarified the security documentation** (see Security below).

### Fixed

- **`preventDuplicates` now works.** The option shipped in the config but was never honored by the
  JavaScript runtime; identical toasts (same type, heading, and description) that are currently
  visible are now skipped when the option is enabled.
- **`clear()` now clears queued messages.** It previously only reset the in-memory list, leaving
  already-flashed messages in the session; it now also forgets the session key.
- **`MessageBag` no longer triggers a `TypeError`.** The previous `string` type hint made the
  `MessageBag` handling unreachable.

### Security

- The **"XSS Safe"** claim has been reworded to be accurate. Custom button URLs are sanitized, but
  toast heading/description content is rendered as HTML. The Security section now documents this
  clearly and advises escaping user-supplied input (e.g. with `e()`). Escaping message content by
  default is planned for a future major release (v3.0.0), with an opt-in flag for intentional HTML.

[2.2.0]: https://github.com/devrabiul/laravel-toaster-magic/releases/tag/v2.2.0
