<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;
use Devrabiul\ToastMagic\ToastMagic as ToastMagicService;

const MESSAGES_KEY = 'laravel-toaster-magic::messages';

/**
 * Decode the `window.toastMagicConfig` object out of the rendered scripts.
 */
function runtimeConfig(): array
{
    preg_match('/window\.toastMagicConfig = (\{.*?\});/', ToastMagic::scripts(), $matches);

    return json_decode($matches[1] ?? '{}', true) ?: [];
}

/**
 * Decode the option objects passed to each queued toast call, in order.
 *
 * @return array<int, array{type: string, options: array}>
 */
function toastCalls(): array
{
    preg_match_all(
        '/window\.toastMagic\.(success|error|warning|info)\((\{.*?\})\);/',
        ToastMagic::scripts(),
        $matches,
        PREG_SET_ORDER
    );

    return array_map(static fn ($m) => [
        'type' => $m[1],
        'options' => json_decode($m[2], true) ?: [],
    ], $matches);
}

// ---------------------------------------------------------------------------
// Queueing
// ---------------------------------------------------------------------------

it('flashes a success message into the session', function () {
    ToastMagic::success('Saved', 'Your data has been saved.');

    $messages = session(MESSAGES_KEY);

    expect($messages)->toBeArray()->toHaveCount(1)
        ->and($messages[0]['type'])->toBe('success')
        ->and($messages[0]['message'])->toBe('Saved')
        ->and($messages[0]['description'])->toBe('Your data has been saved.');
});

it('stores each toast type with the correct type key', function (string $type) {
    ToastMagic::{$type}('Heading');

    expect(session(MESSAGES_KEY)[0]['type'])->toBe($type);
})->with(['success', 'info', 'warning', 'error']);

it('falls back to the info type for an unknown type', function () {
    ToastMagic::add('not-a-real-type', 'Hello');

    expect(session(MESSAGES_KEY)[0]['type'])->toBe('info');
});

it('queues multiple messages in order', function () {
    ToastMagic::success('first');
    ToastMagic::error('second');

    $messages = session(MESSAGES_KEY);

    expect($messages)->toHaveCount(2)
        ->and($messages[0]['message'])->toBe('first')
        ->and($messages[1]['message'])->toBe('second');
});

it('dispatch() returns the toast instance for fluent chaining', function () {
    expect(ToastMagic::dispatch())->toBeInstanceOf(ToastMagicService::class);
});

it('flashes a message through the fluent dispatch syntax', function () {
    ToastMagic::dispatch()->success('Fluent', 'Works');

    expect(session(MESSAGES_KEY)[0]['message'])->toBe('Fluent');
});

it('clear() resets the in-memory message list', function () {
    ToastMagic::success('one');
    ToastMagic::clear();
    ToastMagic::success('two');

    $messages = session(MESSAGES_KEY);

    expect($messages)->toHaveCount(1)
        ->and($messages[0]['message'])->toBe('two');
});

it('clear() removes queued messages from the session', function () {
    ToastMagic::success('one');
    ToastMagic::clear();

    expect(session(MESSAGES_KEY))->toBeNull();
});

// ---------------------------------------------------------------------------
// MessageBag
// ---------------------------------------------------------------------------

it('flattens a MessageBag into newline-separated text', function () {
    $bag = new Illuminate\Support\MessageBag([
        'email' => ['Email is required', 'Email is invalid'],
    ]);

    ToastMagic::error($bag);

    // Newlines rather than <br>: the runtime escapes the text and then inserts
    // real <br> elements, so markup here would be displayed literally.
    expect(session(MESSAGES_KEY)[0]['message'])->toBe("Email is required\nEmail is invalid");
});

it('flattens a MessageBag with <br> when the toast opts into HTML', function () {
    $bag = new Illuminate\Support\MessageBag([
        'email' => ['Email is required', 'Email is invalid'],
    ]);

    ToastMagic::error($bag, null, ['html' => true]);

    expect(session(MESSAGES_KEY)[0]['message'])->toBe('Email is required<br>Email is invalid');
});

it('accepts a MessageBag for every toast type without a TypeError', function (string $type) {
    $bag = new Illuminate\Support\MessageBag(['field' => ['Something went wrong']]);

    ToastMagic::{$type}($bag);

    expect(session(MESSAGES_KEY)[0]['message'])->toBe('Something went wrong');
})->with(['success', 'info', 'warning', 'error']);

