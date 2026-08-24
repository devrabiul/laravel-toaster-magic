/*!
 * Laravel Toaster Magic — preset pack: general
 *
 * Cross-cutting states any project has: loading, connectivity, auth, clipboard, preferences.
 *
 * Loaded only when this pack is listed under `presets` in the config. It
 * registers into the shared runtime, which must be loaded first — the pack
 * adds no behaviour of its own, only icons and their motion.
 *
 * Icon geometry is Lucide v1.33.0 — ISC License, Copyright (c) 2026 Lucide
 * Icons and Contributors. Some icons derive from Feather — MIT License,
 * Copyright (c) 2013-present Cole Bemis.
 */
(function () {
    "use strict";

    var P = window.ToastMagicPresets;

    if (!P) {
        if (window.console && window.console.warn) {
            window.console.warn("[toast-magic] preset pack \"general\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3, F2 = P.f2, F3 = P.f3;

    P.register({
        userCheck: ICON_ATTRS + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" fill="var(--tm-i3, none)"' + S3 + '/><path class="tm-tick" d="m16 11 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        mapPin: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"' + F2 + '/></svg>',
        key: ICON_ATTRS + '<path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"' + S3 + '/><circle class="tm-ring" cx="7.5" cy="15.5" r="5.5" fill="var(--tm-i2, none)"' + S2 + '/></svg>',
        clipboard: ICON_ATTRS + '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1" fill="var(--tm-i2, none)"' + S2 + '/></svg>',
        // Lucide's wifi-off — the arcs are already broken where the slash runs.
        wifiOff: ICON_ATTRS + '<path d="M12 20h.01" stroke-width="3"' + S3 + '/><path d="M8.5 16.429a5 5 0 0 1 7 0"' + S3 + '/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"' + S3 + '/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"' + S3 + '/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"' + S3 + '/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"' + S3 + '/><path d="m2 2 20 20" stroke-width="2.5"' + S2 + '/></svg>',
        // Paths run dot, outer, middle, inner — `arcs-stagger` plays them in
        // reverse so the signal builds outward, each arc a step brighter.
        wifi: ICON_ATTRS + '<path d="M12 20h.01" stroke-width="3"' + S2 + '/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"' + S3 + '/><path d="M8.5 16.429a5 5 0 0 1 7 0"' + S2 + '/></svg>',
        // Shaft and head are grouped so one transform moves the whole arrow
        // into (or out of) the tray, which stays put.
        download: ICON_ATTRS + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><g class="tm-arrow"' + S2 + '><path d="M12 15V3"/><path d="m7 10 5 5 5-5"/></g></svg>',
        send: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"' + S2 + '/></svg>',
        badge: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path class="tm-tick" d="m9 12 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        funnel: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/></svg>',
        doorOpen: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"' + S3 + '/><path d="M11 20H2M22 20h-3"' + S3 + '/><path class="tm-knob" d="M14 12h.01" stroke-width="3"' + S2 + '/></svg>',
        languages: ICON_ATTRS + '<g class="tm-first"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/></g><g class="tm-second"' + S2 + '><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></g></svg>',
        // Three nodes, three colours — `nodes-pulse` lights them in sequence.
        share: ICON_ATTRS + '<line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/><circle cx="18" cy="5" r="3"' + F2 + '/><circle cx="6" cy="12" r="3"' + F3 + '/><circle cx="18" cy="19" r="3"' + F2 + '/></svg>',
        // One arc with a gap: the gap is what makes the rotation visible.
        spinner: ICON_ATTRS + '<path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
        logIn: ICON_ATTRS + '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><g class="tm-arrow"' + S2 + '><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></g></svg>',
        logOut: ICON_ATTRS + '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><g class="tm-arrow"' + S2 + '><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></g></svg>',
        searchX: ICON_ATTRS + '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"' + S3 + '/><g class="tm-x"' + S2 + '><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/></g></svg>',
        bellOff: ICON_ATTRS + '<path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"/><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"/><path d="M10.268 21a2 2 0 0 0 3.464 0"' + S3 + '/><path d="m2 2 20 20" stroke-width="2.5"' + S2 + '/></svg>',
        phone: ICON_ATTRS + '<rect width="14" height="20" x="5" y="2" rx="2" ry="2" fill="var(--tm-i3, none)"/><path d="M12 18h.01" stroke-width="3"' + S2 + '/></svg>',
        // The shackle is separate so it can drop shut onto the body.
        lock: ICON_ATTRS + '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" fill="var(--tm-i3, none)"/><path class="tm-shackle" d="M7 11V7a5 5 0 0 1 10 0v4"' + S2 + '/></svg>',
        shield: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><g class="tm-bang"' + S2 + '><path d="M12 8v4"/><path d="M12 16h.01" stroke-width="2.5"/></g></svg>',
        user: ICON_ATTRS + '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill="var(--tm-i2, none)"' + S2 + '/></svg>',
        qrCode: ICON_ATTRS + '<path d="M12 7v3a2 2 0 0 1-2 2H7"' + S3 + '/><path d="M21 16h-3a2 2 0 0 0-2 2v3"' + S3 + '/><path d="M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M21 21v.01M12 21v-1" stroke-width="2.5"' + S3 + '/><g class="tm-corners"' + S2 + '><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/></g></svg>',
        history: ICON_ATTRS + '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"' + S3 + '/><path class="tm-hands" d="M12 7v5l4 2"' + S2 + '/></svg>',
        alarmClock: ICON_ATTRS + '<circle cx="12" cy="13" r="8" fill="var(--tm-i3, none)"/><path class="tm-hands" d="M12 9v4l2 2"' + S2 + '/><g class="tm-bells"' + S3 + '><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></g></svg>',
        // Hands are their own path so they can sweep inside a still face.
        clock: ICON_ATTRS + '<circle cx="12" cy="12" r="10"/><path class="tm-hands" d="M12 6v6l4 2"' + S2 + '/></svg>',
        gear: ICON_ATTRS + '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3" fill="var(--tm-i2, none)"' + S2 + '/></svg>',
        fileCheck: ICON_ATTRS + '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"' + S3 + '/><path class="tm-tick" d="m9 15 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        moon: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
        shieldCheck: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path class="tm-tick" d="m9 12 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        upload: ICON_ATTRS + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><g class="tm-arrow"' + S2 + '><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/></g></svg>',
        // >>> generated by build/presets/generate.py
        sun: ICON_ATTRS + '<circle cx="12" cy="12" r="4" fill="var(--tm-i3, none)"/><g class="tm-accent"' + S2 + '><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/><path d="m4.93 4.93 1.41 1.41M17.66 17.66l1.41 1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g></svg>',
        lightbulb_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path class="tm-accent" d="M9 18h6M10 22h4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        lightbulb_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path class="tm-accent" d="M9 18h6M10 22h4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        compass_tick: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        compass_bang: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        target_plus: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        target_tick: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        trendUp_up: ICON_ATTRS + '<path class="tm-accent" d="m22 7-8.5 8.5-5-5L2 17"' + S2 + '/><path d="M16 7h6v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        chartColumn_tick: ICON_ATTRS + '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><g class="tm-accent"' + S2 + '><path d="M8 17v-3"/><path d="M13 17V5"/><path d="M18 17V9"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_clock: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        cpu_tick: ICON_ATTRS + '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"' + S2 + '/><g' + S3 + '><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        cpu_x: ICON_ATTRS + '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"' + S2 + '/><g' + S3 + '><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        cloud_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        volume_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><g class="tm-accent"' + S2 + '><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        volumeX: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><g class="tm-accent"' + S2 + '><path d="m22 9-6 6"/><path d="m16 9 6 6"/></g></svg>',
        terminal_tick: ICON_ATTRS + '<path class="tm-accent" d="m4 17 6-6-6-6"' + S2 + '/><path d="M12 19h8"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        container_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path class="tm-accent" d="M10 21.9V14L2.1 9.1M10 14l11.9-6.9"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        contact_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        briefcase_tick: ICON_ATTRS + '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_up: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        calendarDays_down: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        notebookPen_up: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        notebookPen_tick: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        briefcase_up: ICON_ATTRS + '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        briefcase_x: ICON_ATTRS + '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        calendarDays_plus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        calendarDays_minus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        presentation_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        presentation_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        target_up: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        target_minus: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        activity_up: ICON_ATTRS + '<path class="tm-accent" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        activity_down: ICON_ATTRS + '<path class="tm-accent" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        cpu_bang: ICON_ATTRS + '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"' + S2 + '/><g' + S3 + '><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        cpu_up: ICON_ATTRS + '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"' + S2 + '/><g' + S3 + '><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        hardDrive_down: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M21.946 12.013H2.054"' + S3 + '/><path class="tm-accent" d="M10 16h.01M6 16h.01" stroke-width="2.5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        cloud_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        cloud_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        cloud_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        cpu_clock: ICON_ATTRS + '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"' + S2 + '/><g' + S3 + '><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        stethoscope_tick: ICON_ATTRS + '<path d="M11 2v2M5 2v2"' + S3 + '/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle class="tm-accent" cx="20" cy="10" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        stethoscope_x: ICON_ATTRS + '<path d="M11 2v2M5 2v2"' + S3 + '/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle class="tm-accent" cx="20" cy="10" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>'
        // <<< generated
    }, {
        "account-created": { icon: "userCheck", anim: "account-open" },
        "address-saved": { icon: "mapPin", anim: "pin-drop" },
        "api-key-generated": { icon: "key", anim: "key-turn" },
        "clipboard-copy": { icon: "clipboard", anim: "clip-snap" },
        "connection-lost": { icon: "wifiOff", anim: "signal-drop" },
        "connection-restored": { icon: "wifi", anim: "arcs-stagger" },
        "download-complete": { icon: "download", anim: "arrow-down" },
        "email-sent": { icon: "send", anim: "plane-launch" },
        "email-verified": { icon: "badge", anim: "badge-pulse" },
        "filter-applied": { icon: "funnel", anim: "funnel-settle" },
        "guest-checkout": { icon: "doorOpen", anim: "guest-enter" },
        "language-changed": { icon: "languages", anim: "glyph-swap" },
        "link-shared": { icon: "share", anim: "nodes-pulse" },
        // `loading` is the one preset whose motion never stops, because it
        // reports work still in progress. Pair it with `timeOut: 0`.
        "loading": { icon: "spinner", anim: "spin-loop" },
        "login": { icon: "logIn", anim: "door-in" },
        "logout": { icon: "logOut", anim: "door-out" },
        "no-results": { icon: "searchX", anim: "search-sweep" },
        "notifications-muted": { icon: "bellOff", anim: "bell-mute" },
        "otp-sent": { icon: "phone", anim: "phone-buzz" },
        "password-changed": { icon: "lock", anim: "lock-shut" },
        "permission-denied": { icon: "shield", anim: "shield-warn" },
        "profile-updated": { icon: "user", anim: "user-pop" },
        "qr-generated": { icon: "qrCode", anim: "qr-scan" },
        "recently-viewed": { icon: "history", anim: "history-rewind" },
        "reminder-set": { icon: "alarmClock", anim: "alarm-tick" },
        "session-expiring": { icon: "clock", anim: "clock-sweep" },
        "settings-saved": { icon: "gear", anim: "gear-spin" },
        "terms-accepted": { icon: "fileCheck", anim: "terms-mark" },
        "theme-changed": { icon: "moon", anim: "moon-swap" },
        "two-factor-enabled": { icon: "shieldCheck", anim: "shield-lock" },
        "upload-complete": { icon: "upload", anim: "arrow-up" },
        // >>> generated by build/presets/generate.py
        "daytime-mode": { icon: "sun", anim: "spin" },
        "idea-captured": { icon: "lightbulb_plus", anim: "badge" },
        "tip-dismissed": { icon: "lightbulb_x", anim: "badge" },
        "location-found": { icon: "compass_tick", anim: "badge" },
        "location-lost": { icon: "compass_bang", anim: "badge" },
        "goal-set": { icon: "target_plus", anim: "badge" },
        "goal-reached": { icon: "target_tick", anim: "badge" },
        "progress-improved": { icon: "trendUp_up", anim: "badge" },
        "stats-ready": { icon: "chartColumn_tick", anim: "badge" },
        "schedule-updated": { icon: "calendarDays_tick", anim: "badge" },
        "reminder-snoozed": { icon: "calendarDays_clock", anim: "badge" },
        "device-connected": { icon: "cpu_tick", anim: "badge" },
        "device-disconnected": { icon: "cpu_x", anim: "badge" },
        "cloud-backup-on": { icon: "cloud_up", anim: "badge" },
        "sound-on": { icon: "volume_tick", anim: "badge" },
        "sound-off": { icon: "volumeX", anim: "flick" },
        "terminal-ready": { icon: "terminal_tick", anim: "badge" },
        "directory-created": { icon: "container_plus", anim: "badge" },
        "contact-card-saved": { icon: "contact_tick", anim: "badge" },
        "workspace-ready": { icon: "briefcase_tick", anim: "badge" },
        "shift-started": { icon: "calendarDays_up", anim: "badge" },
        "shift-ended": { icon: "calendarDays_down", anim: "badge" },
        "timesheet-submitted": { icon: "notebookPen_up", anim: "badge" },
        "timesheet-approved": { icon: "notebookPen_tick", anim: "badge" },
        "expense-submitted": { icon: "briefcase_up", anim: "badge" },
        "expense-approved": { icon: "briefcase_tick", anim: "badge" },
        "expense-rejected": { icon: "briefcase_x", anim: "badge" },
        "leave-requested": { icon: "calendarDays_plus", anim: "badge" },
        "leave-approved": { icon: "calendarDays_up", anim: "badge" },
        "leave-declined": { icon: "calendarDays_minus", anim: "badge" },
        "survey-submitted": { icon: "presentation_up", anim: "badge" },
        "survey-closed": { icon: "presentation_x", anim: "badge" },
        "checklist-complete": { icon: "target_up", anim: "badge" },
        "checklist-reset": { icon: "target_minus", anim: "badge" },
        "signal-strong": { icon: "activity_up", anim: "badge" },
        "signal-weak": { icon: "activity_down", anim: "badge" },
        "battery-low": { icon: "cpu_bang", anim: "badge" },
        "battery-charged": { icon: "cpu_up", anim: "badge" },
        "storage-optimised": { icon: "hardDrive_down", anim: "badge" },
        "update-available": { icon: "cloud_plus", anim: "badge" },
        "update-installed": { icon: "cloud_tick", anim: "badge" },
        "update-failed": { icon: "cloud_bang", anim: "badge" },
        "restart-required": { icon: "cpu_clock", anim: "badge" },
        "diagnostics-passed": { icon: "stethoscope_tick", anim: "badge" },
        "diagnostics-failed": { icon: "stethoscope_x", anim: "badge" }
        // <<< generated
    }, "general");
})();
