/*!
 * Laravel Toaster Magic — shared runtime
 *
 * This is the single source of truth for toast behaviour. The Livewire build
 * loads this same file and layers a thin event bridge on top
 * (livewire-v3/livewire-toaster-magic-v3.js), so both integrations render
 * identically by construction rather than by convention.
 *
 * Security note: no user-controlled value is ever concatenated into an HTML
 * string. Text goes through `textContent` and URLs go through `setAttribute`,
 * which makes attribute breakout structurally impossible. HTML is rendered only
 * when a caller explicitly opts in with `html: true`.
 */
(function () {
    "use strict";

    var TOAST_TYPES = ["success", "error", "warning", "info"];

    // Protocols that may appear in a toast action link. `javascript:` and
    // `data:` are deliberately absent — those are the executable ones.
    var LINK_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];
    // Avatars are images; only real network schemes make sense.
    var IMAGE_PROTOCOLS = ["http:", "https:"];

    // ===============================
    // Config access
    // ===============================
    // Read lazily on every access. The runtime therefore does not care whether
    // it is evaluated before or after the inline config block, which is what
    // previously left every configured value stuck on its default.
    function getConfig() {
        return window.toastMagicConfig || {};
    }

    function getStyleVars() {
        return window.toastMagicStyleVars || {};
    }

    function configValue(key, fallback) {
        var config = getConfig();
        return config[key] === undefined || config[key] === null ? fallback : config[key];
    }

    // ===============================
    // Utility: URL sanitizer
    // ===============================
    // Returns a safe URL string, or null when the value cannot be trusted.
    //
    // Because every URL produced here is applied with `setAttribute()`, quotes
    // and angle brackets cannot escape the attribute no matter what they are.
    // That reduces this function's job to one question: does the URL resolve to
    // a protocol that can execute code? Anything that does is rejected outright.
    function sanitizeUrl(value, allowedProtocols) {
        if (typeof value !== "string") return null;

        var raw = value.trim();
        if (!raw) return null;

        // Control characters and raw whitespace inside the value are the
        // classic way to smuggle a scheme past a naive check. Reject them.
        // eslint-disable-next-line no-control-regex -- rejecting control characters is the point
        if (/[\u0000-\u0020\u007F]/.test(raw)) return null;

        var parsed;
        try {
            parsed = new URL(raw, document.baseURI);
        } catch {
            return null;
        }

        if (allowedProtocols.indexOf(parsed.protocol) === -1) return null;

        // A relative or fragment URL that already resolved to a safe protocol is
        // returned in the author's original form — resolving it to an absolute
        // URL would work too, but needlessly rewrites what ends up in the DOM.
        if (raw.charAt(0) === "#" || raw.charAt(0) === "/") return raw;

        return parsed.href;
    }

    // ===============================
    // Utility: safe text rendering
    // ===============================
    // Escaped by default. Newlines become real <br> elements, so multi-line
    // messages keep working without ever interpreting caller content as markup.
    function renderText(target, value, allowHtml) {
        var text = value === null || value === undefined ? "" : String(value);

        if (allowHtml) {
            // Explicit opt-in. The caller owns the safety of this string.
            target.innerHTML = text;
            return;
        }

        var lines = text.split(/\r\n|\r|\n/);
        for (var i = 0; i < lines.length; i++) {
            if (i > 0) target.appendChild(document.createElement("br"));
            if (lines[i] !== "") target.appendChild(document.createTextNode(lines[i]));
        }
    }

    // Parse a trusted SVG string into an element. Used only for the bundled
    // icons, which are package constants and never caller input.
    function buildIcon(markup) {
        var wrapper = document.createElement("span");
        wrapper.innerHTML = markup;

        var svg = wrapper.querySelector("svg");
        if (!svg) return null;

        // Icons are decorative: the toast text already carries the meaning, so
        // they must not be announced or focusable.
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        return svg;
    }

    // ===============================
    // Utility: accessible live regions
    // ===============================
    // A live region only announces mutations that happen *inside* a region the
    // assistive technology is already observing. Inserting an already-populated
    // role="alert" element — which is what this package used to do — is widely
    // unreliable. So two empty regions are created up front and the toast text
    // is written into the one matching the severity.
    var liveRegions = null;

    function ensureLiveRegions() {
        if (liveRegions && liveRegions.polite.isConnected) return liveRegions;
        if (!document.body) return null;

        // Adopt regions already in the DOM (a second evaluation of this file, or
        // a server-rendered pair) instead of appending a duplicate set.
        var existing = document.querySelectorAll(".toast-magic-live-region");
        if (existing.length >= 2) {
            liveRegions = { polite: existing[0], assertive: existing[1] };
            return liveRegions;
        }

        function build(role, live) {
            var region = document.createElement("div");
            region.className = "toast-magic-live-region";
            region.setAttribute("role", role);
            region.setAttribute("aria-live", live);
            region.setAttribute("aria-atomic", "true");
            document.body.appendChild(region);
            return region;
        }

        liveRegions = {
            polite: build("status", "polite"),
            assertive: build("alert", "assertive")
        };

        return liveRegions;
    }

    function announce(type, heading, description) {
        var regions = ensureLiveRegions();
        if (!regions) return;

        // Errors interrupt; everything else waits for a natural pause.
        var region = type === "error" ? regions.assertive : regions.polite;
        var message = [heading, description]
            .filter(function (part) { return part; })
            .join(". ");

        if (!message) return;

        // Clearing first guarantees a mutation even when two identical toasts
        // are announced back to back.
        region.textContent = "";
        window.setTimeout(function () {
            region.textContent = message;
        }, 50);
    }

    // ===============================
    // Utility: close toast
    // ===============================
    function closeToastMagicItem(toast) {
        if (!toast || toast.dataset.tmClosing) return; // guard against double-close
        toast.dataset.tmClosing = "1";

        if (typeof toast._tmDispose === "function") toast._tmDispose();

        var container = toast.closest(".toast-container");

        // Pin the closing toast in place (out of flow) so the flex gap collapses
        // immediately, then glide the remaining toasts up to fill the space — all
        // while it slides/fades out. Keeps the stack moving smoothly.
        flipReflow(container, function () {
            var rect = toast.getBoundingClientRect();
            toast.style.translate = "";   // drop any in-progress reflow offset
            toast.style.position = "fixed";
            toast.style.top = rect.top + "px";
            toast.style.left = rect.left + "px";
            toast.style.width = rect.width + "px";
            toast.style.height = rect.height + "px";
            toast.style.margin = "0";
        });

        toast.classList.remove("show");
        // `hide` drives the exit transform, including the RTL-specific rule that
        // was previously unreachable because nothing ever added this class.
        toast.classList.add("hide");

        window.setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 500);
    }

    function prefersReducedMotion() {
        return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }

    // ===============================
    // Utility: Smooth stack reflow (FLIP)
    // ===============================
    // When a toast is added or removed, the others glide to their new positions
    // instead of jumping. Reflow uses the independent `translate` CSS property so it
    // never fights the entrance/exit animation, which uses `transform` — that means
    // a toast can slide in AND reflow vertically at the same time without conflict.
    function flipReflow(container, mutate) {
        if (!container || prefersReducedMotion()) {
            mutate();
            return;
        }

        var reflowTransition = "translate .5s cubic-bezier(0.22, 0.61, 0.36, 1), transform .5s ease-in-out, opacity .5s ease-in-out";

        var snapshot = Array.prototype.slice.call(container.querySelectorAll(".toast-item"))
            .filter(function (el) { return !el.dataset.tmClosing; })
            .map(function (el) { return { el: el, top: el.getBoundingClientRect().top }; });

        mutate();

        snapshot.forEach(function (entry) {
            var el = entry.el;
            if (!el.isConnected) return;

            // Cancel any reflow still animating on this element so its stale
            // cleanup can't wipe the new one mid-glide — that race is what made
            // the stack teleport when entrances and exits overlapped.
            if (el._tmReflowCleanup) {
                el._tmReflowCleanup();
            }

            el.style.transition = "none";
            el.style.translate = "0px";
            var delta = entry.top - el.getBoundingClientRect().top;
            if (!delta) {
                el.style.transition = "";
                el.style.translate = "";
                return;
            }

            el.style.translate = "0 " + delta + "px";
            void el.offsetHeight; // flush the inverted position before playing

            window.requestAnimationFrame(function () {
                el.style.transition = reflowTransition;
                el.style.translate = "0 0";

                var settled = false;
                var fallbackTimer = null;

                // Single cleanup path shared by transitionend and the timeout.
                // Without the timeout an interrupted transition would leave the
                // inline transition/translate styles stuck on the element.
                var cleanup = function () {
                    if (settled) return;
                    settled = true;
                    if (fallbackTimer) window.clearTimeout(fallbackTimer);
                    el.style.transition = "";
                    el.style.translate = "";
                    el.removeEventListener("transitionend", onEnd);
                    el._tmReflowCleanup = null;
                };

                var onEnd = function (event) {
                    if (event.propertyName !== "translate") return;
                    cleanup();
                };

                fallbackTimer = window.setTimeout(cleanup, 700);
                el._tmReflowCleanup = cleanup;
                el.addEventListener("transitionend", onEnd);
            });
        });
    }

    // ===============================
    // Utility: Apply configured style variables
    // ===============================
    // The spacing/typography config is resolved server-side into CSS custom
    // properties (see ToastMagic::resolveStyleVariables) and published as
    // `window.toastMagicStyleVars`.
    function applyToastMagicStyleVars(container) {
        if (!container) return;
        var vars = getStyleVars();
        for (var name in vars) {
            if (Object.prototype.hasOwnProperty.call(vars, name)) {
                container.style.setProperty(name, vars[name]);
            }
        }
    }

    // ===============================
    // Utility: Icon markup
    // ===============================
    // Preset icons (v2.6). Stroke-based rather than filled, so individual parts
    // can be moved and drawn on with stroke-dashoffset — the four type icons
    // below are filled paths and are deliberately left exactly as they were.
    //
    // Like every other icon in this file these are package constants. The
    // registry is keyed by name and a caller can only ever supply a *key*, never
    // markup, so the trusted-icon parser gains no new attack surface.
    // Icon parts are painted from four custom properties rather than a single
    // `currentColor`, which is what makes a preset icon multi-coloured:
    //
    //   --tm-i1   primary stroke (the body of the icon)
    //   --tm-i2   accent        (wheels, stripes, the filled part)
    //   --tm-i3   secondary accent
    //   --tm-ic   reserved for a preset's fourth part
    //
    // Every one falls back to `currentColor`, so an icon with no palette behind
    // it still renders in the type accent exactly as the built-in icons do —
    // and setting them all back to `currentColor` returns the whole set to
    // monochrome. The palettes live in the stylesheet, per preset, with dark
    // mode variants.
    var ICON_ATTRS = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
        + 'fill="none" stroke="var(--tm-i1, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';

    // Shorthands for the per-part paint attributes.
    var S2 = ' stroke="var(--tm-i2, currentColor)"';
    var S3 = ' stroke="var(--tm-i3, currentColor)"';
    var F2 = ' fill="var(--tm-i2, currentColor)"' + S2;
    var F3 = ' fill="var(--tm-i3, currentColor)"' + S3;

    // Icon geometry is Lucide v1.33.0, used unmodified except where an animation
    // needs a part addressable on its own (see `trash` and `download` below).
    //
    //   Lucide — ISC License, Copyright (c) 2026 Lucide Icons and Contributors
    //   `check`, `download`, `upload` and `trash-2` derive from Feather —
    //   MIT License, Copyright (c) 2013-present Cole Bemis
    //
    // Both licences permit redistribution, which is what makes these safe to
    // ship inside an MIT package. Icon sets that forbid redistribution or
    // require attribution from *your* end users deliberately are not used here.
    var PRESET_ICONS = {};

    // ===============================
    // Preset registry
    // ===============================
    // A preset is a presentation layer *on top of* a type: it swaps the icon and
    // gives it motion. The type still owns colour, the progress bar, the theme
    // treatment and — importantly — screen-reader urgency, which is why nothing
    // here can change how a toast is announced.
    //
    // Closed registry by design. A name that is not a key here is ignored and the
    // toast falls back to its type icon, matching how every other enumerated
    // value in this package degrades.
    // Filled by preset packs, which are separate files loaded after this one.
    // The core runtime ships no presets: a project that uses none pays nothing
    // for them, and a project loads only the packs it asks for in config.
    var TOAST_PRESETS = {};

    // ===============================
    // Preset pack registration
    // ===============================
    // A pack is a plain script that calls register() with its own icons and
    // preset definitions. The paint shorthands are handed back out so a pack
    // does not have to restate them, and so every pack paints from the same
    // four custom properties the core documents.
    //
    // Registering is additive and last-write-wins per key, which lets an
    // application ship its own pack that overrides one preset without having to
    // replace the whole file.
    // Which pack each preset came from. Not used for rendering — it exists so a
    // page can report what it actually loaded, rather than trusting a list that
    // drifts from the files.
    var PRESET_PACK_OF = {};

    window.ToastMagicPresets = {
        attrs: ICON_ATTRS,
        s2: S2,
        s3: S3,
        f2: F2,
        f3: F3,

        register: function (icons, presets, pack) {
            var name;

            for (name in icons) {
                if (Object.prototype.hasOwnProperty.call(icons, name)) {
                    PRESET_ICONS[name] = icons[name];
                }
            }

            for (name in presets) {
                if (Object.prototype.hasOwnProperty.call(presets, name)) {
                    TOAST_PRESETS[name] = presets[name];
                    if (pack) PRESET_PACK_OF[name] = String(pack);
                }
            }
        }
    };

    // Returns the preset definition, or null for anything unregistered. The
    // hasOwnProperty guard keeps inherited property names ("constructor",
    // "toString") from resolving to something that is not a preset.
    function resolvePreset(name) {
        if (typeof name !== "string" || name === "") return null;

        return Object.prototype.hasOwnProperty.call(TOAST_PRESETS, name)
            ? TOAST_PRESETS[name]
            : null;
    }

    function getToasterIcon(key) {
        var name = String(key);

        // Preset icons first; the type and close icons keep their own markup.
        if (Object.prototype.hasOwnProperty.call(PRESET_ICONS, name)) {
            return PRESET_ICONS[name];
        }

        switch (name) {
            case "success":
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path fill="currentColor" d="M405.333,0H106.667C47.786,0.071,0.071,47.786,0,106.667v298.667C0.071,464.214,47.786,511.93,106.667,512h298.667C464.214,511.93,511.93,464.214,512,405.333V106.667C511.93,47.786,464.214,0.071,405.333,0z M426.667,172.352L229.248,369.771c-16.659,16.666-43.674,16.671-60.34,0.012c-0.004-0.004-0.008-0.008-0.012-0.012l-83.563-83.541c-8.348-8.348-8.348-21.882,0-30.229s21.882-8.348,30.229,0l83.541,83.541l197.44-197.419c8.348-8.318,21.858-8.294,30.176,0.053C435.038,150.524,435.014,164.034,426.667,172.352z"/></svg>';
            case "error":
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-1.231,6.641l-4.466,5.359,4.466,5.359c.354.425.296,1.056-.128,1.409-.188.155-.414.231-.64.231-.287,0-.571-.122-.77-.359l-4.231-5.078-4.231,5.078c-.198.237-.482.359-.77.359-.226,0-.452-.076-.64-.231-.424-.354-.481-.984-.128-1.409l4.466-5.359-4.466-5.359c-.354-.425-.296-1.056.128-1.409.426-.353,1.056-.296,1.409.128l4.231,5.078,4.231-5.078c.354-.424.983-.48,1.409-.128.424.354.481.984.128,1.409Z"/></svg>';
            case "info":
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 1920 1920"><path d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm223.797 707.147c-28.531-29.561-67.826-39.944-109.227-39.455-55.225.657-114.197 20.664-156.38 40.315-100.942 47.024-178.395 130.295-242.903 219.312-11.616 16.025-17.678 34.946 2.76 49.697 17.428 12.58 29.978 1.324 40.49-9.897l.69-.74c.801-.862 1.591-1.72 2.37-2.565 11.795-12.772 23.194-25.999 34.593-39.237l2.85-3.31 2.851-3.308c34.231-39.687 69.056-78.805 115.144-105.345 27.4-15.778 47.142 8.591 42.912 35.963-2.535 16.413-11.165 31.874-17.2 47.744-21.44 56.363-43.197 112.607-64.862 168.888-23.74 61.7-47.405 123.425-70.426 185.398l-2 5.38-1.998 5.375c-20.31 54.64-40.319 108.872-53.554 165.896-10.575 45.592-24.811 100.906-4.357 145.697 11.781 25.8 36.77 43.532 64.567 47.566 37.912 5.504 78.906 6.133 116.003-2.308 19.216-4.368 38.12-10.07 56.57-17.005 56.646-21.298 108.226-54.146 154.681-92.755 47.26-39.384 88.919-85.972 126.906-134.292 12.21-15.53 27.004-32.703 31.163-52.596 3.908-18.657-12.746-45.302-34.326-34.473-11.395 5.718-19.929 19.867-28.231 29.27-10.42 11.798-21.044 23.423-31.786 34.92-21.488 22.987-43.513 45.463-65.634 67.831-13.54 13.692-30.37 25.263-47.662 33.763-21.59 10.609-38.785-1.157-36.448-25.064 2.144-21.954 7.515-44.145 15.046-64.926 30.306-83.675 61.19-167.135 91.834-250.686 19.157-52.214 38.217-104.461 56.999-156.816 17.554-48.928 32.514-97.463 38.834-149.3 4.357-35.71-4.9-72.647-30.269-98.937Zm63.72-401.498c-91.342-35.538-200.232 25.112-218.574 121.757-13.25 69.784 13.336 131.23 67.998 157.155 105.765 50.16 232.284-29.954 232.29-147.084.005-64.997-28.612-111.165-81.715-131.828Z" fill-rule="evenodd"/></svg>';
            case "warning":
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 52 52"><path d="m51.4 42.5l-22.9-37c-1.2-2-3.8-2-5 0l-22.9 37c-1.4 2.3 0 5.5 2.5 5.5h45.8c2.5 0 4-3.2 2.5-5.5z m-25.4-2.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z m3-9c0 0.6-0.4 1-1 1h-4c-0.6 0-1-0.4-1-1v-13c0-0.6 0.4-1 1-1h4c0.6 0 1 0.4 1 1v13z"/></svg>';
            case "close":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"/></svg>';
            default:
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-8,6c0-.553.447-1,1-1s1,.447,1,1v7.5c0,.553-.447,1-1,1s-1-.447-1-1v-7.5Zm1,13c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z"/></svg>';
        }
    }

    function typeClasses(type) {
        switch (type) {
            case "success": return { item: "toast-success", basic: "success" };
            case "error": return { item: "toast-danger", basic: "danger" };
            case "warning": return { item: "toast-warning", basic: "warning" };
            default: return { item: "toast-info", basic: "info" };
        }
    }

    // ===============================
    // ToastMagic class
    // ===============================
    if (typeof window.ToastMagic === "undefined") {
        window.ToastMagic = function ToastMagic() {
            this.toastContainer = null;
            this._pending = [];
            this._ready = false;
            this._init();
        };

        window.ToastMagic.prototype._init = function () {
            var self = this;

            if (document.readyState === "loading") {
                // Placing the scripts in <head> used to throw, because the
                // constructor reached for document.body during parse. Now the
                // container is built when the DOM is ready and any toast raised
                // before that point is queued rather than lost.
                document.addEventListener("DOMContentLoaded", function () { self._boot(); });
                return;
            }

            this._boot();
        };

        window.ToastMagic.prototype._boot = function () {
            if (this._ready) return;

            this.ensureContainer();
            ensureLiveRegions();
            this._ready = true;

            var pending = this._pending;
            this._pending = [];
            for (var i = 0; i < pending.length; i++) {
                this.show(pending[i]);
            }
        };

        // Create the container if needed and (re)apply every container-level
        // modifier from the current config. Modifiers are toggled individually
        // rather than by overwriting className, so classes added by the host
        // application survive.
        window.ToastMagic.prototype.ensureContainer = function () {
            if (!document.body) return null;

            if (!this.toastContainer || !this.toastContainer.isConnected) {
                this.toastContainer = document.querySelector(".toast-container");
            }

            if (!this.toastContainer) {
                this.toastContainer = document.createElement("div");
                this.toastContainer.className = "toast-container";
                document.body.appendChild(this.toastContainer);
            }

            var container = this.toastContainer;
            var position = configValue("positionClass", "toast-top-end");
            var theme = configValue("theme", "default");

            [
                "toast-top-start", "toast-top-end", "toast-top-center",
                "toast-bottom-start", "toast-bottom-end", "toast-bottom-center"
            ].forEach(function (name) {
                container.classList.toggle(name, name === position);
            });

            Array.prototype.slice.call(container.classList).forEach(function (name) {
                if (name.indexOf("theme-") === 0 && name !== "theme-" + theme) {
                    container.classList.remove(name);
                }
            });
            container.classList.add("theme-" + theme);

            container.classList.toggle("toast-gradient-enable", !!getConfig().gradient_enable);
            container.classList.toggle("toast-color-true", !!getConfig().color_mode);

            if (!container.hasAttribute("aria-label")) {
                container.setAttribute("aria-label", configValue("containerLabel", "Notifications"));
            }

            applyToastMagicStyleVars(container);

            return container;
        };

        window.ToastMagic.prototype.show = function (options) {
            var settings = options || {};

            if (!this._ready) {
                this._pending.push(settings);
                return;
            }

            var container = this.ensureContainer();
            if (!container) return;

            var config = getConfig();
            var type = TOAST_TYPES.indexOf(settings.type) === -1 ? "info" : settings.type;
            var heading = settings.heading === undefined || settings.heading === null ? "" : String(settings.heading);
            var description = settings.description === undefined || settings.description === null ? "" : String(settings.description);

            // Escaping is the default. `html: true` per toast, or a global
            // `escape_html: false`, opts back into raw HTML rendering.
            var allowHtml = settings.html === true || config.escape_html === false;

            var showCloseBtn = settings.showCloseBtn === undefined
                ? !!config.closeButton
                : !!settings.showCloseBtn;

            var customBtnText = settings.customBtnText ? String(settings.customBtnText) : "";
            var customBtnLink = settings.customBtnLink ? String(settings.customBtnLink) : "";
            var avatar = settings.avatar ? String(settings.avatar) : "";

            // An unregistered preset is ignored rather than rejected: the toast
            // still renders, with its type icon and no icon animation.
            var preset = resolvePreset(settings.preset);
            var presetName = preset ? String(settings.preset) : "";

            // Skip rendering if an identical toast is already visible and
            // duplicate prevention is enabled in the config.
            //
            // The preset is part of the key: "Saved" as `settings-saved` and
            // "Saved" as `clipboard-copy` are different toasts, and collapsing
            // them would silently drop the second one's icon.
            var duplicateKey = type + "|" + presetName + "|" + heading + "|" + description;
            if (config.preventDuplicates) {
                var existing = Array.prototype.slice.call(container.querySelectorAll(".toast-item"));
                for (var d = 0; d < existing.length; d++) {
                    if (existing[d].dataset.toastKey === duplicateKey && !existing[d].dataset.tmClosing) return;
                }
            }

            var names = typeClasses(type);

            var showDuration = typeof settings.showDuration === "number"
                ? settings.showDuration
                : (typeof config.showDuration === "number" ? config.showDuration : 300);

            // `timeOut: 0` means "stay until dismissed" — a WCAG 2.2.1 escape
            // hatch. Only a strictly positive number starts the dismiss timer.
            var timeOut = typeof settings.timeOut === "number"
                ? settings.timeOut
                : (typeof config.timeOut === "number" ? config.timeOut : 5000);

            var toast = this._buildToast({
                type: type,
                names: names,
                heading: heading,
                description: description,
                allowHtml: allowHtml,
                showCloseBtn: showCloseBtn,
                customBtnText: customBtnText,
                customBtnLink: customBtnLink,
                avatar: avatar,
                preset: preset,
                presetName: presetName,
                duplicateKey: duplicateKey,
                timeOut: timeOut,
                showDuration: showDuration
            });

            var position = configValue("positionClass", "toast-top-end");
            var atBottom = String(position).indexOf("bottom") !== -1;

            // Cap the stack before inserting. The container is `position: fixed`
            // with no scroll and `pointer-events: none`, so anything pushed past
            // the edge of the viewport is neither readable nor closable — it just
            // waits out its timer off-screen. Roughly six toasts fit on a phone.
            var maxVisible = Math.max(0, parseInt(configValue("maxVisible", 15), 10) || 0);
            if (maxVisible > 0) {
                var live = Array.prototype.slice.call(container.querySelectorAll(".toast-item"))
                    .filter(function (el) { return !el.dataset.tmClosing; });

                // The newest sits closest to the anchored corner, so the oldest are
                // at the far end: the tail when we prepend, the head when we append.
                for (var i = 0; i < live.length - (maxVisible - 1); i++) {
                    closeToastMagicItem(atBottom ? live[i] : live[live.length - 1 - i]);
                }
            }

            // Newest toast always appears closest to its anchored corner: on top
            // for top positions (older toasts move down), at the bottom for bottom
            // positions (older toasts move up).
            if (atBottom) {
                flipReflow(container, function () { container.append(toast); });
            } else {
                flipReflow(container, function () { container.prepend(toast); });
            }

            window.setTimeout(function () { toast.classList.add("show"); }, showDuration);

            announce(type, heading, description);

            this._startDismissTimer(toast, timeOut);

            return toast;
        };

        window.ToastMagic.prototype._buildToast = function (spec) {
            var config = getConfig();

            var toast = document.createElement("div");
            toast.className = "toast-item " + spec.names.item;
            toast.dataset.toastKey = spec.duplicateKey;
            // Deliberately NOT `data-toast-type`: that attribute is the trigger
            // API, and the delegated handler finds triggers with
            // closest("[data-toast-type]"). Stamping it here made every rendered
            // toast its own trigger, so clicking one spawned a duplicate.
            toast.dataset.toastItemType = spec.type;

            var animation = config.animation;
            if (animation && animation !== "default") {
                toast.classList.add("toast-animate-" + animation);
            }

            // The toast is a labelled group rather than its own live region —
            // announcement is handled by the persistent regions above, and
            // duplicating it here would make screen readers read it twice.
            toast.setAttribute("role", "group");
            toast.setAttribute(
                "aria-label",
                (config.typeLabels && config.typeLabels[spec.type]) || spec.type + " notification"
            );

            // Drive the progress bar from the real dismiss time instead of the
            // hardcoded 3s it used to assume.
            if (spec.timeOut > 0) {
                toast.style.setProperty("--tm-toast-duration", spec.timeOut + "ms");
                toast.style.setProperty("--tm-toast-delay", spec.showDuration + "ms");
            } else {
                toast.classList.add("toast-no-timeout");
            }

            var positionRelative = document.createElement("div");
            positionRelative.className = "toast-magic-relative";

            // `shake` is the one preset animation that moves more than the icon.
            // It cannot live on .toast-item: `transform` there is owned by the
            // entrance/exit transition and `translate` by the FLIP stack reflow,
            // so a third animation would fight both. This inner wrapper is not
            // transformed by anything, and leaving .toast-item alone keeps the
            // progress bar (a pseudo-element on it) steady while the content moves.
            if (spec.preset && spec.preset.shake) {
                positionRelative.classList.add("tm-anim-shake");
            }

            var content = document.createElement("div");
            content.className = "toast-item-content-center";

            var body = document.createElement("div");
            body.className = "toast-body" + (spec.avatar ? " toast-body-avatar" : "");

            var iconContainer = document.createElement("span");
            iconContainer.className = "toast-body-icon-container toast-text-" + spec.names.basic;

            var avatarUrl = spec.avatar ? sanitizeUrl(spec.avatar, IMAGE_PROTOCOLS) : null;
            if (avatarUrl) {
                var img = document.createElement("img");
                // setAttribute cannot break out of the attribute, whatever the value.
                img.setAttribute("src", avatarUrl);
                img.setAttribute("alt", "");
                img.className = "toast-avatar";
                iconContainer.appendChild(img);
            } else {
                if (spec.avatar) body.classList.remove("toast-body-avatar");

                // A preset swaps the type icon for its own. Note the order: an
                // avatar still wins, so a rejected avatar URL falls back to the
                // preset icon when there is one and to the type icon otherwise.
                var icon = buildIcon(getToasterIcon(spec.preset ? spec.preset.icon : spec.type));

                if (spec.preset) {
                    iconContainer.classList.add(
                        "tm-preset",
                        "tm-preset-" + spec.presetName,
                        "tm-anim-" + spec.preset.anim
                    );

                    // setAttribute rather than classList: SVGAnimatedString is
                    // read-only for `className` in older engines, and these
                    // elements carry no class of their own to preserve.
                    if (icon) icon.setAttribute("class", "tm-icon-base");
                }

                if (icon) iconContainer.appendChild(icon);

                if (spec.preset && spec.preset.particles) {
                    for (var p = 0; p < spec.preset.particles; p++) {
                        var particle = document.createElement("i");
                        particle.className = "tm-particle";
                        particle.setAttribute("aria-hidden", "true");
                        iconContainer.appendChild(particle);
                    }
                }
            }

            var bodyContainer = document.createElement("div");
            bodyContainer.className = "toast-body-container";

            if (spec.heading) {
                var titleWrap = document.createElement("div");
                titleWrap.className = "toast-body-title";
                var title = document.createElement("h4");
                renderText(title, spec.heading, spec.allowHtml);
                titleWrap.appendChild(title);
                bodyContainer.appendChild(titleWrap);
            }

            if (spec.description) {
                var paragraph = document.createElement("p");
                paragraph.className = "toast-body-description";
                renderText(paragraph, spec.description, spec.allowHtml);
                bodyContainer.appendChild(paragraph);
            }

            body.appendChild(iconContainer);
            body.appendChild(bodyContainer);

            var end = document.createElement("div");
            end.className = "toast-body-end";

            if (spec.showCloseBtn) {
                var closeBtn = document.createElement("button");
                closeBtn.setAttribute("type", "button");
                closeBtn.className = "toast-close-btn";
                closeBtn.setAttribute("aria-label", configValue("closeButtonLabel", "Close notification"));
                var closeIcon = buildIcon(getToasterIcon("close"));
                if (closeIcon) closeBtn.appendChild(closeIcon);
                end.appendChild(closeBtn);
            }

            if (spec.customBtnText && spec.customBtnLink) {
                var link = document.createElement("a");
                // An unusable URL degrades to "#", matching the documented
                // contract, and is safe because it is applied as an attribute.
                link.setAttribute("href", sanitizeUrl(spec.customBtnLink, LINK_PROTOCOLS) || "#");
                link.className = "toast-custom-btn toast-btn-bg-" + spec.names.basic;
                renderText(link, spec.customBtnText, spec.allowHtml);
                end.appendChild(link);
            }

            content.appendChild(body);
            content.appendChild(end);
            positionRelative.appendChild(content);
            toast.appendChild(positionRelative);

            return toast;
        };

        // Auto-dismiss with pause on hover *and* keyboard focus. Pausing the
        // timer also pauses the progress bar, which previously kept running.
        window.ToastMagic.prototype._startDismissTimer = function (toast, timeOut) {
            if (!(timeOut > 0)) {
                toast._tmDispose = function () {};
                return;
            }

            var config = getConfig();
            var pauseOnHover = config.pauseOnHover !== false;
            var remaining = timeOut;
            var startedAt = Date.now();
            var timer = window.setTimeout(function () { closeToastMagicItem(toast); }, remaining);
            var paused = false;

            function pause() {
                if (paused) return;
                paused = true;
                window.clearTimeout(timer);
                remaining -= Date.now() - startedAt;
                toast.classList.add("toast-paused");
            }

            function resume() {
                if (!paused) return;
                paused = false;
                startedAt = Date.now();
                toast.classList.remove("toast-paused");
                timer = window.setTimeout(function () { closeToastMagicItem(toast); }, Math.max(remaining, 0));
            }

            toast._tmDispose = function () {
                window.clearTimeout(timer);
                toast.removeEventListener("mouseenter", pause);
                toast.removeEventListener("mouseleave", resume);
                toast.removeEventListener("focusin", pause);
                toast.removeEventListener("focusout", resume);
            };

            if (pauseOnHover) {
                toast.addEventListener("mouseenter", pause);
                toast.addEventListener("mouseleave", resume);
            }

            // Focus pausing is not optional: a keyboard user who has tabbed into
            // a toast must not have it yanked away mid-interaction.
            toast.addEventListener("focusin", pause);
            toast.addEventListener("focusout", resume);
        };

        // Accepts either the positional signature kept for backward
        // compatibility, or a single options object (what the PHP side emits).
        window.ToastMagic.prototype._parseArgs = function (args) {
            if (args.length === 1 && args[0] && typeof args[0] === "object") {
                return args[0];
            }

            return {
                heading: args[0] !== undefined ? args[0] : "",
                description: args[1] !== undefined ? args[1] : "",
                showCloseBtn: args[2] !== undefined ? args[2] : undefined,
                customBtnText: args[3] !== undefined ? args[3] : "",
                customBtnLink: args[4] !== undefined ? args[4] : "",
                timeOut: args[5] !== undefined ? args[5] : null,
                showDuration: args[6] !== undefined ? args[6] : null,
                avatar: args[7] !== undefined ? args[7] : ""
            };
        };

        TOAST_TYPES.forEach(function (type) {
            window.ToastMagic.prototype[type] = function () {
                var parsed = this._parseArgs(Array.prototype.slice.call(arguments));
                parsed.type = type;
                return this.show(parsed);
            };
        });

        // Programmatically dismiss every currently visible toast.
        window.ToastMagic.prototype.clear = function () {
            if (!this.toastContainer) return;
            Array.prototype.slice.call(this.toastContainer.querySelectorAll(".toast-item"))
                .forEach(function (toast) { closeToastMagicItem(toast); });
        };

        window.ToastMagic.prototype.dismissAll = function () {
            this.clear();
        };
    }

    // ===============================
    // Single shared instance
    // ===============================
    if (typeof window.toastMagic === "undefined") {
        window.toastMagic = new window.ToastMagic();
    }

    // ===============================
    // Delegated document listeners (bound once)
    // ===============================
    if (!window._toastMagicListenersBound) {
        window._toastMagicListenersBound = true;

        document.addEventListener("click", function (event) {
            var closeBtn = event.target.closest && event.target.closest(".toast-close-btn");
            if (closeBtn) {
                closeToastMagicItem(closeBtn.closest(".toast-item"));
                return;
            }

            var trigger = event.target.closest && event.target.closest("[data-toast-type]");
            if (!trigger) return;

            // A rendered toast must never act as a trigger. The marker attribute
            // no longer collides, but this also covers an application that puts
            // its own data-toast-type inside a toast — clicking a toast should
            // dismiss or do nothing, never spawn another one.
            if (trigger.closest(".toast-container") || trigger.classList.contains("toast-item")) return;

            // Only real toast types are accepted. Previously any truthy property
            // name — "show", "clear", "constructor" — was invoked here.
            var type = trigger.getAttribute("data-toast-type");
            if (TOAST_TYPES.indexOf(type) === -1) type = "info";

            window.toastMagic[type]({
                heading: trigger.getAttribute("data-toast-heading") || "Notification",
                description: trigger.getAttribute("data-toast-description") || "",
                showCloseBtn: trigger.hasAttribute("data-toast-close-btn"),
                customBtnText: trigger.getAttribute("data-toast-btn-text") || "",
                customBtnLink: trigger.getAttribute("data-toast-btn-link") || "",
                avatar: trigger.getAttribute("data-toast-avatar") || "",
                // Validated in show() against the preset registry, so an
                // unregistered name here is ignored rather than rendered.
                preset: trigger.getAttribute("data-toast-preset") || ""
            });
        });

        // Escape dismisses the most recent toast, giving keyboard users a way
        // out that does not depend on the close button being enabled.
        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape" && event.key !== "Esc") return;

            var container = document.querySelector(".toast-container");
            if (!container) return;

            var toasts = Array.prototype.slice.call(container.querySelectorAll(".toast-item"))
                .filter(function (toast) { return !toast.dataset.tmClosing; });

            if (!toasts.length) return;

            var position = configValue("positionClass", "toast-top-end");
            // The newest toast is nearest the anchored corner: first child for
            // top positions, last child for bottom ones.
            var newest = String(position).indexOf("bottom") !== -1
                ? toasts[toasts.length - 1]
                : toasts[0];

            closeToastMagicItem(newest);
        });
    }

    // Exposed for the test suite and for integrations that need the same
    // guarantees (the Livewire bridge reuses `show`).
    window.ToastMagicInternals = {
        sanitizeUrl: sanitizeUrl,
        renderText: renderText,
        closeToast: closeToastMagicItem,
        TOAST_TYPES: TOAST_TYPES,
        LINK_PROTOCOLS: LINK_PROTOCOLS,
        IMAGE_PROTOCOLS: IMAGE_PROTOCOLS,
        // The Livewire bridge reads this rather than keeping its own copy of the
        // preset list, so the two cannot drift apart.
        TOAST_PRESETS: TOAST_PRESETS,
        PRESET_PACK_OF: PRESET_PACK_OF,
        resolvePreset: resolvePreset
    };
})();
