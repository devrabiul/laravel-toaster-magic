<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;

/**
 * Decode the `window.toastMagicConfig` object out of the rendered scripts.
 */
function emittedConfig(): array
{
    preg_match('/window\.toastMagicConfig = (\{.*?\});/', ToastMagic::scripts(), $matches);

    return json_decode($matches[1] ?? '{}', true) ?: [];
}

/** The packaged defaults, straight from the shipped config file. */
function packagedDefaults(): array
{
    return require __DIR__ . '/../../src/config/laravel-toaster-magic.php';
}

// ---------------------------------------------------------------------------
// Merging with a published config
// ---------------------------------------------------------------------------

it('merges the package config so top-level keys are always present', function () {
    // Simulates a config file published before these keys existed.
    config(['laravel-toaster-magic' => ['options' => ['theme' => 'ios']]]);

    expect(config('laravel-toaster-magic.options.theme'))->toBe('ios');
});

it('fills in every option a published config predates', function () {
    // A config published at v2.0 knew nothing about pauseOnHover, animation,
    // escape_html, stagger or the accessibility labels. Without a
    // recursive merge those all arrived as null and the runtime silently fell
    // back to values that differed from the documented defaults.
    config(['laravel-toaster-magic.options' => [
        'closeButton' => true,
        'positionClass' => 'toast-top-end',
        'theme' => 'material',
        'gradient_enable' => false,
        'color_mode' => false,
    ]]);

    $emitted = emittedConfig();
    $defaults = packagedDefaults()['options'];

    expect($emitted['theme'])->toBe('material')          // user value preserved
        ->and($emitted['pauseOnHover'])->toBe($defaults['pauseOnHover'])
        ->and($emitted['animation'])->toBe($defaults['animation'])
        ->and($emitted['escape_html'])->toBe($defaults['escape_html'])
        ->and($emitted['stagger'])->toBe($defaults['stagger'])
        ->and($emitted['timeOut'])->toBe($defaults['timeOut'])
        ->and($emitted['showDuration'])->toBe($defaults['showDuration'])
        ->and($emitted['closeButtonLabel'])->toBe($defaults['closeButtonLabel'])
        ->and($emitted['containerLabel'])->toBe($defaults['containerLabel']);
});

it('fills in nested spacing and typography keys a published config predates', function () {
    config(['laravel-toaster-magic.options' => [
        'theme' => 'default',
        'spacing' => ['enable' => true, 'container' => '2px'],
    ]]);

    $html = ToastMagic::scripts();

    // The user's own value wins, and the rest of the section still resolves.
    expect($html)->toContain('"--tm-space-container":"2px"')
        ->toContain('--tm-space-icon-gap');
});

it('keeps a user value of false rather than replacing it with the default', function () {
    config(['laravel-toaster-magic.options' => [
        'theme' => 'default',
        'pauseOnHover' => false,
    ]]);

    $emitted = emittedConfig();

    expect($emitted['pauseOnHover'])->toBeFalse();
});

it('emits the documented defaults when nothing is configured', function () {
    $emitted = emittedConfig();
    $defaults = packagedDefaults()['options'];

    // The PHP default and the value the runtime actually uses must agree; they
    // previously diverged (showDuration was 300 in config, 100 in the runtime).
    foreach (['closeButton', 'positionClass', 'preventDuplicates', 'showDuration',
              'timeOut', 'theme', 'gradient_enable', 'color_mode', 'maxVisible',
              'pauseOnHover', 'animation', 'escape_html', 'stagger'] as $key) {
        expect($emitted[$key])->toBe($defaults[$key], "option {$key}");
    }
});

// ---------------------------------------------------------------------------
// Config file shape
// ---------------------------------------------------------------------------

it('ships a config file with no dead options', function () {
    $config = packagedDefaults();

    // `livewire_version` was shipped and documented for several releases while
    // nothing ever read it; one bridge serves both Livewire v3 and v4.
    expect($config)->not->toHaveKey('livewire_version');
});

it('documents escaping as on by default', function () {
    expect(packagedDefaults()['options']['escape_html'])->toBeTrue();
});

it('exposes every documented theme through the class constant', function () {
    $documented = ['default', 'material', 'ios', 'glassmorphism', 'neon',
                   'minimal', 'neumorphism', 'neumorphic', 'compact'];

    expect(Devrabiul\ToastMagic\ToastMagic::THEMES)->toBe($documented);
});

// ---------------------------------------------------------------------------
// Asset URL resolution
// ---------------------------------------------------------------------------

it('emits no public prefix for a standard public-root layout', function () {
    config(['laravel-toaster-magic.system_processing_directory' => 'public']);

    expect(ToastMagic::styles())->not->toContain('/public/packages/');
});

it('emits a public prefix when the entry script sits at the project root', function () {
    config(['laravel-toaster-magic.system_processing_directory' => 'root']);

    expect(ToastMagic::styles())->toContain('/public/packages/');
});

it('assumes no prefix for an unknown layout', function () {
    config(['laravel-toaster-magic.system_processing_directory' => 'unknown']);

    expect(ToastMagic::styles())->not->toContain('/public/packages/');
});

it('honours an explicit asset path prefix', function () {
    config(['laravel-toaster-magic.asset_path_prefix' => 'public']);

    expect(ToastMagic::styles())->toContain('/public/packages/');
});

it('honours an explicit empty asset path prefix', function () {
    config([
        'laravel-toaster-magic.system_processing_directory' => 'root',
        'laravel-toaster-magic.asset_path_prefix' => '',
    ]);

    // An explicit empty string must override the auto-detection.
    expect(ToastMagic::styles())->not->toContain('/public/packages/');
});

it('does not branch on the client IP address', function () {
    // The old implementation used request()->ip() to choose the asset path,
    // which reported 127.0.0.1 in production behind any reverse proxy.
    //
    // Comments are stripped so the docblock explaining this cannot satisfy it.
    $tokens = token_get_all(file_get_contents(__DIR__ . '/../../src/ToastMagic.php'));

    $code = '';
    foreach ($tokens as $token) {
        if (is_array($token) && in_array($token[0], [T_COMMENT, T_DOC_COMMENT], true)) {
            continue;
        }
        $code .= is_array($token) ? $token[1] : $token;
    }

    expect($code)->not->toContain('127.0.0.1')
        ->and($code)->not->toContain('request()->ip()');
});

// ---------------------------------------------------------------------------
// Publishing
// ---------------------------------------------------------------------------

it('registers both publish tags', function () {
    $groups = Illuminate\Support\ServiceProvider::$publishGroups;

    // `--tag=toast-magic-assets` has been the documented upgrade step for
    // several releases without the tag actually existing.
    expect($groups)->toHaveKey('toast-magic-assets')
        ->and($groups)->toHaveKey('toast-magic-config');
});

it('publishes the assets directory under the assets tag', function () {
    $paths = Illuminate\Support\ServiceProvider::$publishGroups['toast-magic-assets'] ?? [];

    expect($paths)->not->toBeEmpty();
    expect(array_key_first($paths))->toEndWith('/assets');
});

it('emits the stack cap and clamps a negative value to unlimited', function () {
    expect(emittedConfig()['maxVisible'])->toBe(6);

    config(['laravel-toaster-magic.options.maxVisible' => 3]);
    expect(emittedConfig()['maxVisible'])->toBe(3);

    config(['laravel-toaster-magic.options.maxVisible' => -5]);
    expect(emittedConfig()['maxVisible'])->toBe(0);
});
