<?php

/*
 * This file is part of the ToastMagic package.
 * (c) Muhammad Rabiul <devrabiul@gmail.com>
 */

use Devrabiul\ToastMagic;
use Devrabiul\ToastMagic\Container\FlasherContainer;
use Devrabiul\ToastMagic\Interface\NotificationInterface;

if (!function_exists('toastMagic')) {
    function toastMagic($message = null, $type = NotificationInterface::SUCCESS, array $options = array())
    {
        return ToastMagic::message($type, $message, $options);
    }
}
