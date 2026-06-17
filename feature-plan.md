# Laravel Toaster Magic – Upcoming Release Feature Plan

> Status: Draft for the next release cycle (planning for **v2.2.0** with a **v3.0.0** outlook)
> Author role: Maintainer planning document
> Date: 2026-06-17

---

## Executive Summary

### Overall assessment

Laravel Toaster Magic is a **mature, focused, and genuinely useful** package. It does one thing — toast notifications for Laravel — and it does it with zero front-end dependencies, a clean facade API, Livewire v3/v4 support, and a polished set of 7 themes. It has real adoption traction (Packagist downloads, GitHub stars) and a working live demo. The core idea is sound and the scope is correctly narrow.

The package is, however, **under-engineered in exactly the places that matter for trust and long-term maintainability**: there are no automated tests, no CI, no changelog, no declared dependency constraints in `composer.json`, and several documentation/code mismatches that will actively confuse new users. None of these require expanding the package's scope to fix — they are quality and reliability investments.

**The single most important conclusion of this plan: the next release should be a "trust and polish" release, not a feature release.** The package does not need more features. It needs to become provably correct, provably compatible, and provably documented. That is what converts a "nice package I found" into "a package I depend on in production."

### Strengths

- **Tightly scoped.** It resists feature creep and is easy to reason about (3 PHP classes, a small JS runtime, CSS themes).
- **Zero runtime dependencies on the front end.** No jQuery/Bootstrap/Tailwind — a real selling point.
- **Good DX surface.** Facade with `success/info/warning/error`, options array, Livewire event dispatch, and an (undocumented) declarative `data-toast-*` HTML API.
- **Thoughtful details already present.** URL sanitization for custom buttons, `MessageBag` flattening, newline normalization, versioned asset auto-publishing, RTL/dark mode, and theme variety.
- **Backward-compatibility awareness** (e.g. supporting both `showCloseBtn` and `closeButton` keys in Livewire events).

### Weaknesses

- **No tests and no CI.** Zero regression protection. For a package that injects script/style into every page and writes to `public/`, this is the biggest risk to its reputation.
- **`composer.json` declares no dependencies.** `"require": {}` means no `php` floor and no `illuminate/support` constraint. Composer cannot warn users about incompatible PHP/Laravel versions, and the package's true support matrix is undocumented and unenforced.
- **A hardcoded `"version"` field in `composer.json`** (`2.1.0`) — an anti-pattern that fights git-tag-based versioning and drifts (`version.php` says `v2.1`, the tag is `v2.1`, composer says `2.1.0`).
- **Documentation/code mismatches.** The README prominently documents `ToastMagic::dispatch()->success(...)`, but no `dispatch()` method exists in `ToastMagic.php` — copying the README example throws an error. The facade docblock is malformed (`clear(): void`) and lists a nonexistent `message()` method while omitting `useVite()`.
- **`preventDuplicates` is configurable but never implemented** in the JS runtime — a dead option that misleads users.
- **Overstated "XSS Safe" claim.** Only the custom button URL is sanitized. Toast heading/description are injected via `innerHTML` without escaping, so HTML in a message renders as markup. Safe when developers pass static strings; an XSS vector if they pass unsanitized user input. The README's blanket "XSS Safe" badge is misleading.
- **No changelog / upgrade notes / release checklist.** Hard for users to assess upgrade risk.

### Recommended release strategy

A **two-track** strategy:

1. **v2.2.0 — "Trust & Polish" (immediate, non-breaking).** Fix the documentation/code mismatches, declare proper dependency constraints, add a real test suite + CI, add a changelog and upgrade/troubleshooting docs, implement the already-advertised `preventDuplicates`, and add the small high-value runtime features that have near-zero maintenance cost (per-toast duration, programmatic dismiss, pause-on-hover). All additive and backward compatible.
2. **v3.0.0 — "Correctness" (later, opt-in / clearly communicated).** Address the message-escaping default and any SPA re-initialization changes that could alter existing behavior, behind clear upgrade notes and a deprecation cycle.

Ship v2.2.0 first and let it stabilize before planning v3.0.0.

---

## Package Philosophy

These principles should govern every future decision and be quoted in the README/CONTRIBUTING:

