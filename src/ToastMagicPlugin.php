<?php

/*
 * This file is part of the PHPFlasher package.
 * (c) Younes KHOUBZA <younes.khoubza@gmail.com>
 */

namespace Devrabiul\ToastMagic;


class ToastMagicPlugin
{
    /**
     * {@inheritdoc}
     */
    public function getScripts()
    {
        return array(
            'cdn' => array(
                'https://cdn.jsdelivr.net/npm/@flasher/flasher-notyf@1.3.2/dist/flasher-notyf.min.js',
            ),
            'local' => array(
                '/vendor/flasher/flasher-notyf.min.js',
            ),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getStyles()
    {
        return array(
            'cdn' => array(
                'https://cdn.jsdelivr.net/npm/@flasher/flasher-notyf@1.3.2/dist/flasher-notyf.min.css',
            ),
            'local' => array(
                '/vendor/flasher/flasher-notyf.min.css',
            ),
        );
    }
}
