/*!
 * Laravel Toaster Magic — preset pack: education
 *
 * Courses, lessons, assignments, grading and library.
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
            window.console.warn("[toast-magic] preset pack \"education\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3;

    P.register({
        graduationCap_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"' + S2 + '/><path d="M22 10v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        graduationCap: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"' + S2 + '/><path d="M22 10v6"' + S3 + '/></svg>',
        graduationCap_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"' + S2 + '/><path d="M22 10v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        bookOpen_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        bookOpen_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        bookOpen_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        notebookPen_tick: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        notebookPen_down: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        notebookPen_clock: ICON_ATTRS + '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"' + S3 + '/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        presentation_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        presentation_x: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        presentation_clock: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        lightbulb: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path class="tm-accent" d="M9 18h6M10 22h4"' + S2 + '/></svg>',
        lightbulb_tick: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path class="tm-accent" d="M9 18h6M10 22h4"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        graduationCap_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"' + S2 + '/><path d="M22 10v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        graduationCap_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"' + S2 + '/><path d="M22 10v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        chartColumn_tick: ICON_ATTRS + '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><g class="tm-accent"' + S2 + '><path d="M8 17v-3"/><path d="M13 17V5"/><path d="M18 17V9"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        calendarDays_plus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        calendarDays_bang: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        bookOpen_down: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        bookOpen_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        backpack_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path class="tm-accent" d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"' + S2 + '/><path d="M8 10h8M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        contact_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        video_tick: ICON_ATTRS + '<rect x="2" y="6" width="14" height="12" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        presentation_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>'
    }, {
        "course-enrolled": { icon: "graduationCap_tick", anim: "badge" },
        "course-completed": { icon: "graduationCap", anim: "rise" },
        "enrolment-closed": { icon: "graduationCap_x", anim: "badge" },
        "lesson-unlocked": { icon: "bookOpen_tick", anim: "badge" },
        "lesson-locked": { icon: "bookOpen_x", anim: "badge" },
        "chapter-added": { icon: "bookOpen_plus", anim: "badge" },
        "assignment-submitted": { icon: "notebookPen_tick", anim: "badge" },
        "assignment-returned": { icon: "notebookPen_down", anim: "badge" },
        "assignment-overdue": { icon: "notebookPen_clock", anim: "badge" },
        "quiz-passed": { icon: "presentation_tick", anim: "badge" },
        "quiz-failed": { icon: "presentation_x", anim: "badge" },
        "class-scheduled": { icon: "presentation_clock", anim: "badge" },
        "hint-available": { icon: "lightbulb", anim: "flick" },
        "answer-revealed": { icon: "lightbulb_tick", anim: "badge" },
        "study-streak": { icon: "graduationCap_up", anim: "badge" },
        "certificate-issued": { icon: "graduationCap_plus", anim: "badge" },
        "grade-published": { icon: "chartColumn_tick", anim: "badge" },
        "attendance-recorded": { icon: "calendarDays_plus", anim: "badge" },
        "attendance-low": { icon: "calendarDays_bang", anim: "badge" },
        "library-item-borrowed": { icon: "bookOpen_down", anim: "badge" },
        "library-item-returned": { icon: "bookOpen_up", anim: "badge" },
        "resource-shared": { icon: "backpack_plus", anim: "badge" },
        "tutor-assigned": { icon: "contact_tick", anim: "badge" },
        "session-recorded": { icon: "video_tick", anim: "badge" },
        "feedback-received": { icon: "presentation_plus", anim: "badge" }
    }, "education");
})();
