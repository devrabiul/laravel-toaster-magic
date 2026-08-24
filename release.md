# 🍞 Laravel Toaster Magic — v2.6.0 Release Notes

**Release date:** 2026-08-24
**Type:** Minor release — **one removed option and two changed defaults**, see the Upgrade Guide below

v2.6.0 is an **"Animated presets"** release. A toast can now carry a `preset` — an animated,
multi-coloured icon layered on top of the type it already has — chosen from **517 presets across 11
opt-in packs**. Packs ship as separate files, so a project downloads only the icons it actually uses
and the core runtime carries none of them.

It also caps how many toasts can stack on screen, slows the queue into a cascade rather than a
burst, fixes the two centre positions — which were never actually centred — and removes the global
shadow toggle added in 2.5.

> ℹ️ **Nothing changes for existing calls.** `preset` has no default and no global switch. A toast
> without one renders exactly as before, and the four type icons are untouched.

---

## ✨ Highlights

- 🎬 **517 animated icon presets** across 11 opt-in packs — carts, deploys, payments, appointments,
  flights and more.
- 🧩 **Opt-in by pack** — `'presets' => ['general']` ships by default; unlisted packs are never
  loaded.
- 🎨 **Multi-coloured icons** driven by CSS custom properties, with a light and a dark palette per
  preset and a dedicated one for `neon`.
- 🛑 **`maxVisible`** — caps the stack (default **15**) so a burst of flashed messages can no longer
  push toasts off-screen.
- 🌊 **`stagger` now 800 ms** (was 250 ms) — queued toasts cascade instead of overlapping.
- 🎯 **Centre positions actually centre** — `toast-top-center` and `toast-bottom-center` were
  anchored to the edge.
- 🧹 **`shadow_enable` removed** — see the Upgrade Guide.
- 🧪 **335 JavaScript tests** (up from 148) and 734 PHP tests.

---

## 🎬 Animated Icon Presets

A **preset** is a presentation layer on top of an existing toast type. It does not replace the type
and it is not a new type — the type still decides the accent colour, the progress bar, the theme
treatment and, because urgency derives from the type alone, how the toast is announced.

```php
ToastMagic::success('Added to cart', 'Nike Air Max ×1', ['preset' => 'cart-add']);
```

Available from the facade, JavaScript, Livewire options and a `data-toast-preset` attribute.

### Opt in by pack

Each pack is a separate script and stylesheet. The core runtime contains **no** preset icons, so a
project ships only what it lists:

```php
// config/laravel-toaster-magic.php
'presets' => ['general'],          // default
'presets' => ['general', 'commerce'],
'presets' => 'all',                // every pack
'presets' => [],                   // none
```

A preset from a pack that is not listed is ignored, and the toast renders with its type icon —
matching how theme, animation and position already degrade.

### The packs

| Pack | Covers | Presets |
|------|--------|---------|
| `general` | loading, connectivity, auth, clipboard, preferences | 76 |
| `commerce` | carts, orders, payments, shipping, catalogue, promotions, stock | 121 |
| `devops` | builds, deploys, source control, infrastructure, incidents | 61 |
| `saas` | subscriptions, workspaces, seats, usage, integrations | 44 |
| `social` | messages, posts, connections, moderation | 38 |
| `files` | documents, storage, backups | 37 |
| `media` | capture, encoding, publishing, playback | 36 |
| `health` | appointments, prescriptions, vitals, lab work | 28 |
| `travel` | flights, stays, transport | 26 |
| `education` | courses, assignments, grading | 25 |
| `crm` | leads, deals, accounts, calls | 25 |
| | **Total** | **517** |

See **[PRESETS.md](PRESETS.md)** for the full catalogue with every preset name.

### How they animate

Every preset animates its own icon and keeps moving. Parts of the icon move in sequence and the
motion runs twice before resting, rather than a one-shot entrance that freezes. Keyframes open and
close on the same frame so the two passes read as one continuous movement, and every icon idles at
full size and full opacity. No preset replaces the icon with a checkmark part-way through.

Tests assert that no two presets share an animation, that every animation has a rule behind it, that
the motion repeats, and that a preset never renders a second icon over the first.

### Colour