1. **One responsibility: toast notifications.** Anything that is not "show a transient, dismissible message" is out of scope. No notification center, no inbox, no persistence layer, no analytics, no admin UI.
2. **Zero front-end dependencies, forever.** No jQuery, Bootstrap, Tailwind, or build step required to consume the package. New features must not introduce front-end runtime dependencies.
3. **Backward compatibility is a feature.** Default behavior should not change between minor versions. Breaking changes are batched into major versions with an upgrade guide and, where possible, a deprecation period.
4. **Convention over configuration.** Sensible defaults that work with no config. New options must justify their existence; every option is a lifetime maintenance and documentation cost.
5. **Solo-maintainer sustainable.** Prefer features that are "write once, rarely touch." Reject features that create ongoing support burden, require tracking external API churn, or need per-Laravel-version babysitting.
6. **Correct and honest.** The docs describe exactly what the code does. Security claims are precise. If something is a footgun, it is documented as one.
7. **Lightweight payload.** The injected CSS/JS stays small. Theme growth should not bloat the default download.

---

## Recommended Features

> Ordered roughly by priority. "Features" here includes correctness/quality work, which is deliberate — for this package, reliability *is* the headline feature of the next release.

### 1. Declare proper dependency constraints & remove hardcoded version

**Problem**
`composer.json` has `"require": {}` and a hardcoded `"version": "2.1.0"`. There is no enforced minimum PHP version (the code uses `string|null` union types and `match`-free but typed properties requiring PHP 8.0+) and no `illuminate/support` constraint. Composer cannot protect users from installing on an incompatible stack, and the hardcoded version drifts from git tags.

**Proposed Solution**
Add explicit constraints, e.g.:
```json
"require": {
    "php": "^8.0",
    "illuminate/support": "^9.0 || ^10.0 || ^11.0 || ^12.0"
}
```
(Confirm the true PHP floor against the syntax actually used.) **Remove the `"version"` field entirely** and let Packagist derive versions from git tags. Document the support matrix in the README.

**Benefits**
Correct installs, clear support matrix, no version drift, fewer "doesn't work on my Laravel" issues.

**Maintenance Cost** Low
**Complexity** Low
**Breaking Change Risk** Low (could surface for users on very old, technically-unsupported stacks — which is the point)
**Priority** Critical
**Recommendation** Approve

---

### 2. Fix documentation/code mismatches (`dispatch()`, facade docblock, "XSS Safe")

**Problem**
The README documents a fluent API `ToastMagic::dispatch()->success(...)` that does not exist in the codebase — users who copy it get a fatal error. The facade docblock declares a nonexistent `message()` method, a malformed `@method static void clear(): void`, and omits `useVite()`. The README markets the package as "XSS Safe" when only URLs are sanitized.

**Proposed Solution**
Decide per item: either (a) **implement** `dispatch()` as a thin fluent entry point (return `$this`, since `success/info/...` already exist on the instance) so the README becomes true, or (b) remove the fluent examples from the README. Implementing it is trivial and makes the docs correct without breaking anything — recommended. Fix the facade docblock to match the real API (`add`, `info`, `success`, `warning`, `error`, `clear`, `styles`, `scripts`, `scriptsPath`, `useVite`). Reword the security section to precisely state what is and isn't escaped (see Feature 8).

**Benefits**
Eliminates the most damaging first-run failure (a broken README example), restores IDE autocompletion accuracy, and makes the security posture honest.

**Maintenance Cost** Low
**Complexity** Low
**Breaking Change Risk** Low
**Priority** Critical
**Recommendation** Approve

---

### 3. Establish an automated test suite + CI

**Problem**
There are no tests and no CI. Every change is a blind change. For a package that writes to `public/`, parses `composer.lock`, builds inline `<script>` strings, and has tricky asset-path heuristics, this is the largest reliability risk.

**Proposed Solution**
Add **Pest** (or PHPUnit) with **Orchestra Testbench** as dev dependencies and cover the PHP surface that is most error-prone:
- Flash message storage/retrieval and the `scripts()` output (correct `toastMagic.<type>(...)` calls, escaping via `json_encode`, fallback option handling, position/theme class injection).
- `MessageBag` flattening and newline normalization.
- Type fallback (`add()` coercing unknown types to `info`).
- `normalizeVersion()` and the versioned-publishing decision logic.
- The asset-path resolution branches in `getDynamicAsset()` (the most fragile code).

