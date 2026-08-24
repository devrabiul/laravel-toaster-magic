<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;

/**
 * Read one of the shipped stylesheets.
 */
function styleVariablesStylesheet(string $file = 'laravel-toaster-magic.css'): string
{
    return file_get_contents(__DIR__ . '/../../assets/css/' . $file);
}

/**
 * Decode the `window.toastMagicStyleVars` object emitted into the scripts output.
 */
function emittedStyleVariables(): array
{
    preg_match('/window\.toastMagicStyleVars = (\{.*?\});/', ToastMagic::scripts(), $matches);

    return json_decode($matches[1] ?? '{}', true);
}

it('emits the shipped spacing and typography values as custom properties', function () {
    expect(emittedStyleVariables())->toBe([
        '--tm-space-container' => '10px 12px',
        '--tm-space-icon-gap' => '8px',
        '--tm-space-content-gap' => '2px',
        '--tm-space-close-gap' => '6px',
        '--tm-font-title-size' => '14px',
        '--tm-font-description-size' => '13px',
    ]);
});

it('publishes the resolved properties for the runtime to apply', function () {
    // The runtime owns the container, so the properties travel as data and it
    // puts them on the element itself (see the runtime assertion below).
    expect(ToastMagic::scripts())->toContain('window.toastMagicStyleVars = {"--tm-space-container"');
});

it('emits nothing when spacing is disabled', function () {
    config(['laravel-toaster-magic.options.spacing.enable' => false]);

    expect(emittedStyleVariables())
        ->not->toHaveKey('--tm-space-container')
        ->toHaveKey('--tm-font-title-size');
});

it('emits nothing when typography is disabled', function () {
    config(['laravel-toaster-magic.options.typography.enable' => false]);

    expect(emittedStyleVariables())
        ->not->toHaveKey('--tm-font-title-size')
        ->toHaveKey('--tm-space-container');
});

it('emits no properties at all when both sections are disabled', function () {
    config([
        'laravel-toaster-magic.options.spacing.enable' => false,
        'laravel-toaster-magic.options.typography.enable' => false,
    ]);

    expect(emittedStyleVariables())->toBe([]);
    expect(ToastMagic::scripts())->toContain('window.toastMagicStyleVars = {}');
});

it('emits custom spacing values', function () {
    config(['laravel-toaster-magic.options.spacing' => [
        'enable' => true,
        'container' => '6px 8px',
        'icon_gap' => '5px',
        'content_gap' => '0px',
        'close_gap' => '4px',
    ]]);

    expect(emittedStyleVariables())
        ->toMatchArray([
            '--tm-space-container' => '6px 8px',
            '--tm-space-icon-gap' => '5px',
            '--tm-space-content-gap' => '0px',
            '--tm-space-close-gap' => '4px',
        ]);
});

it('emits custom typography values, including the optional ones', function () {
    config(['laravel-toaster-magic.options.typography' => [
        'enable' => true,
        'title_size' => '15px',
        'description_size' => '12px',
        'title_weight' => 600,
        'description_weight' => 400,
        'line_height' => 1.4,
    ]]);

    expect(emittedStyleVariables())
        ->toMatchArray([
            '--tm-font-title-size' => '15px',
            '--tm-font-description-size' => '12px',
            // Numbers are cast to strings for style.setProperty().
            '--tm-font-title-weight' => '600',
            '--tm-font-description-weight' => '400',
            '--tm-line-height' => '1.4',
        ]);
});

it('skips values that are omitted, null or empty', function () {
    config(['laravel-toaster-magic.options.typography' => [
        'enable' => true,
        'title_size' => '15px',
        'description_size' => null,
        'line_height' => '',
    ]]);

    expect(emittedStyleVariables())
        ->toBe(['--tm-space-container' => '10px 12px',
            '--tm-space-icon-gap' => '8px',
            '--tm-space-content-gap' => '2px',
            '--tm-space-close-gap' => '6px',
            '--tm-font-title-size' => '15px']);
});

it('resolves nothing once both sections are switched off in a published config', function () {
    // A published config is merged over the packaged defaults, so turning a
    // section off is what restores the theme's own spacing/typography.
    config(['laravel-toaster-magic.options' => [
        'closeButton' => true,
        'positionClass' => 'toast-top-end',
        'theme' => 'default',
        'spacing' => ['enable' => false],
        'typography' => ['enable' => false],
    ]]);

    expect(emittedStyleVariables())->toBe([]);
});

it('leaves every theme rule readable through its own fallback', function (string $file) {
    $css = styleVariablesStylesheet($file);

    expect($css)
        // Shared base rules.
        ->toContain('var(--tm-space-container,')
        ->toContain('var(--tm-space-icon-gap,')
        ->toContain('var(--tm-space-content-gap,')
        ->toContain('var(--tm-space-close-gap,')
        ->toContain('var(--tm-font-title-size,')
        ->toContain('var(--tm-font-title-weight,')
        ->toContain('var(--tm-font-description-size,')
        ->toContain('var(--tm-font-description-weight,')
        ->toContain('var(--tm-line-height,');
})->with(['laravel-toaster-magic.css', 'laravel-toaster-magic.min.css']);

it('keeps each theme own value as the fallback so an unset property is a no-op', function () {
    $css = styleVariablesStylesheet();

    expect($css)
        // Shared defaults.
        ->toContain('padding: var(--tm-space-container, .85rem) !important')
        ->toContain('gap: var(--tm-space-close-gap, .5rem) !important')
        ->toContain('gap: var(--tm-space-icon-gap, .5rem) !important')
        ->toContain('gap: var(--tm-space-content-gap, .25rem)')
        ->toContain('font-size: var(--tm-font-title-size, 0.875rem)')
        ->toContain('font-size: var(--tm-font-description-size, 0.75rem)')
        // Per-theme defaults are preserved, not flattened onto one value.
        ->toContain('padding: var(--tm-space-container, 14px 18px) !important')
        ->toContain('padding: var(--tm-space-container, 1rem) !important')
        ->toContain('padding: var(--tm-space-container, 1rem 1.15rem 1.35rem) !important')
        ->toContain('padding: var(--tm-space-container, .5rem .625rem) !important')
        ->toContain('font-size: var(--tm-font-title-size, 15px)')
        ->toContain('font-size: var(--tm-font-title-size, .8125rem)');
});

it('re-applies the properties from the javascript runtime', function () {
    // The runtime rebuilds/reuses the container on its own, so it has to put the
    // properties back rather than relying only on the inline script.
    $js = file_get_contents(__DIR__ . '/../../assets/js/laravel-toaster-magic.js');

    expect($js)
        ->toContain('window.toastMagicStyleVars')
        ->toContain('setProperty');
});

it('keeps working together with the theme and color options', function () {
    config([
        'laravel-toaster-magic.options.theme' => 'compact',
        'laravel-toaster-magic.options.color_mode' => true,
    ]);

    expect(ToastMagic::scripts())
        ->toContain('"theme":"compact"')
        ->toContain('"color_mode":true')
        ->toContain('"--tm-space-container":"10px 12px"');
});
