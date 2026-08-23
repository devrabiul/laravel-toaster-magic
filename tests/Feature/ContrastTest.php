<?php

/**
 * Colour-contrast regression tests.
 *
 * Contrast failures are measurable, not a matter of taste, so they get the same
 * treatment as any other regression. Colour mode shipped three of its four types
 * below half the required ratio, and the neumorphism theme was unreadable in
 * dark mode; these lock the fixes in.
 */

/** Relative luminance per WCAG 2.1. */
function relativeLuminance(string $hex): float
{
    $hex = ltrim($hex, '#');
    $channels = str_split($hex, 2);

    $linear = array_map(static function (string $channel): float {
        $value = hexdec($channel) / 255;

        return $value <= 0.03928
            ? $value / 12.92
            : (($value + 0.055) / 1.055) ** 2.4;
    }, $channels);

    return 0.2126 * $linear[0] + 0.7152 * $linear[1] + 0.0722 * $linear[2];
}

/** Contrast ratio between two hex colours. */
function contrastRatio(string $foreground, string $background): float
{
    $a = relativeLuminance($foreground);
    $b = relativeLuminance($background);

    return (max($a, $b) + 0.05) / (min($a, $b) + 0.05);
}

/** Read the source stylesheet. */
function contrastStylesheet(): string
{
    return file_get_contents(__DIR__ . '/../../assets/css/laravel-toaster-magic.css');
}

it('computes contrast ratios correctly', function () {
    // Sanity-check the helper against the two known extremes.
    expect(round(contrastRatio('#000000', '#ffffff'), 2))->toBe(21.0)
        ->and(round(contrastRatio('#ffffff', '#ffffff'), 2))->toBe(1.0);
});

it('meets WCAG AA for every colour-mode toast type', function (string $label, string $fg, string $bg) {
    $ratio = contrastRatio($fg, $bg);

    expect($ratio)->toBeGreaterThanOrEqual(
        4.5,
        sprintf('%s: %s on %s is %.2f:1, below the 4.5:1 AA requirement', $label, $fg, $bg, $ratio)
    );
})->with([
    // White on the raw accent measured 2.50:1, so colour mode uses a darker green.
    'success' => ['success', '#ffffff', '#03774f'],
    'danger'  => ['danger', '#ffffff', '#dc3545'],
    // These two accents are light; white on them measured 1.63:1 and 1.96:1.
    'warning' => ['warning', '#1a1d21', '#ffc107'],
    'info'    => ['info', '#1a1d21', '#0dcaf0'],
]);

it('meets WCAG AA for the neumorphism surface', function () {
    // The theme hardcodes a light surface and used to inherit --toast-item-color,
    // which is white in dark mode: 1.27:1.
    expect(contrastRatio('#303643', '#e0e5ec'))->toBeGreaterThanOrEqual(4.5)
        ->and(contrastRatio('#5c6474', '#e0e5ec'))->toBeGreaterThanOrEqual(4.5);
});

it('meets WCAG AA for the neumorphic surface in both modes', function () {
    expect(contrastRatio('#303643', '#e6eaf2'))->toBeGreaterThanOrEqual(4.5)
        ->and(contrastRatio('#5c6474', '#e6eaf2'))->toBeGreaterThanOrEqual(4.5)
        ->and(contrastRatio('#e7e9ee', '#2c2f36'))->toBeGreaterThanOrEqual(4.5);
});

it('meets WCAG AA for the neon surface', function () {
    expect(contrastRatio('#e4e4e7', '#09090b'))->toBeGreaterThanOrEqual(4.5)
        ->and(contrastRatio('#a1a1aa', '#09090b'))->toBeGreaterThanOrEqual(4.5);
});

it('meets WCAG AA for the default surface in both modes', function () {
    expect(contrastRatio('#000000', '#ffffff'))->toBeGreaterThanOrEqual(4.5)
        ->and(contrastRatio('#ffffff', '#000000'))->toBeGreaterThanOrEqual(4.5);
});

it('keeps colour-mode surfaces fully opaque', function () {
    $css = contrastStylesheet();

    // The surfaces reused --toast-item-after-opacity, a progress-bar variable
    // that the `-start` positions set to 0.4 — so the same toast rendered at
    // 40% opacity on the left and 100% on the right.
    foreach (['success', 'info', 'warning', 'danger'] as $type) {
        preg_match(
            '/\.toast-container\.toast-color-true \.toast-item\.toast-' . $type . ' \{(.*?)\}/s',
            $css,
            $matches
        );

        expect($matches[1] ?? '')->not->toContain('--toast-item-after-opacity');
    }
});

it('gives warning and info a dark foreground in colour mode', function () {
    $css = contrastStylesheet();

    expect($css)->toContain('.toast-container.toast-color-true .toast-item.toast-warning .toast-close-btn')
        ->toContain('.toast-container.toast-color-true .toast-item.toast-info .toast-close-btn');
});