// ---------------------------------------------------------------------------
// Rendered output
// ---------------------------------------------------------------------------

it('renders a stylesheet link tag', function () {
    expect(ToastMagic::styles())
        ->toContain('<link rel="stylesheet"')
        ->toContain('laravel-toaster-magic.min.css');
});

it('emits the config before the runtime script so the runtime can read it', function () {
    $html = ToastMagic::scripts();

    $configAt = strpos($html, 'window.toastMagicConfig');
    $runtimeAt = strpos($html, 'js/laravel-toaster-magic.js');

    expect($configAt)->not->toBeFalse()
        ->and($runtimeAt)->not->toBeFalse()
        ->and($configAt)->toBeLessThan($runtimeAt);
});

it('renders the toast call with its options object', function () {
    ToastMagic::success('Hello', 'World');

    $calls = toastCalls();

    expect($calls)->toHaveCount(1)
        ->and($calls[0]['type'])->toBe('success')
        ->and($calls[0]['options']['heading'])->toBe('Hello')
        ->and($calls[0]['options']['description'])->toBe('World');
});

it('loads only the shared runtime when Livewire is disabled', function () {
    config(['laravel-toaster-magic.livewire_enabled' => false]);

    expect(ToastMagic::scripts())
        ->toContain('js/laravel-toaster-magic.js')
        ->not->toContain('livewire-toaster-magic-v3.js');
});

it('loads the shared runtime plus the bridge when Livewire is enabled', function () {
    config(['laravel-toaster-magic.livewire_enabled' => true]);

    $html = ToastMagic::scripts();

    // Both builds share one runtime; Livewire only adds the event bridge.
    expect($html)
        ->toContain('js/laravel-toaster-magic.js')
        ->toContain('js/livewire-v3/livewire-toaster-magic-v3.js');

    expect(strpos($html, 'js/laravel-toaster-magic.js'))
        ->toBeLessThan(strpos($html, 'livewire-toaster-magic-v3.js'));
});

it('emits no toast script block when nothing is queued', function () {
    expect(ToastMagic::scripts())->not->toContain('setTimeout(');
});

it('collapses runs of blank lines but keeps the newlines', function () {
    ToastMagic::info("Line1\n\n\nLine2");

    // The runtime turns these into <br> elements after escaping.
    expect(toastCalls()[0]['options']['heading'])->toBe("Line1\nLine2");
});

it('normalizes carriage returns', function () {
    ToastMagic::info("Line1\r\nLine2");

    expect(toastCalls()[0]['options']['heading'])->toBe("Line1\nLine2");
});

it('staggers queued toasts by the configured delay', function () {
    config(['laravel-toaster-magic.options.stagger' => 400]);

    ToastMagic::success('one');
    ToastMagic::success('two');
    ToastMagic::success('three');

    $html = ToastMagic::scripts();

    expect($html)->toContain('},0);')
        ->toContain('},400);')
        ->toContain('},800);');
});

// ---------------------------------------------------------------------------
// Per-toast options
// ---------------------------------------------------------------------------

it('respects a per-message closeButton option', function () {
    ToastMagic::success('Hi', null, ['closeButton' => false]);

    expect(toastCalls()[0]['options']['showCloseBtn'])->toBeFalse();
});

it('respects the documented showCloseBtn option key', function () {
    // README has always documented `showCloseBtn`, but only `closeButton` was
    // read server-side, so the documented key silently did nothing.
    config(['laravel-toaster-magic.options.closeButton' => false]);

    ToastMagic::success('Hi', null, ['showCloseBtn' => true]);

    expect(toastCalls()[0]['options']['showCloseBtn'])->toBeTrue();
});

it('prefers showCloseBtn over closeButton when both are given', function () {
    ToastMagic::success('Hi', null, ['showCloseBtn' => false, 'closeButton' => true]);

    expect(toastCalls()[0]['options']['showCloseBtn'])->toBeFalse();
});

it('falls back to the global closeButton default', function () {
    config(['laravel-toaster-magic.options.closeButton' => true]);

    ToastMagic::success('Hi');

    expect(toastCalls()[0]['options']['showCloseBtn'])->toBeTrue();
});

