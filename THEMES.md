# Laravel Toaster Magic - Theme Guide

## Available Themes

Laravel Toaster Magic comes with **7 beautifully crafted themes** that you can use to match your application's design aesthetic.

### 1. **Default Theme** (`theme-default`)
Clean and professional design with subtle styling.
- Rounded corners (0.5rem)
- Minimal shadows
- Perfect for corporate applications
- Supports gradient mode

```php
'theme' => 'default'
```

---

### 2. **Material Theme** (`theme-material`)
Google Material Design inspired theme.
- Sharp edges (no border-radius)
- Material-style shadows
- Flat design aesthetic
- Supports gradient mode

```php
'theme' => 'material'
```

---

### 3. **iOS Theme** (`theme-ios`)
Apple iOS-inspired modern design with smooth animations.
- Rounded corners (1.25rem)
- Backdrop blur effect
- Smooth bounce animation
- Left border accent color
- Elegant hover effects
- Supports gradient mode

```php
'theme' => 'ios'
```

**Special Features:**
- Uses `backdrop-filter: blur(20px)` for glass effect
- Cubic bezier animation: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Hover state with enhanced shadows

---

### 4. **Glassmorphism Theme** (`theme-glassmorphism`)
Modern frosted glass effect with vibrant colors.
- Heavy blur effects
- Semi-transparent backgrounds
- Gradient borders
- Inset shadows for depth
- Supports gradient mode

```php
'theme' => 'glassmorphism'
```

**Special Features:**
- `backdrop-filter: blur(20px) saturate(180%)`
- Color-specific glass effects per toast type
- Layered shadow effects

---

### 5. **Neon Theme** (`theme-neon`)
Dark mode cyberpunk-inspired design with glowing effects.
- Dark gradient background
- Neon glow effects
- Border glow matching toast type
- White text for dark backgrounds
- Supports gradient mode

```php
'theme' => 'neon'
```

**Special Features:**
- Best for dark-themed applications
- Glowing progress bar with `box-shadow`
- Animated neon line at top
- Semi-transparent dark backgrounds

---

### 6. **Minimal Theme** (`theme-minimal`)
Ultra-clean, distraction-free design.
- Minimal styling
- Left colored border accent
- No progress bars
- Subtle shadows
- Smaller padding

```php
'theme' => 'minimal'
```

**Special Features:**
- Progress bars are hidden
- 4px left border for toast type indication
- Perfect for content-focused applications

---

### 7. **Neumorphism Theme** (`theme-neumorphism`)
Soft UI (neumorphism) design with 3D-like shadows.
- Soft embossed/debossed effects
- Light background (#e0e5ec)
- Dual-directional shadows
- No borders
- Smooth, tactile feel

```php
'theme' => 'neumorphism'
```

**Special Features:**
- Dual shadows: `9px 9px 16px` and `-9px -9px 16px`
- Inset colored shadows for toast types
- Best for light-themed applications
- Soft, subtle progress bars

---

## Configuration

### Basic Setup

In your `config/laravel-toaster-magic.php`:

```php
return [
    'options' => [
        "theme" => "default", // Change to: ios, material, glassmorphism, neon, minimal, neumorphism
        "gradient_enable" => false, // Works with: default, material, ios, glassmorphism, neon
        "color_mode" => false // Full color backgrounds
    ]
];
```

### Enable Gradient Mode

Gradient mode adds a subtle color wash to toasts based on their type (success, error, warning, info).

```php
'gradient_enable' => true
```

**Supported Themes:**
- ✅ default
- ✅ material
- ✅ ios
- ✅ glassmorphism
- ✅ neon
- ❌ minimal (intentionally disabled)
- ❌ neumorphism (uses shadow coloring instead)

---

## Theme Comparison Table

| Feature | Default | Material | iOS | Glassmorphism | Neon | Minimal | Neumorphism |
|---------|---------|----------|-----|---------------|------|---------|-------------|
| Border Radius | 0.5rem | 0 | 1.25rem | 1rem | 0.625rem | 0.375rem | 1rem |
| Backdrop Blur | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Progress Bar | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Gradient Support | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Dark Mode Ready | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Best For | Corporate | Modern Apps | Apple-like | Trendy Sites | Dark Theme Apps | Clean UI | Light Theme Apps |

---

## Usage Examples

### Example 1: iOS Theme with Gradient
```php
// config/laravel-toaster-magic.php
return [
    'options' => [
        "theme" => "ios",
        "gradient_enable" => true,
        "positionClass" => "toast-top-end",
        "timeOut" => "5000",
    ]
];
```

### Example 2: Neon Theme for Dark Apps
```php
return [
    'options' => [
        "theme" => "neon",
        "gradient_enable" => true,
        "positionClass" => "toast-bottom-end",
    ]
];
```

### Example 3: Minimal Theme
```php
return [
    'options' => [
        "theme" => "minimal",
        "closeButton" => true,
    ]
];
```

---

## Browser Support

All themes use modern CSS features:
- CSS Custom Properties (CSS Variables)
- `backdrop-filter` (iOS, Glassmorphism, Neon)
- CSS Animations
- Flexbox

**Recommended Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Customization

You can override any theme's styles in your own CSS:

```css
/* Override iOS theme border radius */
.toast-container.theme-ios .toast-item {
    border-radius: 2rem !important;
}

/* Change Neon theme colors */
.toast-container.theme-neon .toast-item.toast-success {
    border-color: #00ff00 !important;
}
```

---

## CSS Structure

The CSS is now organized with a clean, maintainable structure:

```
├── CSS Variables
├── Utility Classes
├── Toast Container Base
│   ├── Position Variants
│   ├── Toast Item Base
│   ├── Progress Bars
│   └── Position Transforms
├── Themes
│   ├── theme-default
│   ├── theme-material
│   ├── theme-ios
│   ├── theme-glassmorphism
│   ├── theme-neon
│   ├── theme-minimal
│   └── theme-neumorphism
├── Color Mode Overrides
├── Content Structure
├── Buttons
├── RTL Support
├── Responsive
└── Animations
```

---

## Notes

1. **Backdrop Blur Performance**: iOS, Glassmorphism, and Neon themes use `backdrop-filter` which may impact performance on lower-end devices.

2. **Neumorphism Light Mode**: Neumorphism theme uses a fixed light background (#e0e5ec) and works best in light-themed applications.

3. **Neon Theme**: Designed specifically for dark-themed applications with automatic white text.

4. **Progress Bar Heights**: Different themes use different progress bar heights (3px for iOS, 4px for others).

---

## Migration from Old Themes

If you were using the old theme structure:

```php
// Old
'theme' => 'material'

// New (same, but more themes available!)
'theme' => 'material'
// Or try: 'ios', 'glassmorphism', 'neon', 'minimal', 'neumorphism'
```

All existing themes are backward compatible!

---

## Support

For issues or questions:
- GitHub Issues: [devrabiul/laravel-toaster-magic](https://github.com/devrabiul/laravel-toaster-magic)
- Documentation: See main README.md

---

**Enjoy your beautiful toast notifications!** 🎉
