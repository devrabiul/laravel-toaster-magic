<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;
use Devrabiul\ToastMagic\ToastMagic as ToastMagicService;

/**
 * Read one of the shipped stylesheets.
 */
function themeStylesheet(string $file = 'laravel-toaster-magic.css'): string
{
    $css = file_get_contents(__DIR__ . '/../../assets/css/' . $file);

    // The minifier drops the quotes inside attribute selectors; normalise them
    // so the assertions describe the selector rather than its formatting.
    return str_replace('[theme=dark]', '[theme="dark"]', $css);
}

/** Every theme the package ships, from the single source of truth. */
function allThemes(): array
{
    return ToastMagicService::THEMES;
}

// ---------------------------------------------------------------------------
// Theme selection
// ---------------------------------------------------------------------------

it('exposes the configured theme to the runtime config', function (string $theme) {
    config(['laravel-toaster-magic.options.theme' => $theme]);

    // The container class is applied by the runtime from this value, rather
    // than by string-concatenated JavaScript emitted here.
    expect(ToastMagic::scripts())->toContain('"theme":"' . $theme . '"');
})->with(allThemes());

it('falls back to the default theme for an unknown value', function () {
    config(['laravel-toaster-magic.options.theme' => 'neumorphc']);

    // A typo used to produce a `theme-neumorphc` class and an unstyled toast.
    expect(ToastMagic::scripts())->toContain('"theme":"default"');
});

it('falls back to the default position for an unknown value', function () {
    config(['laravel-toaster-magic.options.positionClass' => 'toast-middle-nowhere']);

    expect(ToastMagic::scripts())->toContain('"positionClass":"toast-top-end"');
});

it('falls back to the default animation for an unknown value', function () {
    config(['laravel-toaster-magic.options.animation' => 'explode']);

    expect(ToastMagic::scripts())->toContain('"animation":"default"');
});

it('never emits an unvalidated theme value into the output', function () {
    config(['laravel-toaster-magic.options.theme' => '"></script><script>alert(1)</script>']);

    $html = ToastMagic::scripts();

    expect($html)->not->toContain('alert(1)')
        ->and($html)->toContain('"theme":"default"');
});

it('renders every toast type under every theme', function (string $theme) {
    config(['laravel-toaster-magic.options.theme' => $theme]);

    foreach (ToastMagicService::TYPES as $type) {
        ToastMagic::{$type}('Heading', 'Description');
    }

    $html = ToastMagic::scripts();

    expect($html)->toContain('"theme":"' . $theme . '"');

    foreach (ToastMagicService::TYPES as $type) {
        expect($html)->toContain('window.toastMagic.' . $type . '(');
    }
})->with(allThemes());

it('keeps every other package option working alongside a theme', function () {
    config([
        'laravel-toaster-magic.options.theme' => 'neumorphic',
        'laravel-toaster-magic.options.color_mode' => true,
        'laravel-toaster-magic.options.gradient_enable' => true,
        'laravel-toaster-magic.options.positionClass' => 'toast-bottom-start',
        'laravel-toaster-magic.options.animation' => 'pop',
    ]);

    ToastMagic::success('Hi', null, ['closeButton' => true, 'timeOut' => 8000]);

    expect(ToastMagic::scripts())
        ->toContain('"theme":"neumorphic"')
        ->toContain('"color_mode":true')
        ->toContain('"gradient_enable":true')
        ->toContain('"positionClass":"toast-bottom-start"')
        ->toContain('"animation":"pop"')
        ->toContain('"timeOut":8000');
});

// ---------------------------------------------------------------------------
// Stylesheet coverage
// ---------------------------------------------------------------------------

it('defines every theme in both the source and minified stylesheets', function (string $file) {
    $css = themeStylesheet($file);

    foreach (allThemes() as $theme) {
        if ($theme === 'default') {
            continue; // the default look is the base rule set, not a modifier
        }

        expect($css)->toContain('.toast-container.theme-' . $theme);
    }
})->with(['laravel-toaster-magic.css', 'laravel-toaster-magic.min.css']);

it('defines the neumorphic theme depth, dark mode and focus rules', function (string $file) {
    $css = themeStylesheet($file);

    expect($css)
        ->toContain('.toast-container.theme-neumorphic')
        ->toContain('--tm-neu-raised')
        ->toContain('--tm-neu-pressed')
        ->toContain('body[theme="dark"] .toast-container.theme-neumorphic')
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

it('keeps the compact theme free of gradients and glass effects', function () {
    // Comments are stripped first so the theme's own prose can't satisfy the check.
    $css = preg_replace('#/\*.*?\*/#s', '', themeStylesheet());

    foreach (explode('}', $css) as $block) {
        if (!str_contains($block, 'theme-compact')) {
            continue;
        }

        expect($block)
            ->not->toContain('gradient')
            ->not->toContain('backdrop-filter');
    }
});

it('scopes every neumorphic custom property to its own theme', function () {
    $css = themeStylesheet();

    preg_match_all('/--tm-neu-[a-z-]+\s*:/', $css, $matches);
    expect($matches[0])->not->toBeEmpty();

    foreach (explode('}', $css) as $block) {
        if (!str_contains($block, '--tm-neu-') && !str_contains($block, 'tm-neu-raised')) {
            continue;
        }

        expect($block)->toContain('theme-neumorphic');
    }
});

it('keeps color mode after the theme rules so it still wins', function () {
    $css = themeStylesheet();

    expect(strpos($css, '.toast-container.theme-neumorphic'))
        ->toBeLessThan(strpos($css, '.toast-container.toast-color-true'));
});

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

it('defines CSS for every animation the config offers', function (string $animation) {
    if ($animation === 'default') {
        expect(true)->toBeTrue(); // the default entrance is the base rule
        return;
    }

    // `slide` shipped in the config and the README for three releases with no
    // rule behind it, so selecting it silently fell through to the default.
    expect(themeStylesheet())->toContain('.toast-animate-' . $animation);
})->with(ToastMagicService::ANIMATIONS);

it('defines every animation in the minified stylesheet too', function (string $animation) {
    if ($animation === 'default') {
        expect(true)->toBeTrue();
        return;
    }

    expect(themeStylesheet('laravel-toaster-magic.min.css'))->toContain('.toast-animate-' . $animation);
})->with(ToastMagicService::ANIMATIONS);

// ---------------------------------------------------------------------------
// Dark mode coverage
// ---------------------------------------------------------------------------

it('gives every theme that hardcodes a surface a dark-mode treatment', function () {
    $css = themeStylesheet();

    // These themes set their own background instead of using --toast-item-bg,
    // so they need an explicit dark treatment or the inherited white text
    // lands on a light surface.
    expect($css)
        ->toContain('body[theme="dark"] .toast-container.theme-ios')
        ->toContain('body[theme="dark"] .toast-container.theme-neumorphic')
        ->toContain('body[theme="dark"] .toast-container.theme-compact')
        ->toContain('body[theme="dark"] .toast-container.theme-glassmorphism')
        ->toContain('body[theme="dark"] .toast-container.theme-minimal');
});

it('pins a readable foreground on the neumorphism light surface', function () {
    $css = preg_replace('#/\*.*?\*/#s', '', themeStylesheet());

    // Without this the theme inherited --toast-item-color, which is white in
    // dark mode: white on #e0e5ec measures 1.27:1.
    preg_match('/\.toast-container\.theme-neumorphism \.toast-item \{(.*?)\}/s', $css, $matches);

    expect($matches[1] ?? '')->toContain('--toast-item-color');
});