Add a GitHub Actions workflow running the suite across the supported PHP and Laravel matrix. Optionally add a tiny JS test (Vitest) for `sanitizeUrl` and `_parseArgs`, but keep it optional to avoid a Node toolchain becoming mandatory.

**Benefits**
Regression protection, confidence to refactor the fragile asset logic, a green CI badge that signals trustworthiness, and a much lower review burden for community PRs.

**Maintenance Cost** Low–Medium (dev-only deps; tests are mostly write-once)
**Complexity** Medium
**Breaking Change Risk** Low (dev-only)
**Priority** Critical
**Recommendation** Approve

---

### 4. Implement `preventDuplicates` (make the existing option real)

**Problem**
`preventDuplicates` ships in the default config and is documented, but the JS runtime never reads it. Users who enable it see no effect — a silent broken promise.

**Proposed Solution**
In the JS `show()` path, when `preventDuplicates` is enabled, skip rendering a toast whose `type + heading + description` matches a currently-visible toast. Small, self-contained, reads the already-exposed `window.toastMagicConfig`.

**Benefits**
Honors documented behavior; genuinely useful for noisy AJAX flows.

**Maintenance Cost** Low
**Complexity** Low
**Breaking Change Risk** Low (default is `false`, so no behavior change unless opted in)
**Priority** High
**Recommendation** Approve

---

### 5. Per-toast duration & configurable inter-toast delay

**Problem**
`timeOut` and `showDuration` are global-only. There is no way to make a single critical error stay longer or a quick success disappear faster. Additionally, stacked toasts are spaced by a **hardcoded 1000ms** delay (in both `scripts()` and the Livewire queue), which feels sluggish and is not configurable.

**Proposed Solution**
Accept an optional `timeOut` (and optionally `showDuration`) inside the per-toast `options` array, threaded through to the JS `show()` call as a per-call override. Make the inter-toast stacking delay a config value (e.g. `stackDelay`, default keeping current behavior or a snappier default chosen deliberately). Keep all globals as fallbacks.

**Benefits**
A frequently requested capability (per-message duration), removes a magic number, improves perceived responsiveness — all without new dependencies.

**Maintenance Cost** Low
**Complexity** Low–Medium
**Breaking Change Risk** Low (additive; defaults preserve current behavior)
**Priority** High
**Recommendation** Approve

---

### 6. Programmatic dismiss + pause-on-hover + progress bar (small UX polish)

**Problem**
There is no JS API to dismiss toasts programmatically (`toastMagic.clear()` on the client), and toasts auto-dismiss even while the user is hovering/reading them — a common usability complaint. There is no visual countdown.

**Proposed Solution**
Add `toastMagic.clear()` / `toastMagic.dismissAll()` to the JS class. Add **pause-on-hover** (clear the dismiss timer on `mouseenter`, restart on `mouseleave`) gated behind a config flag defaulting to current behavior to avoid surprises, or default-on if deemed strictly an improvement. Optionally add an opt-in CSS progress bar tied to `timeOut`.

**Benefits**
Meaningful, low-cost UX wins that match user expectations from other toast libraries; pure CSS/JS, no dependencies.

**Maintenance Cost** Low
**Complexity** Low–Medium
**Breaking Change Risk** Low (gate behind flags / additive)
**Priority** Medium–High
**Recommendation** Approve

---

### 7. Document the declarative `data-toast-*` HTML API

**Problem**
The JS already supports triggering toasts from any element via `data-toast-type`, `data-toast-heading`, `data-toast-description`, `data-toast-close-btn`, `data-toast-btn-text`, `data-toast-btn-link` — a genuinely nice, framework-agnostic feature that is **completely undocumented**. Hidden value.

**Proposed Solution**
Document it in the README with a short "No-JS / declarative usage" recipe. No code change needed (verify behavior with a test from Feature 3).

**Benefits**
Surfaces an existing feature; great for static pages, blade-only apps, and demos — increases perceived capability at zero implementation cost.

**Maintenance Cost** Low
**Complexity** Low
**Breaking Change Risk** Low
**Priority** Medium
**Recommendation** Approve

