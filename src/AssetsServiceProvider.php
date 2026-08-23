<?php

namespace Devrabiul\ToastMagic;

use Composer\InstalledVersions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Throwable;

/**
 * Class AssetsServiceProvider
 *
 * Keeps the package's published assets in `public/packages/...` in step with the
 * installed package version.
 *
 * The guiding constraint is that this runs on every request, so the common case
 * — assets already current — must cost as close to nothing as possible, and the
 * uncommon case must never leave the public directory in a broken state.
 *
 * @package Devrabiul\ToastMagic
 */
class AssetsServiceProvider extends ServiceProvider
{
    /**
     * Composer package name, used for both the version lookup and the public path.
     */
    private const PACKAGE = 'devrabiul/laravel-toaster-magic';

    /**
     * Cache key prefix for the "assets for version X are published" marker.
     */
    private const CACHE_PREFIX = 'toast_magic_published_version_';

    /**
     * Bootstrap the provider.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->syncPublishedAssets();
    }

    /**
     * Register any application services.
     *
     * This provider contributes no container bindings; it exists purely for the
     * asset-sync side effect in {@see boot()}.
     *
     * @return void
     */
    public function register(): void
    {
        //
    }

    /**
     * Resolve the installed version of this package.
     *
     * Uses Composer's generated runtime API, which reads an already-autoloaded
     * PHP array — no file I/O and no JSON parsing. `composer.lock` is never read
     * on a normal request.
     *
     * @return string|null Raw version string, or null when it cannot be resolved.
     */
    public function getCurrentVersion(?string $name = null): ?string
    {
        $name ??= self::PACKAGE;

        try {
            if (class_exists(InstalledVersions::class) && InstalledVersions::isInstalled($name)) {
                return InstalledVersions::getPrettyVersion($name);
            }
        } catch (Throwable) {
            // Fall through: Composer's runtime API is unavailable or the package
            // is not registered with it (e.g. the package's own test suite).
        }

        return null;
    }

    /**
     * Read the version recorded alongside the currently published assets.
     *
     * @param string|null $name
     * @return string|null
     */
    public function getPublishedVersion(?string $name = null): ?string
    {
        $name ??= self::PACKAGE;
        $versionFile = public_path('packages/' . $name . '/version.php');

        if (!File::exists($versionFile)) {
            return null;
        }

        try {
            $versionData = include $versionFile;
        } catch (Throwable) {
            return null;
        }

        return is_array($versionData) && isset($versionData['version']) && $versionData['version'] !== ''
            ? (string)$versionData['version']
            : null;
    }

    /**
     * A stable identity for the installed copy of this package.
     *
     * Tagged releases identify as their numeric version. A `dev-*` install has
     * no meaningful version, so it identifies by its commit reference instead —
     * which still changes on every update, so those installs get fresh assets
     * without the package having to guess.
     *
     * Returns null only when Composer can tell us nothing at all, in which case
     * the assets are left alone entirely.
     */
    public function resolveAssetIdentity(?string $name = null): ?string
    {
        $name ??= self::PACKAGE;

        $version = $this->normalizeVersion($this->getCurrentVersion($name));

        if ($version !== null) {
            return $version;
        }

        try {
            if (class_exists(InstalledVersions::class) && InstalledVersions::isInstalled($name)) {
                $reference = InstalledVersions::getReference($name);

                if (is_string($reference) && $reference !== '') {
                    return 'dev-' . substr($reference, 0, 12);
                }
            }
        } catch (Throwable) {
            // Nothing further to try.
        }

        return null;
    }

    /**
     * Publish the assets when — and only when — the installed copy differs from
     * what is currently on disk.
     *
     * The identity comes from Composer's in-memory runtime API and the "already
     * published" answer is cached, so a warm request performs no filesystem work
     * at all.
     *
     * The critical property is convergence. The previous implementation treated
     * "I cannot determine the version" as "republish everything", then wrote a
     * marker that was itself unresolvable — so every request deleted and re-copied
     * the whole asset directory, forever, and concurrent requests served 404s for
     * the package's own CSS out of the gap. Now an unknown identity publishes
     * nothing, and a known one publishes exactly once.
     *
     * @return void
     */
    private function syncPublishedAssets(): void
    {
        $identity = $this->resolveAssetIdentity();

        // Composer knows nothing about this install. Leave the existing assets
        // untouched; `vendor:publish --tag=toast-magic-assets --force` is the
        // supported path for these setups.
        if ($identity === null) {
            return;
        }

        $cacheKey = self::CACHE_PREFIX . md5(self::PACKAGE . '|' . $identity);

        // Fast path: a warm cache means the assets were already published for
        // this exact identity, so there is nothing to stat, read or copy.
        if ($this->cacheHas($cacheKey)) {
            return;
        }

        if ($this->getPublishedVersion() === $identity) {
            $this->cacheRemember($cacheKey);
            return;
        }

        if ($this->publishAssets($identity)) {
            $this->cacheRemember($cacheKey);
        }
    }

