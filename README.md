# ToastMagic - Laravel Toaster

A powerful and flexible Toaster package for Laravel applications, designed to enhance user experience with customizable toast notifications.

## Features

- 🔥 **Easy-to-Use Toaster Package** – Simple and intuitive file management for Laravel.
- 🌍 **RTL Support** – Fully compatible with right-to-left (RTL) languages.
- 🌙 **Dark Mode Support** – Seamless dark mode for a better user experience.
- 📦 **Customizable Notifications** – Tailor toast messages to fit your application's needs.

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

Integrate ToastMagic into your blade template by adding the following includes:

1. Add the styles in your `<head>` section:

    ```php
    {!! ToastMagic::styles() !!}
    ```

2. Add the scripts before the closing `<body>` tag:

    ```php
    {!! ToastMagic::scripts() !!}
    ```

### Usage Example: (Optional - If needed in any AJAX function)

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

### 🎯 Get Started Today!
Experience the magic of ToastMagic and enhance your Laravel applications with elegant toast notifications.

🔗 **GitHub:** [Laravel Toaster Magic](https://github.com/devrabiul/laravel-toaster-magic)
🔗 **Website:** [laravel-toaster-magic.rixetbd.com](https://laravel-toaster-magic.rixetbd.com)
🔗 **Packagist:** [https://packagist.org/packages/devrabiul/laravel-toaster-magic](https://packagist.org/packages/devrabiul/laravel-toaster-magic)

## Contributing

We welcome contributions to ToastMagic! If you would like to contribute, please fork the repository and submit a pull request. For any issues or feature requests, please open an issue on GitHub.

## License

This package is open-sourced software licensed under the [MIT license](LICENSE.md).

## Contact

For support or inquiries, please reach out to us at [devrabiul@gmail.com](mailto:devrabiul@gmail.com).
