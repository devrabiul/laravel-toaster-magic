import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadRuntime, onlyToast, stubAnimationFrame, toasts } from "./helpers.mjs";

describe("auto-dismiss", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    it("dismisses after the configured timeOut", () => {
        loadRuntime({ timeOut: 5000 });
        window.toastMagic.info({ heading: "Hi" });

        expect(toasts()).toHaveLength(1);

        vi.advanceTimersByTime(4999);
        expect(toasts()[0].dataset.tmClosing).toBeUndefined();

        vi.advanceTimersByTime(1);
        expect(toasts()[0].dataset.tmClosing).toBe("1");

        // The element is removed once the exit transition has had time to run.
        vi.advanceTimersByTime(500);
        expect(toasts()).toHaveLength(0);
    });

    it("honours a per-toast timeOut override", () => {
        loadRuntime({ timeOut: 5000 });
        window.toastMagic.info({ heading: "Hi", timeOut: 1000 });

        vi.advanceTimersByTime(1000);
        expect(toasts()[0].dataset.tmClosing).toBe("1");
    });

    it("never auto-dismisses when timeOut is 0", () => {
        loadRuntime({ timeOut: 5000 });
        window.toastMagic.info({ heading: "Hi", timeOut: 0 });

        vi.advanceTimersByTime(60000);

        expect(toasts()).toHaveLength(1);
        expect(toasts()[0].dataset.tmClosing).toBeUndefined();
        // With no timer there is no progress to show.
        expect(toasts()[0].classList.contains("toast-no-timeout")).toBe(true);
    });

    it("never auto-dismisses when the global timeOut is 0", () => {
        loadRuntime({ timeOut: 0 });
        window.toastMagic.info({ heading: "Hi" });

        vi.advanceTimersByTime(60000);
        expect(toasts()).toHaveLength(1);
    });

    it("exposes the real duration to the progress bar", () => {
        loadRuntime({ timeOut: 8000, showDuration: 300 });
        window.toastMagic.info({ heading: "Hi" });

        const toast = onlyToast();
        // Previously the bar was hardcoded to 3s regardless of the dismiss time.
        expect(toast.style.getPropertyValue("--tm-toast-duration")).toBe("8000ms");
        expect(toast.style.getPropertyValue("--tm-toast-delay")).toBe("300ms");
    });

    it("adds the show class after showDuration", () => {
        loadRuntime({ showDuration: 300 });
        window.toastMagic.info({ heading: "Hi" });

        expect(onlyToast().classList.contains("show")).toBe(false);
        vi.advanceTimersByTime(300);
        expect(onlyToast().classList.contains("show")).toBe(true);
    });
});

describe("pause behaviour", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    it("pauses on hover and resumes on leave", () => {
        loadRuntime({ timeOut: 1000, pauseOnHover: true });
        window.toastMagic.info({ heading: "Hi" });
        const toast = onlyToast();

        vi.advanceTimersByTime(500);
        toast.dispatchEvent(new window.MouseEvent("mouseenter"));
        expect(toast.classList.contains("toast-paused")).toBe(true);

        // Time passing while paused must not dismiss the toast.
        vi.advanceTimersByTime(10000);
        expect(toast.dataset.tmClosing).toBeUndefined();

        toast.dispatchEvent(new window.MouseEvent("mouseleave"));
        expect(toast.classList.contains("toast-paused")).toBe(false);

        // Only the remaining 500ms is left to run.
        vi.advanceTimersByTime(499);
        expect(toast.dataset.tmClosing).toBeUndefined();
        vi.advanceTimersByTime(1);
        expect(toast.dataset.tmClosing).toBe("1");
    });

    it("does not pause on hover when pauseOnHover is false", () => {
        loadRuntime({ timeOut: 1000, pauseOnHover: false });
        window.toastMagic.info({ heading: "Hi" });
        const toast = onlyToast();

        toast.dispatchEvent(new window.MouseEvent("mouseenter"));
        vi.advanceTimersByTime(1000);

        expect(toast.dataset.tmClosing).toBe("1");
    });

    it("pauses on keyboard focus even when pauseOnHover is disabled", () => {
        // A keyboard user who has tabbed into a toast must not have it removed
        // mid-interaction, regardless of the hover preference.
        loadRuntime({ timeOut: 1000, pauseOnHover: false, closeButton: true });
        window.toastMagic.info({ heading: "Hi" });
        const toast = onlyToast();

        toast.dispatchEvent(new window.FocusEvent("focusin", { bubbles: true }));
        vi.advanceTimersByTime(10000);

        expect(toast.dataset.tmClosing).toBeUndefined();

        toast.dispatchEvent(new window.FocusEvent("focusout", { bubbles: true }));
        vi.advanceTimersByTime(1000);
        expect(toast.dataset.tmClosing).toBe("1");
    });

    it("clears the dismiss timer when a toast is closed while paused", () => {
        loadRuntime({ timeOut: 1000, closeButton: true });
        window.toastMagic.info({ heading: "Hi" });
        const toast = onlyToast();

        toast.dispatchEvent(new window.MouseEvent("mouseenter"));
        toast.querySelector(".toast-close-btn").click();

        expect(toast.dataset.tmClosing).toBe("1");
        // No stray timer may fire against the removed element.
        expect(() => vi.advanceTimersByTime(60000)).not.toThrow();
    });
});

