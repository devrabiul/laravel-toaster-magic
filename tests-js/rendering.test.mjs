import { beforeEach, describe, expect, it } from "vitest";
import { loadRuntime, onlyToast, stubAnimationFrame, toasts } from "./helpers.mjs";

describe("toast rendering", () => {
    beforeEach(() => {
        loadRuntime({});
        stubAnimationFrame();
    });

    it.each([
        ["success", "toast-success", "success"],
        ["error", "toast-danger", "danger"],
        ["warning", "toast-warning", "warning"],
        ["info", "toast-info", "info"],
    ])("renders a %s toast with the right classes", (type, itemClass, basic) => {
        window.toastMagic[type]({ heading: "Heading" });

        const toast = onlyToast();
        expect(toast.classList.contains("toast-item")).toBe(true);
        expect(toast.classList.contains(itemClass)).toBe(true);
        expect(toast.querySelector(`.toast-text-${basic}`)).not.toBeNull();
        expect(toast.dataset.toastItemType).toBe(type);
    });

    it("renders the heading and description", () => {
        window.toastMagic.success({ heading: "Saved", description: "All good" });

        const toast = onlyToast();
        expect(toast.querySelector("h4").textContent).toBe("Saved");
        expect(toast.querySelector("p").textContent).toBe("All good");
    });

    it("omits the heading and description elements when empty", () => {
        window.toastMagic.success({ heading: "", description: "" });

        const toast = onlyToast();
        expect(toast.querySelector("h4")).toBeNull();
        expect(toast.querySelector("p")).toBeNull();
    });

    it("renders a type icon when there is no avatar", () => {
        window.toastMagic.info({ heading: "Hi" });

        const toast = onlyToast();
        expect(toast.querySelector(".toast-body-icon-container svg")).not.toBeNull();
        expect(toast.querySelector("img")).toBeNull();
    });

    it("renders an avatar in place of the icon and marks the body", () => {
        window.toastMagic.info({ heading: "Hi", avatar: "https://example.com/a.png" });

        const toast = onlyToast();
        expect(toast.querySelector("img.toast-avatar")).not.toBeNull();
        expect(toast.querySelector(".toast-body-icon-container svg")).toBeNull();
        // The avatar layout class the Livewire build used to drop.
        expect(toast.querySelector(".toast-body").classList.contains("toast-body-avatar")).toBe(true);
    });

    it("does not mark the body as an avatar toast when the avatar was rejected", () => {
        window.toastMagic.info({ heading: "Hi", avatar: "javascript:alert(1)" });

        expect(onlyToast().querySelector(".toast-body").classList.contains("toast-body-avatar")).toBe(false);
    });

    it("renders the close button only when requested", () => {
        window.toastMagic.info({ heading: "Hi", showCloseBtn: true });
        expect(onlyToast().querySelector(".toast-close-btn")).not.toBeNull();

        loadRuntime({});
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi", showCloseBtn: false });
        expect(onlyToast().querySelector(".toast-close-btn")).toBeNull();
    });

    it("falls back to the configured closeButton default", () => {
        loadRuntime({ closeButton: true });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi" });
        expect(onlyToast().querySelector(".toast-close-btn")).not.toBeNull();
    });

    it("renders the action button only when both text and link are present", () => {
        window.toastMagic.info({ heading: "Hi", customBtnText: "Go", customBtnLink: "/x" });
        expect(onlyToast().querySelector("a.toast-custom-btn")).not.toBeNull();

        loadRuntime({});
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi", customBtnText: "Go" });
        expect(onlyToast().querySelector("a.toast-custom-btn")).toBeNull();
    });

    it("applies the type-specific action button class", () => {
        window.toastMagic.error({ heading: "Hi", customBtnText: "Go", customBtnLink: "/x" });
        expect(onlyToast().querySelector("a.toast-custom-btn").classList.contains("toast-btn-bg-danger")).toBe(true);
    });

    it("supports the legacy positional signature", () => {
        window.toastMagic.success("Heading", "Description", true, "Go", "https://example.com");

        const toast = onlyToast();
        expect(toast.querySelector("h4").textContent).toBe("Heading");
        expect(toast.querySelector("p").textContent).toBe("Description");
        expect(toast.querySelector(".toast-close-btn")).not.toBeNull();
        expect(toast.querySelector("a.toast-custom-btn").getAttribute("href")).toBe("https://example.com/");
    });

    it("renders multiple toasts at once", () => {
        window.toastMagic.success({ heading: "One" });
        window.toastMagic.error({ heading: "Two" });
        window.toastMagic.info({ heading: "Three" });

        expect(toasts()).toHaveLength(3);
    });

    it("prepends for top positions and appends for bottom positions", () => {
        loadRuntime({ positionClass: "toast-top-end" });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "First" });
        window.toastMagic.info({ heading: "Second" });
        // Newest nearest the anchored corner: top positions prepend.
        expect(toasts()[0].querySelector("h4").textContent).toBe("Second");

        loadRuntime({ positionClass: "toast-bottom-end" });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "First" });
        window.toastMagic.info({ heading: "Second" });
        expect(toasts()[1].querySelector("h4").textContent).toBe("Second");
    });
});

