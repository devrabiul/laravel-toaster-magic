<?php

namespace Devrabiul\ToastMagic\Tests;

use Devrabiul\ToastMagic\Facades\ToastMagic;
use Devrabiul\ToastMagic\ToastMagicServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    /**
     * Register the package service provider for the test application.
     */
    protected function getPackageProviders($app): array
    {
        return [
            ToastMagicServiceProvider::class,
        ];
    }

    /**
     * Register the package facade alias for the test application.
     */
    protected function getPackageAliases($app): array
    {
        return [
            'ToastMagic' => ToastMagic::class,
        ];
    }
}
