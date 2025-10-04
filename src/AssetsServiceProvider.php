<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

/**
 * Class AssetsServiceProvider
 *
 * Service provider for the ToastMagic Laravel package.
 *
 * Handles bootstrapping of the package including
 * - Setting up asset routes for package resources.
 * - Managing version-based asset publishing.
 * - Configuring processing directory detection.
 * - Registering package publishing commands.
 *
 * @package Devrabiul\ToastMagic
 */
class AssetsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any package services.
     *
     * This method is called after all other services have been registered,
     * allowing you to perform actions like route registration, publishing assets,
     * and configuration adjustments.
     *
     * It:
     * - Sets the system processing directory config value.
     * - Defines a route for serving package assets in development or fallback.
     * - Handles version-based asset publishing, replacing assets if a package version changed.
     * - Registers publishable resources when running in console.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->handleVersionedPublishing(name: 'devrabiul/laravel-toaster-magic');
    }

    /**
     * Register any application services.
     *
     * This method:
     * - Loads the package config file if not already loaded.
     * - Registers a singleton instance of the ToastMagic class in the Laravel service container.
     *
     * This allows other parts of the application to resolve the 'ToastMagic' service.
     *
     * @return void
     */
    public function register(): void
    {
        //
    }

    /**
     * Get the current installed version of the package from composer.lock.
     *
     *
     * Returns null if:
     * - composer.lock does not exist
     * - package is not found in composer.lock
     *
     * @return string|null Version string of the installed package, e.g. "1.0.1" or null if unavailable.
     */
    private function getCurrentVersion($name): ?string
    {
        $lockFile = base_path('composer.lock');
        if (!file_exists($lockFile)) {
            return null;
        }

        $lockData = json_decode(file_get_contents($lockFile), true);
        $packages = $lockData['packages'] ?? [];

        foreach ($packages as $package) {
            if ($package['name'] === $name) {
                return $package['version'];
            }
        }

        return null;
    }

    /**
     * Get the version recorded in the published version.php file.
     *
     * If the file exists and returns an array with a 'version' key,
     * that version string is returned.
     *
     * Returns null if the file does not exist or does not contain a version.
     *
     * @return string|null Previously published version string or null if none found.
     */
    private function getPublishedVersion($name): ?string
    {
        $versionFile = public_path('packages/'.$name.'/version.php');
        if (!File::exists($versionFile)) {
            return null;
        }
        $versionData = include $versionFile;
        return $versionData['version'] ?? null;
    }

    /**
     * Publish the assets if the current package version differs from the published version.
     *
     * This method performs the following steps:
     * - Retrieves the current installed package version.
     * - Retrieves the previously published version from the public directory.
     * - If versions differ (or no published version exists), deletes the existing asset folder.
     * - Copies the new assets from the package's `assets` directory to the public packages folder.
     * - Writes/updates the version.php file in the public folder with the current version.
     *
     * This ensures the public assets are always in sync with the installed package version.
     *
     * @param string|null $name
     * @return void
     */
    private function handleVersionedPublishing(?string $name): void
    {
        $currentVersionRaw = $this->getCurrentVersion(name: $name);
        $publishedVersionRaw = $this->getPublishedVersion(name: $name);

        $currentVersion = $this->normalizeVersion($currentVersionRaw);
        $publishedVersion = $this->normalizeVersion($publishedVersionRaw);

        if ((is_null($currentVersion) && is_null($publishedVersion)) || ($currentVersion && $currentVersion !== $publishedVersion)) {
            $assetsPath = public_path('packages/' . $name);
            $sourceAssets = base_path('vendor/' . $name . '/assets');

            // Ensure source assets exist before proceeding
            if (!File::exists($sourceAssets)) {
                return;
            }

            // Delete and re-create the target directory
            if (File::exists($assetsPath)) {
                File::deleteDirectory($assetsPath);
            }

            File::ensureDirectoryExists($assetsPath);
            File::copyDirectory($sourceAssets, $assetsPath);

            // Create version.php file with the current version
            $versionPhpContent = "<?php\n\nreturn [\n    'version' => '{$currentVersion}',\n];\n";
            File::put(public_path('packages/' . $name . '/version.php'), $versionPhpContent);
        }
    }

    /**
     * Normalize version to numeric-only format (e.g., strip ^, v, ~).
     *
     * @param string|null $version
     * @return string|null
     */
    private function normalizeVersion(?string $version): ?string
    {
        if (!$version) {
            return null;
        }

        // Match numeric versions like 1.0.0, 1.1, 2.3.4-beta1 etc.
        if (preg_match('/\d+\.\d+(?:\.\d+)?/', $version, $matches)) {
            return $matches[0];
        }

        return null;
    }

}
