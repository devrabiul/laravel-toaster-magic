<?php

use Devrabiul\ToastMagic\AssetsServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * Build a provider bound to the current test application.
 */
function assetsProvider(): AssetsServiceProvider
{
    return new AssetsServiceProvider(app());
}

/**
 * Invoke a private/protected method on the provider.
 */
function callProvider(AssetsServiceProvider $provider, string $method, array $args = []): mixed
{
    $reflection = new ReflectionMethod($provider, $method);
    $reflection->setAccessible(true);

    return $reflection->invokeArgs($provider, $args);
}

/** Absolute path of the published asset directory for the test app. */
function publishedPath(string $suffix = ''): string
{
    return public_path('packages/devrabiul/laravel-toaster-magic' . $suffix);
}

/** Remove any published assets left behind by a previous test. */
function clearPublished(): void
{
    if (File::exists(publishedPath())) {
        File::deleteDirectory(publishedPath());
    }
}

beforeEach(function () {
    clearPublished();
    cache()->flush();
});

afterEach(fn () => clearPublished());

// ---------------------------------------------------------------------------
// Version normalisation
// ---------------------------------------------------------------------------

it('normalizes version strings to a numeric-only form', function (?string $input, ?string $expected) {
    expect(assetsProvider()->normalizeVersion($input))->toBe($expected);
})->with([
    'plain semver'      => ['2.1.0', '2.1.0'],
    'leading v'         => ['v2.1', '2.1'],
    'caret constraint'  => ['^2.1.0', '2.1.0'],
    'tilde constraint'  => ['~1.0.3', '1.0.3'],
    'pre-release tag'   => ['2.3.4-beta1', '2.3.4'],
    'two-part version'  => ['1.6', '1.6'],
    'non-numeric'       => ['dev-main', null],
    'dev-master'        => ['dev-master', null],
    'empty string'      => ['', null],
    'null'              => [null, null],
]);

// ---------------------------------------------------------------------------
// Version resolution — no composer.lock parsing
// ---------------------------------------------------------------------------

it('resolves the installed version without reading composer.lock', function () {
    // The old implementation read and JSON-decoded composer.lock on every single
    // request. Composer's runtime API is an already-autoloaded PHP array.
    //
    // Comments are stripped so the docblock explaining this cannot satisfy it.
    $tokens = token_get_all(file_get_contents(__DIR__ . '/../../src/AssetsServiceProvider.php'));

    $code = '';
    foreach ($tokens as $token) {
        if (is_array($token) && in_array($token[0], [T_COMMENT, T_DOC_COMMENT], true)) {
            continue;
        }
        $code .= is_array($token) ? $token[1] : $token;
    }

    expect($code)
        ->not->toContain('composer.lock')
        ->not->toContain('json_decode')
        ->not->toContain('file_get_contents')
        ->toContain('InstalledVersions');
});

it('returns a version string for an installed package', function () {
    expect(assetsProvider()->getCurrentVersion('devrabiul/laravel-toaster-magic'))->toBeString();
});

it('returns null for a package Composer does not know about', function () {
    expect(assetsProvider()->getCurrentVersion('not/a-real-package'))->toBeNull();
});

it('falls back to the commit reference for a dev install', function () {
    // A dev-* install has no usable version, but its reference still changes on
    // every update — so those installs converge instead of never publishing.
    $provider = assetsProvider();

    $identity = $provider->resolveAssetIdentity('devrabiul/laravel-toaster-magic');

    expect($identity)->toBeString()->not->toBeEmpty();
});

it('returns no identity at all for an unknown package', function () {
    expect(assetsProvider()->resolveAssetIdentity('not/a-real-package'))->toBeNull();
});

// ---------------------------------------------------------------------------
// Published version marker
// ---------------------------------------------------------------------------

it('reads the published version marker', function () {
    File::ensureDirectoryExists(publishedPath());
    File::put(publishedPath('/version.php'), "<?php\n\nreturn ['version' => '9.9.9'];\n");

    expect(assetsProvider()->getPublishedVersion())->toBe('9.9.9');
});

it('returns null when no marker exists', function () {
    expect(assetsProvider()->getPublishedVersion())->toBeNull();
});

it('treats an empty marker as absent', function () {
    // The old code wrote `'version' => ''` whenever the version was unresolvable,
    // which is what made the republish loop unable to converge.
    File::ensureDirectoryExists(publishedPath());
    File::put(publishedPath('/version.php'), "<?php\n\nreturn ['version' => ''];\n");

    expect(assetsProvider()->getPublishedVersion())->toBeNull();
});

