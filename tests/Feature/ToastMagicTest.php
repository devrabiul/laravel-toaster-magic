<?php

use Devrabiul\ToastMagic\Facades\ToastMagic;
use Devrabiul\ToastMagic\ToastMagic as ToastMagicService;

const MESSAGES_KEY = 'laravel-toaster-magic::messages';

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

it('flattens a MessageBag into <br>-separated text', function () {
    $bag = new Illuminate\Support\MessageBag([
        'email' => ['Email is required', 'Email is invalid'],
    ]);

    ToastMagic::error($bag);

    expect(session(MESSAGES_KEY)[0]['message'])->toBe('Email is required<br>Email is invalid');
});

it('accepts a MessageBag for every toast type without a TypeError', function (string $type) {
    $bag = new Illuminate\Support\MessageBag(['field' => ['Something went wrong']]);

    ToastMagic::{$type}($bag);

    expect(session(MESSAGES_KEY)[0]['message'])->toBe('Something went wrong');
})->with(['success', 'info', 'warning', 'error']);

it('renders a stylesheet link tag', function () {
    expect(ToastMagic::styles())
        ->toContain('<link rel="stylesheet"')
        ->toContain('laravel-toaster-magic.min.css');
});

it('renders the toast call and config in the scripts output', function () {
    ToastMagic::success('Hello', 'World');

    $html = ToastMagic::scripts();

    expect($html)
        ->toContain('window.toastMagicConfig')
        ->toContain('toastMagic.success(')
        ->toContain('"Hello"')
        ->toContain('"World"');
});

it('collapses multiple consecutive newlines and converts them to <br>', function () {
    ToastMagic::info("Line1\n\n\nLine2");

    expect(ToastMagic::scripts())->toContain('Line1<br>Line2');
});

it('respects a per-message closeButton option in the scripts output', function () {
    ToastMagic::success('Hi', null, ['closeButton' => false]);

    expect(ToastMagic::scripts())->toContain('toastMagic.success("Hi", "", false,');
});

it('passes the custom button text and link into the toast call', function () {
    ToastMagic::success('Hi', null, [
        'customBtnText' => 'View',
        'customBtnLink' => 'https://example.com',
    ]);

    expect(ToastMagic::scripts())
        ->toContain('"View"')
        ->toContain('https:\/\/example.com');
});

it('emits null durations and an empty avatar when no overrides are provided', function () {
    ToastMagic::success('Hi');

    // Trailing positional args: timeOut, showDuration, avatar.
    expect(ToastMagic::scripts())->toContain(', null, null, "");');
});

it('emits a per-toast timeOut override in the scripts output', function () {
    ToastMagic::success('Hi', null, ['timeOut' => 10000]);

    expect(ToastMagic::scripts())->toContain(', 10000, null, "");');
});

it('emits a per-toast showDuration override in the scripts output', function () {
    ToastMagic::info('Hi', null, ['showDuration' => 50]);

    expect(ToastMagic::scripts())->toContain(', null, 50, "");');
});

it('exposes the pauseOnHover config to the front end', function () {
    ToastMagic::info('Hi');

    expect(ToastMagic::scripts())->toContain('"pauseOnHover":true');
});

it('exposes the animation config to the front end', function () {
    ToastMagic::info('Hi');

    expect(ToastMagic::scripts())->toContain('"animation":"default"');
});

it('emits the avatar URL in the toast call', function () {
    ToastMagic::info('New message', 'Hello there', [
        'avatar' => 'https://example.com/avatar.png',
    ]);

    expect(ToastMagic::scripts())->toContain('https:\/\/example.com\/avatar.png');
});
