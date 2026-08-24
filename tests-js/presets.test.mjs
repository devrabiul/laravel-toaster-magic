/**
 * Animated icon presets.
 *
 * A preset is a presentation layer on top of a type: it swaps the icon and
 * gives it motion. These tests pin down that it never leaks into the type, that
 * an unregistered name degrades instead of rendering, and that the avatar keeps
 * its precedence over the icon slot.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
    coreSource, coreStylesheet, loadRuntime, onlyToast, packSource,
    packStylesheet, PACKS, stubAnimationFrame, toasts,
} from "./helpers.mjs";

/** Core plus every pack — what `'presets' => 'all'` ships. */
const stylesheet = () => coreStylesheet() + PACKS.map(packStylesheet).join("\n");
// The paint shorthands live in the core runtime and the icon markup in the
// packs, so a variable is only provably dead when neither reads it.
const allSources = () => coreSource() + PACKS.map(packSource).join("\n");

const iconContainer = (toast) => toast.querySelector(".toast-body-icon-container");

describe("toast presets", () => {
    beforeEach(() => {
        loadRuntime({});
        stubAnimationFrame();
    });

    it("stamps the preset and animation classes on the icon container", () => {
        window.toastMagic.success({ heading: "Added to cart", preset: "cart-add" });

        const icon = iconContainer(onlyToast());
        expect(icon.classList.contains("tm-preset")).toBe(true);
        expect(icon.classList.contains("tm-preset-cart-add")).toBe(true);
        expect(icon.classList.contains("tm-anim-bounce")).toBe(true);
        expect(icon.querySelector("svg.tm-icon-base")).not.toBeNull();
    });

    it("keeps the type classes when a preset is applied", () => {
        // The preset owns the icon; the type still owns colour, the progress bar
        // and the theme treatment.
        window.toastMagic.error({ heading: "Payment failed", preset: "payment-failed" });

        const toast = onlyToast();
        expect(toast.classList.contains("toast-danger")).toBe(true);
        expect(toast.dataset.toastItemType).toBe("error");
        expect(toast.querySelector(".toast-text-danger")).not.toBeNull();
    });

    it.each([
        ["cart-add", "bounce"],
        ["wishlist-add", "pop-particles"],
        ["wishlist-remove", "heart-break"],
        ["order-placed", "box-drop"],
        ["payment-success", "note-swipe"],
        ["payment-failed", "card-strike"],
        ["item-removed", "lid-lift"],
        ["clipboard-copy", "clip-snap"],
        ["link-shared", "nodes-pulse"],
        ["profile-updated", "user-pop"],
        ["settings-saved", "gear-spin"],
        ["download-complete", "arrow-down"],
        ["upload-complete", "arrow-up"],
        ["connection-restored", "arcs-stagger"],
        ["loading", "spin-loop"],
        ["connection-lost", "signal-drop"],
        ["session-expiring", "clock-sweep"],
        ["out-of-stock", "stock-out"],
        ["back-in-stock", "bell-ring"],
        ["coupon-applied", "ticket-punch"],
        ["email-sent", "plane-launch"],
        ["password-changed", "lock-shut"],
        ["login", "door-in"],
        ["logout", "door-out"],
        ["order-shipped", "truck-drive"],
        ["order-delivered", "parcel-open"],
        ["message-received", "bubble-pop"],
        ["review-submitted", "star-twinkle"],
        ["refund-issued", "coins-return"],
        ["subscription-upgraded", "crown-rise"],
        ["email-verified", "badge-pulse"],
        ["sync-complete", "sync-turn"],
        ["draft-saved", "pen-write"],
        ["bookmark-saved", "bookmark-drop"],
        ["follow-added", "plus-pop"],
        ["appointment-booked", "calendar-mark"],
        ["no-results", "search-sweep"],
        ["permission-denied", "shield-warn"],
        ["file-rejected", "file-reject"],
        ["export-ready", "file-descend"],
        ["print-sent", "print-feed"],
        ["address-saved", "pin-drop"],
        ["otp-sent", "phone-buzz"],
        ["two-factor-enabled", "shield-lock"],
        ["api-key-generated", "key-turn"],
        ["like-added", "thumb-up"],
        ["notifications-muted", "bell-mute"],
        ["archived", "archive-in"],
        ["restored", "archive-out"],
        ["backup-complete", "disk-stack"],
        ["cache-cleared", "bolt-flash"],
        ["trial-ending", "sand-fall"],
        ["cart-update", "cart-swap"],
        ["cart-remove", "cart-out"],
        ["comment-posted", "reply-fly"],
        ["follow-removed", "minus-fade"],
        ["user-blocked", "block-strike"],
        ["invite-sent", "invite-wave"],
        ["photo-uploaded", "frame-fill"],
        ["deploy-succeeded", "rocket-launch"],
        ["maintenance-mode", "wrench-turn"],
        ["theme-changed", "moon-swap"],
        ["language-changed", "glyph-swap"],
        ["filter-applied", "funnel-settle"],
        ["points-earned", "award-shine"],
        ["wallet-topped-up", "wallet-fill"],
        ["qr-generated", "qr-scan"],
        ["terms-accepted", "terms-mark"],
        ["deploy-failed", "crash-shake"],
        ["recording-started", "mic-live"],
        ["mic-muted", "mic-cut"],
        ["camera-off", "lens-cut"],
        ["screen-shared", "screen-cast"],
        ["invoice-paid", "receipt-stamp"],
        ["pinned", "pin-press"],
        ["unpinned", "pin-lift"],
        ["folder-created", "folder-grow"],
        ["duplicated", "copy-split"],
        ["reminder-set", "alarm-tick"],
        ["gift-sent", "gift-shake"],
        ["celebration", "confetti-burst"],
        ["rate-limited", "gauge-swing"],
        ["checkout-started", "bag-swing"],
        ["order-cancelled", "order-void"],
        ["return-requested", "return-arc"],
        ["price-dropped", "price-fall"],
        ["stock-low", "stock-dip"],
        ["product-added", "product-add"],
        ["inventory-updated", "stack-shuffle"],
        ["compare-added", "scale-tip"],
        ["free-shipping-unlocked", "perk-unlock"],
        ["gift-card-applied", "card-flip"],
        ["subscription-renewed", "renew-loop"],
        ["subscription-cancelled", "plan-void"],
        ["barcode-scanned", "scan-line"],
        ["preorder-placed", "preorder-hold"],
        ["out-for-delivery", "courier-ride"],
        ["pickup-ready", "store-open"],
        ["product-published", "eye-open"],
        ["product-unpublished", "eye-shut"],
        ["size-guide-opened", "ruler-measure"],
        ["currency-changed", "coin-spin"],
        ["payout-sent", "bank-transfer"],
        ["dispute-opened", "gavel-strike"],
        ["order-on-hold", "hold-pulse"],
        ["csv-imported", "sheet-fill"],
        ["warranty-registered", "warranty-seal"],
        ["eco-delivery", "leaf-sway"],
        ["delivery-failed", "drop-miss"],
        ["payment-pending", "card-wait"],
        ["payment-method-added", "card-add"],
        ["payment-method-removed", "card-drop"],
        ["payment-retry", "card-retry"],
        ["card-expiring", "card-expire"],
        ["installment-selected", "slice-fill"],
        ["refund-declined", "refund-void"],
        ["address-verified", "pin-verify"],
        ["address-invalid", "pin-alert"],
        ["tracking-added", "parcel-scan"],
        ["partial-shipment", "parcel-split"],
        ["international-shipping", "globe-spin"],
        ["customs-cleared", "customs-stamp"],
        ["signature-required", "sign-line"],
        ["shipping-calculated", "calc-tally"],
        ["tag-added", "tag-flip"],
        ["category-created", "tree-grow"],
        ["bundle-created", "bundle-bind"],
        ["variant-added", "swatch-cycle"],
        ["seo-updated", "seo-check"],
        ["bulk-edit-applied", "list-tick"],
        ["stocktake-completed", "tally-done"],
        ["flash-sale-started", "flame-flicker"],
        ["sale-ended", "timer-stop"],
        ["coupon-expired", "coupon-void"],
        ["coupon-invalid", "coupon-warn"],
        ["reward-redeemed", "spark-burst"],
        ["referral-earned", "hands-meet"],
        ["newsletter-subscribed", "mail-join"],
        ["newsletter-unsubscribed", "mail-leave"],
        ["review-approved", "star-approve"],
        ["review-rejected", "star-reject"],
        ["question-answered", "answer-mark"],
        ["stock-notify-requested", "bell-subscribe"],
        ["account-created", "account-open"],
        ["guest-checkout", "guest-enter"],
        ["cart-merged", "merge-join"],
        ["cart-expired", "cart-lapse"],
        ["recently-viewed", "history-rewind"],
        ["order-issue-reported", "issue-flag"],
        ["store-closed", "store-shut"],
    ])("renders the %s preset with the %s animation", (preset, anim) => {
        window.toastMagic.success({ heading: "Hi", preset });

        const icon = iconContainer(onlyToast());
        expect(icon.classList.contains(`tm-preset-${preset}`)).toBe(true);
        expect(icon.classList.contains(`tm-anim-${anim}`)).toBe(true);
        expect(icon.querySelector("svg.tm-icon-base")).not.toBeNull();
    });

    it("records which pack every preset came from", () => {
        // Lets a page report what it actually loaded instead of trusting a
        // hardcoded list that drifts from the files.
        const { TOAST_PRESETS, PRESET_PACK_OF } = window.ToastMagicInternals;
        const names = Object.keys(TOAST_PRESETS);

        expect(Object.keys(PRESET_PACK_OF)).toHaveLength(names.length);
        for (const name of names) {
            expect(PACKS, `${name} -> ${PRESET_PACK_OF[name]}`).toContain(PRESET_PACK_OF[name]);
        }
    });

    it("attributes presets only to the packs actually loaded", () => {
        loadRuntime({}, {}, "", ["commerce", "media"]);
        const { TOAST_PRESETS, PRESET_PACK_OF } = window.ToastMagicInternals;

        expect(new Set(Object.values(PRESET_PACK_OF))).toEqual(new Set(["commerce", "media"]));
        expect(Object.keys(TOAST_PRESETS)).toHaveLength(121 + 36);
    });

    it("registers exactly the documented presets", () => {
        expect(Object.keys(window.ToastMagicInternals.TOAST_PRESETS)).toHaveLength(517);
    });

    it("never replaces the caller's icon with a second one", () => {
        // A preset animates the icon it was given. An overlay layer used to take
        // over five of these — every one ended as the same green tick, so the
        // icon you picked was gone ~360ms in.
        for (const name of Object.keys(window.ToastMagicInternals.TOAST_PRESETS)) {
            loadRuntime({});
            window.toastMagic.success({ heading: "Hi", preset: name });

            const svgs = onlyToast().querySelectorAll(".toast-body-icon-container svg");
            expect(svgs, `${name} renders ${svgs.length} icons`).toHaveLength(1);
            expect(svgs[0].classList.contains("tm-icon-base")).toBe(true);
        }
    });

    it("never renders two presets identically", () => {
        // The bug this guards is presets that are indistinguishable *on screen*,
        // not ones that share a motion. Sharing an animation is fine and
        // intended — a badge pulse is the same wherever it appears — and so is
        // sharing geometry across domains. What must never repeat is the whole
        // appearance: icon, motion and palette together.
        const css = stylesheet();
        const paletteOf = (name) => {
            const rule = css.match(
                new RegExp(`(?<!\\] )\\.toast-body-icon-container\\.tm-preset-${name}\\s*\\{([^}]*)\\}`),
            );
            return rule ? rule[1].replace(/\s+/g, " ").trim() : "(no palette)";
        };

        const seen = new Map();

        for (const [name, preset] of Object.entries(window.ToastMagicInternals.TOAST_PRESETS)) {
            const key = `${preset.icon}+${preset.anim}+${paletteOf(name)}`;
            expect(seen.has(key), `${name} is identical to ${seen.get(key)}`).toBe(false);
            seen.set(key, name);
        }
    });

    it("adds particle elements only for the wishlist-add preset", () => {
        window.toastMagic.success({ heading: "Saved", preset: "wishlist-add" });
        expect(onlyToast().querySelectorAll(".tm-particle")).toHaveLength(6);

        loadRuntime({});
        window.toastMagic.success({ heading: "Saved", preset: "cart-add" });
        expect(onlyToast().querySelectorAll(".tm-particle")).toHaveLength(0);
    });

    it("puts shake on the inner wrapper, never on the toast itself", () => {
        // .toast-item's transform is owned by the entrance transition and its
        // translate by the FLIP reflow — a third animation there would fight both.
        window.toastMagic.error({ heading: "Declined", preset: "payment-failed" });

        const toast = onlyToast();
        expect(toast.querySelector(".toast-magic-relative").classList.contains("tm-anim-shake")).toBe(true);
        expect(toast.classList.contains("tm-anim-shake")).toBe(false);
    });

    // The animations below address individual parts of an icon by structure, so
    // these pin the markup contract the stylesheet depends on. Swapping an icon
    // for one with a different shape would otherwise break the motion silently.

    it("gives the trash icon a lid group for lid-lift to pivot", () => {
        window.toastMagic.warning({ heading: "Removed", preset: "item-removed" });

        expect(onlyToast().querySelector(".tm-icon-base g.tm-lid")).not.toBeNull();
    });

    it("gives the wifi icon four paths for arcs-stagger to sequence", () => {
        window.toastMagic.success({ heading: "Online", preset: "connection-restored" });

        expect(onlyToast().querySelectorAll(".tm-icon-base path")).toHaveLength(4);
    });

    it("gives the share icon three circles for nodes-pulse to sequence", () => {
        window.toastMagic.info({ heading: "Shared", preset: "link-shared" });

        expect(onlyToast().querySelectorAll(".tm-icon-base circle")).toHaveLength(3);
    });

    it("paints every preset icon from palette variables, never a literal colour", () => {
        // Two things ride on this. A hardcoded hex would ignore the dark-mode
        // palette and the neon override; and dropping the `currentColor`
        // fallback would leave an icon invisible for anyone who resets the
        // variables to go back to monochrome.
        const PAINT = /^(none|var\(--tm-i[123], (?:currentColor|none)\))$/;

        for (const name of Object.keys(window.ToastMagicInternals.TOAST_PRESETS)) {
            loadRuntime({});
            window.toastMagic.success({ heading: "Hi", preset: name });

            const icon = iconContainer(onlyToast());
            const painted = icon.querySelectorAll("svg, path, circle, ellipse, rect, line, polyline, g");
            expect(painted.length).toBeGreaterThan(0);

            painted.forEach((el) => {
                ["stroke", "fill"].forEach((attr) => {
                    const value = el.getAttribute(attr);
                    if (value === null) return; // inherited from the <svg>
                    expect(value, `${name} <${el.tagName}> ${attr}="${value}"`).toMatch(PAINT);
                });
            });
        }
    });

    it("ships a keyframed rule for every preset animation", () => {
        // `slide` shipped for three releases as a config value with no CSS
        // behind it. An animation named in the registry but absent from the
        // stylesheet fails the same silent way — the icon just sits there.
        const css = stylesheet();

        for (const [name, preset] of Object.entries(window.ToastMagicInternals.TOAST_PRESETS)) {
            const rule = new RegExp(`\\.tm-anim-${preset.anim}[\\s.:>{]`);
            expect(css, `${name}: no rule for .tm-anim-${preset.anim}`).toMatch(rule);
        }
    });

    it("gives every preset motion that repeats rather than a one-shot entrance", () => {
        // The whole point of a preset is that the icon is animated. An entrance
        // that plays once and freezes reads as a static icon a moment later —
        // which is what every preset except `nodes-pulse` used to do.
        const css = stylesheet();

        for (const [name, preset] of Object.entries(window.ToastMagicInternals.TOAST_PRESETS)) {
            const repeats = new RegExp(
                `\\.tm-anim-${preset.anim}[^{]*\\{[^}]*animation:[^;]* (2|infinite);`,
            );
            expect(css, `${name}: .tm-anim-${preset.anim} has no repeating rule`).toMatch(repeats);
        }
    });

    it("declares no custom property that nothing reads", () => {
        // Variables are consumed from two places: the stylesheet, and the icon
        // markup in the runtime (`stroke="var(--tm-i1, currentColor)"`). A
        // declaration read by neither is dead weight that survives minification
        // — `--tm-ic` outlived the checkmark overlay this way.
        const css = stylesheet();
        const js = allSources();
        const code = css.replace(/\/\*[\s\S]*?\*\//g, "");

        const declared = new Set([...code.matchAll(/(--tm-i[\w-]+)\s*:/g)].map((m) => m[1]));
        const read = new Set([
            ...code.matchAll(/var\(\s*(--tm-i[\w-]+)/g),
            ...js.matchAll(/var\(\s*(--tm-i[\w-]+)/g),
        ].map((m) => m[1]));

        expect(declared.size).toBeGreaterThan(0);
        for (const name of declared) {
            expect([...read], `${name} is declared but never read`).toContain(name);
        }
    });

    it("ships a light and a dark palette for every preset", () => {
        // Without a palette a preset silently renders monochrome, which looks
        // like a styling bug rather than a missing rule. Without a dark variant
        // it keeps its light colours on a dark toast surface.
        const css = stylesheet();

        for (const name of Object.keys(window.ToastMagicInternals.TOAST_PRESETS)) {
            const light = new RegExp(`(?<!body\\[theme="dark"\\] )\\.toast-body-icon-container\\.tm-preset-${name}\\s*\\{[^}]*--tm-i1`);
            const dark = new RegExp(`body\\[theme="dark"\\] \\.toast-body-icon-container\\.tm-preset-${name}\\s*\\{[^}]*--tm-i1`);

            expect(css, `${name} has no light palette`).toMatch(light);
            expect(css, `${name} has no dark palette`).toMatch(dark);
        }
    });

    it("keeps a currentColor fallback on the root of every preset icon", () => {
        for (const name of Object.keys(window.ToastMagicInternals.TOAST_PRESETS)) {
            loadRuntime({});
            window.toastMagic.success({ heading: "Hi", preset: name });

            const svg = onlyToast().querySelector("svg.tm-icon-base");
            expect(svg.getAttribute("stroke")).toBe("var(--tm-i1, currentColor)");
            expect(svg.getAttribute("fill")).toBe("none");
        }
    });

    it("ignores an unregistered preset and falls back to the type icon", () => {
        window.toastMagic.success({ heading: "Added to cart", preset: "cart-added" });

        const icon = iconContainer(onlyToast());
        expect(icon.classList.contains("tm-preset")).toBe(false);
        expect(icon.querySelector("svg")).not.toBeNull();
        expect(icon.querySelector("svg.tm-icon-base")).toBeNull();
    });

    it("ignores inherited property names", () => {
        // A plain object lookup would resolve these to something that is not a
        // preset, so the registry is read through hasOwnProperty.
        for (const name of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
            loadRuntime({});
            window.toastMagic.success({ heading: "Hi", preset: name });
            expect(iconContainer(onlyToast()).classList.contains("tm-preset")).toBe(false);
        }
    });

    it.each([[true], [42], [null], [{}], [["cart-add"]]])(
        "ignores a non-string preset (%s)",
        (preset) => {
            window.toastMagic.success({ heading: "Hi", preset });
            expect(iconContainer(onlyToast()).classList.contains("tm-preset")).toBe(false);
        },
    );

    it("lets the avatar win over the preset icon", () => {
        window.toastMagic.success({
            heading: "Added to cart",
            preset: "cart-add",
            avatar: "https://example.com/a.png",
        });

        const toast = onlyToast();
        expect(toast.querySelector("img.toast-avatar")).not.toBeNull();
        expect(toast.querySelector(".toast-body-icon-container svg")).toBeNull();
    });

    it("falls back to the preset icon when the avatar URL is rejected", () => {
        window.toastMagic.success({
            heading: "Added to cart",
            preset: "cart-add",
            avatar: "javascript:alert(1)",
        });

        const icon = iconContainer(onlyToast());
        expect(icon.querySelector("img")).toBeNull();
        expect(icon.classList.contains("tm-preset-cart-add")).toBe(true);
        expect(icon.querySelector("svg.tm-icon-base")).not.toBeNull();
    });

    it("treats two presets sharing the same text as different toasts", () => {
        // The duplicate key includes the preset; without it the second toast
        // would be dropped and its icon silently lost.
        loadRuntime({ preventDuplicates: true });
        stubAnimationFrame();

        window.toastMagic.success({ heading: "Saved", preset: "settings-saved" });
        window.toastMagic.success({ heading: "Saved", preset: "clipboard-copy" });

        expect(toasts()).toHaveLength(2);
    });

    it("still collapses genuine duplicates of the same preset", () => {
        loadRuntime({ preventDuplicates: true });
        stubAnimationFrame();

        window.toastMagic.success({ heading: "Saved", preset: "settings-saved" });
        window.toastMagic.success({ heading: "Saved", preset: "settings-saved" });

        expect(toasts()).toHaveLength(1);
    });

    it("reads a preset from a data attribute trigger", () => {
        loadRuntime({}, {}, '<button id="t" data-toast-type="success" data-toast-preset="cart-add" data-toast-heading="Added">Add</button>');
        stubAnimationFrame();

        document.getElementById("t").click();

        expect(iconContainer(onlyToast()).classList.contains("tm-preset-cart-add")).toBe(true);
    });

    it("ignores an unregistered preset from a data attribute trigger", () => {
        loadRuntime({}, {}, '<button id="t" data-toast-type="success" data-toast-preset="nope" data-toast-heading="Added">Add</button>');
        stubAnimationFrame();

        document.getElementById("t").click();

        expect(iconContainer(onlyToast()).classList.contains("tm-preset")).toBe(false);
    });

    it("marks every preset icon as decorative", () => {
        // The toast text carries the meaning; the icon must not be announced.
        window.toastMagic.success({ heading: "Saved", preset: "settings-saved" });

        const toast = onlyToast();
        toast.querySelectorAll(".toast-body-icon-container svg").forEach((svg) => {
            expect(svg.getAttribute("aria-hidden")).toBe("true");
            expect(svg.getAttribute("focusable")).toBe("false");
        });
        toast.querySelectorAll(".tm-particle").forEach((particle) => {
            expect(particle.getAttribute("aria-hidden")).toBe("true");
        });
    });

    it("does not change how a toast is announced", () => {
        // Urgency is derived from the type alone. A preset must never be able to
        // make a success toast interrupt a screen reader.
        window.toastMagic.success({ heading: "Declined", preset: "payment-failed" });

        expect(onlyToast().getAttribute("aria-label")).toBe("success notification");
    });
});
