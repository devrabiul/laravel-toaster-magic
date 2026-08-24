/*!
 * Laravel Toaster Magic — preset pack: crm
 *
 * Leads, deals, accounts, calls and forecasting.
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
            window.console.warn("[toast-magic] preset pack \"crm\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3, F2 = P.f2;

    P.register({
        contact_plus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        contact_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        contact_x: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        target_tick: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        target_x: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        target_up: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        trendUp: ICON_ATTRS + '<path class="tm-accent" d="m22 7-8.5 8.5-5-5L2 17"' + S2 + '/><path d="M16 7h6v6"' + S3 + '/></svg>',
        trendUp_bang: ICON_ATTRS + '<path class="tm-accent" d="m22 7-8.5 8.5-5-5L2 17"' + S2 + '/><path d="M16 7h6v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        chartColumn: ICON_ATTRS + '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><g class="tm-accent"' + S2 + '><path d="M8 17v-3"/><path d="M13 17V5"/><path d="M18 17V9"/></g></svg>',
        chartColumn_clock: ICON_ATTRS + '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><g class="tm-accent"' + S2 + '><path d="M8 17v-3"/><path d="M13 17V5"/><path d="M18 17V9"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        phoneCall_tick: ICON_ATTRS + '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"' + S2 + '><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        phoneCall_x: ICON_ATTRS + '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"' + S2 + '><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        phoneCall_clock: ICON_ATTRS + '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"' + S2 + '><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        calendarDays_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_minus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        building_plus: ICON_ATTRS + '<path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path fill="var(--tm-i3, none)" d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path class="tm-accent" d="M10 12h4M10 8h4"' + S2 + '/><path d="M14 21v-3a2 2 0 0 0-4 0v3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        building_minus: ICON_ATTRS + '<path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path fill="var(--tm-i3, none)" d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path class="tm-accent" d="M10 12h4M10 8h4"' + S2 + '/><path d="M14 21v-3a2 2 0 0 0-4 0v3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        briefcase_tick: ICON_ATTRS + '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        briefcase_up: ICON_ATTRS + '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        presentation_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        presentation_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        presentation_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        notebookPen_tick: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_clock: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        map_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path class="tm-accent" d="M15 5.764v15M9 3.236v15"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>'
    }, {
        "lead-created": { icon: "contact_plus", anim: "badge" },
        "lead-qualified": { icon: "contact_tick", anim: "badge" },
        "lead-lost": { icon: "contact_x", anim: "badge" },
        "deal-won": { icon: "target_tick", anim: "badge" },
        "deal-lost": { icon: "target_x", anim: "badge" },
        "deal-stage-changed": { icon: "target_up", anim: "badge" },
        "quota-reached": { icon: "trendUp", anim: "rise" },
        "quota-at-risk": { icon: "trendUp_bang", anim: "badge" },
        "forecast-updated": { icon: "chartColumn", anim: "pulse" },
        "report-scheduled": { icon: "chartColumn_clock", anim: "badge" },
        "call-logged": { icon: "phoneCall_tick", anim: "badge" },
        "call-missed": { icon: "phoneCall_x", anim: "badge" },
        "callback-scheduled": { icon: "phoneCall_clock", anim: "badge" },
        "meeting-booked": { icon: "calendarDays_tick", anim: "badge" },
        "meeting-cancelled": { icon: "calendarDays_minus", anim: "badge" },
        "company-added": { icon: "building_plus", anim: "badge" },
        "company-archived": { icon: "building_minus", anim: "badge" },
        "account-assigned": { icon: "briefcase_tick", anim: "badge" },
        "account-transferred": { icon: "briefcase_up", anim: "badge" },
        "proposal-sent": { icon: "presentation_up", anim: "badge" },
        "proposal-accepted": { icon: "presentation_tick", anim: "badge" },
        "proposal-rejected": { icon: "presentation_x", anim: "badge" },
        "contract-signed": { icon: "notebookPen_tick", anim: "badge" },
        "renewal-due": { icon: "calendarDays_clock", anim: "badge" },
        "territory-updated": { icon: "map_plus", anim: "badge" }
    }, "crm");
})();
