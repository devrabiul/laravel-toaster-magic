<?php

namespace Devrabiul\ToastMagic\Facades;

use Illuminate\Support\Facades\Facade;


/**
 * @method static string styles()
 * @method static string scripts()
 * @method static string scriptsPath()
 * @method static \Devrabiul\ToastMagic\ToastMagic dispatch()
 * @method static void add(string $type, string $message, string|null $description = null, array $options = [])
 * @method static void info(string|\Illuminate\Support\MessageBag $message, string|null $description = null, array $options = [])
 * @method static void success(string|\Illuminate\Support\MessageBag $message, string|null $description = null, array $options = [])
 * @method static void warning(string|\Illuminate\Support\MessageBag $message, string|null $description = null, array $options = [])
 * @method static void error(string|\Illuminate\Support\MessageBag $message, string|null $description = null, array $options = [])
 * @method static void clear()
 * @method static void useVite()
 *
 * @see \Devrabiul\ToastMagic\ToastMagic
 */
class ToastMagic extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'ToastMagic';
    }
}
