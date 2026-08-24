/*!
 * Laravel Toaster Magic — preset pack: social
 *
 * Messaging, comments, reviews, follows and moderation.
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
            window.console.warn("[toast-magic] preset pack \"social\" loaded before the runtime; ignoring.");
        }
        return;
    }

    var ICON_ATTRS = P.attrs, S2 = P.s2, S3 = P.s3, F2 = P.f2;

    P.register({
        calendar: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 2v3M16 2v3"' + S3 + '/><path d="M3 9h18"' + S3 + '/><path class="tm-tick" d="m9 15 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        bookmark: ICON_ATTRS + '<path fill="var(--tm-i2, none)" d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/></svg>',
        partyPopper: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/><path d="M5.8 11.3 2 22l10.7-3.79"/><g class="tm-sparks"' + S2 + '><path d="M4 3h.01" stroke-width="2.5"/><path d="M22 8h.01" stroke-width="2.5"/><path d="M15 2h.01" stroke-width="2.5"/><path d="M22 20h.01" stroke-width="2.5"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/></g></svg>',
        messageReply: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><g class="tm-arrow"' + S2 + '><path d="m10 8-3 3 3 3"/><path d="M17 14v-1a2 2 0 0 0-2-2H7"/></g></svg>',
        userPlus: ICON_ATTRS + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" fill="var(--tm-i3, none)"' + S3 + '/><g class="tm-plus"' + S2 + '><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></g></svg>',
        userMinus: ICON_ATTRS + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" fill="var(--tm-i3, none)"' + S3 + '/><line class="tm-minus" x1="22" x2="16" y1="11" y2="11" stroke-width="2.5"' + S2 + '/></svg>',
        thumbsUp: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/><path d="M7 10v12"' + S2 + '/></svg>',
        bubble: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.5"' + S2 + '/></svg>',
        messageCheck: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path class="tm-tick" d="m9 11 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        starCheck: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/><path class="tm-tick" d="m15.5 18 2 2 4-4" stroke-width="2.5"' + S2 + '/></svg>',
        starX: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/><g class="tm-x"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        star: ICON_ATTRS + '<path fill="var(--tm-i2, none)" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>',
        userX: ICON_ATTRS + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" fill="var(--tm-i3, none)"' + S3 + '/><g class="tm-x"' + S2 + '><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></g></svg>',
        // >>> generated by build/presets/generate.py
        contact_plus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        contact_minus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        contact_tick: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        phoneCall: ICON_ATTRS + '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"' + S2 + '><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g></svg>',
        phoneCall_down: ICON_ATTRS + '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"' + S2 + '><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="m16 18 3 3 3-3"/></g></svg>',
        contact_up: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        presentation_up: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        presentation_clock: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        presentation_minus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M16 18h6" stroke-width="2.5"/></g></svg>',
        presentation_bang: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"' + S3 + '/><path class="tm-accent" d="m7 21 5-5 5 5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        film_up: ICON_ATTRS + '<rect width="18" height="18" x="3" y="3" rx="2" fill="var(--tm-i3, none)"/><g class="tm-accent"' + S2 + '><path d="M7 3v18M17 3v18"/></g><path d="M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        film_clock: ICON_ATTRS + '<rect width="18" height="18" x="3" y="3" rx="2" fill="var(--tm-i3, none)"/><g class="tm-accent"' + S2 + '><path d="M7 3v18M17 3v18"/></g><path d="M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        video: ICON_ATTRS + '<rect x="2" y="6" width="14" height="12" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"' + S2 + '/></svg>',
        video_x: ICON_ATTRS + '<rect x="2" y="6" width="14" height="12" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        contact_bang: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 13v5"/><path d="M19 21h.01" stroke-width="2.5"/></g></svg>',
        heartPulse_plus: ICON_ATTRS + '<path fill="var(--tm-i3, none)" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path class="tm-accent" d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"' + S2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        target_tick: ICON_ATTRS + '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"' + S3 + '/><circle class="tm-accent" cx="12" cy="12" r="2"' + F2 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m15.5 18 2 2 4-4" stroke-width="2.5"/></g></svg>',
        trendUp_up: ICON_ATTRS + '<path class="tm-accent" d="m22 7-8.5 8.5-5-5L2 17"' + S2 + '/><path d="M16 7h6v6"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>',
        contact_x: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        contact_clock: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"' + S3 + '/><circle class="tm-accent" cx="12" cy="11" r="4"' + S2 + '/><path d="M17.915 21a6 6 0 1 0-12 0"' + S3 + '/><g class="tm-badge-glyph"' + S2 + '><circle cx="18" cy="18" r="4.5" fill="var(--tm-i3, none)"/><path d="M18 16v2.2l1.4.9"/></g></svg>',
        calendarDays_plus: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 15v6"/><path d="M16 18h6"/></g></svg>',
        calendarDays_x: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="m16 16 5 5"/><path d="m21 16-5 5"/></g></svg>',
        calendarDays_up: ICON_ATTRS + '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"' + S3 + '/><g class="tm-accent"' + S2 + '><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g><g class="tm-badge-glyph"' + S2 + '><path d="M19 21v-6"/><path d="m16 18 3-3 3 3"/></g></svg>'
        // <<< generated
    }, {
        "appointment-booked": { icon: "calendar", anim: "calendar-mark" },
        "bookmark-saved": { icon: "bookmark", anim: "bookmark-drop" },
        "celebration": { icon: "partyPopper", anim: "confetti-burst" },
        "comment-posted": { icon: "messageReply", anim: "reply-fly" },
        "follow-added": { icon: "userPlus", anim: "plus-pop" },
        "follow-removed": { icon: "userMinus", anim: "minus-fade" },
        "like-added": { icon: "thumbsUp", anim: "thumb-up" },
        "message-received": { icon: "bubble", anim: "bubble-pop" },
        "question-answered": { icon: "messageCheck", anim: "answer-mark" },
        "review-approved": { icon: "starCheck", anim: "star-approve" },
        "review-rejected": { icon: "starX", anim: "star-reject" },
        "review-submitted": { icon: "star", anim: "star-twinkle" },
        "user-blocked": { icon: "userX", anim: "block-strike" },
        // >>> generated by build/presets/generate.py
        "contact-added": { icon: "contact_plus", anim: "badge" },
        "contact-removed": { icon: "contact_minus", anim: "badge" },
        "contact-verified": { icon: "contact_tick", anim: "badge" },
        "call-started": { icon: "phoneCall", anim: "pulse" },
        "call-ended": { icon: "phoneCall_down", anim: "badge" },
        "group-created": { icon: "contact_up", anim: "badge" },
        "post-published": { icon: "presentation_up", anim: "badge" },
        "post-scheduled": { icon: "presentation_clock", anim: "badge" },
        "post-removed": { icon: "presentation_minus", anim: "badge" },
        "post-flagged": { icon: "presentation_bang", anim: "badge" },
        "story-posted": { icon: "film_up", anim: "badge" },
        "story-expired": { icon: "film_clock", anim: "badge" },
        "live-started": { icon: "video", anim: "pulse" },
        "live-ended": { icon: "video_x", anim: "badge" },
        "mention-received": { icon: "contact_bang", anim: "badge" },
        "reaction-received": { icon: "heartPulse_plus", anim: "badge" },
        "badge-earned": { icon: "target_tick", anim: "badge" },
        "milestone-reached": { icon: "trendUp_up", anim: "badge" },
        "profile-verified": { icon: "contact_up", anim: "badge" },
        "profile-hidden": { icon: "contact_x", anim: "badge" },
        "connection-requested": { icon: "contact_clock", anim: "badge" },
        "connection-accepted": { icon: "contact_tick", anim: "badge" },
        "event-created": { icon: "calendarDays_plus", anim: "badge" },
        "event-cancelled": { icon: "calendarDays_x", anim: "badge" },
        "rsvp-confirmed": { icon: "calendarDays_up", anim: "badge" }
        // <<< generated
    }, "social");
})();
