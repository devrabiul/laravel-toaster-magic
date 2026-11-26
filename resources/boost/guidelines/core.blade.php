@verbatim
## Laravel Toaster Magic

`devrabiul/laravel-toaster-magic` renders toast notifications from PHP, JavaScript, Blade data attributes and Livewire. It has no jQuery, Bootstrap or Tailwind dependency. Configuration lives in `config/laravel-toaster-magic.php` (publish it with `php artisan vendor:publish --tag=toast-magic-config`).

### Setup

The main layout must output both tags, using raw echo (`{!! !!}`, never `{{ }}`):

<code-snippet name="Layout tags" lang="blade">
<head>
    {!! ToastMagic::styles() !!}
</head>
<body>
    ...
    {!! ToastMagic::scripts() !!}
</body>
</code-snippet>

Under a CSP without `'unsafe-inline'`, use `{!! ToastMagic::nonce($nonce)->scripts() !!}`.

### Raising toasts

- Types are `success`, `error`, `warning` and `info`. The signature is `(heading, description = null, options = [])`.
- Toasts are flashed to the session and appear on the next rendered page. Call them before `redirect()` / `back()`. They do nothing on JSON responses.
- Options: `showCloseBtn`, `customBtnText`, `customBtnLink`, `avatar`, `preset`, `timeOut` (ms, `0` = never auto-dismiss), `showDuration`, `html`.
- A validation `MessageBag` can be passed as the heading: `ToastMagic::error($validator->errors())`.

<code-snippet name="Toasts from PHP" lang="php">
use Devrabiul\ToastMagic\Facades\ToastMagic;

ToastMagic::success('Saved', 'Your changes are live.');
ToastMagic::error('Payment failed', null, ['timeOut' => 0, 'preset' => 'payment-failed']);
</code-snippet>

In JavaScript, use the shared `window.toastMagic` instance and never call `new ToastMagic()`: `toastMagic.success({ heading: 'Saved', description: '...' })`.

### Livewire

Requires `'livewire_enabled' => true` in config. In the event, `title` is the **heading** and `message` is the **description**:

<code-snippet name="Toast from a Livewire component" lang="php">
$this->dispatch('toastMagic', status: 'success', title: 'User created', message: 'Welcome aboard.');
</code-snippet>

### Rules

- Toast text is escaped automatically. Pass user input as-is and do not wrap it in `e()`.
- Only use `['html' => true]` for markup the developer fully controls. Never set `escape_html` to `false`.
- Invalid `theme`, `positionClass`, `animation` and `preset` values are ignored silently and fall back to defaults. Use only documented values.
- Themes: `default`, `material`, `ios`, `glassmorphism`, `neon`, `minimal`, `neumorphism`, `neumorphic`, `compact`. Positions: `toast-{top|bottom}-{start|end|center}`. Animations: `default`, `slide`, `fade`, `pop`, `bounce`.

### Animated icon presets

The `preset` option swaps the type icon for an animated one. A preset only renders when its pack is listed under the top-level `presets` config key (default `['general']`, or `'all'`). Never invent preset names. Look them up in the `laravel-toaster-magic` skill's preset catalogue, and pair each preset with its recommended type.
@endverbatim

{{-- BEGIN GENERATED: packs --}}
517 presets in 11 packs: `general` (76), `commerce` (121), `saas` (44), `social` (38), `devops` (61), `media` (36), `files` (37), `health` (28), `travel` (26), `education` (25), `crm` (25).
{{-- END GENERATED: packs --}}