---

### 8. Honest message-escaping policy (and an opt-in safe mode)

**Problem**
Heading/description are rendered via `innerHTML`. Server-side text is `json_encode`d (safe as a JS *string*) but is then assigned to `innerHTML`, so embedded HTML renders. This is fine for static developer strings but is an XSS vector if user-controlled input is passed in — yet the README claims the package is "XSS Safe" outright.

**Proposed Solution**
Two parts:
- **Now (v2.2.0, non-breaking):** Correct the README to state precisely that *custom button URLs* are sanitized and that *message/heading content is rendered as HTML — do not pass unsanitized user input, or escape it yourself*. Add a troubleshooting/security note.
- **Later (v3.0.0, breaking, opt-in transition):** Introduce escaping of heading/description by default, with an explicit per-toast `allowHtml`/`html => true` opt-out for users who intentionally pass markup (the existing `<br>` newline handling must be preserved — implement it as escaping-then-controlled-`<br>` insertion). Ship behind a clearly communicated major version with upgrade notes.

**Benefits**
Makes the security claim truthful immediately; closes a real XSS footgun safely without surprising existing users.

**Maintenance Cost** Low–Medium
**Complexity** Medium (must preserve newline-to-`<br>` behavior while escaping)
**Breaking Change Risk** Doc fix: Low. Default escaping change: **High** → defer to v3.0.0.
**Priority** High (doc fix) / Medium (default change, later)
**Recommendation** Approve (doc fix now) / Consider Later (default escaping in v3)

---

### 9. SPA / persistent-navigation reliability (Inertia, Turbo, Livewire `wire:navigate`)

**Problem**
The default runtime wires up the container and click handlers on `DOMContentLoaded`. Under SPA-style navigation (Inertia, Turbo Drive, Livewire `wire:navigate`) the event does not fire again, so flashed toasts on subsequent navigations may not render via the default (non-Livewire) path. Livewire's event path is handled, but the broader SPA story is unaddressed and likely a source of "toasts don't show" issues.

**Proposed Solution**
Make initialization idempotent and also bind to the relevant navigation lifecycle events when present (e.g. Turbo `turbo:load`, Livewire `livewire:navigated`) in addition to `DOMContentLoaded`. Keep it dependency-free and feature-detect — only attach listeners for frameworks that are actually present. Document a one-line recipe for Inertia users (dispatch from the page response). Cover with a documented manual test matrix rather than heavy browser automation.

**Benefits**
Removes a whole class of "works on full page load, not on SPA nav" bug reports — increasingly common as Laravel apps adopt `wire:navigate`/Inertia.

**Maintenance Cost** Medium (light coupling to framework lifecycle events)
**Complexity** Medium
**Breaking Change Risk** Low–Medium (idempotency must be careful not to double-bind)
**Priority** Medium
**Recommendation** Consider Later (target v2.3.0 after gathering specific reports; ship a documented recipe now)

---

### 10. Harden / simplify asset path resolution

