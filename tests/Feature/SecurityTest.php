<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;

/**
 * Server-side security regression tests.
 *
 * The DOM-level protections live in the JavaScript suite (tests-js/security).
 * These cover what PHP is responsible for: never letting a value break out of
 * the generated `<script>` block, and never letting an unvalidated config value
 * reach the page.
 */

/** Extract everything the rendered output puts inside script blocks. */
function renderedScripts(): string
{
    return ToastMagic::scripts();
}

// ---------------------------------------------------------------------------
// Script block integrity
// ---------------------------------------------------------------------------

it('cannot be broken out of with a closing script tag in a message', function () {
    ToastMagic::success('</script><script>alert(1)</script>', 'also </script> here');

    $html = renderedScripts();

    // The only literal </script> tags may be the ones this class emits itself.
    $blocks = substr_count($html, '<script');
    $closers = substr_count($html, '</script>');

    expect($closers)->toBe($blocks)
        ->and($html)->not->toContain('<script>alert(1)</script>');
});

it('escapes forward slashes so a closing tag cannot terminate the block', function () {
    ToastMagic::success('</script>');

    // JSON_UNESCAPED_SLASHES was previously applied to the config object, which
    // is exactly what would have let a closing tag through. Belt and braces now:
    // the slash is escaped *and* the angle brackets are hex-encoded.
    expect(renderedScripts())->toContain('\/script');
});

it('cannot be broken out of via a description', function () {
    ToastMagic::info('Hi', '</script><img src=x onerror=alert(1)>');

    expect(renderedScripts())->not->toContain('<img src=x onerror=alert(1)>');
});

it('cannot be broken out of via the custom button text', function () {
    ToastMagic::info('Hi', null, [
        'customBtnText' => '</script><script>alert(1)</script>',
        'customBtnLink' => '/x',
    ]);

    expect(renderedScripts())->not->toContain('<script>alert(1)</script>');
});

it('cannot be broken out of via a config value', function () {
    config(['laravel-toaster-magic.options.closeButtonLabel' => '</script><script>alert(1)</script>']);

    expect(renderedScripts())->not->toContain('<script>alert(1)</script>');
});

it('encodes angle brackets and ampersands in the emitted JSON', function () {
    ToastMagic::success('<b>&amp;</b>');

    $html = renderedScripts();

    // JSON_HEX_TAG / JSON_HEX_AMP keep these out of the markup entirely.
    expect($html)->not->toContain('<b>')
        ->and($html)->toContain('<');
});

it('cannot inject an HTML comment sequence that breaks parsing', function () {
    ToastMagic::success('<!--<script>alert(1)</script>-->');

    expect(renderedScripts())->not->toContain('<!--');
});

// ---------------------------------------------------------------------------
// Attribute integrity
// ---------------------------------------------------------------------------

it('escapes the asset URL in the stylesheet tag', function () {
    config(['laravel-toaster-magic.asset_path_prefix' => 'a"onload="alert(1)']);

    $html = ToastMagic::styles();

    expect($html)->not->toContain('onload="alert(1)"')
        ->and($html)->toContain('&quot;');
});

it('escapes a nonce before writing it into an attribute', function () {
    ToastMagic::success('Hi');
    ToastMagic::nonce('abc" onload="alert(1)');

    expect(renderedScripts())->not->toContain('onload="alert(1)"');
});

// ---------------------------------------------------------------------------
// Escaping contract
// ---------------------------------------------------------------------------

it('marks toasts as escaped by default', function () {
    ToastMagic::success('<b>Hi</b>');

    expect(renderedScripts())->toContain('"html":false');
});

it('marks a toast as HTML when it opts in', function () {
    ToastMagic::success('<b>Hi</b>', null, ['html' => true]);

    expect(renderedScripts())->toContain('"html":true');
});

it('marks every toast as HTML when escaping is globally disabled', function () {
    config(['laravel-toaster-magic.options.escape_html' => false]);

    ToastMagic::success('<b>Hi</b>');

    expect(renderedScripts())->toContain('"html":true');
});

it('lets a per-toast opt-out win over a global opt-in', function () {
    config(['laravel-toaster-magic.options.escape_html' => false]);

    ToastMagic::success('<b>Hi</b>', null, ['html' => false]);

    expect(renderedScripts())->toContain('"html":false');
});

it('does not convert newlines to markup before escaping', function () {
    ToastMagic::info("a\nb");

    // A <br> inserted here would be shown as literal text once escaped; the
    // runtime inserts real <br> elements after escaping instead.
    expect(renderedScripts())->not->toContain('a<br>b');
});

// ---------------------------------------------------------------------------
// Style variable sanitisation
// ---------------------------------------------------------------------------

it('drops a style variable containing unexpected characters', function () {
    config([
        'laravel-toaster-magic.options.spacing.enable' => true,
        'laravel-toaster-magic.options.spacing.container' => 'red; background: url("evil")',
    ]);

    expect(renderedScripts())->not->toContain('evil');
});

it('keeps a legitimate style variable value', function () {
    config([
        'laravel-toaster-magic.options.spacing.enable' => true,
        'laravel-toaster-magic.options.spacing.container' => '0.5rem 1rem',
    ]);

    expect(renderedScripts())->toContain('"--tm-space-container":"0.5rem 1rem"');
});

it('accepts calc and percentage values', function () {
    config([
        'laravel-toaster-magic.options.typography.enable' => true,
        'laravel-toaster-magic.options.typography.line_height' => 'calc(1em + 2px)',
    ]);

    expect(renderedScripts())->toContain('calc(1em + 2px)');
});

// ---------------------------------------------------------------------------
// Shipped runtime
// ---------------------------------------------------------------------------

it('builds the toast DOM without string-concatenated markup', function () {
    $js = file_get_contents(__DIR__ . '/../../assets/js/laravel-toaster-magic.js');

    // The vulnerability was a template literal interpolating URLs and text into
    // an innerHTML assignment. Only the trusted-icon parser and the explicit
    // html:true opt-in may touch innerHTML now.
    expect(substr_count($js, 'innerHTML'))->toBeLessThanOrEqual(2)
        ->and($js)->toContain('setAttribute("src"')
        ->and($js)->toContain('setAttribute("href"')
        ->and($js)->toContain('createTextNode');
});

it('keeps the URL sanitiser protocol-based rather than prefix-based', function () {
    $js = file_get_contents(__DIR__ . '/../../assets/js/laravel-toaster-magic.js');

    expect($js)
        ->toContain('LINK_PROTOCOLS')
        ->toContain('IMAGE_PROTOCOLS')
        ->toContain('new URL(');
});
