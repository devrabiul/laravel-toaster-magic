# ToastMagic - Laravel Toaster

A powerful and flexible Toaster package for Laravel applications.

## Features

- 🔥 Easy-to-Use Toaster Package – Simple and intuitive file management for Laravel.
- 🌍 RTL Support – Fully compatible with right-to-left (RTL) languages.
- 🌙 Dark Mode Support – Seamless dark mode for a better user experience.

## Installation

First, install the package via Composer:

```bash
composer require devrabiul/laravel-toaster-magic
```

## Usage

### 1. Basic Setup

Add the following includes to your blade template:

1. Add the styles in your `<head>` section:
```php
{!! ToastMagic::styles() !!}
```

2. Add the scripts before ends your `<body>` tags end section:
```php
{!! ToastMagic::scripts() !!}
```

### Usage Example:
```js
const toastMagic = new ToastMagic();

// Show a success toast
toastMagic.success("Success!", "Your data has been saved!");

// Show an error toast
toastMagic.error("Error!", "Something went wrong.");

// Show a warning toast with a close button
toastMagic.warning("Warning!", "Please check your input.", true);

// Show an info toast with a custom button
toastMagic.info("Info!", "Click below for more details.", false, "Learn More", "https://example.com");

```

## Toast Position Options

You can configure the position of the toast notifications using the following options:

| Position          | Description                          |
|------------------|----------------------------------|
| `toast-top-start`     | Displays toast in the top left corner.     |
| `toast-top-end`    | Displays toast in the top right corner.    |
| `toast-bottom-start`  | Displays toast in the bottom left corner.  |
| `toast-bottom-end` | Displays toast in the bottom right corner. |
| `toast-top-center`   | Displays toast at the top center.          |
| `toast-bottom-center`| Displays toast at the bottom center.       |

## License

This package is open-sourced software licensed under the [MIT license](LICENSE.md).
