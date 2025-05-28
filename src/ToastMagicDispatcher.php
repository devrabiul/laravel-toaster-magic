<?php

namespace Devrabiul\ToasterMagic;

class ToastMagicDispatcher
{
    protected string $status = 'info';
    protected string $title = '';
    protected string $message = '';
    protected array $options = [];

    public function success(string $message, string $title = 'Success', array $options = []): void
    {
        $this->status = 'success';
        $this->title = $title;
        $this->message = $message;
        $this->options = $options;

        $this->dispatch();
    }

    public function error(string $message, string $title = 'Error', array $options = []): void
    {
        $this->status = 'error';
        $this->title = $title;
        $this->message = $message;
        $this->options = $options;

        $this->dispatch();
    }

    public function dispatch(): void
    {
        if (function_exists('livewire')) {
            livewire()->dispatch('toastMagic', [
                'status' => $this->status,
                'title' => $this->title,
                'message' => $this->message,
                'options' => $this->options,
            ]);
        }
    }
}
