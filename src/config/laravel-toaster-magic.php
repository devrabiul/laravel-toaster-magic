<?php

return [
    'options' => [

        // ─────────────────────────────────────────────
        // Security
        // ─────────────────────────────────────────────
        // Toast text is escaped before it reaches the DOM.
        // Leave this on. A single toast can opt into HTML:
        //
        //   ToastMagic::success('<b>Saved</b>', null, ['html' => true]);
        //
        // Setting this to false makes EVERY toast render raw
        // HTML, which turns any user-supplied value into a
        // cross-site scripting hole.
        "escape_html" => true,

        // ─────────────────────────────────────────────
        // Toast behavior
        // ─────────────────────────────────────────────
        "closeButton" => true,
        "positionClass" => "toast-top-end",
        "preventDuplicates" => false,
        "showDuration" => 300,
        "timeOut" => 5000,
        // Use 0 to keep toasts on screen until dismissed.

        "stagger" => 800,
        // Gap between consecutive queued toasts, in ms.
        // The entrance animation runs for 500ms, so this
        // staggers them into a cascade rather than a burst.
        // All of maxVisible land within maxVisible * stagger.

        "maxVisible" => 15,
        // Most toasts on screen at once; the oldest is
        // dismissed to make room. The container is fixed
        // positioned, so without a cap a burst of flashed
        // messages pushes toasts past the bottom of the
        // viewport where they cannot be seen or closed.
        // Use 0 for no limit.

        "pauseOnHover" => true,
        // Keyboard focus always pauses the timer, regardless
        // of this setting.

        // ─────────────────────────────────────────────
        // Theme & appearance
        // ─────────────────────────────────────────────
        "theme" => "default",
        // Available themes:
        // default, material, ios, glassmorphism, neon,
        // minimal, neumorphism, neumorphic, compact

        "gradient_enable" => false,
        // Available for: default, material, ios,
        // glassmorphism, neon themes

        "color_mode" => false,
        // Enable/disable color mode

        // ─────────────────────────────────────────────
        // Animation
        // ─────────────────────────────────────────────
        "animation" => "default",
        // Available animations:
        // default, slide, fade, pop, bounce

        // ─────────────────────────────────────────────
        // Accessibility
        // ─────────────────────────────────────────────
        "closeButtonLabel" => "Close notification",
        // Accessible name announced for the close button.

        "containerLabel" => "Notifications",
        // Accessible name for the toast region.

        // ─────────────────────────────────────────────
        // Spacing
        // ─────────────────────────────────────────────
        // Global spacing. Works with every theme.
        // Set "enable" => false to use the active theme's
        // default spacing.
        //
        // Individual values can be omitted or set to null
        // to fall back to the theme's default value.
        "spacing" => [
            "enable" => true,
            "container" => "10px 12px", // Inner toast padding
            "icon_gap" => "8px",        // Icon ↔ content
            "content_gap" => "2px",     // Title ↔ description
            "close_gap" => "6px",       // Content ↔ close/action
        ],

        // ─────────────────────────────────────────────
        // Typography
        // ─────────────────────────────────────────────
        // Global typography. Works with every theme.
        // Set "enable" => false to use the active theme's
        // default typography.
        //
        // Weight and line-height are optional. Omit them
        // to keep the theme's default values.
        "typography" => [
            "enable" => true,
            "title_size" => "14px",
            "description_size" => "13px",
        ],
    ],

    // ─────────────────────────────────────────────────
    // Animated icon presets
    // ─────────────────────────────────────────────────
    // Preset packs to load. Each pack is a separate script
    // and stylesheet, so a project ships only the icons it
    // actually uses — the core runtime contains none.
    //
    //   general   loading, connectivity, auth, clipboard,
    //             preferences                     (76)
    //   commerce  carts, orders, payments, shipping,
    //             catalogue, promotions, stock   (121)
    //   saas      subscriptions, workspaces, seats,
    //             usage, integrations             (44)
    //   social    messages, posts, connections,
    //             moderation                      (38)
    //   devops    builds, deploys, source control,
    //             infrastructure, incidents       (61)
    //   media     capture, encoding, publishing,
    //             playback                        (36)
    //   files     documents, storage, backups      (37)
    //   health    appointments, prescriptions,
    //             vitals, lab work                (28)
    //   travel    flights, stays, transport        (26)
    //   education courses, assignments, grading    (25)
    //   crm       leads, deals, accounts, calls     (25)
    //                                             ----
    //                                              517
    //
    // Use 'all' for every pack, or [] for none.
    //
    // A preset from a pack that is not listed here is
    // ignored, and the toast renders with its type icon.
    'presets' => ['general'],

    // ─────────────────────────────────────────────────
    // Livewire integration
    // ─────────────────────────────────────────────────
    // Loads the event bridge alongside the shared runtime.
    // One bridge serves both Livewire v3 and v4 — they
    // dispatch browser events identically, so there is no
    // version to select.
    'livewire_enabled' => false,

    // ─────────────────────────────────────────────────
    // Content Security Policy
    // ─────────────────────────────────────────────────
    // Nonce applied to the inline <script> blocks. Leave
    // null when you have no CSP, or call
    // ToastMagic::nonce($nonce) when it is only known at
    // request time.
    'csp_nonce' => null,

    // ─────────────────────────────────────────────────
    // Asset URLs
    // ─────────────────────────────────────────────────
    // Prefix prepended to published asset URLs. null
    // auto-detects from the entry script; set "public" if
    // your document root is the project root, or "" to
    // force no prefix.
    'asset_path_prefix' => null,
];
