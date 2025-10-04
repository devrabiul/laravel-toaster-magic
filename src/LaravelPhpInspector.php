<?php

namespace Devrabiul\LaravelPhpInspector;

use Exception;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Session\SessionManager as Session;
use Illuminate\Config\Repository as Config;

/**
 * Class LaravelPhpInspector
 *
 * This class handles the management of toast notifications in a Laravel application.
 * It provides methods to add flash messages to the session and render the necessary
 * styles and scripts for displaying these messages.
 */
class LaravelPhpInspector
{
    /**
     * The session manager.
     *
     * @var \Illuminate\Session\SessionManager
     */
    protected $session;

    /**
     * The Config Handler.
     *
     * @var Repository
     */
    protected $config;

    /**
     * The messages stored in the session.
     *
     * @var array
     */
    protected array $messages = [];

    /**
     * The JavaScript type for script tags.
     *
     * @var string
     */
    protected string $jsType = 'text/javascript';

    /**
     * LaravelPhpInspector constructor.
     *
     * @param Session $session The session manager instance.
     * @param Config $config The configuration repository instance.
     */
    function __construct(Session $session, Config $config)
    {
        $this->session = $session;
        $this->config = $config;
    }


}
