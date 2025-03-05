// Initialize toast container
document.addEventListener("DOMContentLoaded", function () {
    // Ensure the toast container exists
    if (!document.querySelector(".toast-container")) {
        document.body.insertAdjacentHTML(
            "afterbegin",
            `<div><div class="toast-container"></div></div>`
        );
    }

    // Initialize ToastMagic instance
    const toastMagic = new ToastMagic();

    // Event delegation for dynamically created toasts
    document.body.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-toast-type]");
        if (!btn) return;

        // Fetch data attributes
        const type = btn.getAttribute("data-toast-type");
        const heading = btn.getAttribute("data-toast-heading") || "Notification";
        const description = btn.getAttribute("data-toast-description") || "";
        const showCloseBtn = btn.hasAttribute("data-toast-close-btn");
        const customBtnText = btn.getAttribute("data-toast-btn-text") || "";
        const customBtnLink = btn.getAttribute("data-toast-btn-link") || "";

        // Call the respective toast function dynamically
        if (toastMagic[type]) {
            toastMagic[type](heading, description, showCloseBtn, customBtnText, customBtnLink);
        } else {
            toastMagic.info(heading, description, showCloseBtn, customBtnText, customBtnLink);
        }
    });
});

// Close button event listener
document.body.addEventListener("click", function (event) {
    const closeButton = event.target.closest(".toast-close-btn");
    if (!closeButton) return;

    const toast = closeButton.closest(".toast-item");
    if (toast) {
        closeToastMagicItem(toast);
    }
});

function closeToastMagicItem(toast) {
    toast.classList.add("hide");
    setTimeout(() => {
        toast.remove();
    }, 500);
}

class ToastMagic {
    constructor() {
        this.toastContainer = document.querySelector(".toast-container");
        if (!this.toastContainer) {
            this.toastContainer = document.createElement("div");
            this.toastContainer.classList.add("toast-container");
            document.body.appendChild(this.toastContainer);
        }
    }

    show({ type, heading, description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "" }) {
        let icon, toastClass, toastClassBasic;
        switch (type) {
            case "success":
                icon = "fi fi-sr-checkbox";
                toastClass = "toast-success";
                toastClassBasic = "success";
                break;
            case "error":
                icon = "fi fi-sr-square-x";
                toastClass = "toast-danger";
                toastClassBasic = "danger";
                break;
            case "warning":
                icon = "fi fi-sr-square-exclamation";
                toastClass = "toast-warning";
                toastClassBasic = "warning";
                break;
            case "info":
                icon = "fi fi-sr-square-exclamation";
                toastClass = "toast-info";
                toastClassBasic = "info";
                break;
            default:
                icon = "fi fi-sr-square-exclamation";
                toastClass = "toast-info";
                toastClassBasic = "info";
        }

        // Create the toast structure
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
                            <i class="${icon}"></i>
                        </span>
                        <div class="toast-body-container">
                            ${
            heading
                ? `<div class="d-flex gap-3 align-items-center justify-content-between mb-1">
                                        <h4>${heading}</h4>
                                    </div>`
                : ''
        }
                            ${
            description
                ? `<p class="fs-12">${description}</p>`
                : ""
        }
                        </div>
                    </div>
                    <div class="toast-body-end">
                        ${
            showCloseBtn
                ? '<button type="button" class="toast-close-btn"><i class="fi fi-rr-cross-small"></i></button>'
                : ""
        }
                        ${
            customBtnText && customBtnLink
                ? `<a href="${customBtnLink}" class="toast-custom-btn toast-btn-bg-${toastClassBasic}">${customBtnText}</a>`
                : ""
        }
                    </div>
                </div>
            </div>
        `;

        this.toastContainer.prepend(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 100);


        // Auto close the toast after 3 seconds
        setTimeout(() => {
            // closeToastMagicItem(toast);
        }, 5000);
    }

    success(heading = "Success!", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "") {
        this.show({ type: "success", heading, description, showCloseBtn, customBtnText, customBtnLink });
    }

    error(heading = "Error!", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "") {
        this.show({ type: "error", heading, description, showCloseBtn, customBtnText, customBtnLink });
    }

    warning(heading = "Warning!", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "") {
        this.show({ type: "warning", heading, description, showCloseBtn, customBtnText, customBtnLink });
    }

    info(heading = "Info!", description = "", showCloseBtn = false, customBtnText = "", customBtnLink = "") {
        this.show({ type: "info", heading, description, showCloseBtn, customBtnText, customBtnLink });
    }
}

// Usage
// Define createToast globally
const toastMagic = new ToastMagic();
// toastMagic.success("Success!", "Your operation was successful!");
// toastMagic.error("Error!", "Something went wrong.");
// toastMagic.warning("Warning!", "This is a warning message.");
// toastMagic.info("Info!", "Just an informational message.", true, 'close', 'link');
