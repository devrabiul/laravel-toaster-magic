# 🍞 Laravel Toaster Magic — v2.3.0 Release Notes

**Release date:** 2026-06-18
**Type:** Minor release — fully backward compatible

v2.3.0 is a **"Motion & Avatars"** release. It brings toasts to life with smooth, physics-aware stacking and configurable entrance/exit animations, and adds avatar/notification-style toasts for "new message" and "new follower" experiences. The package's scope is unchanged, and **there are no breaking changes** — the new `default` animation preserves the exact look and feel of v2.2, so existing apps upgrade without touching any code.

---

## ✨ Highlights

- 🖼️ **Avatar / notification-style toasts** — render a user image in place of the type icon.
- 🎞️ **5 entrance/exit animations** — `default`, `slide`, `fade`, `pop`, `bounce`.
- 🪄 **Smooth stack reflow (FLIP)** — remaining toasts glide into place instead of jumping when one is added or dismissed.
- 🧷 **Stable, position-aware stacking** — newest toast appears at the anchored corner; the rest stay put and slide cleanly.
- 🐛 **Fixed stack "teleport"** — no more jumps when toasts enter and exit at the same time.
- ♿ **Respects `prefers-reduced-motion`** — animations gracefully degrade for users who ask for less motion.

---

## 🚀 What's New

### Avatar / notification-style toasts

Pass an `avatar` image URL in the options array to show an image instead of the type icon — perfect for chat, social, and activity notifications. The URL is sanitized before it's rendered.

```php
ToastMagic::info('New message', 'Hey, are you free to chat?', [
    'avatar' => $user->avatar_url,
]);
```

Also available from JavaScript (8th argument) and through Livewire event options:

```js
// toastMagic.{type}(heading, description, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar)
toastMagic.info('New follower', 'Sarah started following you.', false, '', '', null, null, '/img/sarah.jpg');
```

### Entrance & exit animations

A new `animation` config option controls how toasts move on and off screen:

```php
// config/laravel-toaster-magic.php
'options' => [
    'animation' => 'slide', // default, slide, fade, pop, bounce
],
```

| Value     | Effect                                                  |
|-----------|---------------------------------------------------------|
| `default` | Slide in from the toast's position *(unchanged from v2.2)* |
| `slide`   | Same as default — explicit slide                        |
| `fade`    | Fade in/out with no movement                            |
| `pop`     | Scale up from slightly smaller, with a soft overshoot   |
| `bounce`  | Slide in with a springy overshoot                       |

### Smooth, stable stack reflow

When a toast is added or dismissed, the remaining toasts now **glide** smoothly into their new positions using the FLIP technique, rather than snapping. Stacking is **position-aware**: the newest toast always appears closest to the configured corner (on top for `toast-top-*`, at the bottom for `toast-bottom-*`), and the existing toasts animate to their new spots instead of being shoved.

This is purely visual polish — no API changes, and it honors `prefers-reduced-motion`.

---

## 🐛 Fixes

- **Stack teleport during overlapping animations.** When new toasts slid in while older ones were still dismissing (e.g. rapid triggers or page reloads), the stack could jump by a full toast height. A stale animation-cleanup race and a double-counted offset in the reflow logic have been fixed — the stack now glides smoothly even when entrances and exits overlap.
- **Inconsistent Livewire stacking.** The Livewire runtime used hard-coded position checks that handled some positions (e.g. `toast-bottom-center`) differently from the standard build. Both runtimes now share one consistent, position-aware rule.

---

## 🧩 Compatibility

| Requirement | Supported |
|-------------|-----------|
| PHP         | 8.0 – 8.5 |
| Laravel     | 8 – 13    |
| Livewire    | v3 & v4   |

No new requirements. The avatar and animation features are opt-in and degrade cleanly when unused.

---

## ⬆️ Upgrade Guide

```bash
composer update devrabiul/laravel-toaster-magic
```

**No code changes required.** The new `default` animation matches v2.2's behavior exactly.

Because v2.3 ships updated CSS and JavaScript, make sure the new assets are served. They auto-refresh on the next page load, or you can re-publish explicitly:

```bash
php artisan vendor:publish --tag=toast-magic-assets --force
```

To try the new features, add them to your config and/or calls:

```php
// config/laravel-toaster-magic.php
'options' => [
    'animation' => 'pop',
],
```

```php
ToastMagic::success('Profile updated', 'Your account information has been saved.', [
    'avatar' => auth()->user()->avatar_url,
]);
```

---

## 🙏 Thanks

Thanks to everyone using and reporting issues on Laravel Toaster Magic. If it helps you in production, consider [planting a tree](https://plant.treeware.earth/devrabiul/laravel-toaster-magic). 🌱

**Full changelog:** see [CHANGELOG.md](CHANGELOG.md).
