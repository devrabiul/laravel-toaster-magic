<?php

namespace Devrabiul\LaravelPhpInspector;

use Illuminate\Support\ServiceProvider;
use Devrabiul\LaravelPhpInspector\Commands\CheckCompatibilityCommand;

/**
 * Class LaravelPhpInspectorServiceProvider
 *
 * Service provider for the LaravelPhpInspector Laravel package.
 *
 * Handles bootstrapping of the package including:
 * - Setting up asset routes for package resources.
 * - Managing version-based asset publishing.
 * - Configuring processing directory detection.
 * - Registering package publishing commands.
 * - Registering the LaravelPhpInspector singleton.
 *
 * @package Devrabiul\LaravelPhpInspector
 */
class LaravelPhpInspectorServiceProvider extends ServiceProvider
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
        $this->registerCommands();
    }

    /**
     * Register commands in the format of Command::class
     */
    protected function registerCommands(): void
    {
         $this->commands([
             CheckCompatibilityCommand::class,
         ]);
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
            __DIR__ . '/config/laravel-php-inspector.php' => config_path('laravel-php-inspector.php'),
        ]);
    }

    /**
     * Register any application services.
     *
     * This method:
     * - Loads the package config file if not already loaded.
     * - Registers a singleton instance of the LaravelPhpInspector class in the Laravel service container.
     *
     * This allows other parts of the application to resolve the 'LaravelPhpInspector' service.
     *
     * @return void
     */
    public function register(): void
    {
        $configPath = config_path('laravel-php-inspector.php');

        if (!file_exists($configPath)) {
            config(['laravel-php-inspector' => require __DIR__ . '/config/laravel-php-inspector.php']);
        }

        $this->app->singleton('LaravelPhpInspector', function ($app) {
            return new LaravelPhpInspector($app['session'], $app['config']);
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
        return ['LaravelPhpInspector'];
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

        config(['laravel-php-inspector.system_processing_directory' => $systemProcessingDirectory]);
    }

}
