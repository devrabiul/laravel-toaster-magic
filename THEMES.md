# 🎉 Release Notes v2.0 - The Theme Revolution

We are thrilled to announce **Laravel Toaster Magic v2.0**! 🚀

This major release focuses on **Design & Extensibility**, bringing **7 stunning new themes**, full **Livewire v3/v4 support**, and modern UI enhancements like **Gradient Mode** and **Color Mode**. 

---

## 🚀 What's New?

### 1. 🎨 7 Beautiful New Themes
We have completely redesigned the visual experience. You can now switch between 7 distinct themes by simply updating your config.

| Theme | Config Value | Description |
| :--- | :--- | :--- |
| **Default** | `'default'` | Clean, professional, and perfect for corporate apps. |
| **Material** | `'material'` | Google Material Design inspired. Flat and bold. |
| **iOS** | `'ios'` | **(Fan Favorite)** Apple-style notifications with backdrop blur and smooth bounce animations. |
| **Glassmorphism** | `'glassmorphism'` | Trendy frosted glass effect with vibrant borders and semi-transparent backgrounds. |
| **Neon** | `'neon'` | **(Dark Mode Best)** Cyberpunk-inspired with glowing neon borders and dark gradients. |
| **Minimal** | `'minimal'` | Ultra-clean, distraction-free design with simple left-border accents. |
| **Neumorphism** | `'neumorphism'` | Soft UI design with 3D embossed/debossed plastic-like shadows. |

👉 **How to use:**
```php
// config/laravel-toaster-magic.php
'theme' => 'neon', 
```

---

### 2. ⚡ Full Livewire v3 & v4 Support
We've rewritten the Javascript core to support **Livewire v3 & v4** natively.
- No more custom event listeners required manually.
- Uses `Livewire.on` (v3) or standard event dispatching.
- Works seamlessly with SPA mode and `wire:navigate`.

```php
// Dispatch from component
$this->dispatch('toastMagic', 
    status: 'success', 
    message: 'User Saved!', 
    title: 'Great Job'
);
```

---

### 3. 🌈 Gradient Mode
Want your toasts to pop without changing the entire theme? Enable **Gradient Mode** to add a subtle "glow-from-within" gradient based on the toast type (Success, Error, etc.).

```php
// config/laravel-toaster-magic.php
'gradient_enable' => true
```
*Works best with Default, Material, Neon, and Glassmorphism themes.*

---

### 4. 🎨 Color Mode
Don't want themes? Just want solid colors? **Color Mode** forces the background of the toast to match its type (Green for Success, Red for Error, etc.), overriding theme backgrounds for high-visibility alerts.

```php
// config/laravel-toaster-magic.php
'color_mode' => true
```

---

### 5. 🛠 Refactored CSS Architecture
We have completely modularized the CSS.
- **CSS Variables**: All colors and values are now CSS variables, making runtime customization instant.
- **Scoped Styles**: Themes are namespaced (`.theme-neon`, `.theme-ios`) to prevent conflicts.
- **Dark Mode**: Native dark mode support via `body[theme="dark"]`.

---

## 📋 Upgrade Guide

Upgrading from **v1.x** to **v2.0**?

1. **Update Composer**:
   ```bash
   composer require devrabiul/laravel-toaster-magic "^2.0"
   ```

2. **Republish Assets** (Critical for new CSS/JS):
   ```bash
   php artisan vendor:publish --tag=toast-magic-assets --force
   ```

3. **Check Config**:
   If you have a published config file, add the new options:
   ```php
   'options' => [
       'theme' => 'default',
       'gradient_enable' => false,
       'color_mode' => false,
   ],
   'livewire_version' => 'v3',
   ```

---

## 🏁 Conclusion

v2.0 transforms **Laravel Toaster Magic** from a simple notification library into a UI-first experience. Whether you're building a sleek SaaS (use **iOS**), a gaming platform (use **Neon**), or an admin dashboard (use **Material**), we probably have a theme for you.

**Enjoy the magic!** 🍞✨

---
* Released: Jan 2026
* [GitHub Repository](https://github.com/devrabiul/laravel-toaster-magic)
