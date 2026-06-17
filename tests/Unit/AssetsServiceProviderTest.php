<?php

use Devrabiul\ToastMagic\AssetsServiceProvider;

/**
 * Invoke the private normalizeVersion() helper via reflection.
 */
function normalizeVersion(?string $version): ?string
{
    $provider = new AssetsServiceProvider(app());

    $method = new ReflectionMethod($provider, 'normalizeVersion');
    $method->setAccessible(true);

    return $method->invoke($provider, $version);
}

it('normalizes version strings to a numeric-only form', function (?string $input, ?string $expected) {
    expect(normalizeVersion($input))->toBe($expected);
})->with([
    'plain semver'      => ['2.1.0', '2.1.0'],
    'leading v'         => ['v2.1', '2.1'],
    'caret constraint'  => ['^2.1.0', '2.1.0'],
    'tilde constraint'  => ['~1.0.3', '1.0.3'],
    'pre-release tag'   => ['2.3.4-beta1', '2.3.4'],
    'two-part version'  => ['1.6', '1.6'],
    'non-numeric'       => ['dev-main', null],
    'null'              => [null, null],
]);
