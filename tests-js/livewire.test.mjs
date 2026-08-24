import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bridgeSource, loadBridge, loadRuntime, onlyToast, stubAnimationFrame, toasts } from "./helpers.mjs";

/** Dispatch the Livewire browser event the bridge listens for. */
function dispatch(detail) {
    window.dispatchEvent(new window.CustomEvent("toastMagic", { detail }));
}

describe("Livewire bridge", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        loadRuntime({ stagger: 250 });
        loadBridge();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    it.each(["success", "error", "warning", "info"])("renders a %s toast from an event", (status) => {
        dispatch({ status, title: "Heading", message: "Body" });

        const toast = onlyToast();
        expect(toast.dataset.toastItemType).toBe(status);
        expect(toast.querySelector("h4").textContent).toBe("Heading");
        expect(toast.querySelector("p").textContent).toBe("Body");
    });

    it("falls back to info for an unknown status", () => {
        dispatch({ status: "not-a-type", title: "Heading" });

        expect(onlyToast().dataset.toastItemType).toBe("info");
    });

    it("queues multiple events and staggers them", () => {
        dispatch({ status: "success", title: "One" });
        dispatch({ status: "success", title: "Two" });
        dispatch({ status: "success", title: "Three" });

        // The first renders immediately; the rest wait for the stagger.
        expect(toasts()).toHaveLength(1);

        vi.advanceTimersByTime(250);
        expect(toasts()).toHaveLength(2);

        vi.advanceTimersByTime(250);
        expect(toasts()).toHaveLength(3);
    });

    it("accepts showCloseBtn and closeButton, preferring showCloseBtn", () => {
        dispatch({ status: "info", title: "A", options: { showCloseBtn: true } });
        expect(onlyToast().querySelector(".toast-close-btn")).not.toBeNull();

        loadRuntime({ stagger: 0, closeButton: false });
        stubAnimationFrame();
        dispatch({ status: "info", title: "B", options: { closeButton: true } });
        expect(onlyToast().querySelector(".toast-close-btn")).not.toBeNull();

        loadRuntime({ stagger: 0, closeButton: true });
        stubAnimationFrame();
        dispatch({ status: "info", title: "C", options: { showCloseBtn: false, closeButton: true } });
        expect(onlyToast().querySelector(".toast-close-btn")).toBeNull();
    });

    it("passes the action button through", () => {
        dispatch({
            status: "info",
            title: "A",
            options: { customBtnText: "View", customBtnLink: "https://example.com/x" },
        });

        const link = onlyToast().querySelector("a.toast-custom-btn");
        expect(link.textContent).toBe("View");
        expect(link.getAttribute("href")).toBe("https://example.com/x");
    });

    it("passes duration overrides through", () => {
        dispatch({ status: "info", title: "A", options: { timeOut: 9000, showDuration: 50 } });

        const toast = onlyToast();
        expect(toast.style.getPropertyValue("--tm-toast-duration")).toBe("9000ms");
        expect(toast.style.getPropertyValue("--tm-toast-delay")).toBe("50ms");
    });

    it("renders avatars with the avatar body class", () => {
        dispatch({ status: "info", title: "A", options: { avatar: "https://example.com/a.png" } });

        const toast = onlyToast();
        expect(toast.querySelector("img.toast-avatar")).not.toBeNull();
        // The class the old duplicated Livewire runtime silently omitted.
        expect(toast.querySelector(".toast-body").classList.contains("toast-body-avatar")).toBe(true);
    });

    it("passes a preset through to the shared runtime", () => {
        dispatch({ status: "success", title: "Added", options: { preset: "cart-add" } });

        const icon = onlyToast().querySelector(".toast-body-icon-container");
        expect(icon.classList.contains("tm-preset-cart-add")).toBe(true);
        expect(icon.classList.contains("tm-anim-bounce")).toBe(true);
    });

    it("leaves preset validation to the shared runtime", () => {
        // The bridge forwards the value verbatim rather than keeping its own
        // copy of the preset list, which is what kept the type list in sync.
        dispatch({ status: "success", title: "Added", options: { preset: "nope" } });

        expect(onlyToast().querySelector(".toast-body-icon-container").classList.contains("tm-preset")).toBe(false);
    });

    it("escapes event content by default", () => {
        dispatch({ status: "info", title: "<img src=x onerror=alert(1)>" });

        const toast = onlyToast();
        expect(toast.querySelector("img")).toBeNull();
        expect(toast.querySelector("h4").textContent).toBe("<img src=x onerror=alert(1)>");
    });

    it("sanitises a breakout payload in the event action link", () => {
        dispatch({
            status: "info",
            title: "A",
            options: { customBtnText: "Go", customBtnLink: 'javascript:alert(1)' },
        });

        expect(onlyToast().querySelector("a.toast-custom-btn").getAttribute("href")).toBe("#");
    });

    it("supports the html opt-in through event options", () => {
        dispatch({ status: "info", title: "<b>Bold</b>", options: { html: true } });

        expect(onlyToast().querySelector("h4 b")).not.toBeNull();
    });

    it("binds only once even if the bridge is evaluated twice", () => {
        loadBridge(); // second evaluation

        dispatch({ status: "info", title: "Once" });

        expect(toasts()).toHaveLength(1);
    });
});

