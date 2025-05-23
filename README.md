# ToastMagic - Laravel Toaster (With Livewire v3 Support)

A powerful and flexible Toaster package for Laravel applications, designed to enhance user experience with customizable toast notifications.

[![Latest Stable Version](https://poser.pugx.org/devrabiul/laravel-toaster-magic/v/stable)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
[![Total Downloads](https://poser.pugx.org/devrabiul/laravel-toaster-magic/downloads)](https://packagist.org/packages/devrabiul/laravel-toaster-magic)
![GitHub license](https://img.shields.io/github/license/devrabiul/laravel-toaster-magic)
![GitHub Repo stars](https://img.shields.io/github/stars/devrabiul/laravel-toaster-magic?style=social)

## Live Demo

👉 [Check out the live demo](https://laravel-toaster-magic.rixetbd.com/)

![Live Demo Thumbnail](https://laravel-toaster-magic.rixetbd.com/public/assets/img/thumbnail.png)


## Features

- 🔥 **Easy-to-Use Toaster Package** – Simple and intuitive toast notificaiton for Laravel.
- 🌍 **RTL Support** – Fully compatible with right-to-left (RTL) languages.
- 🌙 **Dark Mode Support** – Seamless dark mode for a better user experience.
- 📦 **Customizable Notifications** – Tailor toast messages to fit your application's needs.
- ⚡ **Livewire v3 Support** – Dispatch toast notifications directly from Livewire components.

## Installation

To get started with ToastMagic, follow these simple steps:

1. Install the package via Composer:

    ```bash
    composer require devrabiul/laravel-toaster-magic
    ```

2. Publish the package resources by running:

    ```bash
    php artisan vendor:publish --provider="Devrabiul\ToastMagic\ToastMagicServiceProvider"
    ```

## Usage

### 1. Basic Setup

Integrate ToastMagic into your Blade template by adding the following includes:

1. Add the styles in your `<head>` section:

    ```php
    {!! ToastMagic::styles() !!}
    ```

2. Add the scripts before the closing `<body>` tag:

    ```php
    {!! ToastMagic::scripts() !!}
    ```

3. Example:

    ```php
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

### 2. Usage in Controller

You can trigger toast notifications from your Laravel controller using the `ToastMagic` facade.

```php
use Devrabiul\ToastMagic\Facades\ToastMagic;

class LanguageController extends Controller
{
    public function add()
    {
        // Your logic
        ToastMagic::success('Successfully Updated');
        return back();
    }
}
````

### 3. Usage in JavaScript (Optional - For AJAX calls)

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

### 4. ✅ Livewire v3 Support

To enable Livewire support in ToastMagic, update your configuration file (`config/laravel-toaster-magic.php`) as follows:

```php
<?php

return [
    'options' => [
        // your existing toast options...
    ],
    'livewire_enabled' => true,
    'livewire_version' => 'v3',
];
```

* Set `'livewire_enabled' => true` to activate Livewire integration.
* Set `'livewire_version' => 'v3'` to specify the Livewire version.

---

### Dispatching Toasts from Livewire Components

ToastMagic allows you to dispatch toast notifications directly from your Livewire components using the `$this->dispatch` method:

```php
$this->dispatch('toastMagic',
    status: 'success',
    title: 'User Created',
    message: 'The user has been successfully created.'
);

$this->dispatch('toastMagic',
    status: 'info',
    title: 'User Created 2',
    message: 'The user has been successfully created.'
);
```

Supported `status` values include:
`success`, `info`, `warning`, `error`.

These toasts work seamlessly with the JavaScript listeners loaded by ToastMagic when Livewire is enabled, providing smooth and reactive notifications in your application.


## Toast Position Options

You can configure the position of the toast notifications using the following options:

| Position              | Description                                |
| --------------------- | ------------------------------------------ |
| `toast-top-start`     | Displays toast in the top left corner.     |
| `toast-top-end`       | Displays toast in the top right corner.    |
| `toast-bottom-start`  | Displays toast in the bottom left corner.  |
| `toast-bottom-end`    | Displays toast in the bottom right corner. |
| `toast-top-center`    | Displays toast at the top center.          |
| `toast-bottom-center` | Displays toast at the bottom center.       |

### 🎯 Get Started Today!

Experience the magic of ToastMagic and enhance your Laravel applications with elegant toast notifications.

🔗 **GitHub:** [Laravel Toaster Magic](https://github.com/devrabiul/laravel-toaster-magic)  
🔗 **Website:** [laravel-toaster-magic.rixetbd.com](https://laravel-toaster-magic.rixetbd.com)  
🔗 **Packagist:** [https://packagist.org/packages/devrabiul/laravel-toaster-magic](https://packagist.org/packages/devrabiul/laravel-toaster-magic)  

## Contributing

We welcome contributions to ToastMagic! If you would like to contribute, please fork the repository and submit a pull request. For any issues or feature requests, please open an issue on GitHub.

## License

This package is open-sourced software licensed under the [MIT license](LICENSE).

## Contact

For support or inquiries, please reach out to us at [Send Mail](mailto:devrabiul@gmail.com).