describe("container configuration", () => {
    beforeEach(() => stubAnimationFrame());

    it("applies the configured position class", () => {
        loadRuntime({ positionClass: "toast-bottom-center" });
        const container = document.querySelector(".toast-container");

        expect(container.classList.contains("toast-bottom-center")).toBe(true);
        expect(container.classList.contains("toast-top-end")).toBe(false);
    });

    it("applies the configured theme class", () => {
        loadRuntime({ theme: "neumorphic" });
        expect(document.querySelector(".toast-container").classList.contains("theme-neumorphic")).toBe(true);
    });

    it("swaps the theme class rather than accumulating themes", () => {
        loadRuntime({ theme: "compact" });
        const container = document.querySelector(".toast-container");

        expect(container.classList.contains("theme-compact")).toBe(true);
        expect(container.classList.contains("theme-default")).toBe(false);
    });

    it("reads config even though it is defined before the runtime evaluates", () => {
        // The regression this guards: the runtime used to snapshot config in its
        // constructor, which ran before the inline config block existed, so every
        // value silently stayed on its default.
        loadRuntime({ theme: "neon", positionClass: "toast-top-start", closeButton: true });
        const container = document.querySelector(".toast-container");

        expect(container.classList.contains("theme-neon")).toBe(true);
        expect(container.classList.contains("toast-top-start")).toBe(true);

        window.toastMagic.info({ heading: "Hi" });
        expect(onlyToast().querySelector(".toast-close-btn")).not.toBeNull();
    });

    describe("maxVisible", () => {
        function fill(count) {
            for (let i = 1; i <= count; i++) window.toastMagic.info({ heading: `Toast ${i}` });
        }

        function headings() {
            return toasts()
                .filter((el) => !el.dataset.tmClosing)
                .map((el) => el.querySelector("h4").textContent);
        }

        it("caps the stack at the configured maximum", () => {
            loadRuntime({ maxVisible: 3 });
            stubAnimationFrame();
            fill(6);

            expect(headings()).toHaveLength(3);
        });

        it("drops the oldest toasts, keeping the newest", () => {
            loadRuntime({ maxVisible: 3 });
            stubAnimationFrame();
            fill(5);

            // Top positions prepend, so the newest is first.
            expect(headings()).toEqual(["Toast 5", "Toast 4", "Toast 3"]);
        });

        it("drops the oldest from the other end for bottom positions", () => {
            loadRuntime({ maxVisible: 3, positionClass: "toast-bottom-end" });
            stubAnimationFrame();
            fill(5);

            // Bottom positions append, so the newest is last.
            expect(headings()).toEqual(["Toast 3", "Toast 4", "Toast 5"]);
        });

        it("treats 0 as unlimited", () => {
            loadRuntime({ maxVisible: 0 });
            stubAnimationFrame();
            fill(9);

            expect(headings()).toHaveLength(9);
        });

        it("defaults to six when nothing is configured", () => {
            loadRuntime({});
            stubAnimationFrame();
            fill(10);

            expect(headings()).toHaveLength(6);
        });
    });

    it("applies the gradient and color modifiers", () => {
        loadRuntime({ gradient_enable: true, color_mode: true });
        const container = document.querySelector(".toast-container");

        expect(container.classList.contains("toast-gradient-enable")).toBe(true);
        expect(container.classList.contains("toast-color-true")).toBe(true);
    });

    it("preserves host application classes on the container", () => {
        loadRuntime({ theme: "ios" }, {}, '<div class="toast-container app-custom"></div>');

        const container = document.querySelector(".toast-container");
        // The constructor used to overwrite className wholesale, wiping both the
        // host's classes and the modifiers added elsewhere.
        expect(container.classList.contains("app-custom")).toBe(true);
        expect(container.classList.contains("theme-ios")).toBe(true);
    });

    it("applies the configured animation class per toast", () => {
        loadRuntime({ animation: "slide" });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi" });

        expect(onlyToast().classList.contains("toast-animate-slide")).toBe(true);
    });

    it("adds no animation class for the default animation", () => {
        loadRuntime({ animation: "default" });
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi" });

        expect(onlyToast().className).not.toContain("toast-animate-");
    });

    it("applies style variables to the container", () => {
        loadRuntime({}, { "--tm-space-container": "4px 6px", "--tm-font-title-size": "11px" });

        const container = document.querySelector(".toast-container");
        expect(container.style.getPropertyValue("--tm-space-container")).toBe("4px 6px");
        expect(container.style.getPropertyValue("--tm-font-title-size")).toBe("11px");
    });
});

