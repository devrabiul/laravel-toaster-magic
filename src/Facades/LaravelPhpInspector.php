<?php

namespace Devrabiul\LaravelPhpInspector\Facades;

use Illuminate\Support\Facades\Facade;


/**
 * @method static string message()
 * @method static void add(string $type, string $message, string|null $description = null, array $options = [])
 * @method static void info(string $message, string|null $description = null, array $options = [])
 * @method static void success(string $message, string|null $description = null, array $options = [])
 * @method static void warning(string $message, string|null $description = null, array $options = [])
 * @method static void error(string $message, string|null $description = null, array $options = [])
 * @method static void clear(): void
 */
class LaravelPhpInspector extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'LaravelPhpInspector';
    }
}
