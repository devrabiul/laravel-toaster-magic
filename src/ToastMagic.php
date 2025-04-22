<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Session\SessionManager as Session;
use Illuminate\Config\Repository as Config;
use Illuminate\Support\MessageBag;

/**
 * Class ToastMagic
 *
 * This class handles the management of toast notifications in a Laravel application.
 * It provides methods to add flash messages to the session and render the necessary
 * styles and scripts for displaying these messages.
 */
class ToastMagic
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
     * @var \Illuminate\Contracts\Config\Repository
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
     * ToastMagic constructor.
     *
     * @param Session $session The session manager instance.
     * @param Config $config The configuration repository instance.
     */
    function __construct(Session $session, Config $config)
    {
        $this->session = $session;
        $this->config = $config;
    }

    /**
     * Generate the HTML for the required styles.
     *
     * @return string The HTML link tag for the stylesheet.
     */
    public function styles(): string
    {
        $style = '<link rel="stylesheet" href="' . url('vendor/laravel-toaster-magic/assets/css/laravel-toaster-magic.css') . '">';
        return $style;
    }

    /**
     * Generate the HTML for the required scripts and initialize toast messages.
     *
     * @return string The HTML script tags for the JavaScript.
     */
    public function scripts(): string
    {
        $messages = $this->session->get('laravel-toaster-magic::messages');

        if (!$messages) $messages = [];

        $config = (array)$this->config->get('laravel-toaster-magic.options');

        $script = '<script src="' . url('vendor/laravel-toaster-magic/assets/js/laravel-toaster-magic.js') . '"></script>';
        $script .= '<script type="' . $this->jsType . '">';

        // Output the config as a global JS object
        $script .= 'window.toastMagicConfig = ' . json_encode($config, JSON_UNESCAPED_SLASHES) . ';';

        $script .= 'document.addEventListener("DOMContentLoaded", function() {';

        $delay = 0; // Initial delay of 0ms

        foreach ($messages as $message) {

            if (count($message['options'])) {
                $config = array_merge($config, $message['options']);
            }

            $description = addslashes($message['description']) ?: null;

            // Add a delay for each message
            $script .= 'setTimeout(function() {
                toastMagic.' . $message['type'] . '("' . addslashes($message['message']) . '", "' . $description . '", '. (isset($config['closeButton']) && $config['closeButton'] ? 'true' : 'false') .', "'. ($config['customBtnText'] ?? '') .'", "'. ($config['customBtnLink'] ?? '') .'");
            }, ' . $delay . ');';

            // Increase the delay for the next message (500ms for each)
            $delay += 1000;
        }

        $script .= '});'; // End of DOMContentLoaded

        $script .= '</script>';

        return $script;
    }


    /**
     * Add a flash message to the session.
     *
     * @param string $type Must be one of info, success, warning, error.
     * @param string $message The flash message content.
     * @param string|null $description Optional description for the message.
     * @param array $options Optional custom options for the message.
     *
     * @return void
     */
    public function add(string $type, string $message, string|null $description = null, array $options = []): void
    {
        $types = ['error', 'info', 'success', 'warning'];

        if (!in_array($type, $types)) {
            throw new Exception("The $type remind message is not valid.");
        }

        $this->messages[] = [
            'type' => $type,
            'message' => $message,
            'description' => $description,
            'options' => $options,
        ];

        $this->session->flash('laravel-toaster-magic::messages', $this->messages);
    }

    /**
     * Add an info flash message to session.
     *
     * @param string $message The flash message content.
     * @param string|null $description
     * @param array $options The custom options.
     *
     * @return void
     */
    public function info(string $message, string|null $description = null, array $options = []): void
    {
        if ($message instanceof MessageBag) {
            $messageString = "";
            foreach ($message->getMessages() as $messageArray) {
                foreach ($messageArray as $currentMessage)
                    $messageString .= $currentMessage . "<br>";
            }

            $this->add('info', rtrim($messageString, "<br>"), $description, $options);
        } else {
            $this->add('info', $message, $description, $options);
        }
    }

    /**
     * Add a success flash message to session.
     *
     * @param string $message The flash message content.
     * @param string|null $description
     * @param array $options The custom options.
     *
     * @return void
     */
    public function success(string $message, string|null $description = null, array $options = []): void
    {
        if ($message instanceof MessageBag) {
            $messageString = "";
            foreach ($message->getMessages() as $messageArray) {
                foreach ($messageArray as $currentMessage)
                    $messageString .= $currentMessage . "<br>";
            }

            $this->add('success', rtrim($messageString, "<br>"), $description, $options);
        } else {
            $this->add('success', $message, $description, $options);
        }
    }

    /**
     * Add a warning flash message to session.
     *
     * @param string $message The flash message content.
     * @param string|null $description
     * @param array $options The custom options.
     *
     * @return void
     */
    public function warning(string $message, string|null $description = null, array $options = []): void
    {
        if ($message instanceof MessageBag) {
            $messageString = "";
            foreach ($message->getMessages() as $messageArray) {
                foreach ($messageArray as $currentMessage)
                    $messageString .= $currentMessage . "<br>";
            }

            $this->add('warning', rtrim($messageString, "<br>"), $description, $options);
        } else {
            $this->add('warning', $message, $description, $options);
        }
    }

    /**
     * Add an error flash message to session.
     *
     * @param string $message The flash message content.
     * @param string|null $description
     * @param array $options The custom options.
     *
     * @return void
     */
    public function error(string $message, string|null $description = null, array $options = []): void
    {
        if ($message instanceof MessageBag) {
            $messageString = "";
            foreach ($message->getMessages() as $messageArray) {
                foreach ($messageArray as $currentMessage)
                    $messageString .= $currentMessage . "<br>";
            }

            $this->add('error', rtrim($messageString, "<br>"), $description, $options);
        } else {
            $this->add('error', $message, $description, $options);
        }
    }

    /**
     * Clear messages
     *
     * @return void
     */
    public function clear(): void
    {
        $this->messages = [];
    }

    /**
     * Set js type to module for using vite
     *
     * @return void
     */
    public function useVite(): void
    {
        $this->jsType = 'module';
    }
}
