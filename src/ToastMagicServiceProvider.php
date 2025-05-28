<?php

namespace Devrabiul\ToastMagic;

use Exception;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class ToastMagicServiceProvider
 *
 * Service provider for the ToastMagic Laravel package.
 *
 * Handles bootstrapping of the package including:
 * - Setting up asset routes for package resources.
 * - Managing version-based asset publishing.
 * - Configuring processing directory detection.
 * - Registering package publishing commands.
 * - Registering the ToastMagic singleton.
 *
 * @package Devrabiul\ToastMagic
 */
class ToastMagicServiceProvider extends ServiceProvider
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
     * - Handles version-based asset publishing, replacing assets if package version changed.
     * - Registers publishable resources when running in console.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->updateProcessingDirectoryConfig();
        $this->updateProcessingAssetRoutes();
        $this->handleVersionedPublishing();

        if ($this->app->runningInConsole()) {
            $this->registerPublishing();
        }
    }

    /**
     * Register the package's publishable resources.
     *
     * This method registers:
     * - Configuration file publishing to the application's config directory.
     * - Asset publishing to the public vendor directory, replacing old assets if found.
     *
     * It is typically called when the application is running in console mode
     * to enable artisan vendor:publish commands.
     *
     * @return void
     */
    private function registerPublishing(): void
    {
        $this->publishes([
            __DIR__ . '/config/laravel-toaster-magic.php' => config_path('laravel-toaster-magic.php'),
        ], 'toastmagic-config');

        $sourceAssets = __DIR__ . '/../assets';
        $publicAssets = public_path('vendor/devrabiul/laravel-toaster-magic');

        if (File::exists($publicAssets)) {
            File::deleteDirectory($publicAssets);
            Log::info("[ToastMagic] Old assets deleted.");
        }

        if (File::exists($sourceAssets)) {
            File::copyDirectory($sourceAssets, $publicAssets);
            Log::info("[ToastMagic] Assets copied successfully.");
        }
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
        $configPath = config_path('laravel-toaster-magic.php');

        if (!file_exists($configPath)) {
            config(['laravel-toaster-magic' => require __DIR__ . '/config/laravel-toaster-magic.php']);
        }

        $this->app->singleton('ToastMagic', function ($app) {
            return new ToastMagic($app['session'], $app['config']);
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * This method is used by Laravel's deferred providers mechanism
     * and lists the services that this provider registers.
     *
     * @return array<string> Array of service container binding keys provided by this provider.
     */
    public function provides(): array
    {
        return ['ToastMagic'];
    }

    /**
     * Define a route to serve package asset files for development or fallback.
     *
     * This route handles requests to '/vendor/laravel-toaster-magic/assets/{path}'
     * and attempts to serve the matching asset from the package's internal assets directory.
     *
     * It determines the proper MIME type for common asset extensions
     * and adds CORS headers allowing access from any origin.
     *
     * If the requested asset file does not exist, a 404 HTTP response is returned.
     *
     * @return void
     */
    private function updateProcessingAssetRoutes(): void
    {
        Route::get('/vendor/laravel-toaster-magic/assets/{path}', function ($path) {
            $file = __DIR__ . '/../assets/' . $path;

            if (!file_exists($file)) {
                abort(404);
            }

            $extension = pathinfo($file, PATHINFO_EXTENSION);

            $mimeTypes = [
                'css'   => 'text/css',
                'js'    => 'application/javascript',
                'png'   => 'image/png',
                'jpg'   => 'image/jpeg',
                'jpeg'  => 'image/jpeg',
                'gif'   => 'image/gif',
                'svg'   => 'image/svg+xml',
                'woff'  => 'font/woff',
                'woff2' => 'font/woff2',
                'ttf'   => 'font/ttf',
                'otf'   => 'font/otf',
                'eot'   => 'application/vnd.ms-fontobject',
                'json'  => 'application/json',
                'ico'   => 'image/x-icon',
            ];

            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

            return Response::file($file, [
                'Content-Type' => $mimeType,
                'Access-Control-Allow-Origin' => '*',
            ]);
        })->where('path', '.*');
    }

    /**
     * Determine and set the 'system_processing_directory' configuration value.
     *
     * This detects if the current PHP script is being executed from the public directory
     * or the project root directory, or neither, and sets a config value accordingly:
     *
     * - 'public' if script path equals public_path()
     * - 'root' if script path equals base_path()
     * - 'unknown' otherwise
     *
     * This config can be used internally to adapt asset loading or paths.
     *
     * @return void
     */
    private function updateProcessingDirectoryConfig(): void
    {
        $scriptPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
        $basePath   = realpath(base_path());
        $publicPath = realpath(public_path());

        if ($scriptPath === $publicPath) {
            $systemProcessingDirectory = 'public';
        } elseif ($scriptPath === $basePath) {
            $systemProcessingDirectory = 'root';
        } else {
            $systemProcessingDirectory = 'unknown';
        }

        config(['laravel-toaster-magic.system_processing_directory' => $systemProcessingDirectory]);
    }

    /**
     * Get the current installed version of the package from composer.lock.
     *
     * Reads and parses the composer.lock file located at the project root,
     * searches for the package 'devrabiul/laravel-toaster-magic',
     * and returns the version string if found.
     *
     * Returns null if:
     * - composer.lock does not exist
     * - package is not found in composer.lock
     *
     * @return string|null Version string of the installed package, e.g. "1.0.1" or null if unavailable.
     */
    private function getCurrentVersion(): ?string
    {
        $lockFile = base_path('composer.lock');
        if (!file_exists($lockFile)) {
            return null;
        }

        $lockData = json_decode(file_get_contents($lockFile), true);
        $packages = $lockData['packages'] ?? [];

        foreach ($packages as $package) {
            if ($package['name'] === 'devrabiul/laravel-toaster-magic') {
                return $package['version'];
            }
        }

        return null;
    }

    /**
     * Get the version recorded in the published version.php file.
     *
     * This file is expected to be located at:
     * `public/vendor/devrabiul/laravel-toaster-magic/version.php`
     *
     * If the file exists and returns an array with a 'version' key,
     * that version string is returned.
     *
     * Returns null if the file does not exist or does not contain a version.
     *
     * @return string|null Previously published version string or null if none found.
     */
    private function getPublishedVersion(): ?string
    {
        $versionFile = public_path('vendor/devrabiul/laravel-toaster-magic/version.php');

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
     * - If versions differ (or no published version exists), deletes the existing assets folder.
     * - Copies the new assets from the package's `assets` directory to the public vendor folder.
     * - Writes/updates the version.php file in the public folder with the current version.
     *
     * This ensures the public assets are always in sync with the installed package version.
     *
     * @return void
     */
    private function handleVersionedPublishing(): void
    {
        $currentVersion = $this->getCurrentVersion();
        $publishedVersion = $this->getPublishedVersion();

        if ($currentVersion && $currentVersion !== $publishedVersion) {
            $assetsPath = public_path('vendor/devrabiul/laravel-toaster-magic');
            $sourceAssets = __DIR__ . '/../assets';

            // Remove old assets if they exist
            if (File::exists($assetsPath)) {
                File::deleteDirectory($assetsPath);
            }

            // Copy new assets from package directory to public directory
            File::copyDirectory($sourceAssets, $assetsPath);

            // Write new version.php file with the current version
            $versionPhpContent = "<?php\n\nreturn [\n    'version' => '{$currentVersion}',\n];\n";
            File::put($assetsPath . '/version.php', $versionPhpContent);
        }
    }
}
