<?php

return [
    'options' => [
        "closeButton" => true,
        "positionClass" => "toast-top-end",
        "preventDuplicates" => false,
        "showDuration" => 300,
        "timeOut" => 5000,
        "theme" => "default", // Available themes: default, material, ios, glassmorphism, neon, minimal, neumorphism
        "gradient_enable" => false, // Available for: default, material, ios, glassmorphism, neon themes
        "color_mode" => false, // Color mode (true or false)
        "pauseOnHover" => true, // Pause the auto-dismiss timer while the toast is hovered
        "animation" => "default" // Entrance/exit animation: default, slide, fade, pop, bounce
    ],
    'livewire_enabled' => false,
    'livewire_version' => 'v3'
];
