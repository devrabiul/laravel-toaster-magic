<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Throwable;

/**
 * Class ToastMagicServiceProvider
 *
 * Service provider for the ToastMagic Laravel package.
 *
 * Responsibilities:
 * - Merge the package configuration with any published copy.
 * - Register the ToastMagic singleton.
 * - Register the publishable config and asset groups.
 * - Detect whether the application is served from `public/` or the project root.
 *
 * @package Devrabiul\ToastMagic
 */
class ToastMagicServiceProvider extends ServiceProvider
{
    /**
     * Absolute path to the package's default configuration file.
     */
    private const CONFIG_PATH = __DIR__ . '/config/laravel-toaster-magic.php';

    /**
     * Bootstrap any package services.
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
     * Both groups are tagged so they can be published individually:
     *
     *   php artisan vendor:publish --tag=toast-magic-config
     *   php artisan vendor:publish --tag=toast-magic-assets --force
     *
     * The asset tag in particular has been documented as the upgrade step for
     * several releases without actually existing; it does now.
     *
     * @return void
     */
    private function registerPublishing(): void
    {
        $this->publishes([
            self::CONFIG_PATH => config_path('laravel-toaster-magic.php'),
        ], 'toast-magic-config');

        $this->publishes([
            dirname(__DIR__) . '/assets' => public_path('packages/devrabiul/laravel-toaster-magic'),
        ], 'toast-magic-assets');

        // Publishing with no tag keeps the historical behavior of writing the
        // config file, so existing `--provider=...` instructions still work.
        $this->publishes([
            self::CONFIG_PATH => config_path('laravel-toaster-magic.php'),
        ]);
    }

    /**
     * Register any application services.
     *
     * `mergeConfigFrom()` replaces the previous "load defaults only when no
     * published config exists" behavior. That approach meant a config file
     * published before an option was introduced never received that option's
     * default, so every release that added an option silently changed behavior
     * for anyone who had published their config.
     *
     * Note that the merge is shallow, which is why {@see ToastMagic} resolves
     * nested `options` keys against the packaged defaults as well.
     *
     * @return void
     */
    public function register(): void
    {
        $this->mergeConfigFrom(self::CONFIG_PATH, 'laravel-toaster-magic');

        $this->app->singleton('ToastMagic', function ($app) {
            return new ToastMagic($app['session'], $app['config']);
        });

        $this->app->alias('ToastMagic', ToastMagic::class);
    }

    /**
     * Determine and set the 'system_processing_directory' configuration value.
     *
     * Detects whether the entry script lives in the application's public
     * directory, its base directory, or somewhere else entirely:
     *
     * - 'public'  when the script path equals public_path()
     * - 'root'    when the script path equals base_path()
     * - 'unknown' otherwise
     *
     * @return void
     */
    private function updateProcessingDirectoryConfig(): void
    {
        $script = $_SERVER['SCRIPT_FILENAME'] ?? getcwd() ?: '';

        $compute = function () use ($script) {
            $scriptPath = realpath(dirname($script));
            $basePath = realpath(base_path());
            $publicPath = realpath(public_path());

            if ($scriptPath !== false && $scriptPath === $publicPath) {
                return 'public';
            }

            if ($scriptPath !== false && $scriptPath === $basePath) {
                return 'root';
            }

            return 'unknown';
        };

        try {
            $cacheKey = 'SYSTEM_DOMAIN_POINTED_DIRECTORY_' . md5($script);
            $systemProcessingDirectory = Cache::rememberForever($cacheKey, $compute);
        } catch (Throwable) {
            // Cache unavailable (e.g. database cache driver before migrations run)
            $systemProcessingDirectory = $compute();
        }

        config(['laravel-toaster-magic.system_processing_directory' => $systemProcessingDirectory]);
    }
}
