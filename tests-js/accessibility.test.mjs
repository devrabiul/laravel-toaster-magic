import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadRuntime, onlyToast, stubAnimationFrame } from "./helpers.mjs";

describe("close button accessibility", () => {
    beforeEach(() => {
        loadRuntime({ closeButton: true });
        stubAnimationFrame();
    });

    it("has an accessible name", () => {
        window.toastMagic.info({ heading: "Hi" });

        const btn = onlyToast().querySelector(".toast-close-btn");
        // Previously the button contained only an SVG and announced as "button".
        expect(btn.getAttribute("aria-label")).toBe("Close notification");
    });

    it("uses the configured close button label", () => {
        loadRuntime({ closeButton: true, closeButtonLabel: "Sluiten" });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi" });

        expect(onlyToast().querySelector(".toast-close-btn").getAttribute("aria-label")).toBe("Sluiten");
    });

    it("is a real button element with an explicit type", () => {
        window.toastMagic.info({ heading: "Hi" });

        const btn = onlyToast().querySelector(".toast-close-btn");
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
    });

    it("is keyboard focusable and activates with a click event", () => {
        window.toastMagic.info({ heading: "Hi" });

        const btn = onlyToast().querySelector(".toast-close-btn");
        btn.focus();
        expect(document.activeElement).toBe(btn);

        btn.click();
        expect(onlyToast().dataset.tmClosing).toBe("1");
    });
});

describe("decorative icons", () => {
    beforeEach(() => {
        loadRuntime({ closeButton: true });
        stubAnimationFrame();
    });

    it("hides type icons from assistive technology", () => {
        window.toastMagic.success({ heading: "Saved" });

        const svg = onlyToast().querySelector(".toast-body-icon-container svg");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(svg.getAttribute("focusable")).toBe("false");
    });

    it("hides the close icon from assistive technology", () => {
        window.toastMagic.success({ heading: "Saved" });

        const svg = onlyToast().querySelector(".toast-close-btn svg");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
    });

    it("gives the avatar an empty alt so it is not announced", () => {
        window.toastMagic.info({ heading: "Hi", avatar: "https://example.com/a.png" });

        expect(onlyToast().querySelector("img.toast-avatar").getAttribute("alt")).toBe("");
    });
});

describe("live regions", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    function regions() {
        const all = document.querySelectorAll(".toast-magic-live-region");
        return {
            polite: all[0],
            assertive: all[1],
        };
    }

    it("creates persistent, initially empty live regions", () => {
        loadRuntime({});
        const { polite, assertive } = regions();

        // The regions must pre-exist and start empty — a live region inserted
        // together with its content is frequently not announced at all.
        expect(polite.getAttribute("aria-live")).toBe("polite");
        expect(polite.getAttribute("role")).toBe("status");
        expect(polite.textContent).toBe("");

        expect(assertive.getAttribute("aria-live")).toBe("assertive");
        expect(assertive.getAttribute("role")).toBe("alert");
        expect(assertive.textContent).toBe("");
    });

    it.each(["success", "info", "warning"])("announces %s politely", (type) => {
        loadRuntime({});
        window.toastMagic[type]({ heading: "Heading", description: "Body" });

        vi.advanceTimersByTime(100);

        expect(regions().polite.textContent).toBe("Heading. Body");
        expect(regions().assertive.textContent).toBe("");
    });

    it("announces errors assertively", () => {
        loadRuntime({});
        window.toastMagic.error({ heading: "Failed", description: "Try again" });

        vi.advanceTimersByTime(100);

        expect(regions().assertive.textContent).toBe("Failed. Try again");
        expect(regions().polite.textContent).toBe("");
    });

    it("re-announces an identical message by clearing the region first", () => {
        loadRuntime({});

        window.toastMagic.info({ heading: "Same" });
        vi.advanceTimersByTime(100);
        expect(regions().polite.textContent).toBe("Same");

        window.toastMagic.info({ heading: "Same" });
        // Cleared immediately so the repeat registers as a mutation.
        expect(regions().polite.textContent).toBe("");
        vi.advanceTimersByTime(100);
        expect(regions().polite.textContent).toBe("Same");
    });

    it("does not duplicate the announcement on the toast element itself", () => {
        loadRuntime({});
        window.toastMagic.info({ heading: "Hi" });

        const toast = onlyToast();
        // The toast is a labelled group, not a second live region — otherwise
        // screen readers read the same content twice.
        expect(toast.getAttribute("aria-live")).toBeNull();
        expect(toast.getAttribute("role")).toBe("group");
        expect(toast.getAttribute("aria-label")).toBe("info notification");
    });

    it("labels the container region", () => {
        loadRuntime({ containerLabel: "Meldingen" });
        expect(document.querySelector(".toast-container").getAttribute("aria-label")).toBe("Meldingen");
    });

    it("announces nothing for an empty toast", () => {
        loadRuntime({});
        window.toastMagic.info({ heading: "", description: "" });

        vi.advanceTimersByTime(100);
        expect(regions().polite.textContent).toBe("");
    });
});
