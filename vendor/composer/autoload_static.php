<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit722c41690107f46814610c7d6cdc44b5
{
    public static $prefixLengthsPsr4 = array (
        'D' => 
        array (
            'Devrabiul\\ToastMagic\\' => 21,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Devrabiul\\ToastMagic\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit722c41690107f46814610c7d6cdc44b5::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit722c41690107f46814610c7d6cdc44b5::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit722c41690107f46814610c7d6cdc44b5::$classMap;

        }, null, ClassLoader::class);
    }
}
