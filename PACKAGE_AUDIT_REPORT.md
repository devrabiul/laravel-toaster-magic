# Package Audit Report

**Package:** `devrabiul/laravel-toaster-magic`
**Audit date:** 2026-08-23
**Audited revision:** working tree after the v2.6.0 remediation pass (base commit `8a148a0`)
**Scope:** full remediation of the P0/P1 findings from the previous audit, followed by an independent second audit of the resulting package.

> This is a new audit of the final state, not an annotated copy of the previous one. Findings that were fixed are recorded under *Changes Implemented* with the evidence that fixed them; everything still outstanding is listed under *Remaining Findings* with the same severity discipline as before.

---

## Executive Summary

The package is in substantially better shape than it was at the start of this pass, and the change is structural rather than cosmetic.

The headline result is that **the confirmed cross-site scripting vulnerability is gone, and it is gone by construction rather than by filtering**. The runtime no longer builds toast markup by concatenating values into an HTML string. Text goes through `textContent`, URLs go through `setAttribute()`, and URLs are validated by parsing them and checking the resulting protocol against an allowlist. Attribute breakout is not "blocked" — it is no longer expressible. Fifty-one JavaScript tests, including every payload from the original finding, prove it, and an end-to-end run of the real PHP-rendered output through jsdom confirms **zero inline event handlers anywhere in the resulting DOM**.

Three further structural problems were resolved. **Message escaping is now the default**, with an explicit `['html' => true]` opt-in, so the package no longer behaves in a way that contradicts every Laravel developer's baseline expectation from Blade. **The per-request asset delete-and-copy loop is gone** — the version comes from Composer's in-memory runtime API instead of parsing `composer.lock`, publishing converges instead of repeating forever, and the swap is atomic so the public directory is never momentarily missing. And **the two hand-maintained JavaScript runtimes are now one**: the 343-line Livewire copy has been deleted, the Livewire integration is a 95-line event bridge, and tests assert both paths produce byte-identical markup.

Accessibility moved from the worst-scoring dimension to a genuinely good one. Announcements now use persistent live regions rather than the insert-a-populated-`role=alert` pattern that assistive technology largely ignores; the close button has an accessible name; Escape dismisses; keyboard focus pauses the timer; `timeOut => 0` satisfies WCAG 2.2.1; and reduced motion is honoured across every animation rather than just the stack reflow. All contrast failures are fixed and **verified numerically** — colour mode went from three of four types failing (worst: 1.63:1) to all four passing AA, and the `neumorphism` dark-mode failure at 1.27:1 is resolved.

The remediation also surfaced problems the first audit had not: **typed class constants had been introduced that would have fatal-errored on PHP 8.0–8.2** while the package advertised PHP 8.0; colour-mode surfaces were reusing the *progress bar's* opacity variable, rendering at 40% opacity in the `-start` positions; and the centre positions' `transform` was breaking the closing-toast animation. All three are fixed.

What remains is honest technical debt rather than defects: the per-type CSS is still copy-pasted across six themes, the repository still mixes the package with a marketing site, and there is no visual-regression coverage. None of it blocks a release.

**Verification:** 192 PHP tests (498 assertions), 141 JavaScript tests, ESLint clean, minified asset verified reproducible, all source parses on PHP 8.0, `composer.json` valid.

---

## Changes Implemented

### P0 — Critical

#### P0-1 · Fixed the XSS in `sanitizeUrl()`

The vulnerable pattern was URL interpolation into an `innerHTML` template. The fix removes the pattern, not just the payload.

**What changed** (`assets/js/laravel-toaster-magic.js`):

- The entire toast is now built with `document.createElement()`. `toast.innerHTML = ...` is gone.
- `sanitizeUrl(value, allowedProtocols)` parses with `new URL(value, document.baseURI)`, rejects control characters and whitespace (the classic scheme-smuggling vector), and checks `parsed.protocol` against a per-context allowlist. It returns `null` — never a dangerous value — for anything else.
  - Links: `http:`, `https:`, `mailto:`, `tel:`, plus relative and fragment URLs.
  - Avatars: `http:`, `https:`, plus relative URLs.
- URLs are applied with `setAttribute("src", …)` / `setAttribute("href", …)`. **A quote in an attribute value cannot create a second attribute**, so the breakout class is structurally eliminated rather than filtered.
- A rejected link degrades to `#` (the documented contract, preserved); a rejected avatar falls back to the type icon.
- Every URL-bearing path was audited and routed through the same function: `avatar`, `customBtnLink`, Livewire event options, and `data-toast-btn-link`.

**Evidence** — `tests-js/security.test.mjs`, 51 tests. Every payload from the brief is covered:

| Payload | Result |
|---------|--------|
| `/a" onerror="alert(1)` | no `on*` attribute created; `src` is a single value |
| `#a" onerror="alert(1)` | ditto |
| `http://example.com" onerror="alert(1)` | ditto |
| `https://example.com" onerror="alert(1)` | ditto |
| `javascript:alert(1)` | rejected → `href="#"`, avatar falls back to icon |
| `JaVaScRiPt:alert(1)`, `  javascript:…`, `java\tscript:…` | rejected |
| `data:text/html;base64,…`, `vbscript:…` | rejected |

Each test asserts that **no attribute beginning with `on`** exists anywhere in the rendered toast, and that no `<script>` element was created. Legitimate URLs (`https://…`, `/orders/42`, `#details`, `mailto:…`) are asserted to still work unchanged.

#### P0-2 · Stopped the per-request asset delete/copy

**Root cause:** `normalizeVersion()` returned `null` for any non-numeric version (`dev-main`, branch aliases, path repositories, missing lock file). The guard treated `null`/`null` as "republish", then wrote `'version' => ''` — which normalised back to `null`. The state could never converge, so every request performed `deleteDirectory()` + `copyDirectory()` on ~1.6 MB.

