<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Target PHP Version
    |--------------------------------------------------------------------------
    |
    | Set the PHP version you want to check compatibility against.
    | Example: '8.4', '8.2', '7.4'
    |
    */
    'php_version' => env('PHP_INSPECTOR_VERSION', '8.4'),

    /*
    |--------------------------------------------------------------------------
    | Paths to Scan
    |--------------------------------------------------------------------------
    |
    | Define the directories that should be scanned for compatibility issues.
    | Example: ['app', 'packages', 'database']
    |
    */
    'paths' => [
        'app',
    ],

    /*
    |--------------------------------------------------------------------------
    | Excluded Paths
    |--------------------------------------------------------------------------
    |
    | Paths or files to exclude from scanning.
    | Example: ['vendor', 'storage']
    |
    */
    'exclude' => [
        'vendor',
        'storage',
    ],

    /*
    |--------------------------------------------------------------------------
    | Fail on Errors
    |--------------------------------------------------------------------------
    |
    | If true, the command will exit with a failure code when errors are found.
    |
    */
    'fail_on_error' => true,

    /*
    |--------------------------------------------------------------------------
    | Show Warnings
    |--------------------------------------------------------------------------
    |
    | If true, warnings will be shown in the console output.
    |
    */
    'show_warnings' => true,
];
