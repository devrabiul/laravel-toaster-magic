# 🍞 Laravel Toaster Magic — v2.2.0 Release Notes

**Release date:** 2026-06-17
**Type:** Minor release — fully backward compatible

v2.2.0 is a **"Trust & Polish"** release. The package's scope is unchanged — it still does one thing, beautiful toast notifications for Laravel — but it is now more reliable, better tested, more compatible, and more pleasant to use. **No breaking changes:** existing apps can upgrade without touching their code.

---

## ✨ Highlights

- ✅ **Automated tests + CI** across PHP 8.1–8.5 and Laravel 10–13 — every release is now verified, with a build-status badge on the README.
- ⏱️ **Per-toast duration** — override `timeOut` / `showDuration` for a single toast.
- 🖱️ **Pause-on-hover** — the auto-dismiss timer pauses while a user is reading a toast.
- 🧹 **Programmatic dismiss** — `toastMagic.clear()` / `toastMagic.dismissAll()` from JavaScript.
- 🔁 **`preventDuplicates` now actually works.**
- 🧾 **Validation `MessageBag` support** — pass `$validator->errors()` straight into a toast.
- 🪄 **The documented fluent API now works** — `ToastMagic::dispatch()->success(...)`.

---

## 🚀 What's New

### Per-toast duration overrides

`timeOut` and `showDuration` can now be set per toast (in milliseconds), falling back to your global config when omitted:

```php
ToastMagic::success('Saved!', 'Your changes are live.', [
    'timeOut' => 10000,   // keep this one on screen longer
    'showDuration' => 300,
]);
```

Also supported through Livewire event options.

### Pause-on-hover

Toasts no longer disappear while a user is hovering over them. This is **enabled by default**. To restore the old always-auto-dismiss behavior, set:

```php
// config/laravel-toaster-magic.php
'options' => [
    'pauseOnHover' => false,
],
```

### Programmatic dismiss API

```js
toastMagic.clear();       // dismiss all visible toasts
toastMagic.dismissAll();  // alias of clear()
```

### Validation errors in one line

```php
ToastMagic::error($validator->errors());
```

The `MessageBag` is flattened into a single toast, one message per line.

### Fluent dispatch syntax

```php
ToastMagic::dispatch()->success('User Created', 'The user has been created.');
```

---

## 🐛 Fixes

- **`preventDuplicates`** is now honored by the JavaScript runtime — identical, currently-visible toasts (same type, heading, and description) are skipped when the option is enabled. Previously the option existed but did nothing.
- **`clear()`** now also clears already-queued messages from the session, not just the in-memory list.
- **`MessageBag`** passed to a toast type no longer throws a `TypeError` — the message-flattening path is now reachable.
- **The README `dispatch()` example** previously referenced a method that didn't exist; it now works as documented.

---

## 🔒 Security note

The README's blanket **"XSS Safe"** wording has been corrected to be precise:

- Custom button URLs **are** sanitized.
- Toast **heading/description content is rendered as HTML** (this is what enables multi-line messages). **Do not pass unescaped, user-supplied input** into a toast — escape it first, e.g. with Laravel's `e()` helper.

```php
ToastMagic::success('Welcome, ' . e($user->name) . '!');
```

> **Coming in v3.0.0:** message content will be escaped by default, with an opt-in flag for intentional HTML.

---

## 🧩 Compatibility

| Requirement | Supported |
|-------------|-----------|
| PHP         | 8.0 – 8.5 |
| Laravel     | 8 – 13    |
| Livewire    | v3 & v4   |

`composer.json` now declares these constraints explicitly, so Composer can warn you about an incompatible stack.

> **Note:** CI verifies PHP 8.1–8.5 with Laravel 10–13. PHP 8.0 and Laravel 8/9 remain supported per the declared constraints but are not exercised in the automated matrix (no current Laravel release runs on PHP 8.0).

---

## ⬆️ Upgrade Guide

```bash
composer update devrabiul/laravel-toaster-magic
```

That's it — **no code changes required.** Assets are auto-refreshed on the next page load (or run `php artisan vendor:publish --provider="Devrabiul\ToastMagic\ToastMagicServiceProvider"` to re-publish the config).

The only behavior change is **pause-on-hover**, which is on by default. If you specifically relied on toasts dismissing while hovered, set `'pauseOnHover' => false` in your config.

---

## 🙏 Thanks

Thanks to everyone using and reporting issues on Laravel Toaster Magic. If it helps you in production, consider [planting a tree](https://plant.treeware.earth/devrabiul/laravel-toaster-magic). 🌱

**Full changelog:** see [CHANGELOG.md](CHANGELOG.md).