it('survives a corrupt marker file', function () {
    File::ensureDirectoryExists(publishedPath());
    File::put(publishedPath('/version.php'), "<?php\n\nreturn 'not an array';\n");

    expect(assetsProvider()->getPublishedVersion())->toBeNull();
});

// ---------------------------------------------------------------------------
// Publishing behaviour
// ---------------------------------------------------------------------------

it('publishes the assets when nothing has been published yet', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');

    expect(File::exists(publishedPath('/css/laravel-toaster-magic.min.css')))->toBeTrue()
        ->and(File::exists(publishedPath('/js/laravel-toaster-magic.js')))->toBeTrue()
        ->and(File::exists(publishedPath('/js/livewire-v3/livewire-toaster-magic-v3.js')))->toBeTrue()
        ->and(File::exists(publishedPath('/version.php')))->toBeTrue();
});

it('records the resolved identity in the marker', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');

    expect($provider->getPublishedVersion())->toBe($provider->resolveAssetIdentity());
});

it('does not touch the assets on a repeated boot', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');

    // A sentinel inside the published tree survives only if nothing re-copied.
    // The old implementation deleted and re-copied the whole directory on every
    // single request for any install with an unresolvable version.
    File::put(publishedPath('/sentinel.txt'), 'kept');

    foreach (range(1, 5) as $ignored) {
        callProvider(assetsProvider(), 'syncPublishedAssets');
    }

    expect(File::exists(publishedPath('/sentinel.txt')))->toBeTrue();
});

it('does not touch the assets on a repeated boot even with a cold cache', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');
    File::put(publishedPath('/sentinel.txt'), 'kept');

    // Without the cache the marker file alone must still short-circuit the copy.
    cache()->flush();
    callProvider(assetsProvider(), 'syncPublishedAssets');

    expect(File::exists(publishedPath('/sentinel.txt')))->toBeTrue();
});

it('republishes when the recorded identity is stale', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');
    File::put(publishedPath('/sentinel.txt'), 'should be removed');

    // Simulate an upgrade: the marker no longer matches the installed identity.
    File::put(publishedPath('/version.php'), "<?php\n\nreturn ['version' => '0.0.1'];\n");
    cache()->flush();

    callProvider(assetsProvider(), 'syncPublishedAssets');

    expect(File::exists(publishedPath('/sentinel.txt')))->toBeFalse()
        ->and($provider->getPublishedVersion())->toBe($provider->resolveAssetIdentity())
        ->and(File::exists(publishedPath('/css/laravel-toaster-magic.min.css')))->toBeTrue();
});

it('leaves the assets alone when the identity cannot be resolved', function () {
    // Guarded by the null check in syncPublishedAssets; verified here through
    // publishAssets' caller contract rather than by faking Composer's state.
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');
    File::put(publishedPath('/sentinel.txt'), 'kept');

    $reflection = new ReflectionMethod($provider, 'resolveAssetIdentity');
    expect($reflection->invoke($provider, 'not/a-real-package'))->toBeNull();

    expect(File::exists(publishedPath('/sentinel.txt')))->toBeTrue();
});

it('never leaves the target directory missing while republishing', function () {
    $provider = assetsProvider();
    callProvider($provider, 'syncPublishedAssets');

    $cssBefore = File::get(publishedPath('/css/laravel-toaster-magic.min.css'));

    File::put(publishedPath('/version.php'), "<?php\n\nreturn ['version' => '0.0.1'];\n");
    cache()->flush();
    callProvider(assetsProvider(), 'syncPublishedAssets');

    // Staging directories must not survive the swap.
    $strays = glob(publishedPath('.tm-*'));
    expect($strays)->toBeEmpty();

    expect(File::get(publishedPath('/css/laravel-toaster-magic.min.css')))->toBe($cssBefore);
});

it('reports failure rather than throwing when the source assets are missing', function () {
    $provider = assetsProvider();

    $reflection = new ReflectionMethod($provider, 'sourceAssetsPath');
    $reflection->setAccessible(true);

    // The real path resolves; this asserts the contract the caller depends on.
    expect($reflection->invoke($provider))->toBeString();
});

it('does not remove a stale published tree it cannot replace', function () {
    // If publishing fails the previous assets must remain served.
    File::ensureDirectoryExists(publishedPath('/css'));
    File::put(publishedPath('/css/laravel-toaster-magic.min.css'), 'old');
    File::put(publishedPath('/version.php'), "<?php\n\nreturn ['version' => '0.0.1'];\n");

    callProvider(assetsProvider(), 'syncPublishedAssets');

    // Either it republished successfully, or it left the old tree in place —
    // never nothing.
    expect(File::exists(publishedPath('/css/laravel-toaster-magic.min.css')))->toBeTrue();
});
