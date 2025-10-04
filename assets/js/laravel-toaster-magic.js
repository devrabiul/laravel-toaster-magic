(function () {
    // ===============================
    // Utility: Close toast function
    // ===============================
    function closeToastMagicItem(toast) {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 500);
    }

    // ===============================
    // Utility: Icon generator
    // ===============================
    function getToasterIcon(key = null) {
        if (key?.toString() === 'success') {
            return `<?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="28" height="28"><g><path fill="currentColor" d="M405.333,0H106.667C47.786,0.071,0.071,47.786,0,106.667v298.667C0.071,464.214,47.786,511.93,106.667,512h298.667   C464.214,511.93,511.93,464.214,512,405.333V106.667C511.93,47.786,464.214,0.071,405.333,0z M426.667,172.352L229.248,369.771   c-16.659,16.666-43.674,16.671-60.34,0.012c-0.004-0.004-0.008-0.008-0.012-0.012l-83.563-83.541   c-8.348-8.348-8.348-21.882,0-30.229s21.882-8.348,30.229,0l83.541,83.541l197.44-197.419c8.348-8.318,21.858-8.294,30.176,0.053   C435.038,150.524,435.014,164.034,426.667,172.352z"/></g></svg>
            `;
        } else if (key?.toString() === 'error') {
            return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-1.231,6.641l-4.466,5.359,4.466,5.359c.354.425.296,1.056-.128,1.409-.188.155-.414.231-.64.231-.287,0-.571-.122-.77-.359l-4.231-5.078-4.231,5.078c-.198.237-.482.359-.77.359-.226,0-.452-.076-.64-.231-.424-.354-.481-.984-.128-1.409l4.466-5.359-4.466-5.359c-.354-.425-.296-1.056.128-1.409.426-.353,1.056-.296,1.409.128l4.231,5.078,4.231-5.078c.354-.424.983-.48,1.409-.128.424.354.481.984.128,1.409Z"/></svg>`;
        } else if (key?.toString() === 'close') {
            return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 20 20" width="14" height="14"><path fill="currentColor" d="M14.121,12,18,8.117A1.5,1.5,0,0,0,15.883,6L12,9.879,8.11,5.988A1.5,1.5,0,1,0,5.988,8.11L9.879,12,6,15.882A1.5,1.5,0,1,0,8.118,18L12,14.121,15.878,18A1.5,1.5,0,0,0,18,15.878Z"/></svg>`;
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
                     customBtnLink = ""
                 }) {
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
                toast.setAttribute("role", "alert");
                toast.setAttribute("aria-live", "assertive");
                toast.setAttribute("aria-atomic", "true");

                toast.innerHTML = `
                    <div class="position-relative">
                        <div class="toast-item-content-center">
                            <div class="toast-body">
                                <span class="toast-body-icon-container toast-text-${toastClassBasic}">
                                    ${getToasterIcon(type)}
                                </span>
                                <div class="toast-body-container">
                                    ${heading ? `<div class="toast-body-title"><h4>${heading}</h4></div>` : ''}
                                    ${description ? `<p class="fs-12">${description}</p>` : ''}
                                </div>
                            </div>
                            <div class="toast-body-end">
                                ${showCloseBtn ? `<button type="button" class="toast-close-btn">${getToasterIcon('close')}</button>` : ""}
                                ${customBtnText && customBtnLink ? `<a href="${customBtnLink}" class="toast-custom-btn toast-btn-bg-${toastClassBasic}">${customBtnText}</a>` : ""}
                            </div>
                        </div>
                    </div>`;

                const cfg = window.toastMagicConfig || {};
                const toastMagicPosition = cfg.positionClass || "toast-top-end";
                const toastMagicShowDuration = cfg?.showDuration || 100;
                const toastMagicTimeOut = cfg?.timeOut || 5000;

                if (
                    toastMagicPosition === 'toast-bottom-end' ||
                    toastMagicPosition === 'toast-bottom-start' ||
                    toastMagicPosition === 'toast-top-center'
                ) {
                    this.toastContainer.append(toast);
                } else {
                    this.toastContainer.prepend(toast);
                }

                setTimeout(() => toast.classList.add("show"), toastMagicShowDuration);
                setTimeout(() => closeToastMagicItem(toast), toastMagicTimeOut);
            }

            success(...args) {
                this.show({type: "success", ...this._parseArgs(args)});
            }

            error(...args) {
                this.show({type: "error", ...this._parseArgs(args)});
            }

            warning(...args) {
                this.show({type: "warning", ...this._parseArgs(args)});
            }

            info(...args) {
                this.show({type: "info", ...this._parseArgs(args)});
            }

            _parseArgs(args) {
                const [heading = "", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = ""] = args;
                return {heading, description, showCloseBtn, customBtnText, customBtnLink};
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
