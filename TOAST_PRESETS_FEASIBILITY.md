# Feasibility: Custom Animated Toast Presets

Study of whether 14 proposed toast types (add-to-cart, wishlist, payment, upload,
etc.) can each be implemented as an individual toast with its own animated icon
and its own animation.

Based on the codebase at branch `security/v2.6-xss-fix-and-hardening` (v2.5).

---

## 1. Architecture: the three things that decide this

### 1.1 Type is a hard, closed allowlist — in five places

| Location | Constraint |
|---|---|
| `src/ToastMagic.php:31` | `const TYPES = ['success','error','warning','info']` |
| `src/ToastMagic.php:515` | `add()` silently coerces anything else → `info` |
| `src/ToastMagic.php:260` | `toastPayload()` re-validates against `TYPES` |
| `assets/js/laravel-toaster-magic.js:438` | `show()` coerces unknown type → `info` |
| `assets/js/livewire-v3/livewire-toaster-magic-v3.js:21` | bridge keeps its **own duplicate** copy of the list |

### 1.2 Per-toast options are whitelist-filtered on the PHP side

`toastPayload()` (`src/ToastMagic.php:279-307`) builds a fresh array and copies
only `customBtnText`, `customBtnLink`, `avatar`, `timeOut`, `showDuration`,
`html`, `showCloseBtn`. Anything else you pass — `['icon' => 'cart']` — is
**silently dropped before it reaches JS**.

This is the single biggest blocker: it is not that presets would look wrong, it
is that the payload cannot carry them at all.

### 1.3 Icon and animation are both locked to type, by different mechanisms

- **Icon** — `getToasterIcon(key)` (`js:312`) is a `switch` returning **trusted
  inline SVG constants**, parsed through `buildIcon()` which uses `innerHTML`.
  That is safe *only* because the markup is a package constant — the invariant
  established by the v2.5 XSS fix (`a7bc797`).
- **Animation** — `_buildToast()` (`js:523`) reads `config.animation` — **global
  only**. It never looks at `spec.animation`. Per-toast animation does not exist
  today, at any level of the API.

### 1.4 Two structural facts that shape the icon designs

- `.toast-item` has `overflow: hidden` (`css:147`) and the icon box is a fixed
  `25×25px` flex box (`css:1323`). **Particles that fly outside the icon box get
  clipped.**
- The reduced-motion block (`css:1623`) already covers `.toast-item *` and both
  pseudo-elements. **Any icon animation added is automatically
  `prefers-reduced-motion`-safe with zero extra work.**

---

## 2. Direct answers

| Question | Answer |
|---|---|
| Is it possible? | **Yes — all 14.** Nothing in the architecture forbids it. |
| Own custom animated icon? | **Yes**, via a closed icon registry. Keeps the "SVG is a package constant" security invariant intact. |
| Different animation per toast? | **Yes, but it does not exist yet.** `_buildToast` must be taught to read a per-toast value. ~3-line change. |
| Native support? | **No. Zero of the 14.** All require implementation across PHP + JS + CSS + Livewire bridge. |

---

## 3. Recommended approach: a preset layer, not new types

Two axes are being conflated and should stay separate:

- **Semantic type** (4 values) — drives color, the `::before`/`::after` progress
  bars, ARIA politeness (`error` → assertive), and per-theme styling. Adding a
  5th type means new CSS **× 9 themes × 2 pseudo-elements × color-mode ×
  gradient-mode**. Adding 14 types this way is combinatorial and would roughly
  double the stylesheet.
- **Preset** — icon + icon animation + optional entrance animation + default
  accessible label. Costs one SVG constant and one `@keyframes` block each.

So: **`preset` rides on top of one of the 4 existing types.**

```php
ToastMagic::cartAdded('Added to cart', 'Nike Air Max ×1');
// → type: success, preset: 'cart-add'
```

```js
toastMagic.success({ heading: 'Added to cart', preset: 'cart-add' });
```

### Implementation order

1. **JS — icon registry.** Turn `getToasterIcon`'s switch into a `TOAST_ICONS`
   object map keyed by preset name. Lookup by key only; unknown key falls back
   to the type icon. Caller never supplies markup, so `buildIcon()`'s
   `innerHTML` sink gains **no new attack surface**.
2. **JS — preset registry.**
   `TOAST_PRESETS = { 'cart-add': { type: 'success', icon: 'cart-add', iconAnim: 'bounce-in', label: 'Added to cart' }, … }`.
   Export it on `window.ToastMagicInternals` so the Livewire bridge reads it
   instead of keeping a third duplicate list.
3. **JS — plumb it through.** `show()` resolves the preset → stamps
   `tm-preset-{name}` on the icon container; `_buildToast` reads
   `spec.animation || config.animation`.
4. **PHP — allowlist + passthrough.** Add `const PRESETS`, add `preset` to
   `toastPayload()`'s copied keys, validate with the existing `allowlist()`
   helper. Generate `cartAdded()`/`wishlistAdded()`/… via `__call` or explicit
   methods.
5. **CSS — one `@keyframes` + one rule per preset**, scoped to `.tm-preset-*`
   inside the icon container.
6. **Livewire bridge + `data-toast-preset`** — same allowlist discipline.
7. **Rebuild `.min.css`.** `build/build.mjs --check` runs in CI (`tests.yml`)
   and **fails the build if the committed minified file is stale**.

### Security rule

**Do not** accept caller-supplied SVG markup from a PHP or Livewire payload. If
app-defined icons are wanted, expose `toastMagic.registerIcon(name, svg)` as a
**JS-only** escape hatch, documented like `html: true` — "you own the safety of
this string."

---

## 4. Per-item breakdown

Four techniques cover all 14. The per-item cost is which technique it needs.

### A. Single-SVG CSS keyframes — cheapest