describe("duplicate prevention", () => {
    beforeEach(() => stubAnimationFrame());

    it("skips an identical visible toast when enabled", () => {
        loadRuntime({ preventDuplicates: true });

        window.toastMagic.success({ heading: "Same", description: "Body" });
        window.toastMagic.success({ heading: "Same", description: "Body" });

        expect(toasts()).toHaveLength(1);
    });

    it("allows toasts that differ in type, heading or description", () => {
        loadRuntime({ preventDuplicates: true });

        window.toastMagic.success({ heading: "Same", description: "Body" });
        window.toastMagic.error({ heading: "Same", description: "Body" });
        window.toastMagic.success({ heading: "Other", description: "Body" });
        window.toastMagic.success({ heading: "Same", description: "Other" });

        expect(toasts()).toHaveLength(4);
    });

    it("allows duplicates when disabled", () => {
        loadRuntime({ preventDuplicates: false });

        window.toastMagic.success({ heading: "Same" });
        window.toastMagic.success({ heading: "Same" });

        expect(toasts()).toHaveLength(2);
    });
});

describe("toasts are not triggers", () => {
    beforeEach(() => {
        loadRuntime({ closeButton: true });
        stubAnimationFrame();
    });

    it("does not spawn a new toast when an existing toast is clicked", () => {
        window.toastMagic.warning({ heading: "Original" });
        expect(toasts()).toHaveLength(1);

        // The rendered toast carried `data-toast-type`, which is the selector the
        // delegated trigger handler looks for — so clicking a toast made it act
        // as its own trigger and spawned a duplicate with the default heading.
        onlyToast().click();

        expect(toasts()).toHaveLength(1);
        expect(onlyToast().querySelector("h4").textContent).toBe("Original");
    });

    it("does not spawn a new toast when the toast body is clicked", () => {
        window.toastMagic.warning({ heading: "Original", description: "Body" });

        onlyToast().querySelector("p").click();
        onlyToast().querySelector("h4").click();
        onlyToast().querySelector(".toast-body-icon-container").click();

        expect(toasts()).toHaveLength(1);
    });

    it("still closes when the close button inside a toast is clicked", () => {
        window.toastMagic.warning({ heading: "Original", showCloseBtn: true });

        onlyToast().querySelector(".toast-close-btn").click();

        expect(toasts()[0].dataset.tmClosing).toBe("1");
        expect(toasts()).toHaveLength(1);
    });
});