**Problem**
`getDynamicAsset()` decides URLs using heuristics including `request()->ip() === '127.0.0.1'` and Windows `public/public` string matching. This is fragile, hard to test, and a likely source of "assets 404" issues on nonstandard hosting (subdirectory installs, symlinked public dirs, load balancers where the client IP isn't localhost).

**Proposed Solution**
Do not rewrite blindly. First, **cover the existing branches with tests** (Feature 3) to lock current behavior. Then introduce an explicit config override (e.g. `asset_base_url` / `system_processing_directory` already exists) so users on unusual setups have an escape hatch without relying on IP heuristics. Document the override in a troubleshooting section. Treat a full rewrite as a long-term consideration once tests exist.

**Benefits**
Fewer asset-loading support issues; an escape hatch for edge hosting; safer future refactors.

**Maintenance Cost** Medium
**Complexity** Medium
**Breaking Change Risk** Medium (asset URL logic touches every install) → tests first
**Priority** Medium
**Recommendation** Consider Later (tests now; config escape hatch in v2.2.0 if low-risk)

---

## Features Explicitly Rejected

These may sound attractive but conflict with the package's philosophy, scope, or maintainability:

- **Notification center / persistent notification inbox.** Out of scope. Toasts are transient by definition; persistence turns this into a different product with a database, models, and migrations to maintain.
- **Analytics / read-receipts / delivery tracking.** Scope creep with a heavy ongoing maintenance and privacy burden.
- **Built-in admin/settings UI for configuring toasts.** Config files are sufficient; a UI is a maintenance sink and an admin-panel direction the package must avoid.
- **Sound/audio notifications bundled in the package.** Niche, accessibility-fraught, and would bloat the asset payload. Document how users can hook their own audio if desired instead.
- **A full theme builder / runtime theme editor.** The 7 curated themes are a strength; a builder is a large, perpetually-supported surface. Keep themes as curated CSS.
- **Email / SMS / push / database notification channels.** That is Laravel's Notification system's job. Integrating channels would explode scope and dependencies.
- **A Tailwind/Bootstrap-styled variant or framework integrations.** Directly violates the "zero front-end dependency" promise.
- **Heavy front-end framework wrappers (React/Vue/Svelte components).** The declarative `data-toast-*` API and JS class already cover programmatic use; maintaining per-framework wrappers is unsustainable for a solo maintainer.
- **Queueing/broadcasting toasts over WebSockets (real-time toasts to other users).** This is broadcasting/notification territory, requires infrastructure, and is a different problem domain.
- **An unbounded options grab-bag (animations library, drag-to-dismiss, swipe gestures, RTL-per-toast, etc.).** Each option is a lifetime cost. Add only the few with broad, proven demand (covered above).

---

## Suggested Release Roadmap

### v2.2.0 (Immediate Release) — "Trust & Polish" (non-breaking)

- **#1** Declare `php` + `illuminate/support` constraints; remove hardcoded `version`. *(Critical)*
- **#2** Fix README `dispatch()` mismatch (implement `dispatch()` or remove example), fix facade docblock, correct "XSS Safe" wording. *(Critical)*
- **#3** Add Pest/PHPUnit + Testbench suite and GitHub Actions CI matrix. *(Critical)*
- **#4** Implement `preventDuplicates` in the JS runtime. *(High)*
- **#5** Per-toast `timeOut`/`showDuration` override + configurable stack delay. *(High)*
- **#6** Programmatic dismiss + pause-on-hover (gated) + optional progress bar. *(Medium-High)*
- **#7** Document the declarative `data-toast-*` API. *(Medium)*
- **#8 (doc portion)** Precise security/escaping documentation + troubleshooting note. *(High)*
- Add `CHANGELOG.md`, upgrade notes, and a release checklist (see below).

### Next Minor Release (v2.3.0)

- **#9** SPA/persistent-navigation initialization (Inertia/Turbo/`wire:navigate`) once specific reports/recipes are validated.
- **#10** Asset-path config escape hatch + troubleshooting docs, backed by the new tests.
- Optional: small JS unit tests (Vitest) for `sanitizeUrl`/argument parsing if a Node toolchain is acceptable.

### Long-Term Considerations (v3.0.0+)

- **#8 (default change)** Escape heading/description by default with an `allowHtml` opt-out — major version, with deprecation notice in v2.x and a clear upgrade guide.
- Refactor/simplify `getDynamicAsset()` once test coverage makes it safe.
- Reassess whether the dual Livewire v3/v4 asset duplication can be unified to reduce maintained files.
- Evaluate a documented, dependency-free "bring your own animation" CSS hook if demand is proven.

---

## Documentation Tasks

- **Fix the `dispatch()` example** so the README only shows APIs that exist.
- **Add a "Compatibility / Support Matrix"** section: supported PHP and Laravel versions, Livewire v3/v4 notes.
- **Add an "Upgrade Guide"** section (per-major-version notes; start with 1.x → 2.x recap and a placeholder for 2.x → 3.x).
- **Add a "Troubleshooting" section** covering: assets 404 (subdirectory installs, `system_processing_directory`, symlinked public), toasts not showing under SPA navigation, Livewire setup gotchas, Vite usage (`useVite()`), and the dark-mode `theme="dark"` attribute.
- **Document the declarative `data-toast-*` API** with a copy-paste example.
- **Rewrite the Security section** to state precisely what is sanitized (custom button URLs) and that message content is rendered as HTML — with guidance to escape user input.
- **Add a "Recipes" / FAQ** section: validation errors via `MessageBag`, per-toast duration, preventing duplicates, AJAX usage, custom action button, choosing a theme/position.
- **Document `useVite()`** and when it's needed.
- **Consolidate versioning docs**: ensure README, `version.php`, and git tags tell a consistent story.
- **Add a CONTRIBUTING note** restating the package philosophy and the "what we will not build" list (mirror the rejected-features section) to reduce out-of-scope PRs.

## Testing Tasks

- Set up **Pest/PHPUnit + Orchestra Testbench**; add CI matrix (PHP 8.x × Laravel 9–12, as supported).
- Test **flash storage & `scripts()` output**: correct per-type calls, `json_encode` escaping, close-button fallback logic, theme/gradient/color/position class injection.
- Test **`MessageBag` flattening** and **newline normalization** (collapse 2+ newlines, convert to `<br>`).
- Test **unknown type fallback** to `info`.
- Test **`normalizeVersion()`** across `^`, `v`, `~`, `-beta` inputs, and the **versioned-publish decision** (publish when versions differ / no published version; skip when equal).
- Test **`getDynamicAsset()` branches** (public vs root vs unknown, localhost heuristic, Windows path case) to lock behavior before any refactor.
- Add a **manual browser-test checklist** (documented, not automated) covering each theme, each position, RTL, dark mode, pause-on-hover, preventDuplicates, and SPA navigation.
- Optional **JS unit tests** (Vitest) for `sanitizeUrl` and `_parseArgs` if a Node toolchain is acceptable — keep optional to avoid forcing a build step.

## Release Checklist

A practical pre-publish checklist (turn into `RELEASE_CHECKLIST.md`):

1. [ ] All tests green in CI across the full PHP/Laravel matrix.
2. [ ] `composer.json` requirements accurate; **no hardcoded `version` field**.
3. [ ] `CHANGELOG.md` updated with a new dated section (Added/Changed/Fixed/Deprecated/Security).
4. [ ] README examples all execute as written (especially `dispatch()` and Livewire snippets).
5. [ ] Facade docblock matches the real public API.
6. [ ] No documented option is unimplemented (e.g. `preventDuplicates`).
7. [ ] Minified CSS/JS regenerated and committed; `assets/version.php` reflects the new version.
8. [ ] Manual browser checklist run on at least Chrome + Firefox + one mobile viewport.
9. [ ] Asset auto-publish verified on a fresh install and on an upgrade (old assets replaced).
10. [ ] Security section accurately describes escaping behavior.
11. [ ] Upgrade notes written if anything changed defaults/behavior.
12. [ ] SemVer respected: breaking → major, additive → minor, fixes → patch.
13. [ ] Git tag matches the intended release; Packagist webhook confirmed.
14. [ ] Live demo updated to the new version.

### Versioning & deprecation policy (to adopt)

- **Follow SemVer strictly.** Default-behavior changes are major; new opt-in features are minor; fixes are patch.
- **Deprecate before removing.** Mark deprecated options/methods in docs and (where possible) with runtime notices one minor version before removal in the next major.
- **Maintain a changelog** in Keep-a-Changelog style and link it from the README.

---

## Final Recommendation

The next release should **make Laravel Toaster Magic more trusted, not bigger.** The package's scope is already right; its gaps are in correctness, proof, and documentation. Ship **v2.2.0 as a "Trust & Polish" release**: declare real dependency constraints, fix the README/code mismatches (the broken `dispatch()` example is actively costing first-time users), stand up a test suite and CI, implement the already-advertised `preventDuplicates`, and add the handful of low-cost runtime wins (per-toast duration, programmatic dismiss, pause-on-hover) that users expect from a modern toast library. Surface the hidden declarative `data-toast-*` API through documentation, and make the security claims honest.

Defer everything with breaking potential — default HTML escaping and SPA re-initialization changes — to a clearly communicated **v3.0.0** with an upgrade guide, so existing users are never surprised.

This path maximizes adoption and developer satisfaction precisely *because* it preserves simplicity: a green CI badge, a truthful README, accurate types, and a few thoughtful, dependency-free improvements will do more for the package's reputation and download growth than any number of new features — and it keeps the maintenance burden squarely within what a single maintainer can sustain.
