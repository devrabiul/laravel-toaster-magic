(function () {
    // ===============================
    // Utility: URL sanitizer
    // ===============================
    function sanitizeUrl(url) {
        if (!url || !/^(https?:\/\/|\/|#)/.test(url)) return '#';
        return url;
    }

    // ===============================
    // Utility: Close toast function
    // ===============================
    function closeToastMagicItem(toast) {
        if (toast.dataset.tmClosing) return; // guard against double-close
        toast.dataset.tmClosing = "1";

        const container = toast.closest(".toast-container");

        // Pin the closing toast in place (out of flow) so the flex gap collapses
        // immediately, then glide the remaining toasts up to fill the space — all
        // while it slides/fades out. Keeps the stack moving smoothly and continuously.
        flipReflow(container, () => {
            const rect = toast.getBoundingClientRect();
            toast.style.translate = "";   // drop any in-progress reflow offset
            toast.style.position = "fixed";
            toast.style.top = rect.top + "px";
            toast.style.left = rect.left + "px";
            toast.style.width = rect.width + "px";
            toast.style.height = rect.height + "px";
            toast.style.margin = "0";
        });

        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }

    // ===============================
    // Utility: Smooth stack reflow (FLIP)
    // ===============================
    // When a toast is added or removed, the others glide to their new positions
    // instead of jumping. Reflow uses the independent `translate` CSS property so it
    // never fights the entrance/exit animation, which uses `transform` — that means
    // a toast can slide in AND reflow vertically at the same time without conflict.
    function flipReflow(container, mutate) {
        if (!container || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
            mutate();
            return;
        }

        // Keep the entrance/exit (`transform`, `opacity`) animating while `translate` reflows.
        const reflowTransition = "translate .5s cubic-bezier(0.22, 0.61, 0.36, 1), transform .5s ease-in-out, opacity .5s ease-in-out";

        const snapshot = Array.from(container.querySelectorAll(".toast-item"))
            .filter(el => !el.dataset.tmClosing)
            .map(el => ({ el, top: el.getBoundingClientRect().top }));

        mutate();

        snapshot.forEach(({ el, top }) => {
            if (!el.isConnected) return;

            // Cancel any reflow still animating on this element so its stale
            // transitionend cleanup can't wipe the new one mid-glide — that race
            // is what made the stack teleport when entrances and exits overlapped.
            if (el._tmReflowCleanup) {
                el.removeEventListener("transitionend", el._tmReflowCleanup);
                el._tmReflowCleanup = null;
            }

            // Measure the true post-mutate layout position with our own offset
            // removed, so an in-progress glide isn't double-counted into delta.
            el.style.transition = "none";
            el.style.translate = "0px";
            const delta = top - el.getBoundingClientRect().top;
            if (!delta) {
                el.style.transition = "";
                el.style.translate = "";
                return;
            }

            // Invert: offset to the old position instantly via the independent `translate`...
            el.style.translate = `0 ${delta}px`;
            void el.offsetHeight; // flush the inverted position before playing

            // ...then play: glide to the new position without touching `transform`.
            requestAnimationFrame(() => {
                el.style.transition = reflowTransition;
                el.style.translate = "0 0";
                const cleanup = (event) => {
                    if (event.propertyName !== "translate") return;
                    el.style.transition = "";
                    el.style.translate = "";
                    el.removeEventListener("transitionend", cleanup);
                    el._tmReflowCleanup = null;
                };
                el._tmReflowCleanup = cleanup;
                el.addEventListener("transitionend", cleanup);
            });
        });
    }

    // ===============================
    // Utility: Icon generator
    // ===============================
    function getToasterIcon(key = null) {
        if (key?.toString() === 'success') {
            return `<?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="250" height="25"><g><path fill="currentColor" d="M405.333,0H106.667C47.786,0.071,0.071,47.786,0,106.667v298.667C0.071,464.214,47.786,511.93,106.667,512h298.667   C464.214,511.93,511.93,464.214,512,405.333V106.667C511.93,47.786,464.214,0.071,405.333,0z M426.667,172.352L229.248,369.771   c-16.659,16.666-43.674,16.671-60.34,0.012c-0.004-0.004-0.008-0.008-0.012-0.012l-83.563-83.541   c-8.348-8.348-8.348-21.882,0-30.229s21.882-8.348,30.229,0l83.541,83.541l197.44-197.419c8.348-8.318,21.858-8.294,30.176,0.053   C435.038,150.524,435.014,164.034,426.667,172.352z"/></g></svg>
            `;
        } else if (key?.toString() === 'error') {
            return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="25" height="25"><path fill="currentColor" d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-1.231,6.641l-4.466,5.359,4.466,5.359c.354.425.296,1.056-.128,1.409-.188.155-.414.231-.64.231-.287,0-.571-.122-.77-.359l-4.231-5.078-4.231,5.078c-.198.237-.482.359-.77.359-.226,0-.452-.076-.64-.231-.424-.354-.481-.984-.128-1.409l4.466-5.359-4.466-5.359c-.354-.425-.296-1.056.128-1.409.426-.353,1.056-.296,1.409.128l4.231,5.078,4.231-5.078c.354-.424.983-.48,1.409-.128.424.354.481.984.128,1.409Z"/></svg>`;
        } else if (key?.toString() === 'info') {
            return `<svg fill="currentColor" width="25px" height="25px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm223.797 707.147c-28.531-29.561-67.826-39.944-109.227-39.455-55.225.657-114.197 20.664-156.38 40.315-100.942 47.024-178.395 130.295-242.903 219.312-11.616 16.025-17.678 34.946 2.76 49.697 17.428 12.58 29.978 1.324 40.49-9.897l.69-.74c.801-.862 1.591-1.72 2.37-2.565 11.795-12.772 23.194-25.999 34.593-39.237l2.85-3.31 2.851-3.308c34.231-39.687 69.056-78.805 115.144-105.345 27.4-15.778 47.142 8.591 42.912 35.963-2.535 16.413-11.165 31.874-17.2 47.744-21.44 56.363-43.197 112.607-64.862 168.888-23.74 61.7-47.405 123.425-70.426 185.398l-2 5.38-1.998 5.375c-20.31 54.64-40.319 108.872-53.554 165.896-10.575 45.592-24.811 100.906-4.357 145.697 11.781 25.8 36.77 43.532 64.567 47.566 37.912 5.504 78.906 6.133 116.003-2.308 19.216-4.368 38.12-10.07 56.57-17.005 56.646-21.298 108.226-54.146 154.681-92.755 47.26-39.384 88.919-85.972 126.906-134.292 12.21-15.53 27.004-32.703 31.163-52.596 3.908-18.657-12.746-45.302-34.326-34.473-11.395 5.718-19.929 19.867-28.231 29.27-10.42 11.798-21.044 23.423-31.786 34.92-21.488 22.987-43.513 45.463-65.634 67.831-13.54 13.692-30.37 25.263-47.662 33.763-21.59 10.609-38.785-1.157-36.448-25.064 2.144-21.954 7.515-44.145 15.046-64.926 30.306-83.675 61.19-167.135 91.834-250.686 19.157-52.214 38.217-104.461 56.999-156.816 17.554-48.928 32.514-97.463 38.834-149.3 4.357-35.71-4.9-72.647-30.269-98.937Zm63.72-401.498c-91.342-35.538-200.232 25.112-218.574 121.757-13.25 69.784 13.336 131.23 67.998 157.155 105.765 50.16 232.284-29.954 232.29-147.084.005-64.997-28.612-111.165-81.715-131.828Z" fill-rule="evenodd"/>
            </svg>`;
        } else if (key?.toString() === 'warning') {
            return `<svg fill="currentColor" width="25px" height="25px" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><path d="m51.4 42.5l-22.9-37c-1.2-2-3.8-2-5 0l-22.9 37c-1.4 2.3 0 5.5 2.5 5.5h45.8c2.5 0 4-3.2 2.5-5.5z m-25.4-2.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z m3-9c0 0.6-0.4 1-1 1h-4c-0.6 0-1-0.4-1-1v-13c0-0.6 0.4-1 1-1h4c0.6 0 1 0.4 1 1v13z"></path></svg>`;
        } else if (key?.toString() === 'close') {
            return `<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"/></svg>`;
        } else {
            return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-8,6c0-.553.447-1,1-1s1,.447,1,1v7.5c0,.553-.447,1-1,1s-1-.447-1-1v-7.5Zm1,13c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z"/></svg>`;
        }
    }

    // ===============================
    // ToastMagic Class Definition
    // ===============================
    if (typeof window.ToastMagic === "undefined") {
        window.ToastMagic = class ToastMagic {
            constructor() {
                const config = window.toastMagicConfig || {};
                this.toastMagicPosition = config.positionClass || "toast-top-end";
                this.toastMagicCloseButton = config.closeButton || false;
                this.toastMagicTheme = config.theme || 'default';

                this.toastContainer = document.querySelector(".toast-container");
                if (!this.toastContainer) {
                    this.toastContainer = document.createElement("div");
                    this.toastContainer.classList.add("toast-container");
                    document.body.appendChild(this.toastContainer);
                }

                this.toastContainer.className = "toast-container " + this.toastMagicPosition + " theme-" + this.toastMagicTheme;
            }

            show({
                type,
                heading,
                description = "",
                showCloseBtn = this.toastMagicCloseButton,
                customBtnText = "",
                customBtnLink = "",
                timeOut = null,
                showDuration = null,
                avatar = ""
            }) {
                // Skip rendering if an identical toast is already visible and
                // duplicate prevention is enabled in the config.
                const duplicateKey = `${type}|${heading}|${description}`;
                if ((window.toastMagicConfig || {}).preventDuplicates && this.toastContainer) {
                    const isDuplicate = Array.from(this.toastContainer.querySelectorAll(".toast-item"))
                        .some(el => el.dataset.toastKey === duplicateKey);
                    if (isDuplicate) return;
                }

                let toastClass, toastClassBasic;
                switch (type) {
                    case "success":
                        toastClass = "toast-success";
                        toastClassBasic = "success";
                        break;
                    case "error":
                        toastClass = "toast-danger";
                        toastClassBasic = "danger";
                        break;
                    case "warning":
                        toastClass = "toast-warning";
                        toastClassBasic = "warning";
                        break;
                    case "info":
                    default:
                        toastClass = "toast-info";
                        toastClassBasic = "info";
                }

                const toast = document.createElement("div");
                toast.classList.add("toast-item", toastClass);
                toast.dataset.toastKey = duplicateKey;
                // Apply the configured entrance/exit animation (default keeps the current behavior).
                const toastAnimation = (window.toastMagicConfig || {}).animation;
                if (toastAnimation && toastAnimation !== "default") {
                    toast.classList.add("toast-animate-" + toastAnimation);
                }
                toast.setAttribute("role", "alert");
                toast.setAttribute("aria-live", "assertive");
                toast.setAttribute("aria-atomic", "true");

                toast.innerHTML = `
                <div class="theme-ios-toast-item-border"></div>
                    <div class="position-relative">
                        <div class="toast-item-content-center">
                            <div class="toast-body ${avatar ? `toast-body-avatar` : ``}">
                                <span class="toast-body-icon-container toast-text-${toastClassBasic}">
                                    ${avatar ? `<img src="${sanitizeUrl(avatar)}" alt="" class="toast-avatar">` : getToasterIcon(type)}
                                </span>
                                <div class="toast-body-container">
                                    ${heading ? `<div class="toast-body-title"><h4>${heading}</h4></div>` : ''}
                                    ${description ? `<p class="fs-12">${description}</p>` : ''}
                                </div>
                            </div>
                            <div class="toast-body-end">
                                ${showCloseBtn ? `<button type="button" class="toast-close-btn">${getToasterIcon('close')}</button>` : ""}
                                ${customBtnText && customBtnLink ? `<a href="${sanitizeUrl(customBtnLink)}" class="toast-custom-btn toast-btn-bg-${toastClassBasic}">${customBtnText}</a>` : ""}
                            </div>
                        </div>
                    </div>`;

                const cfg = window.toastMagicConfig || {};
                const toastMagicPosition = cfg.positionClass || "toast-top-end";
                // Per-toast overrides take precedence; otherwise fall back to the global config.
                const toastMagicShowDuration = (typeof showDuration === "number") ? showDuration : (cfg?.showDuration || 100);
                const toastMagicTimeOut = (typeof timeOut === "number") ? timeOut : (cfg?.timeOut || 5000);

                // Newest toast always appears closest to its anchored corner: on top
                // for top positions (older toasts move down), at the bottom for bottom
                // positions (older toasts move up). flipReflow glides the existing toasts
                // smoothly to their new spots instead of letting them jump, and removal
                // reflows the stack to close the gap (see closeToastMagicItem).
                if (
                    toastMagicPosition.includes('bottom')
                ) {
                    flipReflow(this.toastContainer, () => this.toastContainer.append(toast));
                } else {
                    flipReflow(this.toastContainer, () => this.toastContainer.prepend(toast));
                }

                setTimeout(() => toast.classList.add("show"), toastMagicShowDuration);

                // Auto-dismiss timer with optional pause-on-hover.
                // Enabled by default; set `pauseOnHover: false` in the config to disable.
                const pauseOnHover = (window.toastMagicConfig || {}).pauseOnHover !== false;
                let remaining = toastMagicTimeOut;
                let startedAt = Date.now();
                let dismissTimer = setTimeout(() => closeToastMagicItem(toast), remaining);

                if (pauseOnHover) {
                    toast.addEventListener("mouseenter", () => {
                        clearTimeout(dismissTimer);
                        remaining -= Date.now() - startedAt;
                    });
                    toast.addEventListener("mouseleave", () => {
                        startedAt = Date.now();
                        dismissTimer = setTimeout(() => closeToastMagicItem(toast), Math.max(remaining, 0));
                    });
                }
            }

            success(...args) {
                this.show({ type: "success", ...this._parseArgs(args) });
            }

            error(...args) {
                this.show({ type: "error", ...this._parseArgs(args) });
            }

            warning(...args) {
                this.show({ type: "warning", ...this._parseArgs(args) });
            }

            info(...args) {
                this.show({ type: "info", ...this._parseArgs(args) });
            }

            // Programmatically dismiss every currently visible toast.
            clear() {
                if (!this.toastContainer) return;
                this.toastContainer
                    .querySelectorAll(".toast-item")
                    .forEach(toast => closeToastMagicItem(toast));
            }

            // Alias for clear().
            dismissAll() {
                this.clear();
            }

            _parseArgs(args) {
                const [heading = "", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "", timeOut = null, showDuration = null, avatar = ""] = args;
                return { heading, description, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar };
            }
        };
    }

    // ===============================
    // Initialize Instance Once
    // ===============================
    if (typeof window.toastMagic === "undefined") {
        window.toastMagic = new window.ToastMagic();
    }

    // ===============================
    // DOM Ready: Setup Container + Events
    // ===============================
    document.addEventListener("DOMContentLoaded", function () {
        const config = window.toastMagicConfig || {};
        const toastMagicPosition = config.positionClass || "toast-top-end";

        if (!document.querySelector(".toast-container")) {
            document.body.insertAdjacentHTML(
                "afterbegin",
                `<div><div class="toast-container ${toastMagicPosition}"></div></div>`
            );
        }

        // Listen for toast trigger buttons
        document.body.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-toast-type]");
            if (!btn) return;

            const type = btn.getAttribute("data-toast-type");
            const heading = btn.getAttribute("data-toast-heading") || "Notification";
            const description = btn.getAttribute("data-toast-description") || "";
            const showCloseBtn = btn.hasAttribute("data-toast-close-btn");
            const customBtnText = btn.getAttribute("data-toast-btn-text") || "";
            const customBtnLink = btn.getAttribute("data-toast-btn-link") || "";

            if (window.toastMagic[type]) {
                window.toastMagic[type](heading, description, showCloseBtn, customBtnText, customBtnLink);
            } else {
                window.toastMagic.info(heading, description, showCloseBtn, customBtnText, customBtnLink);
            }
        });

        // Listen for toast close buttons
        document.body.addEventListener("click", function (event) {
            const closeBtn = event.target.closest(".toast-close-btn");
            if (closeBtn) {
                const toast = closeBtn.closest(".toast-item");
                if (toast) closeToastMagicItem(toast);
            }
        });
    });
})();