describe("Livewire / standard parity", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        stubAnimationFrame();
    });

    afterEach(() => vi.useRealTimers());

    /**
     * The regression this whole block exists for: the Livewire integration used
     * to be a hand-maintained copy of the runtime and had already drifted on the
     * avatar class, icon sizes and config handling. Both paths must now produce
     * byte-identical markup.
     */
    const CASES = [
        { label: "plain", opts: {}, detail: {} },
        { label: "with close button", opts: { showCloseBtn: true }, detail: { options: { showCloseBtn: true } } },
        {
            label: "with avatar",
            opts: { avatar: "https://example.com/a.png" },
            detail: { options: { avatar: "https://example.com/a.png" } },
        },
        {
            label: "with action button",
            opts: { customBtnText: "View", customBtnLink: "/x" },
            detail: { options: { customBtnText: "View", customBtnLink: "/x" } },
        },
    ];

    it.each(CASES)("renders identical markup $label", ({ opts, detail }) => {
        const config = { stagger: 0, closeButton: false, theme: "neumorphic" };

        loadRuntime(config);
        stubAnimationFrame();
        window.toastMagic.success({ heading: "Heading", description: "Body", ...opts });
        const direct = onlyToast().outerHTML;

        loadRuntime(config);
        loadBridge();
        stubAnimationFrame();
        dispatch({ status: "success", title: "Heading", message: "Body", ...detail });
        const viaBridge = onlyToast().outerHTML;

        expect(viaBridge).toBe(direct);
    });

    it.each(["success", "error", "warning", "info"])("renders identical markup for %s", (type) => {
        const config = { stagger: 0, closeButton: true };

        loadRuntime(config);
        stubAnimationFrame();
        window.toastMagic[type]({ heading: "H", description: "D" });
        const direct = onlyToast().outerHTML;

        loadRuntime(config);
        loadBridge();
        stubAnimationFrame();
        dispatch({ status: type, title: "H", message: "D" });

        expect(onlyToast().outerHTML).toBe(direct);
    });
});

describe("bridge implementation", () => {
    it("is a thin adapter rather than a second runtime", () => {
        const source = bridgeSource();

        // Guards against the duplicated-runtime pattern returning: the bridge
        // must not build DOM, define the class, or render toasts itself.
        expect(source).not.toContain("innerHTML");
        expect(source).not.toContain("createElement");
        expect(source).not.toContain("class ToastMagic");
        expect(source).not.toContain("getToasterIcon");
        expect(source).not.toContain("sanitizeUrl");

        // And it must stay small. The old copy was 343 lines.
        expect(source.split("\n").length).toBeLessThan(120);
    });

    it("warns instead of throwing when the shared runtime is missing", () => {
        loadRuntime({});
        loadBridge();
        delete window.toastMagic;

        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(() => dispatch({ status: "info", title: "X" })).not.toThrow();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});