**What changed** (`src/AssetsServiceProvider.php`):

- An unresolvable identity now **publishes nothing**. "I don't know the version" is no longer treated as "replace everything".
- Dev installs are no longer stranded: `resolveAssetIdentity()` falls back to Composer's install **reference** (commit hash), which still changes on update — so `dev-main` installs converge on a real identity rather than either looping or never publishing.
- Publishing is **atomic**: the new tree is staged in a sibling directory and swapped in with two renames. A concurrent request sees the old complete tree or the new complete tree, never a half-deleted one. On failure the original is restored.
- A cache marker short-circuits the check entirely, so a warm request does **no filesystem work at all**.
- The version marker is never written empty.

**Evidence** — `tests/Unit/AssetsServiceProviderTest.php`, 28 tests covering the cases named in the brief:

- normal version · changed version · unresolved version · missing version metadata · missing source assets · repeated requests
- *"does not touch the assets on a repeated boot"* — plants a sentinel file inside the published tree and boots five more times; the sentinel survives. Under the old code it would have been deleted on the first repeat.
- *"does not touch the assets on a repeated boot even with a cold cache"* — proves the marker file alone short-circuits the copy.
- *"never leaves the target directory missing while republishing"* — asserts no staging directories survive the swap and the content is intact.
- *"treats an empty marker as absent"* — locks out the non-convergence bug specifically.

#### P0-3 · Stopped parsing `composer.lock` on every request

`getCurrentVersion()` now uses `Composer\InstalledVersions`, an already-autoloaded PHP array — no file I/O, no JSON decode, no linear scan. The result feeds a cached identity check.

**Evidence** — a test tokenises `AssetsServiceProvider.php`, **strips comments** (so the docblock explaining the change cannot satisfy it), and asserts the code contains no `composer.lock`, no `json_decode` and no `file_get_contents`, and does reference `InstalledVersions`. Works with `config:cache` (nothing is resolved at config-build time).

#### P0-4 · Made HTML escaping safe by default

**What changed:**

- The runtime writes text with `textContent`. Newlines become **real `<br>` elements inserted after escaping**, so multiline messages still work and a message containing markup is displayed rather than executed.
- PHP no longer converts newlines to `<br>` before sending — that would have been displayed literally once escaping was on. It normalises line endings and collapses blank runs; the runtime does the rest.
- `MessageBag` flattening joins with `\n` instead of `<br>` (and still with `<br>` when the toast opts into HTML).
- Per-toast opt-in: `['html' => true]`. Global switch: `escape_html` (default `true`).
- Applies to **heading, description and custom button text** — the last of which the old documentation never even mentioned as unescaped.
- `json_encode` now uses `JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT`, and `JSON_UNESCAPED_SLASHES` was removed, so `</script>` in any value cannot terminate the block.

**Evidence** — escaping tests in `tests-js/security.test.mjs` and `tests/Feature/SecurityTest.php` cover `<script>`, `<img onerror>`, `<svg onload>`, tag-splitting payloads, the `html: true` opt-in, the global switch, per-toast opt-out beating global opt-in, and newline handling mixed with markup.

Config, PHP API, JS runtime, README, security docs, tests and changelog were all updated.

### P1 — High

#### P1-5 · One shared runtime, thin Livewire adapter

`assets/js/livewire-v3/laravel-toaster-magic.js` (343 lines, a hand-maintained copy that had already drifted in four places) is **deleted**. `scriptsPath()` now loads the shared runtime for both builds and appends the bridge only when Livewire is enabled.

The bridge is **95 lines** and does one thing: translate a `toastMagic` browser event into a call on the shared runtime. Both Livewire v3 and v4 dispatch browser events identically, so one bridge serves both.

**Verified parity** — `tests-js/livewire.test.mjs` renders the same toast through the direct API and through the bridge and asserts `outerHTML` is **byte-identical**, across four toast types and four option shapes (plain, close button, avatar, action button). Each of the previously identified divergences is covered:

| Divergence | Status |
|------------|--------|
| avatar body class (`toast-body-avatar` missing in Livewire) | fixed, asserted |
| icon sizes (25px vs 28px) | fixed — one icon set |
| config re-reading | fixed — both read lazily |
| shadow handling | fixed — one code path |
| close button behaviour | fixed, asserted |

A guard test asserts the bridge contains no `innerHTML`, no `createElement`, no `getToasterIcon`, no `sanitizeUrl`, and stays under 120 lines — so the duplicated-runtime pattern cannot quietly return.

#### P1-6 · `mergeConfigFrom()`

`register()` now calls `$this->mergeConfigFrom(...)`. Because that merge is shallow, `ToastMagic::resolveOptions()` additionally does an `array_replace_recursive` against the packaged defaults, so nested `options`, `spacing` and `typography` keys are filled in too.

**Evidence** — `tests/Feature/ConfigTest.php`:

- *"fills in every option a published config predates"* simulates a v2.0-era config and asserts the user's values survive while `pauseOnHover`, `animation`, `shadow_enable`, `escape_html`, `stagger`, `timeOut`, `showDuration` and both accessibility labels all resolve to the packaged defaults.
- *"fills in nested spacing and typography keys a published config predates"* covers the second level.
- *"keeps a user value of false rather than replacing it with the default"* guards the classic merge bug.
- *"emits the documented defaults when nothing is configured"* asserts the PHP default and the value the runtime actually uses agree for every option — they previously diverged (`showDuration` was 300 in config, 100 in the runtime).

Publish tags `toast-magic-config` and `toast-magic-assets` are now registered (the latter has been documented as the upgrade step for several releases without existing), with the untagged config publish retained for backward compatibility.

#### P1-7 · Accessibility

