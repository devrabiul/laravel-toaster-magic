/*!
 * Laravel Toaster Magic — preset pack: travel
 *
 * Flights, stays, ground transport and itineraries.
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
            window.console.warn("[toast-magic] preset pack \"travel\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3, F2 = P.f2, F3 = P.f3;

    P.register({
        plane_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        plane_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        plane_clock: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        planeTakeoff: ICON_ATTRS + '<path class="tm-accent" d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"' + S2 + '/><path d="M2 22h20"' + S3 + '/></svg>',
        planeTakeoff_tick: ICON_ATTRS + '<path class="tm-accent" d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"' + S2 + '/><path d="M2 22h20"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        luggage_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path class="tm-accent" d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"' + S2 + '/><g class="tm-wheels"' + F3 + '><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        luggage_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path class="tm-accent" d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"' + S2 + '/><g class="tm-wheels"' + F3 + '><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        luggage_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path class="tm-accent" d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"' + S2 + '/><g class="tm-wheels"' + F3 + '><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        bed_tick: ICON_ATTRS + '<path d="M2 4v16"/><path fill="var(--tm-i3, none)" d="M2 8h18a2 2 0 0 1 2 2v10"/><path class="tm-accent" d="M2 17h20"' + S2 + '/><path d="M6 8v9"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        bed_x: ICON_ATTRS + '<path d="M2 4v16"/><path fill="var(--tm-i3, none)" d="M2 8h18a2 2 0 0 1 2 2v10"/><path class="tm-accent" d="M2 17h20"' + S2 + '/><path d="M6 8v9"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        bed_clock: ICON_ATTRS + '<path d="M2 4v16"/><path fill="var(--tm-i3, none)" d="M2 8h18a2 2 0 0 1 2 2v10"/><path class="tm-accent" d="M2 17h20"' + S2 + '/><path d="M6 8v9"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        map_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path class="tm-accent" d="M15 5.764v15M9 3.236v15"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        map_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path class="tm-accent" d="M15 5.764v15M9 3.236v15"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        compass: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"' + S2 + '/></svg>',
        car_tick: ICON_ATTRS + '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"' + S3 + '/><g class="tm-wheels"' + F2 + '><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        car_x: ICON_ATTRS + '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"' + S3 + '/><g class="tm-wheels"' + F2 + '><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        car_clock: ICON_ATTRS + '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"' + S3 + '/><g class="tm-wheels"' + F2 + '><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        bus_clock: ICON_ATTRS + '<path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><path d="M8 6v6M15 6v6M2 12h19.6M9 18h5"' + S3 + '/><g class="tm-wheels"' + F2 + '><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        bus_tick: ICON_ATTRS + '<path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><path d="M8 6v6M15 6v6M2 12h19.6M9 18h5"' + S3 + '/><g class="tm-wheels"' + F2 + '><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        train_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path class="tm-accent" d="M8 3.1V7a4 4 0 0 0 8 0V3.1"' + S2 + '/><path d="m9 15-1-1M15 15l1-1M8 19l-2 3M16 19l2 3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        train_clock: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path class="tm-accent" d="M8 3.1V7a4 4 0 0 0 8 0V3.1"' + S2 + '/><path d="m9 15-1-1M15 15l1-1M8 19l-2 3M16 19l2 3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        ship_tick: ICON_ATTRS + '<path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"/><path fill="var(--tm-i3, none)" d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path class="tm-accent" d="M12 10.189V14M12 2v3"' + S2 + '/><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        tent_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M3.5 21 14 3l6.5 18z"/><path class="tm-accent" d="M15.5 21 12 15l-3.5 6"' + S2 + '/><path d="M2 21h20"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        sun: ICON_ATTRS + '<circle cx="12" cy="12" r="4" fill="var(--tm-i3, none)"/><g class="tm-accent"' + S2 + '><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/><path d="m4.93 4.93 1.41 1.41M17.66 17.66l1.41 1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g></svg>',
        umbrella_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z"/><path class="tm-accent" d="M12 13v7a2 2 0 0 0 4 0M12 2v2"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        backpack_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path class="tm-accent" d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"' + S2 + '/><path d="M8 10h8M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>'
    }, {
        "flight-booked": { icon: "plane_tick", anim: "badge" },
        "flight-cancelled": { icon: "plane_x", anim: "badge" },
        "flight-delayed": { icon: "plane_clock", anim: "badge" },
        "check-in-open": { icon: "planeTakeoff", anim: "drive" },
        "boarding-started": { icon: "planeTakeoff_tick", anim: "badge" },
        "baggage-checked": { icon: "luggage_tick", anim: "badge" },
        "baggage-lost": { icon: "luggage_bang", anim: "badge" },
        "baggage-extra-added": { icon: "luggage_plus", anim: "badge" },
        "hotel-booked": { icon: "bed_tick", anim: "badge" },
        "hotel-cancelled": { icon: "bed_x", anim: "badge" },
        "checkout-reminder": { icon: "bed_clock", anim: "badge" },
        "route-saved": { icon: "map_tick", anim: "badge" },
        "route-changed": { icon: "map_bang", anim: "badge" },
        "directions-ready": { icon: "compass", anim: "spin" },
        "ride-booked": { icon: "car_tick", anim: "badge" },
        "ride-cancelled": { icon: "car_x", anim: "badge" },
        "driver-arriving": { icon: "car_clock", anim: "badge" },
        "bus-departing": { icon: "bus_clock", anim: "badge" },
        "bus-booked": { icon: "bus_tick", anim: "badge" },
        "train-booked": { icon: "train_tick", anim: "badge" },
        "train-delayed": { icon: "train_clock", anim: "badge" },
        "ferry-booked": { icon: "ship_tick", anim: "badge" },
        "campsite-reserved": { icon: "tent_tick", anim: "badge" },
        "weather-clear": { icon: "sun", anim: "spin" },
        "weather-warning": { icon: "umbrella_bang", anim: "badge" },
        "packing-list-ready": { icon: "backpack_tick", anim: "badge" }
    }, "travel");
})();