Each icon is painted from custom properties (`--tm-i1` / `--tm-i2` / `--tm-i3`), with a light and a
dark palette per preset and a dedicated one for `neon`. Every property falls back to `currentColor`,
so resetting them returns the whole set to monochrome tracking the toast type. Tests assert no
preset ships a literal colour or a missing palette.

Motion is neutralised under `prefers-reduced-motion: reduce` — the icons still render, they just do
not move.

### Registry

`ToastMagic::PRESETS` exposes the registered names, and the runtime exposes the same registry on
`window.ToastMagicInternals.TOAST_PRESETS`. A test asserts the two stay in step, so a preset added to
one and forgotten in the other fails CI rather than being silently dropped.

Icon geometry is [Lucide](https://lucide.dev) v1.33.0 (ISC; `check`, `download`, `upload` and
`trash-2` derive from Feather, MIT). Both licences permit redistribution, unlike the animated-icon
libraries that would otherwise be the obvious source. Animation is plain CSS — no Lottie player, so
the zero-dependency promise holds.

---

## 🚀 Also New

### 🛑 `maxVisible` — cap the stack

```php
'options' => [
    'maxVisible' => 15,  // 0 = no limit
],
```

The container is fixed positioned, so without a cap a burst of flashed messages pushed toasts past
the bottom of the viewport, where they could not be read or dismissed. The oldest is now dismissed
to make room.

### 🌊 `stagger` — 800 ms, up from 250 ms

The entrance animation runs for 500 ms, so the previous 250 ms gap overlapped consecutive toasts
into what read as a burst. At 800 ms they cascade, and a full stack lands within
`maxVisible * stagger`.

Existing published configs keep whatever value they already set — only the packaged default moved.

---

## 🐛 Fixed

- **`toast-top-center` and `toast-bottom-center` were not centred.** Both rules set
  `inset-inline-start: 0` and then re-declared `left: auto` a line later. `inset-inline-start` *is*
  the physical `left` in LTR, so the later declaration won and left `left: auto; right: 0` —
  anchoring the container to the right edge (the left edge under RTL) instead of centring it, with
  `margin-inline: auto` unable to help a box that was no longer over-constrained. Removing the
  redundant physical inset restores both. A test now asserts neither centre rule re-declares a
  physical inset.

---

## 🧹 Removed

- **The global `shadow_enable` option, added in 2.5.0.** Removed from the PHP config, the JS
  container class toggling and the stylesheet's shadow-disable rules, along with its dedicated test
  suite. See the Upgrade Guide.

---

## 🧩 Compatibility

| Requirement | Supported |
|-------------|-----------|
| PHP         | 8.0 – 8.5 |
| Laravel     | 8 – 13    |
| Livewire    | v3 & v4   |

---

## ⬆️ Upgrade Guide

```bash
composer update devrabiul/laravel-toaster-magic
php artisan vendor:publish --tag=toast-magic-assets --force
```

Republishing is required — **both the CSS and the JS changed.**

### 1. If your config sets `shadow_enable`

The key is now **inert** — it is silently ignored rather than raising an error, and shadows follow
the active theme. Delete it from your published config.

To suppress shadows now, override the variable in your own CSS:

```css
.toast-container {
    --toast-magic-box-shadow: none;
}
```

Or pick a theme whose depth you want — `minimal` and `compact` are the flattest.

### 2. Toasts now cap at 15 on screen

If your application deliberately shows more than 15 at once, raise or disable the cap:

```php
'options' => [
    'maxVisible' => 0,  // no limit, the pre-2.6 behaviour
],
```

### 3. Queued toasts appear more slowly

`stagger` moved from 250 ms to 800 ms. If you published your config **before 2.6**, your own value
is preserved and nothing changes. To restore the old pacing explicitly:

```php
'options' => [
    'stagger' => 250,
],
```

### 4. To use presets, opt a pack in

Presets are off unless listed. The default published config enables `general` only:

```php
'presets' => ['general', 'commerce'],
```

Nothing else is required — a toast without a `preset` is unaffected either way.

---

## 🙏 Thanks

Thanks to everyone using and reporting issues on Laravel Toaster Magic. If it helps you in
production, consider [planting a tree](https://plant.treeware.earth/devrabiul/laravel-toaster-magic). 🌱

**Full changelog:** see [CHANGELOG.md](CHANGELOG.md).
