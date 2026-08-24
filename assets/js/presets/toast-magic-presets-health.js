/*!
 * Laravel Toaster Magic — preset pack: health
 *
 * Clinical and wellbeing flows: appointments, prescriptions, vitals, lab work.
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
            window.console.warn("[toast-magic] preset pack \"health\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3, F2 = P.f2, F3 = P.f3;

    P.register({
        calendarDays_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_x: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        calendarDays_clock: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        pill_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path class="tm-accent" d="m8.5 8.5 7 7"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        pill_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path class="tm-accent" d="m8.5 8.5 7 7"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        pill_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path class="tm-accent" d="m8.5 8.5 7 7"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        heartPulse: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path class="tm-accent" d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"' + S2 + '/></svg>',
        heartPulse_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path class="tm-accent" d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        stethoscope_tick: ICON_ATTRS + '<path d="M11 2v2M5 2v2"' + S3 + '/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle class="tm-accent" cx="20" cy="10" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        stethoscope: ICON_ATTRS + '<path d="M11 2v2M5 2v2"' + S3 + '/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle class="tm-accent" cx="20" cy="10" r="2"' + F2 + '/></svg>',
        syringe_tick: ICON_ATTRS + '<path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path class="tm-accent" d="m18 2 4 4M17 7l3-3M14 4l6 6"' + S2 + '/><path d="m9 11 4 4M5 19l-3 3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        syringe_clock: ICON_ATTRS + '<path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path class="tm-accent" d="m18 2 4 4M17 7l3-3M14 4l6 6"' + S2 + '/><path d="m9 11 4 4M5 19l-3 3"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        thermometer_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        thermometer_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        activity: ICON_ATTRS + '<path class="tm-accent" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"' + S2 + '/></svg>',
        activity_x: ICON_ATTRS + '<path class="tm-accent" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        bandage_tick: ICON_ATTRS + '<rect x="2" y="6" width="20" height="12" rx="2" fill="var(--tm-i3, none)"/><path d="M18 6v12M6 6v12"' + S3 + '/><path class="tm-accent" d="M10 10.01h.01M10 14.01h.01M14 10.01h.01M14 14.01h.01" stroke-width="2.5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        bandage_bang: ICON_ATTRS + '<rect x="2" y="6" width="20" height="12" rx="2" fill="var(--tm-i3, none)"/><path d="M18 6v12M6 6v12"' + S3 + '/><path class="tm-accent" d="M10 10.01h.01M10 14.01h.01M14 10.01h.01M14 14.01h.01" stroke-width="2.5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        ambulance: ICON_ATTRS + '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"' + S3 + '/><path d="M9 18h6"' + S3 + '/><path class="tm-accent" d="M10 10H6M8 8v4"' + S2 + '/><g class="tm-wheels"' + F3 + '><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g></svg>',
        ambulance_tick: ICON_ATTRS + '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"' + S3 + '/><path d="M9 18h6"' + S3 + '/><path class="tm-accent" d="M10 10H6M8 8v4"' + S2 + '/><g class="tm-wheels"' + F3 + '><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        hospital_tick: ICON_ATTRS + '<path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path fill="var(--tm-i3, none)" d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"' + S3 + '/><path class="tm-accent" d="M12 7v4M14 9h-4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        hospital_down: ICON_ATTRS + '<path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path fill="var(--tm-i3, none)" d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"' + S3 + '/><path class="tm-accent" d="M12 7v4M14 9h-4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        testTube_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path class="tm-accent" d="M8.5 2h7M14.5 16h-5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        testTube_clock: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path class="tm-accent" d="M8.5 2h7M14.5 16h-5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        testTube_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path class="tm-accent" d="M8.5 2h7M14.5 16h-5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        microscope_tick: ICON_ATTRS + '<path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" fill="var(--tm-i3, none)"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M6 18h8M3 22h18M9 14h2"' + S3 + '/><path class="tm-accent" d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        dna_tick: ICON_ATTRS + '<path d="M2 15c6.667-6 13.333 0 20-6"/><path class="tm-accent" d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993M9 22c1.798-1.998 2.518-3.995 2.807-5.993"' + S2 + '/><path d="m10 16 1.5 1.5M14 8l-1.5-1.5M16.5 10.5l1 1M6.5 12.5l1 1"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        brain_tick: ICON_ATTRS + '<path d="M12 18V5"' + S3 + '/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path class="tm-accent" d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>'
    }, {
        "appointment-confirmed": { icon: "calendarDays_tick", anim: "badge" },
        "appointment-cancelled": { icon: "calendarDays_x", anim: "badge" },
        "appointment-rescheduled": { icon: "calendarDays_clock", anim: "badge" },
        "prescription-ready": { icon: "pill_tick", anim: "badge" },
        "prescription-expired": { icon: "pill_x", anim: "badge" },
        "refill-requested": { icon: "pill_plus", anim: "badge" },
        "vitals-recorded": { icon: "heartPulse", anim: "pulse" },
        "vitals-abnormal": { icon: "heartPulse_bang", anim: "badge" },
        "consultation-booked": { icon: "stethoscope_tick", anim: "badge" },
        "consultation-started": { icon: "stethoscope", anim: "pulse" },
        "vaccination-recorded": { icon: "syringe_tick", anim: "badge" },
        "vaccination-due": { icon: "syringe_clock", anim: "badge" },
        "temperature-high": { icon: "thermometer_bang", anim: "badge" },
        "temperature-normal": { icon: "thermometer_tick", anim: "badge" },
        "activity-goal-met": { icon: "activity", anim: "pulse" },
        "activity-goal-missed": { icon: "activity_x", anim: "badge" },
        "first-aid-logged": { icon: "bandage_tick", anim: "badge" },
        "injury-reported": { icon: "bandage_bang", anim: "badge" },
        "ambulance-dispatched": { icon: "ambulance", anim: "drive" },
        "ambulance-arrived": { icon: "ambulance_tick", anim: "badge" },
        "admission-recorded": { icon: "hospital_tick", anim: "badge" },
        "discharge-recorded": { icon: "hospital_down", anim: "badge" },
        "lab-result-ready": { icon: "testTube_tick", anim: "badge" },
        "lab-result-pending": { icon: "testTube_clock", anim: "badge" },
        "sample-collected": { icon: "testTube_plus", anim: "badge" },
        "screening-complete": { icon: "microscope_tick", anim: "badge" },
        "genetic-report-ready": { icon: "dna_tick", anim: "badge" },
        "assessment-complete": { icon: "brain_tick", anim: "badge" }
    }, "health");
})();
