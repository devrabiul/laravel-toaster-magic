# 🕵️ LaravelPhpInspector

**LaravelPhpInspector** is a developer tool for Laravel that helps you check your project’s **PHP 8.4** and **Laravel 12** compatibility.  
It uses **PHP_CodeSniffer** and the **PHPCompatibility** ruleset under the hood to scan your code and highlight deprecated functions, syntax issues, and Laravel helper changes.

[![Latest Stable Version](https://poser.pugx.org/devrabiul/laravel-php-inspector/v/stable)](https://packagist.org/packages/devrabiul/laravel-php-inspector)
[![Total Downloads](https://poser.pugx.org/devrabiul/laravel-php-inspector/downloads)](https://packagist.org/packages/devrabiul/laravel-php-inspector)
[![Monthly Downloads](https://poser.pugx.org/devrabiul/laravel-php-inspector/d/monthly)](https://packagist.org/packages/devrabiul/laravel-php-inspector)
![GitHub license](https://img.shields.io/github/license/devrabiul/laravel-php-inspector)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/devrabiul/laravel-php-inspector)
![GitHub Repo stars](https://img.shields.io/github/stars/devrabiul/laravel-php-inspector?style=social)

---

## 🚀 Live Demo

👉 [Try the Live Demo](https://packages.rixetbd.com/devrabiul/laravel-php-inspector)

![Live Demo Thumbnail](https://packages.rixetbd.com/storage/app/public/package/devrabiul/laravel-php-inspector.webp)

---

## ✨ Features

- ✅ Detects deprecated PHP functions, classes, and syntax
- ✅ Highlights Laravel helpers and validation rules that need updating
- ✅ Compatible with **PHP 8.4**
- ✅ Works with **Laravel 10, 11, and 12**
- ✅ Excludes `vendor/`, `node_modules/`, and public assets by default
- ✅ Provides Artisan command for easy inspection

---

## 📦 Installation

Install the package via Composer:

```bash
composer require devrabiul/laravel-php-inspector --dev
````

Then publish the package config:

```bash
php artisan vendor:publish --provider="Devrabiul\LaravelPhpInspector\LaravelPhpInspectorServiceProvider"
```

---

## ⚙️ Usage

Run the inspector to check your Laravel app for PHP compatibility:

```bash
php artisan phpcompat:check
```

### Available Options

* **`--php=`** → Target PHP version (overrides config)
  Example:

  ```bash
  php artisan phpcompat:check --php=8.4
  ```

* **`--path=`** → Specific path to scan (overrides config)
  Example:

  ```bash
  php artisan phpcompat:check --path=app/Models
  ```

By default, the command scans your entire Laravel project (excluding `vendor/`, `storage/`, and `*.blade.php` files).

---

## 🎯 Get Started Today!

Experience the magic of LaravelPhpInspector and enrich your Laravel application with modern PHP compatibility checks.

* 🔗 **GitHub:** [devrabiul/laravel-php-inspector](https://github.com/devrabiul/laravel-php-inspector)
* 🔗 **Live Demo:** [laravel-php-inspector.rixetbd.com](https://laravel-php-inspector.rixetbd.com)
* 🔗 **Packagist:** [packagist.org/packages/devrabiul/laravel-php-inspector](https://packagist.org/packages/devrabiul/laravel-php-inspector)

---

## 🤝 Contributing

We welcome contributions!
Please fork the repository, make your changes, and submit a pull request.
For feature requests or issues, [open a GitHub issue](https://github.com/devrabiul/laravel-php-inspector/issues).

---

## 📄 License

This package is open-source software licensed under the [MIT license](LICENSE).

---

## 🌱 Treeware

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/devrabiul/laravel-php-inspector) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

---

## 📬 Contact

For support or inquiries, feel free to reach out:
📧 [devrabiul@gmail.com](mailto:devrabiul@gmail.com)

```