One SVG + one `@keyframes`.

| # | Toast | Base type | Note |
|---|---|---|---|
| 1 | Add to cart | success | Bounce = `translate`/`scale` on the icon box. Nothing animates it today, so it is free. |
| 3 | Removed from wishlist | info | `scale(1)→scale(0.6)` + opacity. Trivial. |
| 7 | Item removed | warning/info | Trash lid needs its own `<path>` with `transform-origin` on the hinge. |
| 9 | Link shared | info | Rotate/translate the three nodes; stagger with `animation-delay`. |
| 14 | Connection restored | success | Three arcs as separate paths, staggered delays. Reads well at 25px. |

### B. Two-layer morph → checkmark — one structural change + stroke-based icons

| # | Toast | Base type |
|---|---|---|
| 4 | Order placed | success |
| 5 | Payment successful | success |
| 8 | Copied to clipboard | success |
| 10 | Profile updated | success |
| 11 | Settings saved | success |
| 12 | Download complete | success |
| 13 | Upload complete | success |

Two gotchas:

- `buildIcon()` does `wrapper.querySelector("svg")` — **returns one SVG only.**
  A morph needs both layers (source icon + checkmark). Change to
  `querySelectorAll` and append all, or emit a single SVG containing both
  groups.
- The checkmark "draw-on" effect is `stroke-dasharray`/`stroke-dashoffset`.
  **The four current icons are all solid `fill="currentColor"` paths** and
  cannot be drawn this way. The preset icon pack should be a **stroke-based
  set** — a deliberate visual divergence from the existing icons that should be
  decided up front, not discovered halfway through.

### C. Toast-level shake — one item, one real trap

| # | Toast | Base type |
|---|---|---|
| 6 | Payment failed | error |

Shake is a whole-toast motion, but **`.toast-item` cannot be shaken**:
`transform` is owned by the entrance/exit transition (`.show` sets
`transform: translate(0,0)`) and `translate` is owned by the FLIP reflow
(`js:258`). Both would fight it.

**Shake `.toast-magic-relative` instead** — an inner wrapper carrying only
`position: relative` (`css:61`) that nothing transforms. Side effect: the
progress bar (a `::before`/`::after` on `.toast-item`) stays still while the
content shakes, which reads better than shaking the bar too.

### D. Particles + extra DOM — most expensive

| # | Toast | Base type |
|---|---|---|
| 2 | Added to wishlist | success |

The heart pop is easy; the particles are not. `.toast-item { overflow: hidden }`
**will clip anything leaving the toast**, and the icon container is a fixed
25×25 flex box. Required: 4–6 extra `<span>` children in the icon container,
`overflow: visible` on the container, and a particle radius that stays inside
the toast's `--tm-space-container` padding (default `10px 12px` — so roughly
**10px of travel**, not more). Budget this one as its own task.

---

## 5. Two limitations that matter more than the icons

### 5.1 No callback on the action button — this blocks "Undo"

`customBtnLink` renders an `<a href>` (`js:608-614`). There is no way to attach
a JS handler. "Item removed" (#7) without an Undo button is the wrong toast —
Undo is the entire reason that toast exists. Same for "Removed from wishlist"
(#3).

Recommend `onAction` as a **JS-only** option (a function reference obviously
cannot come from a PHP session payload), rendering a `<button>` rather than an
`<a>`.

### 5.2 No toast handle — this weakens #12, #13 and #14

"Download complete → arrow morphs to checkmark" is only meaningful if the *same
toast* was showing "Downloading…" a moment earlier. Today there is no way to do
that:

- `ToastMagic::success()` returns `void` on the PHP side.
- In JS, `show()` returns the element — **except when the toast is queued before
  DOM-ready** (`js:429-432`), where it returns `undefined`.
- There is no `update()`, no `dismiss(id)`. `clear()` is all-or-nothing.

Recommend `show()` returning a stable handle (`{ id, update(), dismiss() }`)
that works in the queued case too. That unlocks a **loading/promise toast** —
spinner → morphs to ✓ or ✗ — which is the highest-value addition on this whole
list and turns #12/#13 from decorative into functional.

---

## 6. Additional toast types worth adding

Prioritized by what the architecture is currently missing rather than by icon
count:

1. **Loading / pending** (spinner, `timeOut: 0`) — the prerequisite for a real
   #12/#13. Highest value.
2. **Connection lost** — the counterpart to #14. Sticky (`timeOut: 0`),
   auto-replaced when #14 fires. Needs the handle API.
3. **Undo** — a preset that *requires* an action button. See §5.1.
4. **Session expiring** — sticky, with a countdown in the description.
5. **Out of stock / back in stock** — the two most common e-commerce toasts
   missing from the list.
6. **Coupon applied** — ticket icon + pop; pairs naturally with #1 and #4.
7. **Email sent / verification sent** — envelope → paper-plane fly-out.
8. **Password changed** — lock click-shut. Maps to `success` but is semantically
   distinct from #10 and #11.

Also worth folding into the same release:

- **`preventDuplicates` currently drops the repeat toast entirely**
  (`js:457-462`). For "Add to cart" clicked three times, a **count badge (`×3`)
  on the existing toast** is much better UX than silence.
- The duplicate key is `type|heading|description` — **add `preset` to it**, or
  two different presets sharing the same text will collide.

---

## 7. Bug found during the study

`assets/js/laravel-toaster-magic.js:534` reads `config.typeLabels[spec.type]`
for the toast's `aria-label`, but **`typeLabels` is never emitted** by
`runtimeConfig()` (`src/ToastMagic.php:356-375`) and is absent from the config
file and the README. It is a dead option — every toast falls through to
`"success notification"` etc.

Since presets each want their own accessible label, this is the natural moment
to either wire it up or remove it.
