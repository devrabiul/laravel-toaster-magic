---
name: laravel-toaster-magic
description: Add, configure and debug toast notifications in Laravel apps that use the devrabiul/laravel-toaster-magic package (ToastMagic facade, window.toastMagic, Livewire toastMagic event). Use when the user wants flash/toast/notification messages in a Laravel, Blade or Livewire project, mentions ToastMagic or laravel-toaster-magic, wants to pick a toast theme, position, animation or animated icon preset, or reports that toasts do not appear, look unstyled, or show the wrong icon.
---

# Laravel Toaster Magic

Toast notifications for Laravel 8–13 (PHP 8.0+), with optional Livewire v3/v4 support.
No jQuery, Bootstrap or Tailwind dependency. Composer package: `devrabiul/laravel-toaster-magic`.

Before you change anything, check whether the project already uses the package:
`composer.json` lists it, `config/laravel-toaster-magic.php` exists, or a layout
calls `ToastMagic::styles()`. If it does, follow the project's existing config
and conventions instead of re-running the install steps.

## Install and set up

```bash
composer require devrabiul/laravel-toaster-magic
php artisan vendor:publish --tag=toast-magic-config   # optional; needed to change options
```

Assets are copied to `public/packages/devrabiul/laravel-toaster-magic` on the first
request automatically. Only when installed from a branch (`dev-main`) or a path
repository, republish after every update:
`php artisan vendor:publish --tag=toast-magic-assets --force`.

Add both tags to the **main layout** used by every page that should show toasts:

```blade
<head>
    ...
    {!! ToastMagic::styles() !!}
</head>
<body>
    ...
    {!! ToastMagic::scripts() !!}
</body>
```

- Use `{!! !!}`, not `{{ }}`. Escaped output prints the tags as text.
- `scripts()` goes at the end of `<body>`. It emits the config, then the runtime, then
  the queued toasts, in that order.
- Under a Content Security Policy without `'unsafe-inline'`, pass the nonce:
  `{!! ToastMagic::nonce($nonce)->scripts() !!}` (or set `csp_nonce` in config).
- For Vite setups that need module scripts: `{!! ToastMagic::useVite()->scripts() !!}`.

## Raising toasts

### From PHP (controllers, actions, middleware)

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

ToastMagic::success('Saved');                                   // heading only
ToastMagic::error('Payment failed', 'Your card was declined.'); // heading + description
ToastMagic::warning('Heads up', null, ['timeOut' => 0]);        // stays until dismissed
ToastMagic::info('New message', 'Hey, free to chat?', [
    'avatar'        => $user->avatar_url,
    'showCloseBtn'  => true,
    'customBtnText' => 'Reply',
    'customBtnLink' => route('messages.show', $message),
    'timeOut'       => 10000,
]);

ToastMagic::error($validator->errors());        // a MessageBag becomes one toast, one line per error
ToastMagic::dispatch()->success('Created');     // fluent form, same behaviour
```

Toasts are flashed to the session, so they appear on the **next rendered page**.
Use them before `return redirect(...)` or `return back()`. On a JSON/API response,
nothing renders them. Use the JavaScript API on the client instead.

Types are `success`, `error`, `warning`, `info`. Any other type falls back to `info`.

Per-toast options: `showCloseBtn`, `customBtnText`, `customBtnLink`, `avatar`,
`preset`, `timeOut` (ms, `0` = never auto-dismiss), `showDuration` (ms), `html`.

### From JavaScript

The runtime creates one shared instance, `window.toastMagic`. **Never call
`new ToastMagic()`**. A second instance competes for the same container.

```js
toastMagic.success({ heading: 'Saved', description: 'Your changes are live.' });
toastMagic.error({ heading: 'Upload failed', timeOut: 0, showCloseBtn: true });
toastMagic.success({ heading: 'Added to cart', preset: 'cart-add' });
toastMagic.clear();   // dismiss everything on screen
```

Options use the same names as PHP. The positional form
`toastMagic.success(heading, description, showCloseBtn, btnText, btnLink, timeOut, showDuration, avatar)`
still works for backward compatibility. Prefer the options object in new code.

### From HTML, with no JavaScript

```html
<button data-toast-type="success" data-toast-heading="Copied"
        data-toast-description="Link copied to clipboard" data-toast-preset="clipboard-copy">Copy</button>
```

Other attributes: `data-toast-close-btn` (presence only), `data-toast-btn-text`,
`data-toast-btn-link`, `data-toast-avatar`.

### From Livewire (v3 and v4)

Set `'livewire_enabled' => true` in `config/laravel-toaster-magic.php`, then:

```php
$this->dispatch('toastMagic',
    status: 'success',            // the type
    title: 'User created',        // the HEADING (bold first line)
    message: 'Welcome aboard.',   // the DESCRIPTION (second line)
    options: ['showCloseBtn' => true, 'preset' => 'account-created'],
);
```

`title` is the heading and `message` is the description. Do not swap them. If
nothing appears, check `livewire_enabled` first.

## Security rules

- Toast text is **escaped by default**. Pass user input directly:
  `ToastMagic::success('Welcome, ' . $user->name)`. Do not wrap it in `e()`, or users
  see `&amp;` and similar entities on screen.
- Newlines (`"\n"`) render as line breaks after escaping. You do not need `<br>`.
- Markup is opt-in per toast with `['html' => true]` (JS: `html: true`). Only use it
  when the HTML is fully under the developer's control, and escape any user value
  inside it yourself. **Never suggest `escape_html => false`**. It makes every toast
  render raw HTML and opens an XSS hole.
- `customBtnLink` allows `http(s):`, `mailto:`, `tel:`, relative and `#fragment` URLs.
  `avatar` allows `http(s):` and relative URLs. Anything else (for example
  `javascript:` or `data:`) is rejected. A rejected link becomes `#`, and a rejected
  avatar falls back to the icon.

