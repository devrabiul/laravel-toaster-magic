<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;

/**
 * Read one of the shipped stylesheets.
 */
function shadowStylesheet(string $file = 'laravel-toaster-magic.css'): string
{
    $css = file_get_contents(__DIR__ . '/../../assets/css/' . $file);

    // The minifier rewrites `::before` to the equivalent `:before` and drops the
    // space before `!important`; normalise both so the assertions describe the
    // rules rather than the minifier's formatting.
    // Collapse first so an already-authored `::before` is not doubled up.
    $css = str_replace(['::before', '::after'], [':before', ':after'], $css);

    $css = str_replace([':before', ':after'], ['::before', '::after'], $css);

    return str_replace(' !important', '!important', $css);
}

it('ships with shadows enabled by default', function () {
    expect(config('laravel-toaster-magic.options.shadow_enable'))->toBeTrue();

    expect(ToastMagic::scripts())->toContain('"shadow_enable":true');
});

it('exposes the disabled shadow flag to the runtime', function () {
    config(['laravel-toaster-magic.options.shadow_enable' => false]);

    expect(ToastMagic::scripts())->toContain('"shadow_enable":false');
});

it('keeps shadows when a published config predates the option', function () {
    config(['laravel-toaster-magic.options' => [
        'closeButton' => true,
        'positionClass' => 'toast-top-end',
        'theme' => 'default',
    ]]);

    expect(ToastMagic::scripts())->not->toContain('"shadow_enable":false');
});

it('applies the shadow toggle regardless of the selected theme', function (string $theme) {
    config([
        'laravel-toaster-magic.options.theme' => $theme,
        'laravel-toaster-magic.options.shadow_enable' => false,
    ]);

    expect(ToastMagic::scripts())
        ->toContain('"theme":"' . $theme . '"')
        ->toContain('"shadow_enable":false');
})->with(['material', 'ios', 'glassmorphism', 'neon', 'minimal', 'neumorphism', 'neumorphic', 'compact']);

it('works alongside the other global options', function () {
    config([
        'laravel-toaster-magic.options.shadow_enable' => false,
        'laravel-toaster-magic.options.color_mode' => true,
        'laravel-toaster-magic.options.gradient_enable' => true,
    ]);

    expect(ToastMagic::scripts())
        ->toContain('"color_mode":true')
        ->toContain('"gradient_enable":true')
        ->toContain('"shadow_enable":false');
});

it('flattens every box-shadow inside the container in both stylesheets', function (string $file) {
    $css = shadowStylesheet($file);

    expect($css)
        // The shared variable is cleared for anything reading it directly...
        ->toContain('.toast-container.toast-shadow-disable')
        // ...and hardcoded theme shadows on the item, its progress bars and any
        // nested control are overridden.
        ->toContain('.toast-container.toast-shadow-disable .toast-item')
        ->toContain('.toast-container.toast-shadow-disable .toast-item::before')
        ->toContain('.toast-container.toast-shadow-disable .toast-item::after')
        ->toContain('.toast-container.toast-shadow-disable .toast-item *')
        ->toContain('box-shadow:none!important');
})->with(['laravel-toaster-magic.min.css']);

it('declares the flattening rule with !important in the source stylesheet', function () {
    $css = shadowStylesheet();

    expect($css)
        ->toContain('.toast-container.toast-shadow-disable .toast-item *::before')
        ->toContain('.toast-container.toast-shadow-disable .toast-item *::after')
        ->toContain('box-shadow: none!important');
});

it('exposes the shadow toggle to the javascript runtime', function () {
    $js = file_get_contents(__DIR__ . '/../../assets/js/laravel-toaster-magic.js');

    expect($js)
        ->toContain('shadow_enable')
        ->toContain('toast-shadow-disable');
});