| Area | Change |
|------|--------|
| **Live regions** | Two persistent, visually-hidden regions created up front — `role="status"`/`aria-live="polite"` and `role="alert"`/`aria-live="assertive"`. Announcements are written into them. The toast itself is a labelled `role="group"` with no live semantics, so nothing is announced twice. Errors are assertive; success/info/warning are polite. |
| **Close button** | `aria-label` from `closeButtonLabel` (default *"Close notification"*). Real `<button type="button">`. All SVG icons get `aria-hidden="true"` and `focusable="false"`; the avatar keeps `alt=""`. |
| **Keyboard** | <kbd>Esc</kbd> dismisses the newest toast, resolving "newest" correctly for both top and bottom positions. |
| **Focus** | `focusin`/`focusout` pause and resume the dismiss timer **regardless of `pauseOnHover`** — a keyboard user cannot have a toast removed mid-interaction. |
| **Timing** | `timeOut => 0` (global or per toast) keeps a toast until dismissed. The progress bar is hidden in that state. |
| **Reduced motion** | One `@media (prefers-reduced-motion: reduce)` block neutralises transitions, animations, entrance/exit travel, the iOS bounce and the progress bars — for every theme, including future ones. Previously only the FLIP reflow honoured it. |
| **Touch targets** | Close buttons ≥ 24×24 px, and 32×32 px under `(pointer: coarse)`. The compact theme shrinks its icon, not its hit area. |

**Contrast — verified numerically, not visually:**

| Case | Before | After |
|------|-------:|------:|
| Colour mode · warning | **1.63:1** ❌ | **10.38:1** ✅ |
| Colour mode · info | **1.96:1** ❌ | **8.64:1** ✅ |
| Colour mode · success | **2.50:1** ❌ | **5.59:1** ✅ |
| Colour mode · danger | 4.53:1 ✅ | 4.53:1 ✅ |
| `neumorphism` dark mode | **1.27:1** ❌ | **9.56:1** ✅ |

Warning and info take a dark foreground (they are light accents); success uses a colour-mode-specific darker green so the conventional white-on-green reads at 5.59:1 without changing `--toast-magic-success`, which every other theme uses for icons. `tests/Feature/ContrastTest.php` computes WCAG relative luminance in PHP and fails the build below 4.5:1, so these cannot silently regress.

`glassmorphism` and `minimal` gained the dark-mode treatments they never had, and the glassmorphism surface opacity was raised from 8% to 72% so text is not left floating over whatever the page shows behind it.

#### P1-8 · Documentation corrected against the implementation

Every item from the brief was re-checked against the code. Where the docs described something real but missing, **the feature was implemented**; where it described something never intended, the docs were corrected.

| Claim | Resolution |
|-------|-----------|
| `livewire_version` | **Removed** from config and all docs — nothing ever read it. One bridge serves v3 and v4; the "v3 & v4 support" claim is accurate and retained. |
| `--tag=toast-magic-assets` | **Tag implemented.** The docs were right; the code was missing it. |
| `slide` animation | **CSS implemented** — a real position-aware slide, not an alias of default. |
| `showCloseBtn` | **Implemented server-side** (both keys accepted, per-toast beats global). |
| Reduced-motion claims | Now true across the board; README states precisely what is covered. |
| Dark mode | Documented that every theme has a treatment, plus how to bridge Tailwind's `.dark` and `prefers-color-scheme`. |
| CSP | New section — `ToastMagic::nonce()` / `csp_nonce`. Previously undocumented and unsupported. |
| HTML rendering / security | Rewritten: escaping is the default, `html: true` is the opt-in, URL allowlists are tabulated. |
| Config upgrade behaviour | Documented that published configs now receive new options automatically. |
| Asset publishing | Corrected — the old text implied `--provider=` published assets; it publishes only the config. Dev-install caveat documented. |
| `data-toast-*` API | **Newly documented** — a shipped feature that appeared in no document. |
| Theme docs | Theme count corrected; compact documented; `THEMES.md` upgrade block fixed. |
| Version references | README title, `assets/version.php` aligned; `composer.json` `version` field removed so the git tag is authoritative. |
| Accessibility | New section documenting announcements, keyboard, focus, timing, motion and touch targets. |
| `new ToastMagic()` | README no longer recommends it — it created a second instance competing for the container. `window.toastMagic` is documented instead. |

#### P1-9 · JavaScript test suite

Vitest + jsdom. **141 tests across 5 files**, testing real runtime behaviour, not string presence.

| File | Tests | Covers |
|------|------:|--------|
| `security.test.mjs` | 51 | URL injection, attribute breakout, `javascript:`/`data:`/`vbscript:`, HTML escaping, trusted-HTML opt-in, data-attribute escaping |
| `rendering.test.mjs` | 29 | all four types, heading, description, avatar, close button, action button, positional signature, multiple toasts, position ordering, container config, duplicate prevention |
| `livewire.test.mjs` | 24 | bridge behaviour, queueing, stagger, option mapping, and byte-identical parity with the direct API |
| `behavior.test.mjs` | 21 | auto-dismiss, `timeOut`, `timeOut: 0`, pause on hover, pause on focus, Escape, close, `clear()`, DOM readiness, reduced motion |
| `accessibility.test.mjs` | 16 | close-button name, decorative icons, live-region wiring, polite vs assertive, container label |

`data-toast-type` is asserted to accept only real toast types — `constructor`, `show`, `clear`, `_parseArgs` and `__proto__` all fall back to `info` without throwing.

### Additional fixes discovered during remediation

These were **not** in the original report and were found while working:

| ID | Severity | Issue |
|----|----------|-------|
| **N-1** | **High** | **Typed class constants** (`public const string`, `public const array`) had been introduced in all three `src/` classes. That is PHP 8.3+ syntax; the package declares `php: ^8.0` and CI runs 8.1. Every install below 8.3 would have fatal-errored on parse. Reverted, and a CI job now lints every file on PHP 8.0 to prevent recurrence. |
| **N-2** | Medium | **Colour-mode surfaces reused `--toast-item-after-opacity`** — a *progress bar* variable that the `-start` positions set to `0.4`. The identical toast rendered at 40% opacity on the left and 100% on the right, making white text unreadable in the left positions. Surfaces are now explicitly opaque; a test asserts the variable is absent from those rules. |
| **N-3** | Medium | **Centre positions broke the dismissal animation.** `toast-top-center`/`toast-bottom-center` used `transform: translateX(-50%)`, and a transformed ancestor becomes the containing block for `position: fixed` descendants — which is exactly what the runtime uses to pin a closing toast. Replaced with `inset-inline: 0; margin-inline: auto`. |
| **N-4** | Low | The style-variable allowlist regex rejected `+`, so legitimate `calc(1em + 2px)` values were silently dropped. Caught by a test I wrote expecting it to pass. |
| **N-5** | Low | The Livewire bridge's queue lived on `window` and could be clobbered by any other script, throwing on `.push`. It now re-creates the array on demand. |
| **N-6** | Low | The FLIP reflow's cleanup ran only on `transitionend`; an interrupted transition left inline `transition`/`translate` styles on the element permanently. Added a timeout fallback and a single shared cleanup path. |
| **N-7** | Low | `.toast-item.hide` was applied nowhere, so the RTL exit rule was dead. The class is now applied on close, and redefined to set only `opacity` — the base transform is already position- and direction-aware, so the old hardcoded `translateX(100%)` would have sent left-anchored and RTL toasts out the wrong side. |

Also fixed, all previously reported: mobile `toast-top-end` left-alignment; `100vw` scrollbar overflow; long-token heading overflow; the 100px action-label truncation; the dead `theme-ios-toast-item-border` div and `fs-12` class; the duplicated iOS icon rule; the globally-leaked `.position-relative` Bootstrap-shaped utility (now `.toast-magic-relative`); `provides()` without `DeferrableProvider`; the PR template in the wrong directory; the 1000 ms inter-toast stagger (now a configurable 250 ms); the client-IP asset heuristic; and the 1.5 MB of marketing images being copied into every consuming application.

---

## Verification

All figures below are actual output from this working tree.

```text
PHP tests            192 passed (498 assertions)     vendor/bin/pest
JavaScript tests     141 passed (5 files)            npm test  (vitest + jsdom)
Lint                 clean, 0 errors 0 warnings      npm run lint  (eslint)
Build verification   minified CSS matches source     npm run build:check
Syntax gate          all src + tests parse on PHP 8.0
Composer             ./composer.json is valid        composer validate
Static analysis      not configured (see R-9)
```

**Test breakdown**

| Suite | File | Tests |
|-------|------|------:|
| PHP | `ToastMagicTest.php` | 46 |
| PHP | `AssetsServiceProviderTest.php` | 28 |
| PHP | `ThemeTest.php` | 43 |
| PHP | `ShadowTest.php` | 15 |
| PHP | `ConfigTest.php` | 16 |
| PHP | `SecurityTest.php` | 19 |
| PHP | `ContrastTest.php` | 11 |
| PHP | `StyleVariablesTest.php` | 14 |
| JS | `security.test.mjs` | 51 |
| JS | `rendering.test.mjs` | 29 |
| JS | `livewire.test.mjs` | 24 |
| JS | `behavior.test.mjs` | 21 |
| JS | `accessibility.test.mjs` | 16 |

**End-to-end check.** Beyond the unit suites, the real output of `ToastMagic::scripts()` — from a request that flashed two toasts including a `<b>` tag, a newline, an attribute-breakout `customBtnLink` and a `javascript:` avatar — was executed in jsdom with the actual shipped runtime:

```text
container classes : toast-container toast-top-end theme-compact   ← config applied
toasts rendered   : 2
  heading         : "Saved <b>now</b>"    <b> element? false      ← escaped
  <br> count      : 1                                             ← newline preserved
  action href     : #                                             ← breakout payload rejected
  avatar img      : false                                         ← javascript: rejected
  close label     : Close notification
inline on* handlers anywhere: 0                                   ← XSS eliminated
live regions      : 2
```

**Measured improvements**

