# 🍞 ToastMagic - Laravel Toaster (With Livewire v3 Support)

Laravel Toaster Magic is a lightweight and flexible toast notification package for Laravel applications — built with zero dependencies on jQuery, Bootstrap, or Tailwind.
It’s fully compatible with Livewire, supports custom events, and now features a Material-inspired design for a modern UX out of the box.

[![Latest Stable Version](https://poser.pugx.org/devrabiul/laravel-toaster-magic/v/stable)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![Total Downloads](https://poser.pugx.org/devrabiul/laravel-toaster-magic/downloads)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![Monthly Downloads](https://poser.pugx.org/devrabiul/laravel-toaster-magic/d/monthly)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
![GitHub license](https://img.shields.io/github/license/devrabiul/laravel-toaster-magic)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/devrabiul/laravel-toaster-magic)
![GitHub Repo stars](https://img.shields.io/github/stars/devrabiul/laravel-toaster-magic?style=social)

---

## 📚 Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [1. Basic Setup](#1-basic-setup)
  - [2. Usage in Controller](#2-usage-in-controller)
  - [3. Usage in JavaScript (Optional)](#3-usage-in-javascript-optional)
  - [4. Livewire v3 Support](#4-livewire-v3-support)
- [Alternative Syntax & Fluent API](#alternative-syntax--fluent-api)
- [Toast Position Options](#toast-position-options)
- [Get Started Today](#-get-started-today)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 Live Demo

👉 [Check out the live demo](https://laravel-toaster-magic.rixetbd.com)

![Live Demo Thumbnail](https://laravel-toaster-magic.rixetbd.com/public/assets/img/thumbnail.png)

---

## ✨ Features

- 🔥 **Easy-to-Use** – Simple and intuitive toast notifications for Laravel.
- 🌍 **RTL Support** – Full compatibility with right-to-left (RTL) languages.
- 🌙 **Dark Mode** – Seamless dark mode integration.
- 🎨 **Customizable** – Tailor toasts with various styles, buttons, and positions.
- ⚡ **Livewire v3 Ready** – Fully supports Livewire v3 with event-based dispatching.

---

## 📦 Installation

Install the package via Composer:

```bash
composer require devrabiul/laravel-toaster-magic
````

Then publish the package assets:

```bash
php artisan vendor:publish --provider="Devrabiul\ToastMagic\ToastMagicServiceProvider"
```

---

## ⚙️ Usage

### 1. Basic Setup

Include the necessary assets in your layout Blade template:

**In the `<head>` section:**

```php
{!! ToastMagic::styles() !!}
```

**Before the closing `</body>` tag:**

```php
{!! ToastMagic::scripts() !!}
```

**Example:**

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page</title>

    {!! ToastMagic::styles() !!}
</head>
<body>

    <!-- Your Content -->

    {!! ToastMagic::scripts() !!}
</body>
</html>
```

---

### 2. Usage in Controller

Trigger toast notifications from your controllers using the `ToastMagic` facade:

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

public function store()
{
    // Your logic
    ToastMagic::success('Successfully Created');
    
    // Another Way - message and description
    ToastMagic::success("Success!", "Your data has been saved!");
    
    // Another Way - message and description
    ToastMagic::success("Success!", "Your data has been saved!", [
        'showCloseBtn' => true,
        'customBtnText' => 'Link Text',
        'customBtnLink' => 'https:/demo.com',
    ]);
    return back();
}
```

---

### 3. Usage in JavaScript (Optional)

Use ToastMagic directly in JavaScript (for AJAX responses, etc.):

```js
const toastMagic = new ToastMagic();

// Basic notifications
toastMagic.success("Success!", "Your data has been saved!");
toastMagic.error("Error!", "Something went wrong.");
toastMagic.warning("Warning!", "Check your input.", true);
toastMagic.info("Info!", "Click for details.", false, "Learn More", "https://example.com");
```

---

### 4. ✅ Livewire v3 Support

Enable Livewire support by updating your config file:

```php
// config/laravel-toaster-magic.php

return [
    'options' => [
        // your toast options...
    ],
    'livewire_enabled' => true,
    'livewire_version' => 'v3',
];
```

* Set `'livewire_enabled' => true` to activate Livewire integration.
* Set `'livewire_version' => 'v3'` to specify the Livewire version.

---

**Dispatch toast notifications from Livewire components:**

```php
$this->dispatch('toastMagic',
    status: 'success',
    title: 'User Created',
    message: 'The user has been successfully created.',
    options: [
        'showCloseBtn' => true,
        'customBtnText' => 'Link Text',
        'customBtnLink' => 'https:/demo.com',
    ],
);

$this->dispatch('toastMagic',
    status: 'info',
    title: 'User Created 2',
    message: 'The user has been successfully created.'
);
```

**Supported status types:** `success`, `info`, `warning`, `error`

---

### 5. ✅ Themes

Change Theme by updating your config file:

```php
// config/laravel-toaster-magic.php

return [
    'options' => [
        // your toast options..
        "theme" => "material", // "default, material".
    ],
    // your toast options..
];
```

---

### 6. 🎨 Enabling Color Mode

ToastMagic supports a **color mode** that dynamically applies toast colors based on the toast type (`success`, `error`, `warning`, `info`). This makes your notifications visually consistent and meaningful without manually specifying colors or themes.

Enable color mode in your configuration file `config/laravel-toaster-magic.php`:

```php
return [
    'options' => [
        // other options...
        'color_mode' => true, // Automatically apply colors based on toast type
    ],
    'livewire_enabled' => false,
    'livewire_version' => 'v3',
];
```

### 7. 🎨 Enabling Gradient Mode

Laravel Toaster Magic now supports a **gradient mode**, which dynamically applies toast colors based on the toast type (`success`, `error`, `warning`, `info`). This ensures that your notifications are visually consistent and meaningful **without manually specifying colors or themes**.

To enable gradient mode, update your configuration file `config/laravel-toaster-magic.php`:

```php
return [
    'options' => [
        // other options...
        "gradient_enable" => true, // Only available for default and material themes
    ],
    'livewire_enabled' => false,
    'livewire_version' => 'v3',
];
```

> **Note:** Gradient mode works only with the **default** and **material** themes.

---

## 🧩 Alternative Syntax & Fluent API

ToastMagic provides both simple and advanced APIs to suit your style.

### 🔹 Static Method (Quick)

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

ToastMagic::success('Operation Successful');
ToastMagic::error('Something went wrong');
```

### 🔹 Fluent Syntax (Advanced)

```php
ToastMagic::dispatch()->success(
    'User Created',
    'The user has been successfully created.',
    [
        'showCloseBtn'    => true,
        'customBtnText'   => 'View Profile',
        'customBtnLink'   => 'https://demo.com',
    ]
);
```
---

## 📍 Toast Position Options

Customize toast display position using any of the following:

| Position              | Description                |
| --------------------- | -------------------------- |
| `toast-top-start`     | Top left corner            |
| `toast-top-end`       | Top right corner (default) |
| `toast-top-center`    | Top center                 |
| `toast-bottom-start`  | Bottom left corner         |
| `toast-bottom-end`    | Bottom right corner        |
| `toast-bottom-center` | Bottom center              |

---


## 🌙 Enable Dark Mode

Add `theme="dark"` to your `<body>` tag to automatically enable dark mode.

```html
<body theme="dark">
```


## 🎯 Get Started Today!

Experience the magic of ToastMagic and enrich your Laravel application with modern, elegant toast notifications.

* 🔗 **GitHub:** [devrabiul/laravel-toaster-magic](https://github.com/devrabiul/laravel-toaster-magic)
* 🔗 **Live Demo:** [laravel-toaster-magic.rixetbd.com](https://laravel-toaster-magic.rixetbd.com)
* 🔗 **Packagist:** [packagist.org/packages/devrabiul/laravel-toaster-magic](https://packagist.org/packages/devrabiul/laravel-toaster-magic)

---

## 🤝 Contributing

We welcome contributions!
Please fork the repository, make your changes, and submit a pull request.
For feature requests or issues, [open a GitHub issue](https://github.com/devrabiul/laravel-toaster-magic/issues).

---

## 📄 License

This package is open-source software licensed under the [MIT license](LICENSE).

---

## 🌱 Treeware

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/devrabiul/laravel-toaster-magic) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

---

## 📬 Contact

For support or inquiries, feel free to reach out:
📧 [devrabiul@gmail.com](mailto:devrabiul@gmail.com)
