<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Support\ServiceProvider;

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
        $this->app->register(AssetsServiceProvider::class);

        if ($this->app->runningInConsole()) {
            $this->registerPublishing();
        }
    }

    /**
     * Register the package's publishable resources.
     *
     * This method registers:
     * - Configuration file publishing to the application's config directory.
     * - Asset publishing to the public packages directory, replacing old assets if found.
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
        ]);
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

}