| Metric | Before | After |
|--------|-------:|------:|
| Published asset payload (copied into every app's `public/`) | ~1.6 MB | **144 KB** |
| JS runtime lines maintained | 686 (2 × 343 duplicated) | **877 in one file + 95 bridge** |
| `composer.lock` reads per request | 1 | **0** |
| Filesystem operations per warm request | 2+ (stat + include), or full delete+copy | **0** |
| PHP tests | 78 | **192** |
| JavaScript tests | 0 | **141** |

---

## Remaining Findings

Everything below is genuinely outstanding. Nothing has been dropped for convenience.

| ID | Severity | Location | Issue | Impact | Recommendation |
|----|----------|----------|-------|--------|----------------|
| **R-1** | Medium | `assets/css/laravel-toaster-magic.css` | Per-type CSS is still copy-pasted. The semantic RGB tokens appear **69 times**; the four `.toast-item.toast-{type}::before/::after` blocks differ only by which token they name, and the pattern repeats in glassmorphism, neon, neumorphism and neumorphic. | Every new theme and every new toast type costs four near-identical blocks. This is the largest remaining maintenance cost. | Promote the `neumorphic` theme's own solution — it already sets `--tm-neu-accent-rgb` once per type — to a global `--toast-accent-rgb`. Would collapse several hundred lines and make R-2 easier. |
| **R-2** | Low-Med | package-wide | No `maxToasts` cap. `.toast-container` has no `max-height` or `overflow`. | Flashing ~20 messages grows the stack past the viewport; off-screen toasts are unreachable and undismissable except via Escape. | Add a `maxToasts` option that evicts the oldest. |
| **R-3** | Low-Med | repository root | The repo still mixes the package with a marketing site. `package.json` now exists on `main` for the package's build tooling, and a **different** `package.json` exists on the `docs` branch for the Vite site. Switching branches leaves `node_modules/` wrong for whichever branch you are on. | Confusing for contributors; `npm ci` produces different trees per branch. | Move the marketing site to its own repository, or into a `site/` subdirectory with its own manifest. |
| **R-4** | Low | `assets/` | The **unminified** source CSS (56 KB) is published to `public/` alongside the minified build (39 KB). | ~58% of the published payload is a file no page loads. | Exclude the source from the publish copy, or ship a source map instead. |
| **R-5** | Low | `assets/js/` | JavaScript ships **unminified** (36 KB). The build pipeline now exists but only minifies CSS. | Larger-than-necessary transfer. Modest — it compresses well. | Add a JS target to `build/build.mjs`; the infrastructure is already there. |
| **R-6** | Low | `package.json` (dev only) | `npm audit` reports 6 advisories (2 moderate, 4 high) in `vitest`→`vite`→`esbuild`/`postcss`/`nanoid` and `eslint`→`js-yaml`/`brace-expansion`. | **No consumer impact** — these are `devDependencies` of a `private: true` manifest that is `export-ignore`d from the Composer tarball. They affect the maintainer's dev machine and CI only. | Track and update on the normal cadence. Do not let this block a release. |
| **R-7** | Low | `THEMES.md` | Still structured as the v2.0 release announcement with later releases appended, and still has no per-theme screenshots — only `neumorphic` and `compact` have images. The README links to it as a "full theme preview". | A user choosing among nine themes cannot see seven of them. | Restructure as a real theme gallery, or retitle it and stop linking it as a preview. |
| **R-8** | Low | `release.md` | Still a single-version file (v2.4), overwritten each release, duplicating CHANGELOG content. Now `export-ignore`d so it no longer ships. | Minor confusion; stale content in the repo. | Version it under `docs/releases/` or delete it. |
| **R-9** | Low | CI | No static analysis (PHPStan/Larastan) and no PHP formatter (Pint), though CONTRIBUTING.md mandates PSR-12. | Style and type regressions rely on review. The typed-constant incident (N-1) is now caught by the PHP 8.0 syntax gate, but a broader net would help. | Add Larastan at level 5 and Pint to CI. |
| **R-10** | Low | testing | No visual-regression coverage. Theme correctness is asserted through CSS substring checks and structural scans, not rendered output. | A theme could break visually with a green suite. | Playwright screenshots across theme × light/dark × LTR/RTL × 4 types would close the last real gap. |
| **R-11** | Informational | naming | `neumorphism` and `neumorphic` still ship as two distinct themes with a one-character difference. | Ongoing footgun for users and for grep. | Deprecate `neumorphism` as an alias at v3.0. |
| **R-12** | Informational | `assets/css` | `!important` count rose from 18 to **35**. Of the 17 added, **10** are the visually-hidden live-region utility and **5** are the reduced-motion block. | Both are standard, defensible practice for those specific patterns — a visually-hidden utility and a motion override must not be overridable. The pre-existing 18 (from the `padding: … !important` on `.toast-item` that every theme must then fight) remain the real debt. | Address alongside R-1. |

### Behavioural changes callers may notice

Documented in the CHANGELOG under *Compatibility notes*, repeated here because they are the honest cost of the fixes:

1. **Toast text that intentionally contained HTML now renders as text.** Add `['html' => true]`. This is deliberate — the previous default made any user-supplied value an XSS hole.
2. **Installs from a branch or path repository no longer auto-publish assets** on a version change (they publish once per commit reference). Tagged releases are unaffected.
3. **`MessageBag` flattening stores `\n` instead of `<br>`** in the session. What renders is unchanged.
4. **`asset_path_prefix` may need setting** on a shared host whose document root is the project root *and* whose entry script is not at the project root. Auto-detection covers the standard layouts; the old client-IP heuristic was wrong in production behind any proxy.

---

## Newly Discovered Findings

Issues found during this second pass that were **not** in the original report. All seven were fixed; they are listed here because the brief asks for them separately.

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| N-1 | **High** | Typed class constants (PHP 8.3+ syntax) in all three `src/` classes would fatal-error on PHP 8.0–8.2, which the package advertises and CI partly tested. | Fixed + CI syntax gate added |
| N-2 | Medium | Colour-mode surfaces reused the progress bar's opacity variable, rendering at 40% opacity in `-start` positions. | Fixed + test |
| N-3 | Medium | Centre positions' container `transform` broke `position: fixed` on the closing toast. | Fixed |
| N-4 | Low | Style-variable allowlist rejected `calc()` expressions containing `+`. | Fixed |
| N-5 | Low | Livewire bridge threw if `window._toastQueue` was replaced by other code. | Fixed |
| N-6 | Low | FLIP reflow leaked inline styles when a transition was interrupted. | Fixed + timeout fallback |
| N-7 | Low | `.toast-item.hide` was never applied, so the RTL exit rule was dead; the rule itself would have sent left-anchored toasts out the wrong side once applied. | Fixed |

---

## Security Review

### Confirmed vulnerabilities fixed

**S-1 · Attribute-breakout XSS in `sanitizeUrl()` — FIXED.**
Was: high severity, undisclosed, contradicted an explicit README safety claim, reachable through the README's own avatar example. Now: eliminated structurally by building the DOM with `setAttribute()` instead of string interpolation, plus protocol-allowlist validation via `new URL()`.
**Regression tests:** 51 tests in `tests-js/security.test.mjs` covering every payload class, each asserting no `on*` attribute and no `<script>` element is created. Plus an end-to-end jsdom run of real rendered output confirming **0 inline handlers**.

### Insecure defaults resolved

**S-2 · HTML-by-default message rendering — RESOLVED.**
Was a disclosed-but-dangerous default with a v3.0 remediation plan. Now escaping is the default, `['html' => true]` is the opt-in, and `customBtnText` — previously unescaped *and* undocumented as such — is covered.
**Regression tests:** escaping tests in both suites.

### Potential risks resolved

| Risk | Resolution |
|------|-----------|
| **S-3** Config values interpolated raw into generated JavaScript | `theme`, `positionClass`, `animation` validated against allowlists; anything else falls back to the default. `JSON_HEX_*` flags applied and `JSON_UNESCAPED_SLASHES` removed, so `</script>` in any value cannot terminate the block. Attribute values are `htmlspecialchars`-escaped. Tested with a `"></script><script>alert(1)</script>` theme value. |
| **S-4** No CSP support | `ToastMagic::nonce($nonce)` and the `csp_nonce` config option. A test asserts the nonce lands on **both** inline blocks — one would leave the page half-broken. |
| **S-5** Under-declared dependencies | `illuminate/config`, `illuminate/session`, `illuminate/filesystem` and `illuminate/cache` now declared. |
| **S-6** `include` of a file under the public web root | Still present in `getPublishedVersion()`, but now wrapped in `try/catch`, validated to be an array with a non-empty `version` key, and only ever written by the package itself. Accepted as low risk. |

### Remaining security posture

- **`['html' => true]` is caller-owned.** By design, and documented in the config file and README. This is the correct trade-off: the safe path is the default and the unsafe path is explicit and greppable.
- **`escape_html => false`** exists as a global escape hatch. Documented as not recommended, directly in the config comment.
- **Dev-only npm advisories** (R-6) — no consumer impact.
- No SQL, shell execution, deserialization, file uploads, or user-controlled file paths anywhere in the package.
- **Zero third-party runtime dependencies** — the supply-chain surface remains effectively nil.

### Security regression tests

| Layer | File | What it locks in |
|-------|------|------------------|
| DOM | `tests-js/security.test.mjs` (51) | attribute breakout, executable protocols, escaping, `html` opt-in, data-attribute API |
| Server | `tests/Feature/SecurityTest.php` (19) | script-block integrity, `</script>` breakout via message/description/button/config, JSON hex encoding, attribute escaping, nonce escaping, style-variable sanitisation, and structural guards asserting the runtime still uses `setAttribute`/`createTextNode` and protocol-based sanitising |

---

## Performance Review

### Improved

| Area | Before | After |
|------|--------|-------|
| **Filesystem per warm request** | `File::exists` + `include`, or a full 1.6 MB delete+copy when the version was unresolvable | **Zero** — a cache marker short-circuits the whole check |
| **`composer.lock` parsing** | `file_get_contents` + `json_decode` + linear scan, every request (typically 300–800 KB) | **Never read** — Composer's in-memory runtime API |
| **Published payload** | ~1.6 MB (1.5 MB of it marketing PNGs) | **144 KB** |
| **Race condition** | Delete-then-copy could serve 404s for the package's own CSS under concurrency | Atomic staged rename; the directory is never missing |
| **JS maintained** | 686 lines across two drifting copies | One runtime + a 95-line bridge |
| **Inter-toast stagger** | Hardcoded 1000 ms — the fifth flashed message appeared 4s after load, after the first had already dismissed | Configurable, default 250 ms |
| **Dead DOM per toast** | An unstyled `<div>` created for every toast in every theme | Removed |
| **Composer dist tarball** | Shipped tests, CI config, docs and 1.5 MB of images | `export-ignore` applied |

### Client-side, unchanged and still good

Event delegation means listener count does not grow with toast count. The FLIP reflow batches reads before writes and deliberately uses the independent `translate` property so it never fights the `transform`-based entrance animation — a considered implementation that was left alone apart from adding the missing cleanup fallback.

### Remaining

- **R-4** — the unminified source CSS is still published alongside the minified build (~58% of the remaining payload).
- **R-5** — JavaScript ships unminified.
- **R-1** — CSS could be several hundred lines smaller.

---

## Accessibility Review

### Verified contrast (computed, not eyeballed)

| Surface | Foreground | Ratio | AA |
|---------|-----------|------:|:--:|
| Colour mode · warning `#ffc107` | `#1a1d21` | 10.38:1 | ✅ |
| Colour mode · info `#0dcaf0` | `#1a1d21` | 8.64:1 | ✅ |
| Colour mode · success `#03774f` | `#ffffff` | 5.59:1 | ✅ |
| Colour mode · danger `#dc3545` | `#ffffff` | 4.53:1 | ✅ |
| `neumorphism` `#e0e5ec` | `#303643` | 9.56:1 | ✅ |
| `neumorphism` body | `#5c6474` | 4.70:1 | ✅ |
| `neumorphic` light `#e6eaf2` | `#303643` | 10.04:1 | ✅ |
| `neumorphic` dark `#2c2f36` | `#e7e9ee` | 11.03:1 | ✅ |
| `neon` `#09090b` | `#a1a1aa` | 7.76:1 | ✅ |
| `glassmorphism` light (72% white over black) | `#000000` | 10.47:1 | ✅ |
| `glassmorphism` dark | `#ffffff` | 15.67:1 | ✅ |
| default light / dark | — | 21.00:1 | ✅ |

Enforced by `tests/Feature/ContrastTest.php`, which implements the WCAG relative-luminance formula and fails below 4.5:1.

### Resolved

Live-region architecture · close-button accessible name · decorative icon handling · Escape dismissal · focus-based timer pause · `timeOut: 0` for WCAG 2.2.1 · comprehensive reduced-motion · touch targets ≥ 24 px (32 px coarse) · semantic `<button>` with explicit type · `role="group"` + label on the toast without duplicating the announcement.

### Remaining

| ID | Issue | Recommendation |
|----|-------|----------------|
| **A-1** | **No testing with real assistive technology.** The live-region architecture is the correct pattern and is unit-tested structurally, but has not been verified against NVDA, JAWS or VoiceOver. | Manual pass with at least one screen reader per platform before a major release. |
| **A-2** | **No swipe-to-dismiss on touch.** Escape covers keyboards; touch users depend on the close button or the timer. | Consider a swipe gesture. |
| **A-3** | **R-2 (no `maxToasts`)** has an accessibility dimension — an overflowing stack is unreachable for everyone, and Escape only removes one at a time. | Cap the stack. |
| **A-4** | Under reduced motion the progress bar completes instantly rather than being hidden. Harmless but slightly odd. | Hide it in that media query. |

---

## Testing Review

### Coverage improvements

From 78 PHP tests and **zero** JavaScript tests to **192 PHP + 141 JavaScript**.

The critical gap is closed: the runtime holds essentially all of the package's behaviour and previously had none of it tested. Every previously identified gap is addressed —

- JavaScript tests (T-1) → 141 tests
- Escaping/XSS regressions (T-2) → 51 security tests + 19 server-side
- Runtime parity (T-3) → byte-identical `outerHTML` assertions
- `getDynamicAsset()` (T-4) → all branches, including the explicit-prefix override
- `handleVersionedPublishing()` (T-5) → 28 tests including the non-convergence bug
- Livewire `scriptsPath()` branch (T-6) → both branches asserted
- Config merge (T-7) → generalised across every option and both nesting levels
- Accessibility assertions (T-9) → 16 tests plus 11 contrast tests
- Minified-asset sync (T-10) → `npm run build:check`, gated in CI
- CI breadth (T-11) → JS job, lint job, build-check job, PHP 8.0 syntax job, and matrix rows for the declared floor

Several tests deliberately **strip comments before asserting** on source code, so a docblock explaining a fix cannot satisfy the test that proves it.

### Remaining gaps

| ID | Gap | Value |
|----|-----|-------|
| **T-A** | **No visual regression testing** (R-10). Theme correctness is structural, not visual. | Highest remaining testing value. |
| **T-B** | **No real-browser testing.** jsdom does not implement layout, so the FLIP reflow, `position: fixed` behaviour and the centre-position fix (N-3) are reasoned about rather than measured. | Playwright would cover this and T-A together. |
| **T-C** | **No screen-reader verification** (A-1). |
| **T-D** | **No concurrency test for asset publishing.** Atomicity is asserted structurally (no staging leftovers, content intact); genuine parallel-request behaviour is not simulated. |
| **T-E** | **No mutation testing.** With a suite this size, Infection would show whether the assertions are as strong as the count suggests. |

---

## Documentation Review

**Documentation now matches implementation.** Every claim in the brief's list was re-verified against code:

| Claim | Verified |
|-------|:--------:|
| `livewire_version` | ✅ removed everywhere |
| `toast-magic-assets` tag | ✅ tag exists, asserted by test |
| `slide` animation | ✅ CSS exists, asserted by test |
| `showCloseBtn` | ✅ works server-side, asserted by test |
| Reduced-motion claims | ✅ accurate |
| Dark-mode support | ✅ accurate, with Tailwind/`prefers-color-scheme` guidance |
| CSP behaviour | ✅ documented and implemented |
| HTML rendering/security | ✅ rewritten |
| Config upgrade behaviour | ✅ documented |
| Asset publishing | ✅ corrected, dev-install caveat added |
| `data-toast-*` API | ✅ newly documented |
| Theme docs | ✅ count corrected, compact documented |
| Version references | ✅ single source (git tag) |
| Command examples | ✅ all executable as written |

**There is no longer a documented feature that silently does nothing** — the four that existed were each either implemented or removed.

Tests enforce parts of this: `ConfigTest` asserts `livewire_version` is absent from the shipped config and that both publish tags are registered; `ThemeTest` asserts CSS exists for every animation the config offers.

### Remaining

- **R-7** — `THEMES.md` is still shaped as a v2.0 release announcement and lacks a theme gallery.
- **R-8** — `release.md` is still single-version (now `export-ignore`d).
- No upgrade guide for the escaping change beyond the CHANGELOG's *Compatibility notes*. Given it is the one change likely to be noticed, a short `UPGRADING.md` would be worth adding.

---

## Dependency Review

**Composer declarations are now accurate.**

```json
"require": {
    "php": "^8.0",
    "illuminate/support":    "^8.0 || ^9.0 || ^10.0 || ^11.0 || ^12.0 || ^13.0",
    "illuminate/config":     "…",
    "illuminate/session":    "…",
    "illuminate/filesystem": "…",
    "illuminate/cache":      "…"
}
```

| Item | Status |
|------|--------|
| Previously implicit `illuminate/*` dependencies | ✅ declared |
| `"version"` field | ✅ removed — the git tag is authoritative |
| `support` block (issues/source/docs) | ✅ added |
| Declared floor actually tested | ✅ CI now includes PHP 8.0/Laravel 8 and PHP 8.1/Laravel 9 |
| `composer validate` | ✅ passes |
| Third-party runtime dependencies | ✅ still **zero** |
| Dev dependencies | ✅ appropriate; CI pins compatible Testbench/Pest majors per row |

**New (dev-only, `private: true`, `export-ignore`d):** `vitest`, `jsdom`, `esbuild`, `eslint`. Four packages to gain a test suite, a lint gate and a reproducible build — a reasonable trade, and none of it reaches consumers.

**No version upgrades are recommended.** R-6 (dev-only advisories) is the only dependency finding, and it does not warrant forcing upgrades.

---

## Standards Compliance

| Area | Before | After | Notes |
|------|:------:|:-----:|-------|
| **Security** | ❌ | ✅ | XSS eliminated structurally; escaping default; allowlists; CSP; hardened JSON. 70 regression tests. |
| **Performance** | ❌ | ✅ | Zero filesystem work per warm request; payload 1.6 MB → 144 KB; publishing atomic. R-4/R-5 minor. |
| **Accessibility** | ❌ | ✅ | Live regions, labels, keyboard, focus, timing, motion, contrast — all AA verified numerically. A-1 (real AT testing) outstanding. |
| **Testing** | ⚠️ | ✅ | 192 PHP + 141 JS. Visual regression (R-10) is the remaining gap. |
| **Documentation** | ⚠️ | ✅ | No documented feature does nothing. R-7 outstanding. |
| **Architecture** | ⚠️ | ✅ | One runtime + thin adapter; centralised, single-sourced, validated config. R-1 (CSS duplication) outstanding. |
| **Code Quality** | ⚠️ | ⚠️ | Much improved, but per-type CSS duplication and the `!important` padding debt remain. |
| **Maintainability** | ❌ | ✅ | One runtime, reproducible build, lint, broadened CI. R-1/R-3 outstanding. |
| **Composer** | ⚠️ | ✅ | Accurate declarations, no `version` field, floor actually tested. |
| **Laravel conventions** | ⚠️ | ✅ | `mergeConfigFrom`, publish tags, `config:cache` safe, dead `provides()` removed, container alias added. |
| **Browser compatibility** | ✅ | ✅ | Consistent evergreen targeting; the build pins the same targets. Touch gaps (A-2) remain. |
| **Build/Asset pipeline** | ❌ | ✅ | Was: none at all, unverifiable minified file. Now: reproducible, CI-gated. R-5 minor. |
| **RTL** | ⚠️ | ✅ | The dead `.hide` rule is fixed; exit direction now follows the position and direction correctly. |
| **Licensing** | ✅ | ✅ | MIT, consistent. |

---

## Final Score

| Category | Before | After |
|----------|-------:|------:|
| Architecture | 5/10 | **7/10** |
| Code Quality | 5/10 | **7/10** |
| Performance | 4/10 | **9/10** |
| Security | 3/10 | **9/10** |
| Accessibility | 3/10 | **8/10** |
| Testing | 5/10 | **8/10** |
| Documentation | 6/10 | **8/10** |
| Maintainability | 4/10 | **7/10** |
| **Overall** | **4.5/10** | **8/10** |

**Why not higher:** Architecture and code quality are held at 7 by R-1 — the per-type CSS duplication is real, measurable (69 token occurrences) and untouched, and it is the thing that will make the next theme and the next toast type more expensive than they should be. Maintainability is held at 7 by that plus R-3 (the repository still hosts two projects). Testing is held at 8 by the absence of visual and real-browser coverage; accessibility by the absence of real assistive-technology verification. Security and performance are 9 rather than 10 because `html: true` remains caller-owned by design and the published payload still includes a file no page loads.

**Totals**

| Metric | Count |
|--------|------:|
| Confirmed issues fixed | **28** (4 P0, 9 P1, 15 supporting) |
| Newly discovered issues (found and fixed this pass) | **7** |
| Confirmed vulnerabilities fixed | **1** (plus 1 insecure default resolved, 4 potential risks closed) |
| Remaining findings | **12** (0 critical, 0 high, 3 medium, 7 low, 2 informational) |
| Remaining testing gaps | **5** |
| Remaining documentation gaps | **3** |
| PHP tests | **192** (498 assertions) |
| JavaScript tests | **141** |

---

## Final Assessment

**Production-ready. Ship it.**

The one finding that would have blocked a release — the attribute-breakout XSS — is fixed, and fixed properly: the vulnerable construct was removed rather than filtered, so the class of bug cannot recur through a different payload. Fifty-one tests and an end-to-end run of real rendered output confirm it. That distinction matters, because the original vulnerability existed precisely *because* the previous fix attempt validated the URL prefix instead of removing the interpolation.

The three other structural problems — HTML-by-default rendering, the per-request asset loop, and the duplicated runtimes — are resolved with tests that lock in the behaviour, including tests specifically targeting the failure modes that made each bug hard to spot (an empty version marker, a config published before an option existed, byte-level markup parity between the two integrations).

The package now has something it did not have at any point in its history: **a way to know it still works**. 333 tests, a lint gate, a reproducible and CI-verified asset build, and a syntax gate on the lowest supported PHP. That last one is not hypothetical — this pass caught typed class constants that would have fatal-errored on every PHP below 8.3 while the package advertised 8.0, a defect introduced during development and invisible on the author's 8.4 machine.

Two things deserve explicit mention as costs. First, **escaping by default is a behavioural change**: callers deliberately passing HTML must add `['html' => true]`. That is the right call — the old default turned any user-supplied value into an XSS hole, and the CHANGELOG documents the migration clearly. Second, **branch installs no longer auto-publish assets on every request**; they publish once per commit reference, and the documented `--tag=toast-magic-assets --force` command now actually exists.

What is left is ordinary, well-understood debt. The CSS duplication (R-1) is the highest-value remaining work and is a refactor, not a fix — the `neumorphic` theme already demonstrates the pattern that would solve it. Visual regression testing (R-10) is the last meaningful gap in confidence. Neither should hold up a release.

**Recommended next steps, in order:**

1. Tag and release **v2.6.0**, with a security advisory for the XSS covering all prior 2.x versions.
2. Verify the live-region behaviour against at least one screen reader (A-1) — the architecture is correct but unverified against real AT.
3. Collapse the per-type CSS behind a shared accent variable (R-1).
4. Add Playwright visual regression across theme × mode × direction × type (R-10, T-B).
5. Separate the marketing site from the package repository (R-3).

---

*Report generated 2026-08-23 against the final working tree. All test counts, contrast ratios, payload sizes and verification output are actual measured results from this repository, not estimates. Contrast was computed with the WCAG 2.1 relative-luminance formula; the XSS fix was verified by executing real PHP-rendered output in jsdom and enumerating every attribute in the resulting DOM.*
