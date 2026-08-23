/*!
 * Laravel Toaster Magic — Livewire bridge (v3 and v4)
 *
 * This file is an adapter, not a runtime. It translates a Livewire
 * `toastMagic` browser event into a call on the shared runtime
 * (assets/js/laravel-toaster-magic.js), which must be loaded first.
 *
 * Both Livewire v3 and v4 dispatch component events as native browser events on
 * `window`, so a single listener serves both — there is no version switch.
 *
 * Everything else — escaping, URL sanitising, rendering, timers, accessibility
 * — lives in the shared runtime, so the Livewire and non-Livewire builds cannot
 * drift apart.
 */
(function () {
    "use strict";

    if (window._toastMagicBound) return;
    window._toastMagicBound = true;

    var TOAST_TYPES = ["success", "error", "warning", "info"];

    window._toastQueue = [];
    window._toastProcessing = false;

    // The queue lives on `window` for backward compatibility, which means
    // anything on the page can replace or remove it. Re-create it on demand
    // rather than throwing on a missing array.
    function queue() {
        if (!Array.isArray(window._toastQueue)) {
            window._toastQueue = [];
        }

        return window._toastQueue;
    }

    function staggerDelay() {
        var config = window.toastMagicConfig || {};
        return typeof config.stagger === "number" ? config.stagger : 250;
    }

    function processToastQueue() {
        if (!queue().length) {
            window._toastProcessing = false;
            return;
        }

        var toast = queue().shift();

        if (window.toastMagic && typeof window.toastMagic[toast.type] === "function") {
            window.toastMagic[toast.type](toast);
        } else if (window.console && window.console.warn) {
            // The shared runtime is missing entirely — a load-order problem the
            // developer needs to see rather than a toast we can silently drop.
            window.console.warn("[toast-magic] shared runtime not loaded; dropping toast:", toast);
        }

        window.setTimeout(processToastQueue, staggerDelay());
    }

    window.addEventListener("toastMagic", function (event) {
        var detail = event.detail || {};
        var options = detail.options || {};

        var type = detail.status || detail.type || "success";
        if (TOAST_TYPES.indexOf(type) === -1) {
            if (window.console && window.console.warn) {
                window.console.warn("[toast-magic] unknown toast status \"" + type + "\", falling back to info.");
            }
            type = "info";
        }

        queue().push({
            type: type,
            heading: detail.title !== undefined ? detail.title : "",
            description: detail.message !== undefined ? detail.message : "",
            // `showCloseBtn` wins over `closeButton`; both are accepted so an
            // existing Livewire payload keeps working either way.
            showCloseBtn: options.showCloseBtn !== undefined
                ? options.showCloseBtn
                : options.closeButton,
            customBtnText: options.customBtnText || "",
            customBtnLink: options.customBtnLink || "",
            timeOut: options.timeOut !== undefined ? options.timeOut : null,
            showDuration: options.showDuration !== undefined ? options.showDuration : null,
            avatar: options.avatar || "",
            html: options.html === true
        });

        if (!window._toastProcessing) {
            window._toastProcessing = true;
            processToastQueue();
        }
    });
})();