    /**
     * Copy the package assets into the public directory without ever leaving it
     * missing.
     *
     * The new tree is built in a sibling staging directory and swapped into
     * place with renames. A concurrent request therefore sees either the old
     * complete tree or the new complete tree — never a half-deleted one, which
     * is what produced intermittent 404s for the package's own CSS and JS.
     *
     * @param string $identity The resolved asset identity being published.
     * @return bool Whether the assets were published.
     */
    private function publishAssets(string $identity): bool
    {
        $sourceAssets = $this->sourceAssetsPath();

        if ($sourceAssets === null) {
            return false;
        }

        $target = public_path('packages/' . self::PACKAGE);
        $suffix = '.tm-' . substr(md5($identity . '|' . getmypid()), 0, 8);
        $staging = $target . $suffix . '.new';
        $retired = $target . $suffix . '.old';

        try {
            if (File::exists($staging)) {
                File::deleteDirectory($staging);
            }

            File::ensureDirectoryExists($staging);

            if (!File::copyDirectory($sourceAssets, $staging)) {
                File::deleteDirectory($staging);
                return false;
            }

            File::put(
                $staging . '/version.php',
                "<?php\n\nreturn [\n    'version' => '" . $identity . "',\n];\n"
            );

            File::ensureDirectoryExists(dirname($target));

            // Swap: move the live tree aside, move the new one in, then bin the
            // old one. Both moves are renames within the same directory.
            $hadExisting = File::exists($target);
            if ($hadExisting && !@rename($target, $retired)) {
                File::deleteDirectory($staging);
                return false;
            }

            if (!@rename($staging, $target)) {
                // Put the original back rather than leaving nothing in place.
                if ($hadExisting) {
                    @rename($retired, $target);
                }
                File::deleteDirectory($staging);
                return false;
            }

            if ($hadExisting && File::exists($retired)) {
                File::deleteDirectory($retired);
            }

            return true;
        } catch (Throwable) {
            // Never let an asset-publishing problem take down the application.
            foreach ([$staging, $retired] as $leftover) {
                if (File::exists($leftover)) {
                    File::deleteDirectory($leftover);
                }
            }

            return false;
        }
    }

    /**
     * Locate the package's own `assets` directory.
     *
     * Resolved relative to this file so it works for a Composer install, a path
     * repository and the package's own test suite alike.
     *
     * @return string|null
     */
    private function sourceAssetsPath(): ?string
    {
        $candidates = [
            dirname(__DIR__) . '/assets',
            base_path('vendor/' . self::PACKAGE . '/assets'),
        ];

        foreach ($candidates as $candidate) {
            if (File::isDirectory($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Normalize a version to a numeric-only form (e.g. strip ^, v, ~).
     *
     * Returns null for anything without a numeric version — `dev-main`,
     * `dev-master` and branch aliases included. Callers treat null as
     * "don't touch the published assets".
     *
     * @param string|null $version
     * @return string|null
     */
    public function normalizeVersion(?string $version): ?string
    {
        if ($version === null || $version === '') {
            return null;
        }

        if (preg_match('/\d+\.\d+(?:\.\d+)?/', $version, $matches)) {
            return $matches[0];
        }

        return null;
    }

    /**
     * Whether the given cache key is set, tolerating an unavailable cache store.
     */
    private function cacheHas(string $key): bool
    {
        try {
            return (bool)Cache::get($key, false);
        } catch (Throwable) {
            // Cache unavailable (e.g. the database driver before migrations run).
            return false;
        }
    }

    /**
     * Record that the current version's assets are published.
     */
    private function cacheRemember(string $key): void
    {
        try {
            Cache::forever($key, true);
        } catch (Throwable) {
            // Without a cache the version file still short-circuits the copy;
            // this only costs one extra stat per request.
        }
    }
}