## Configuration

Everything lives in `config/laravel-toaster-magic.php`. Toast behaviour goes under
`options`. `presets`, `livewire_enabled`, `csp_nonce` and `asset_path_prefix` are
top-level keys.

| Key (`options.*`) | Values | Default |
|---|---|---|
| `theme` | `default`, `material`, `ios`, `glassmorphism`, `neon`, `minimal`, `neumorphism`, `neumorphic`, `compact` | `default` |
| `positionClass` | `toast-top-start`, `toast-top-end`, `toast-top-center`, `toast-bottom-start`, `toast-bottom-end`, `toast-bottom-center` | `toast-top-end` |
| `animation` | `default`, `slide`, `fade`, `pop`, `bounce` | `default` |
| `timeOut` | ms; `0` = stay until dismissed | `5000` |
| `showDuration` | ms | `300` |
| `stagger` | ms gap between queued toasts | `800` |
| `maxVisible` | max on screen; `0` = unlimited | `15` |
| `closeButton`, `pauseOnHover`, `preventDuplicates` | bool | `true`, `true`, `false` |
| `color_mode` | tint the whole toast by type | `false` |
| `gradient_enable` | subtle gradient (best with `default`, `material`, `neon`) | `false` |
| `spacing` | `enable`, `container`, `icon_gap`, `content_gap`, `close_gap` (CSS lengths) | enabled |
| `typography` | `enable`, `title_size`, `description_size`, optional `title_weight`, `description_weight`, `line_height` | enabled |
| `closeButtonLabel`, `containerLabel` | accessible names | `Close notification`, `Notifications` |

An invalid theme, position or animation **falls back silently** to its default
instead of throwing an error. If the config seems to be ignored, check the value
for a typo first.

**Dark mode:** add `theme="dark"` to `<body>`. If the app uses Tailwind's `.dark`
class or `prefers-color-scheme`, mirror that state onto the `theme` attribute of `<body>`.

**Published config older than the package:** missing options are merged from the
package's defaults, so an old published config file still works.

## Animated icon presets

A preset swaps the type icon for an animated one. The type still controls the
colour, the progress bar and screen-reader urgency.

```php
ToastMagic::success('Added to cart', 'Nike Air Max ×1', ['preset' => 'cart-add']);
```

1. **The pack must be enabled.** In config, set `'presets' => ['general', 'commerce']`.
   The value can also be `'all'` or `[]`. The default is `['general']`. A preset from
   a pack that is not enabled is **dropped silently**, and the toast shows the plain
   type icon.
2. **Use an exact name.** Unknown names are also ignored silently. Do not invent
   preset names. Look them up in [references/presets.md](references/presets.md),
   which lists every preset by pack with its icon and recommended type. Search
   it with a keyword such as `grep -i deploy references/presets.md` instead of
   reading the whole file.
3. **Match the type** to the preset's recommended type. For example, use
   `payment-failed` with `error` and `stock-low` with `warning`.
4. **`avatar` wins over `preset`.** If both are set, the avatar renders and the
   preset is skipped.

<!-- BEGIN GENERATED: packs -->
517 presets in 11 packs: `general` (76), `commerce` (121), `saas` (44), `social` (38), `devops` (61), `media` (36), `files` (37), `health` (28), `travel` (26), `education` (25), `crm` (25).
<!-- END GENERATED: packs -->

Each enabled pack adds one script and one stylesheet, so enable only the packs the
app uses.

In code, `ToastMagic::presetManifest()` returns the pack → names map,
`ToastMagic::allPresets()` returns every name, and `app('ToastMagic')->enabledPresets()`
returns the names this app can actually render. Use these lists in tests when preset
names are built dynamically.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| No toast at all after a redirect | `ToastMagic::scripts()` is missing from the layout that renders, or the response was JSON |
| Tags are printed as text | `{{ }}` was used instead of `{!! !!}` |
| Toast appears but is unstyled | `ToastMagic::styles()` is missing, or assets were not published (`--tag=toast-magic-assets --force`) |
| Asset 404s, with `public/` missing from or doubled in the URL | Set `asset_path_prefix` (`'public'` when the document root is the project root, `''` to force no prefix) |
| Livewire dispatch does nothing | `livewire_enabled` is `false`, or the event name is not exactly `toastMagic` |
| Heading and description are swapped (Livewire) | `title` is the heading and `message` is the description |
| Preset icon not shown | The pack is not in `presets`, the name has a typo, or `avatar` is also set |
| Theme or position change ignored | The value is not in the allowed list, or the config is cached (`php artisan config:clear`) |
| Blocked by CSP | Pass a nonce with `ToastMagic::nonce($nonce)->scripts()` |
| Two toast stacks or duplicated toasts | Code calls `new ToastMagic()`. Use `window.toastMagic` instead |
