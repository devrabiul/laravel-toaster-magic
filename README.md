# 🍞 Laravel Toaster Magic — v2.3

Laravel Toaster Magic is a lightweight, dependency-free toast notification package for Laravel with Livewire v3 & v4 support.

Laravel Toaster Magic provides elegant, fully customizable toast notifications for Laravel applications — with **zero dependency** on jQuery, Bootstrap, or Tailwind CSS. It works out of the box with Livewire, supports multiple modern themes, and is simple enough to drop into any project in minutes.

[![Tests](https://github.com/devrabiul/laravel-toaster-magic/actions/workflows/tests.yml/badge.svg)](https://github.com/devrabiul/laravel-toaster-magic/actions/workflows/tests.yml)
[![Latest Stable Version](https://poser.pugx.org/devrabiul/laravel-toaster-magic/v/stable)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![Total Downloads](https://poser.pugx.org/devrabiul/laravel-toaster-magic/downloads)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![Monthly Downloads](https://poser.pugx.org/devrabiul/laravel-toaster-magic/d/monthly)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![GitHub License](https://img.shields.io/github/license/devrabiul/laravel-toaster-magic)](LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/devrabiul/laravel-toaster-magic)
[![GitHub Stars](https://img.shields.io/github/stars/devrabiul/laravel-toaster-magic?style=social)](https://github.com/devrabiul/laravel-toaster-magic)

---

## 🚀 Live Demo

👉 [Try the Live Demo](https://laravel-toaster-magic.rixetbd.com)

![Live Demo Thumbnail](https://rixetbd.com/storage/app/public/package/devrabiul/laravel-toaster-magic.webp)

---

## ✨ Features

- 🔥 **Easy to Use** — Simple, intuitive API with support for both static and fluent syntax.
- 🌍 **RTL Support** — Full compatibility with right-to-left languages.
- 🌙 **Dark Mode** — Built-in dark mode support via a single HTML attribute.
- 🎨 **7+ Themes** — iOS, Neon, Glassmorphism, Material, Minimal, Neumorphism, and Default.
- 🎞️ **Entrance/Exit Animations** — Choose how toasts enter and leave: `slide`, `fade`, `pop`, or `bounce`.
- 🪄 **Smooth Stack Reflow** — Remaining toasts glide into place (FLIP) when one is added or dismissed. Respects `prefers-reduced-motion`.
- 🖼️ **Avatar Toasts** — Render an image in place of the type icon for notification-style toasts.
- ⚡ **Livewire Ready** — First-class support for Livewire v3 & v4 with event-based dispatching.
- 🔒 **Safe Button Links** — Custom button URLs are sanitized before being rendered into the DOM. See the [Security](#-security) section for how message content is handled.
- ✅ **Zero Dependencies** — No jQuery, Bootstrap, or Tailwind required.

---

## 📦 Installation

Install the package via Composer:

```bash
composer require devrabiul/laravel-toaster-magic
```

Publish the package assets:

```bash
php artisan vendor:publish --provider="Devrabiul\ToastMagic\ToastMagicServiceProvider"
```

> **Note:** Assets are also auto-published on the first page load and automatically refreshed whenever the package is updated.

---

## ⚙️ Basic Setup

Add the stylesheet inside your `<head>` tag and the scripts just before the closing `</body>` tag:

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>

    {!! ToastMagic::styles() !!}
</head>
<body>

    <!-- Your Content -->

    {!! ToastMagic::scripts() !!}
</body>
</html>
```

---

## 🧑‍💻 Usage

### 1. Controller Usage

Trigger toast notifications from your controllers using the `ToastMagic` facade:

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

public function store()
{
    // Simple message
    ToastMagic::success('Successfully Created');

    // Message with description
    ToastMagic::success('Success!', 'Your data has been saved!');

    // With custom options
    ToastMagic::success('Success!', 'Your data has been saved!', [
        'showCloseBtn' => true,
        'customBtnText' => 'View Record',
        'customBtnLink' => 'https://example.com',
        'timeOut' => 10000,    // Optional: override the auto-dismiss time (ms) for this toast only
        'showDuration' => 300, // Optional: override the show animation delay (ms) for this toast only
    ]);

    return back();
}
```

**Available toast types:** `success`, `info`, `warning`, `error`

You can also pass a validation `MessageBag` directly — its messages are flattened into a single toast, one per line:

```php
ToastMagic::error($validator->errors());
```

#### 🖼️ Avatar / notification-style toasts

Pass an `avatar` URL to render an image in place of the type icon — ideal for "new message" / "new follower" style notifications:

```php
ToastMagic::info('New message', 'Hey, are you free to chat?', [
    'avatar' => $user->avatar_url,
]);
```

---

### 2. JavaScript Usage

Use ToastMagic directly in JavaScript for AJAX responses or client-side events:

```js
const toastMagic = new ToastMagic();

toastMagic.success('Success!', 'Your data has been saved!');
toastMagic.error('Error!', 'Something went wrong.');
toastMagic.warning('Warning!', 'Check your input.', true);
toastMagic.info('Info!', 'Click for details.', false, 'Learn More', 'https://example.com');

// Programmatically dismiss all visible toasts
toastMagic.clear();      // or toastMagic.dismissAll();
```

**Signature:** `toastMagic.{type}(heading, description, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar)`

> `timeOut` and `showDuration` are optional per-toast overrides (in milliseconds). `avatar` is an optional image URL shown in place of the type icon. When omitted, the global config values are used.

---

### 3. Livewire Support (v3 & v4)

Enable Livewire support in your config file:

```php
// config/laravel-toaster-magic.php

return [
    'options' => [
        // your toast options...
    ],
    'livewire_enabled' => true,
    'livewire_version' => 'v3', // 'v3' or 'v4'
];
```

Dispatch toast notifications from any Livewire component:

```php
// With full options
$this->dispatch('toastMagic',
    status: 'success',
    title: 'User Created',
    message: 'The user has been successfully created.',
    options: [
        'showCloseBtn' => true,
        'customBtnText' => 'View Profile',
        'customBtnLink' => 'https://example.com',
    ],
);

// Simple dispatch
$this->dispatch('toastMagic',
    status: 'info',
    title: 'Heads Up',
    message: 'Your session will expire soon.'
);
```

**Supported status values:** `success`, `info`, `warning`, `error`

> **Backward Compatibility:** Both `showCloseBtn` and `closeButton` option keys are supported in Livewire events. If both are provided, `showCloseBtn` takes priority.

---

### 4. Alternative & Fluent Syntax

ToastMagic supports both a quick static method and a fluent dispatch style.

**Static (Quick):**

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

ToastMagic::success('Operation Successful');
ToastMagic::error('Something went wrong');
```

**Fluent (Advanced):**

```php
ToastMagic::dispatch()->success(
    'User Created',
    'The user has been successfully created.',
    [
        'showCloseBtn'  => true,
        'customBtnText' => 'View Profile',
        'customBtnLink' => 'https://example.com',
    ]
);
```

---

## 📍 Position Options

Control where toasts appear on screen using the `positionClass` config option:

| Value | Position |
|----------------------|--------------------------|
| `toast-top-start` | Top left |
| `toast-top-end` | Top right *(default)* |
| `toast-top-center` | Top center |
| `toast-bottom-start` | Bottom left |
| `toast-bottom-end` | Bottom right |
| `toast-bottom-center` | Bottom center |

---

## 🎨 Themes

ToastMagic includes 7 built-in themes. Set your preferred theme in `config/laravel-toaster-magic.php`:

```php
return [
    'options' => [
        "theme" => "default", // See options below
    ],
];
```

| Theme | Description |
|-----------------|-----------------------------------------------------------|
| `default` | Clean, classic look |
| `material` | Material Design — flat and bold |
| `ios` | Apple-style notifications with backdrop blur |
| `glassmorphism` | Heavy blur, semi-transparent, modern aesthetic |
| `neon` | Dark background with glowing borders — ideal for dark UIs |
| `minimal` | Clean design with colored left-side accent |
| `neumorphism` | Soft UI with extruded shadow styling |

For a full theme preview, see [THEMES.md](THEMES.md).

---

## 🌈 Color Mode

Enable color mode to apply toast-type colors automatically to backgrounds and accents:

```php
return [
    'options' => [
        'color_mode' => true,
    ],
];
```

---

## 🌟 Gradient Mode

Enable gradient mode to apply subtle gradients to toast backgrounds:

```php
return [
    'options' => [
        "gradient_enable" => true,
    ],
];
```

> **Note:** Gradient mode works best with the `default`, `material`, and `neon` themes.

---

## 🎞️ Animations

Choose how toasts enter and leave the screen using the `animation` config option:

```php
return [
    'options' => [
        'animation' => 'slide', // default, slide, fade, pop, bounce
    ],
];
```

| Value | Effect |
|-----------|------------------------------------------------|
| `default` | Slide in from the toast's position *(default)* |
| `slide`   | Same as default — explicit slide |
| `fade`    | Fade in/out with no movement |
| `pop`     | Scale up from slightly smaller, with a soft overshoot |
| `bounce`  | Slide in with a springy overshoot |

> **Smooth stack reflow:** When a toast is added or dismissed, the remaining toasts glide smoothly into their new positions (using the FLIP technique) instead of jumping. This honors the user's `prefers-reduced-motion` setting and requires no configuration.

---

## 🌙 Dark Mode

Add `theme="dark"` to your `<body>` tag to enable dark mode globally:

```html
<body theme="dark">
```

---

## ⚙️ Full Configuration Reference

```php
// config/laravel-toaster-magic.php

return [
    'options' => [
        'closeButton'       => true,
        'positionClass'     => 'toast-top-end',
        'preventDuplicates' => false,
        'showDuration'      => 300,
        'timeOut'           => 5000,
        'theme'             => 'default', // default, material, ios, glassmorphism, neon, minimal, neumorphism
        'gradient_enable'   => false,
        'color_mode'        => false,
        'pauseOnHover'      => true, // Pause the auto-dismiss timer while hovering a toast
        'animation'         => 'default', // default, slide, fade, pop, bounce
    ],
    'livewire_enabled'  => false,
    'livewire_version'  => 'v3',
];
```

---

## 🔒 Security

**Custom button links** (`customBtnLink`) are validated before being rendered into `href` attributes. Only URLs starting with `http://`, `https://`, `/`, or `#` are allowed; all other values are safely replaced with `#`.

**Message content is rendered as HTML.** The toast heading and description are inserted into the DOM as HTML — this is what enables multi-line messages (newlines become `<br>`). Because of this, **you should never pass unescaped, user-supplied input directly into a toast**, as it can introduce a cross-site scripting (XSS) vulnerability. If a value may contain user input, escape it first — for example with Laravel's `e()` helper or `strip_tags()`:

```php
ToastMagic::success('Welcome, ' . e($user->name) . '!');
```

> **Roadmap:** A future major release (v3.0.0) will escape message content by default, with an opt-in flag for cases where HTML is intentional.

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of notable changes in each release.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, make your changes, and open a pull request.
For bug reports or feature requests, [open an issue on GitHub](https://github.com/devrabiul/laravel-toaster-magic/issues).

---

## 📄 License

This package is open-source software licensed under the [MIT License](LICENSE).

---

## 🌱 Treeware

This package is [Treeware](https://treeware.earth). If you use it in production, we ask that you [**buy the world a tree**](https://plant.treeware.earth/devrabiul/laravel-toaster-magic) to thank us for our work. By contributing to the Treeware forest you'll be creating employment for local families and restoring wildlife habitats.

---

## 📬 Contact & Links

- 🔗 **GitHub:** [devrabiul/laravel-toaster-magic](https://github.com/devrabiul/laravel-toaster-magic)
- 🔗 **Live Demo:** [laravel-toaster-magic.rixetbd.com](https://laravel-toaster-magic.rixetbd.com)
- 🔗 **Packagist:** [packagist.org/packages/devrabiul/laravel-toaster-magic](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
- 📧 **Email:** [devrabiul@gmail.com](mailto:devrabiul@gmail.com)
