<?php

namespace Devrabiul\ToastMagic\Facades;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\MessageBag;

/**
 * @method static string styles()
 * @method static string scripts()
 * @method static string scriptsPath()
 * @method static \Devrabiul\ToastMagic\ToastMagic dispatch()
 * @method static void add(string $type, string $message, string|null $description = null, array $options = [])
 * @method static void info(string|MessageBag $message, string|null $description = null, array $options = [])
 * @method static void success(string|MessageBag $message, string|null $description = null, array $options = [])
 * @method static void warning(string|MessageBag $message, string|null $description = null, array $options = [])
 * @method static void error(string|MessageBag $message, string|null $description = null, array $options = [])
 * @method static void clear()
 * @method static \Devrabiul\ToastMagic\ToastMagic useVite()
 * @method static \Devrabiul\ToastMagic\ToastMagic nonce(string $nonce)
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