describe("dismissal", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    it("closes when the close button is clicked", () => {
        loadRuntime({ closeButton: true, timeOut: 0 });
        window.toastMagic.info({ heading: "Hi" });

        onlyToast().querySelector(".toast-close-btn").click();

        expect(toasts()[0].dataset.tmClosing).toBe("1");
        expect(toasts()[0].classList.contains("hide")).toBe(true);
        expect(toasts()[0].classList.contains("show")).toBe(false);
    });

    it("is idempotent when closed twice", () => {
        loadRuntime({ closeButton: true, timeOut: 0 });
        window.toastMagic.info({ heading: "Hi" });

        const btn = onlyToast().querySelector(".toast-close-btn");
        btn.click();
        expect(() => btn.click()).not.toThrow();

        vi.advanceTimersByTime(1000);
        expect(toasts()).toHaveLength(0);
    });

    it("dismisses the newest toast on Escape for a top position", () => {
        loadRuntime({ timeOut: 0, positionClass: "toast-top-end" });
        window.toastMagic.info({ heading: "Older" });
        window.toastMagic.info({ heading: "Newest" });

        document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        const closing = toasts().filter((t) => t.dataset.tmClosing);
        expect(closing).toHaveLength(1);
        expect(closing[0].querySelector("h4").textContent).toBe("Newest");
    });

    it("dismisses the newest toast on Escape for a bottom position", () => {
        loadRuntime({ timeOut: 0, positionClass: "toast-bottom-end" });
        window.toastMagic.info({ heading: "Older" });
        window.toastMagic.info({ heading: "Newest" });

        document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        const closing = toasts().filter((t) => t.dataset.tmClosing);
        expect(closing).toHaveLength(1);
        expect(closing[0].querySelector("h4").textContent).toBe("Newest");
    });

    it("ignores Escape when nothing is on screen", () => {
        loadRuntime({ timeOut: 0 });
        expect(() =>
            document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
        ).not.toThrow();
    });

    it("clear() dismisses every visible toast", () => {
        loadRuntime({ timeOut: 0 });
        window.toastMagic.info({ heading: "One" });
        window.toastMagic.info({ heading: "Two" });
        window.toastMagic.info({ heading: "Three" });

        window.toastMagic.clear();

        expect(toasts().every((t) => t.dataset.tmClosing === "1")).toBe(true);
        vi.advanceTimersByTime(1000);
        expect(toasts()).toHaveLength(0);
    });

    it("dismissAll() is an alias for clear()", () => {
        loadRuntime({ timeOut: 0 });
        window.toastMagic.info({ heading: "One" });

        window.toastMagic.dismissAll();
        expect(toasts()[0].dataset.tmClosing).toBe("1");
    });
});

describe("DOM readiness", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    it("creates the container and a pair of live regions", () => {
        loadRuntime({});

        expect(document.querySelector(".toast-container")).not.toBeNull();
        expect(document.querySelectorAll(".toast-magic-live-region")).toHaveLength(2);
    });

    it("reuses an existing container rather than adding a second one", () => {
        loadRuntime({}, {}, '<div class="toast-container"></div>');
        window.toastMagic.info({ heading: "Hi" });

        expect(document.querySelectorAll(".toast-container")).toHaveLength(1);
    });

    it("recreates the container if it is removed", () => {
        loadRuntime({});
        document.querySelector(".toast-container").remove();

        window.toastMagic.info({ heading: "Hi" });

        expect(document.querySelectorAll(".toast-container")).toHaveLength(1);
        expect(toasts()).toHaveLength(1);
    });
});

describe("reduced motion", () => {
    beforeEach(() => stubAnimationFrame());

    it("skips the FLIP reflow when reduced motion is requested", () => {
        loadRuntime({});
        window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });

        window.toastMagic.info({ heading: "One" });
        window.toastMagic.info({ heading: "Two" });

        // The reflow is what sets an inline translate; with motion reduced the
        // toasts are simply placed.
        for (const toast of toasts()) {
            expect(toast.style.translate).toBe("");
        }
        expect(toasts()).toHaveLength(2);
    });
});
