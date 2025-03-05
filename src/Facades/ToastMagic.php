<?php

namespace Devrabiul\ToastMagic\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static message():string
 * @method static add($type, $message, $description = null, $options = []):void
 * @method static info($message, $description = null, $options = []):void
 * @method static success($message, $description = null, $options = []):void
 * @method static warning($message, $description = null, $options = []):void
 * @method static error($message, $description = null, $options = []):void
 * @method static clear($message, $description = null, $options = []):void
 */
class ToastMagic extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'ToastMagic';
    }
}
