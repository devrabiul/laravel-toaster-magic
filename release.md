# 🍞 Laravel Toaster Magic — v2.4.0 Release Notes

**Release date:** 2026-08-13
**Type:** Minor release — fully backward compatible

v2.4.0 is a **"Soft UI"** release. It adds **Neumorphic**, a new theme built around physical depth: the toast reads as an object extruded from the same material as the page behind it, with raised controls that press *into* the surface when you click them. The package's scope, API and every existing theme are unchanged — **there are no breaking changes**, and upgrading requires no code changes at all.

---

## ✨ Highlights

- 🪶 **New `neumorphic` theme** — soft, tactile, low-contrast soft UI with real depth.
- 🌗 **A dedicated dark mode** — not an inversion: the shadow carries the depth and accents are muted.
- 🎛️ **Raised, pressable controls** — icon puck, close button and action button lift on hover and inset on `:active`.
- 📉 **Recessed progress groove** — the progress bar sits in a channel carved into the toast's bottom edge.
- 🎨 **Fully themeable** — driven by `--tm-neu-*` CSS variables you can override in your own stylesheet.
- ♿ **Accessible by default** — focus-visible rings, comfortable touch targets, `prefers-reduced-motion` support.
- 🔒 **Zero impact on existing themes** — verified pixel-for-pixel across every theme in light, dark and RTL.

---

## 🚀 What's New

### 🪶 The Neumorphic theme

```php
// config/laravel-toaster-magic.php
'options' => [
    'theme' => 'neumorphic',
],
```

![Neumorphic theme — light and dark mode](art/theme-neumorphic.png)

Depth comes from a **dual-direction shadow pair** — a light highlight from the top-left and a soft
dark shadow from the bottom-right — plus a hairline inner bevel, rather than borders, gradients or
blur. The surface stays monochromatic for every toast type; only the icon, the progress fill and the
focus ring pick up the semantic accent, so a toast never turns into a bright colored card.

| Element | Behavior |
|-----------------|-----------------------------------------------------------|
| Toast surface | Raised from the page; lifts slightly on hover — shadow only, no movement |
| Icon | Sits on a small raised puck, subtly tinted with the semantic accent |
| Close button | A raised physical control: lifts on hover, presses inset on `:active` |
| Action button | Same raised/pressed treatment, with an accent-tinted surface |
| Progress bar | An accent fill running in a groove recessed into the bottom edge |

**Light mode** uses a cool off-white surface (`#e6eaf2`) that blends into the page, with a white
highlight and a soft blue-gray shadow. **Dark mode** is a dedicated treatment rather than an
inversion — a soft charcoal surface (`#2c2f36`) on a deeper charcoal page, where the shadow does the
heavy lifting, the highlight is reduced to a faint light edge, and semantic accents are muted so
nothing glows.

### 🎨 Customizing the surface

The theme is driven entirely by CSS variables scoped to `.toast-container.theme-neumorphic`, so you
can match it to your app's own surface without forking any CSS:

```css
.toast-container.theme-neumorphic {
    --tm-neu-surface: #eef0f5;      /* the toast + control material   */
    --tm-neu-shadow-light: rgba(255, 255, 255, 0.9);
    --tm-neu-shadow-dark: rgba(163, 177, 198, 0.55);
    --tm-neu-radius: 1.5rem;        /* corner softness                */
    --tm-neu-distance: 7px;         /* how far it sits off the page   */
    --tm-neu-blur: 18px;            /* how diffused the shadow is     */
}
```

### ✅ Works with everything you already use

The theme is registered through the existing theme system and composes with the rest of the package:
color mode, gradient mode, all six positions, all five animations, auto-dismiss and per-toast
`timeOut` / `showDuration`, pause-on-hover, the close button, custom action buttons, avatar toasts,
RTL, and Livewire v3/v4.

> **Note:** `neumorphic` is a separate theme from the original `neumorphism`. Both ship side by side,
> and selecting one has no effect on the other.

---

## 🧩 Compatibility

| Requirement | Supported |
|-------------|-----------|
| PHP         | 8.0 – 8.5 |
| Laravel     | 8 – 13    |
| Livewire    | v3 & v4   |

No new requirements. The new theme is opt-in; if you don't select it, nothing about your toasts changes.

---

## ⬆️ Upgrade Guide

```bash
composer update devrabiul/laravel-toaster-magic
```

**No code changes required.** Every existing theme renders exactly as it did in v2.3.

Because v2.4 ships an updated stylesheet, make sure the new assets are served. They auto-refresh on
the next page load, or you can re-publish explicitly:

```bash
php artisan vendor:publish --tag=toast-magic-assets --force
```

Then, to try the new theme:

```php
// config/laravel-toaster-magic.php
'options' => [
    'theme' => 'neumorphic',
],
```

---

## 🙏 Thanks

Thanks to everyone using and reporting issues on Laravel Toaster Magic. If it helps you in production, consider [planting a tree](https://plant.treeware.earth/devrabiul/laravel-toaster-magic). 🌱

**Full changelog:** see [CHANGELOG.md](CHANGELOG.md).