it('passes the custom button text and link into the toast call', function () {
    ToastMagic::success('Hi', null, [
        'customBtnText' => 'View',
        'customBtnLink' => 'https://example.com',
    ]);

    $options = toastCalls()[0]['options'];

    expect($options['customBtnText'])->toBe('View')
        ->and($options['customBtnLink'])->toBe('https://example.com');
});

it('omits optional keys when they are not provided', function () {
    ToastMagic::success('Hi');

    $options = toastCalls()[0]['options'];

    expect($options)->not->toHaveKey('timeOut')
        ->and($options)->not->toHaveKey('showDuration')
        ->and($options)->not->toHaveKey('avatar')
        ->and($options)->not->toHaveKey('customBtnLink');
});

it('emits a per-toast timeOut override', function () {
    ToastMagic::success('Hi', null, ['timeOut' => 10000]);

    expect(toastCalls()[0]['options']['timeOut'])->toBe(10000);
});

it('emits a per-toast timeOut of zero for a persistent toast', function () {
    // 0 means "stay until dismissed" and must survive rather than being
    // treated as "not supplied".
    ToastMagic::success('Hi', null, ['timeOut' => 0]);

    expect(toastCalls()[0]['options'])->toHaveKey('timeOut')
        ->and(toastCalls()[0]['options']['timeOut'])->toBe(0);
});

it('emits a per-toast showDuration override', function () {
    ToastMagic::info('Hi', null, ['showDuration' => 50]);

    expect(toastCalls()[0]['options']['showDuration'])->toBe(50);
});

it('ignores a non-numeric duration override', function () {
    ToastMagic::info('Hi', null, ['timeOut' => 'soon']);

    expect(toastCalls()[0]['options'])->not->toHaveKey('timeOut');
});

it('emits the avatar URL in the toast call', function () {
    ToastMagic::info('New message', 'Hello there', [
        'avatar' => 'https://example.com/avatar.png',
    ]);

    expect(toastCalls()[0]['options']['avatar'])->toBe('https://example.com/avatar.png');
});

// ---------------------------------------------------------------------------
// Runtime config object
// ---------------------------------------------------------------------------

it('exposes the behaviour options to the front end', function () {
    $config = runtimeConfig();

    expect($config['pauseOnHover'])->toBeTrue()
        ->and($config['animation'])->toBe('default')
        ->and($config['escape_html'])->toBeTrue()
        ->and($config['timeOut'])->toBe(5000)
        ->and($config['showDuration'])->toBe(300)
        ->and($config['stagger'])->toBe(400)
        ->and($config['maxVisible'])->toBe(6);
});

it('exposes the accessibility labels to the front end', function () {
    $config = runtimeConfig();

    expect($config['closeButtonLabel'])->toBe('Close notification')
        ->and($config['containerLabel'])->toBe('Notifications');
});

it('exposes the resolved style variables', function () {
    expect(ToastMagic::scripts())
        ->toContain('window.toastMagicStyleVars')
        ->toContain('--tm-space-container');
});

it('emits an empty style-vars object when both sections are disabled', function () {
    config([
        'laravel-toaster-magic.options.spacing.enable' => false,
        'laravel-toaster-magic.options.typography.enable' => false,
    ]);

    expect(ToastMagic::scripts())->toContain('window.toastMagicStyleVars = {};');
});

// ---------------------------------------------------------------------------
// Vite / CSP
// ---------------------------------------------------------------------------

it('renders inline scripts as modules after useVite()', function () {
    ToastMagic::success('Hi');
    ToastMagic::useVite();

    expect(ToastMagic::scripts())->toContain('<script type="module"');
});

it('applies a CSP nonce to every inline script', function () {
    ToastMagic::success('Hi');
    ToastMagic::nonce('abc123');

    $html = ToastMagic::scripts();

    // Both inline blocks need the nonce, or the page half-works under a policy.
    expect(substr_count($html, 'nonce="abc123"'))->toBe(2);
});

it('applies a CSP nonce from config', function () {
    config(['laravel-toaster-magic.csp_nonce' => 'from-config']);

    expect(ToastMagic::scripts())->toContain('nonce="from-config"');
});

it('emits no nonce attribute when none is configured', function () {
    expect(ToastMagic::scripts())->not->toContain('nonce=');
});

it('returns the instance from useVite() and nonce() for chaining', function () {
    expect(ToastMagic::useVite())->toBeInstanceOf(ToastMagicService::class)
        ->and(ToastMagic::nonce('x'))->toBeInstanceOf(ToastMagicService::class);
});
