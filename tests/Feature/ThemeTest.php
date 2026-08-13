<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;

/**
 * Read one of the shipped stylesheets.
 */
function themeStylesheet(string $file = 'laravel-toaster-magic.css'): string
{
    return file_get_contents(__DIR__ . '/../../assets/css/' . $file);
}

it('applies the configured theme class to the toast container', function (string $theme) {
    config(['laravel-toaster-magic.options.theme' => $theme]);

    expect(ToastMagic::scripts())
        ->toContain('classList.add("theme-' . $theme . '")')
        ->toContain('classList.remove("theme-default")');
})->with(['neumorphic', 'neumorphism', 'material', 'ios', 'glassmorphism', 'neon', 'minimal']);

it('leaves the default theme class untouched', function () {
    config(['laravel-toaster-magic.options.theme' => 'default']);

    expect(ToastMagic::scripts())->not->toContain('classList.remove("theme-default")');
});

it('exposes the configured theme to the front end config object', function () {
    config(['laravel-toaster-magic.options.theme' => 'neumorphic']);

    expect(ToastMagic::scripts())->toContain('"theme":"neumorphic"');
});

it('renders every toast type while the neumorphic theme is active', function (string $type) {
    config(['laravel-toaster-magic.options.theme' => 'neumorphic']);

    ToastMagic::{$type}('Heading', 'Description');

    expect(ToastMagic::scripts())
        ->toContain('theme-neumorphic')
        ->toContain('toastMagic.' . $type . '("Heading", "Description"');
})->with(['success', 'error', 'warning', 'info']);

it('keeps every other package option working under the neumorphic theme', function () {
    config([
        'laravel-toaster-magic.options.theme' => 'neumorphic',
        'laravel-toaster-magic.options.color_mode' => true,
        'laravel-toaster-magic.options.gradient_enable' => true,
        'laravel-toaster-magic.options.positionClass' => 'toast-bottom-start',
        'laravel-toaster-magic.options.animation' => 'pop',
    ]);

    ToastMagic::success('Hi', null, ['closeButton' => true, 'timeOut' => 8000]);

    expect(ToastMagic::scripts())
        ->toContain('classList.add("theme-neumorphic")')
        ->toContain('classList.add("toast-color-true")')
        ->toContain('classList.add("toast-gradient-enable")')
        ->toContain('classList.add("toast-bottom-start")')
        ->toContain('"animation":"pop"')
        ->toContain('toastMagic.success("Hi", "", true, "", "", 8000, null, "");');
});

it('defines the neumorphic theme in both the source and minified stylesheets', function (string $file) {
    $css = themeStylesheet($file);

    expect($css)
        // Scoped behind the existing theme system, and isolated from other themes.
        ->toContain('.toast-container.theme-neumorphic')
        // Dual-direction shadow system + pressed (inset) state.
        ->toContain('--tm-neu-raised')
        ->toContain('--tm-neu-pressed')
        // Dedicated dark-mode treatment.
        ->toContain('body[theme="dark"] .toast-container.theme-neumorphic')
        // Accessibility: visible focus state and reduced-motion handling.
        ->toContain('.toast-container.theme-neumorphic .toast-close-btn:focus-visible')
        ->toContain('prefers-reduced-motion');
})->with(['laravel-toaster-magic.css', 'laravel-toaster-magic.min.css']);

it('styles the close button, progress groove and accents of the neumorphic theme', function () {
    $css = themeStylesheet();

    expect($css)
        ->toContain('.toast-container.theme-neumorphic .toast-close-btn:active')
        ->toContain('.toast-container.theme-neumorphic .toast-custom-btn:active')
        ->toContain('.toast-container.theme-neumorphic .toast-item::before')
        ->toContain('.toast-container.theme-neumorphic .toast-item::after')
        ->toContain('.toast-container.theme-neumorphic .toast-item.toast-success')
        ->toContain('.toast-container.theme-neumorphic .toast-item.toast-danger')
        ->toContain('.toast-container.theme-neumorphic .toast-item.toast-warning')
        ->toContain('.toast-container.theme-neumorphic .toast-item.toast-info');
});

it('leaves the existing themes untouched', function () {
    $css = themeStylesheet();

    // The original neumorphism theme and the other themes must still be present,
    // and no neumorphic rule may leak into them.
    expect($css)
        ->toContain('.toast-container.theme-neumorphism .toast-item')
        ->toContain('.toast-container.theme-ios .toast-item')
        ->toContain('.toast-container.theme-neon .toast-item')
        ->toContain('.toast-container.theme-glassmorphism .toast-item')
        ->toContain('.toast-container.theme-material .toast-item')
        ->toContain('.toast-container.theme-minimal .toast-item');

    // Every neumorphic declaration block is scoped to the theme container.
    preg_match_all('/--tm-neu-[a-z-]+\s*:/', $css, $matches);
    expect($matches[0])->not->toBeEmpty();

    foreach (explode('}', $css) as $block) {
        if (!str_contains($block, '--tm-neu-') && !str_contains($block, 'tm-neu-raised')) {
            continue;
        }
        expect($block)->toContain('theme-neumorphic');
    }
});

it('keeps the neumorphic theme after the color mode rules so color mode still wins', function () {
    $css = themeStylesheet();

    expect(strpos($css, '.toast-container.theme-neumorphic'))
        ->toBeLessThan(strpos($css, '.toast-container.toast-color-true'));
});
