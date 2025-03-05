<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Session\SessionManager as Session;
use Illuminate\Config\Repository as Config;
use Illuminate\Support\MessageBag;

class ToastMagic
{
    /**
     * The session manager.
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
     * The messages in session.
     *
     * @var array
     */
    protected $messages = [];

    /**
     * The js type src type.
     *
     * @var string
     */
    protected $jsType = 'text/javascript';

    function __construct(Session $session, Config $config)
    {
        $this->session = $session;
        $this->config  = $config;
    }

    public function styles()
    {
        $style = '<link rel="stylesheet" href="'. url('vendor/toast-magic/assets/webfonts/uicons-regular-rounded.css') . '">';
        $style .= '<link rel="stylesheet" href="'. url('vendor/toast-magic/assets/webfonts/uicons-solid-rounded.css') . '">';
        $style .= '<link rel="stylesheet" href="' . url('vendor/toast-magic/assets/css/toast-magic.css') . '">';
        return $style;
    }

    public function scripts()
    {
        $messages = $this->session->get('toastr-magic::messages');

        if (! $messages) $messages = [];

        $script = '<script src="' . url('vendor/toast-magic/assets/js/toast-magic.js') . '"></script>';
        $script .= '<script type="' . $this->jsType . '">';

        $script .= 'document.addEventListener("DOMContentLoaded", function() {';

        $delay = 0; // Initial delay of 0ms

        foreach ($messages as $message) {
            $config = (array) $this->config->get('toastr.options');

            if (count($message['options'])) {
                $config = array_merge($config, $message['options']);
            }

            if ($config) {
                $script .= 'toastr.options = ' . json_encode($config) . ';';
            }

            $title = addslashes($message['title']) ?: null;

            // Add a delay for each message
            $script .= 'setTimeout(function() {
                createToast({
                    type: "' . $message['type'] . '",
                    heading: "' . $title . '",
                    description: "' . addslashes($message['message']) . '",
                    showCloseBtn: true,
                });
            }, ' . $delay . ');';

            // Increase the delay for the next message (500ms for each)
            $delay += 500;
        }

        $script .= '});'; // End of DOMContentLoaded

        $script .= '</script>';

        return $script;
    }


    /**
     *
     * Add a flash message to session.
     *
     * @param string $type Must be one of info, success, warning, error.
     * @param string $message The flash message content.
     * @param string $title The flash message title.
     * @param array  $options The custom options.
     *
     * @return void
     */
    public function add($type, $message, $title = null, $options = [])
    {
        $types = ['error', 'info', 'success', 'warning'];

        if (! in_array($type, $types)) {
            throw new Exception("The $type remind message is not valid.");
        }

        $this->messages[] = [
            'type'    => $type,
            'title'   => $title,
            'message' => $message,
            'options' => $options,
        ];

        $this->session->flash('toastr-magic::messages', $this->messages);
    }

    /**
     * Add an info flash message to session.
     *
     * @param string $message The flash message content.
     * @param string $title The flash message title.
     * @param array  $options The custom options.
     *
     * @return void
     */
    public function info($message, $title = null, $options = [])
    {
		if($message instanceof MessageBag)
		{
			$messageString = "";
			foreach ($message->getMessages() as $messageArray)
			{
				foreach ($messageArray as $currentMessage)
					$messageString .= $currentMessage."<br>";
			}

			$this->add('info', rtrim($messageString, "<br>"), $title, $options);
		}
		else
			$this->add('info', $message, $title, $options);
    }

    /**
     * Add a success flash message to session.
     *
     * @param string $message The flash message content.
     * @param string $title The flash message title.
     * @param array  $options The custom options.
     *
     * @return void
     */
    public function success($message, $title = null, $options = [])
    {
		if($message instanceof MessageBag)
		{
			$messageString = "";
			foreach ($message->getMessages() as $messageArray)
			{
				foreach ($messageArray as $currentMessage)
					$messageString .= $currentMessage."<br>";
			}

			$this->add('success', rtrim($messageString, "<br>"), $title, $options);
		}
		else
			$this->add('success', $message, $title, $options);
    }

    /**
     * Add an warning flash message to session.
     *
     * @param string $message The flash message content.
     * @param string $title The flash message title.
     * @param array  $options The custom options.
     *
     * @return void
     */
    public function warning($message, $title = null, $options = [])
    {
		if($message instanceof MessageBag)
		{
			$messageString = "";
			foreach ($message->getMessages() as $messageArray)
			{
				foreach ($messageArray as $currentMessage)
					$messageString .= $currentMessage."<br>";
			}

			$this->add('warning', rtrim($messageString, "<br>"), $title, $options);
		}
		else
			$this->add('warning', $message, $title, $options);
    }

    /**
     * Add an error flash message to session.
     *
     * @param string $message The flash message content.
     * @param string $title The flash message title.
     * @param array  $options The custom options.
     *
     * @return void
     */
    public function error($message, $title = null, $options = [])
    {
    	if($message instanceof MessageBag)
		{
			$messageString = "";
			foreach ($message->getMessages() as $messageArray)
			{
				foreach ($messageArray as $currentMessage)
					$messageString .= $currentMessage."<br>";
			}

			$this->add('error', rtrim($messageString, "<br>"), $title, $options);
		}
    	else
        	$this->add('error', $message, $title, $options);
    }

    /**
     * Clear messages
     *
     * @return void
     */
    public function clear()
    {
        $this->messages = [];
    }
    /**
     * Set js type to module for using vite
     *
     * @return void
     */
    public function useVite(){
        $this->jsType = 'module';
    }
}
