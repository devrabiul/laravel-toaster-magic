/**
 * Security regression tests.
 *
 * Every payload here corresponds to a concrete vulnerability or a near miss.
 * They exist to fail loudly if the DOM construction ever regresses to string
 * concatenation.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { loadRuntime, onlyToast, stubAnimationFrame, toasts } from "./helpers.mjs";

// The exact payloads from the audit, plus the scheme-based ones.
const ATTRIBUTE_BREAKOUT_PAYLOADS = [
    '/a" onerror="alert(1)',
    '#a" onerror="alert(1)',
    'http://example.com" onerror="alert(1)',
    'https://example.com" onerror="alert(1)',
    '/a"><script>alert(1)</script>',
    "/a' onerror='alert(1)",
];

const EXECUTABLE_URL_PAYLOADS = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "vbscript:msgbox(1)",
];

describe("URL sanitising", () => {
    beforeEach(() => {
        loadRuntime({ closeButton: true });
        stubAnimationFrame();
    });

    it.each(ATTRIBUTE_BREAKOUT_PAYLOADS)(
        "does not create extra attributes from avatar payload %j",
        (payload) => {
            window.toastMagic.info({ heading: "Hi", avatar: payload });

            const toast = onlyToast();
            const img = toast.querySelector("img.toast-avatar");

            // Whatever survives sanitising, it must not have produced handlers.
            const all = [toast, ...toast.querySelectorAll("*")];
            for (const el of all) {
                for (const attr of Array.from(el.attributes)) {
                    expect(attr.name.toLowerCase().startsWith("on")).toBe(false);
                }
            }

            // And the value must never appear unencoded in the markup.
            expect(toast.innerHTML).not.toContain('onerror="alert(1)');
            expect(toast.querySelector("script")).toBeNull();

            if (img) {
                // A surviving src is a single attribute value, not a breakout.
                expect(img.getAttribute("src")).not.toContain('" onerror');
            }
        }
    );

    it.each(ATTRIBUTE_BREAKOUT_PAYLOADS)(
        "does not create extra attributes from customBtnLink payload %j",
        (payload) => {
            window.toastMagic.info({
                heading: "Hi",
                customBtnText: "Go",
                customBtnLink: payload,
            });

            const toast = onlyToast();

            const all = [toast, ...toast.querySelectorAll("*")];
            for (const el of all) {
                for (const attr of Array.from(el.attributes)) {
                    expect(attr.name.toLowerCase().startsWith("on")).toBe(false);
                }
            }

            expect(toast.innerHTML).not.toContain('onerror="alert(1)');
            expect(toast.querySelector("script")).toBeNull();
        }
    );

    it.each(EXECUTABLE_URL_PAYLOADS)("rejects executable URL %j on an action link", (payload) => {
        window.toastMagic.info({ heading: "Hi", customBtnText: "Go", customBtnLink: payload });

        const link = onlyToast().querySelector("a.toast-custom-btn");
        expect(link).not.toBeNull();
        // Rejected URLs degrade to "#", the documented contract.
        expect(link.getAttribute("href")).toBe("#");
    });

    it.each(EXECUTABLE_URL_PAYLOADS)("rejects executable URL %j on an avatar", (payload) => {
        window.toastMagic.info({ heading: "Hi", avatar: payload });

        const toast = onlyToast();
        // An unusable avatar falls back to the type icon rather than rendering
        // a broken or dangerous <img>.
        expect(toast.querySelector("img.toast-avatar")).toBeNull();
        expect(toast.querySelector("svg")).not.toBeNull();
    });

    it("keeps legitimate URLs working", () => {
        const cases = [
            ["https://example.com/view", "https://example.com/view"],
            ["http://example.com/view", "http://example.com/view"],
            ["/orders/42", "/orders/42"],
            ["#details", "#details"],
            ["mailto:hi@example.com", "mailto:hi@example.com"],
        ];

        for (const [input, expected] of cases) {
            loadRuntime({});
            stubAnimationFrame();
            window.toastMagic.info({ heading: "Hi", customBtnText: "Go", customBtnLink: input });
            expect(onlyToast().querySelector("a.toast-custom-btn").getAttribute("href")).toBe(expected);
        }
    });

    it("allows https and relative avatar images", () => {
        window.toastMagic.info({ heading: "Hi", avatar: "https://example.com/a.png" });
        expect(onlyToast().querySelector("img.toast-avatar").getAttribute("src"))
            .toBe("https://example.com/a.png");

        loadRuntime({});
        stubAnimationFrame();
        window.toastMagic.info({ heading: "Hi", avatar: "/avatars/1.png" });
        expect(onlyToast().querySelector("img.toast-avatar").getAttribute("src")).toBe("/avatars/1.png");
    });

    it("exposes a sanitiser that returns null rather than a dangerous value", () => {
        const { sanitizeUrl, LINK_PROTOCOLS } = window.ToastMagicInternals;

        expect(sanitizeUrl("javascript:alert(1)", LINK_PROTOCOLS)).toBeNull();
        expect(sanitizeUrl("", LINK_PROTOCOLS)).toBeNull();
        expect(sanitizeUrl(null, LINK_PROTOCOLS)).toBeNull();
        expect(sanitizeUrl(undefined, LINK_PROTOCOLS)).toBeNull();
        expect(sanitizeUrl(12345, LINK_PROTOCOLS)).toBeNull();
        expect(sanitizeUrl("https://example.com", LINK_PROTOCOLS)).toBe("https://example.com/");
    });
});

describe("HTML escaping", () => {
    beforeEach(() => {
        loadRuntime({});
        stubAnimationFrame();
    });

    const HTML_PAYLOADS = [
        "<script>alert(1)</script>",
        "<img src=x onerror=alert(1)>",
        "<b>bold</b>",
        "<svg onload=alert(1)>",
        "</h4><img src=x onerror=alert(1)><h4>",
    ];

    it.each(HTML_PAYLOADS)("escapes heading payload %j by default", (payload) => {
        window.toastMagic.success({ heading: payload });

        const toast = onlyToast();

        expect(toast.querySelector("script")).toBeNull();
        expect(toast.querySelector("img")).toBeNull();
        // The payload is visible as text, exactly as typed.
        expect(toast.querySelector("h4").textContent).toBe(payload);
    });

    it.each(HTML_PAYLOADS)("escapes description payload %j by default", (payload) => {
        window.toastMagic.success({ heading: "Hi", description: payload });

        const toast = onlyToast();

        expect(toast.querySelector("script")).toBeNull();
        expect(toast.querySelector("img")).toBeNull();
        expect(toast.querySelector("p").textContent).toBe(payload);
    });

    it("escapes the custom button text by default", () => {
        window.toastMagic.success({
            heading: "Hi",
            customBtnText: "<img src=x onerror=alert(1)>",
            customBtnLink: "/go",
        });

        const link = onlyToast().querySelector("a.toast-custom-btn");
        expect(link.querySelector("img")).toBeNull();
        expect(link.textContent).toBe("<img src=x onerror=alert(1)>");
    });

    it("renders HTML when the toast explicitly opts in", () => {
        window.toastMagic.success({ heading: "<b>Saved</b>", html: true });

        const heading = onlyToast().querySelector("h4");
        expect(heading.querySelector("b")).not.toBeNull();
        expect(heading.textContent).toBe("Saved");
    });

    it("renders HTML when escape_html is globally disabled", () => {
        loadRuntime({ escape_html: false });
        stubAnimationFrame();

        window.toastMagic.success({ heading: "<b>Saved</b>" });

        expect(onlyToast().querySelector("h4 b")).not.toBeNull();
    });

    it("converts newlines to <br> elements without interpreting markup", () => {
        window.toastMagic.info({ heading: "Line1\nLine2\nLine3" });

        const heading = onlyToast().querySelector("h4");
        expect(heading.querySelectorAll("br")).toHaveLength(2);
        expect(heading.textContent).toBe("Line1Line2Line3");
    });

    it("escapes a payload that mixes newlines and markup", () => {
        window.toastMagic.info({ heading: "ok\n<script>alert(1)</script>" });

        const heading = onlyToast().querySelector("h4");
        expect(heading.querySelector("script")).toBeNull();
        expect(heading.querySelectorAll("br")).toHaveLength(1);
        expect(heading.textContent).toContain("<script>alert(1)</script>");
    });
});

describe("data attribute API", () => {
    beforeEach(() => {
        loadRuntime({});
        stubAnimationFrame();
    });

    it("renders a toast from data-toast-* attributes", () => {
        document.body.insertAdjacentHTML(
            "beforeend",
            '<button data-toast-type="success" data-toast-heading="Saved" ' +
            'data-toast-description="All good" data-toast-close-btn>Go</button>'
        );

        document.querySelector("button").click();

        const toast = onlyToast();
        expect(toast.classList.contains("toast-success")).toBe(true);
        expect(toast.querySelector("h4").textContent).toBe("Saved");
        expect(toast.querySelector("p").textContent).toBe("All good");
        expect(toast.querySelector(".toast-close-btn")).not.toBeNull();
    });

    it.each(["constructor", "show", "clear", "_parseArgs", "__proto__", "nope"])(
        "falls back to info for the non-type %j instead of invoking it",
        (type) => {
            document.body.insertAdjacentHTML(
                "beforeend",
                `<button data-toast-type="${type}" data-toast-heading="X">Go</button>`
            );

            expect(() => document.querySelector("button").click()).not.toThrow();

            const all = toasts();
            expect(all).toHaveLength(1);
            expect(all[0].classList.contains("toast-info")).toBe(true);
        }
    );

    it("escapes attribute-sourced content", () => {
        document.body.insertAdjacentHTML(
            "beforeend",
            '<button data-toast-type="info" data-toast-heading="&lt;img src=x onerror=alert(1)&gt;">Go</button>'
        );

        document.querySelector("button").click();

        const toast = onlyToast();
        expect(toast.querySelector("img")).toBeNull();
        expect(toast.querySelector("h4").textContent).toBe("<img src=x onerror=alert(1)>");
    });

    it("sanitises a data-toast-btn-link breakout payload", () => {
        document.body.insertAdjacentHTML(
            "beforeend",
            '<button data-toast-type="info" data-toast-heading="X" ' +
            'data-toast-btn-text="Go" data-toast-btn-link="javascript:alert(1)">Go</button>'
        );

        document.querySelector("button").click();

        expect(onlyToast().querySelector("a.toast-custom-btn").getAttribute("href")).toBe("#");
    });
});
