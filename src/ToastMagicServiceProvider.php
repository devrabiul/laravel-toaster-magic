<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

class ToastMagicServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->updateProcessingAssetRoutes();
        $this->publishes([
            __DIR__ . '/config/toast-magic.php' => config_path('toast-magic.php'),
            ], 'config');
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->singleton('ToastMagic', function ($app) {
            return new ToastMagic($app['session'], $app['config']);
        });
    }

    /**
     * Get the services provider by the provider
     *
     * @return array
     */
    public function provides(): array
    {
        return ['ToastMagic'];
    }

    private function updateProcessingAssetRoutes(): void
    {
        Route::get('/vendor/toast-magic/assets/{path}', function ($path) {
            $file = __DIR__ . '/../assets/' . $path;

            if (file_exists($file)) {
                // Get file extension
                $extension = pathinfo($file, PATHINFO_EXTENSION);

                // Mime types based on file extension
                $mimeTypes = [
                    'css' => 'text/css',
                    'js' => 'application/javascript',
                    'png' => 'image/png',
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'gif' => 'image/gif',
                    'svg' => 'image/svg+xml',
                    'woff' => 'font/woff',
                    'woff2' => 'font/woff2',
                    'ttf' => 'font/ttf',
                    'otf' => 'font/otf',
                    'eot' => 'application/vnd.ms-fontobject',
                    'json' => 'application/json',
                    'ico' => 'image/x-icon',
                ];

                // Default to application/octet-stream if the extension is not recognized
                $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

                return Response::file($file, [
                    'Content-Type' => $mimeType,
                    'Access-Control-Allow-Origin' => '*',
                ]);
            }

            abort(404);
        })->where('path', '.*');
    }
}
