// Define createToast globally
function createToast({
    type,
    heading,
    description = "",
    showCloseBtn = false,
    customBtnText = "",
    customBtnLink = "",
}) {
    const toastContainer = document.querySelector(".toast-container");

    if (!toastContainer) return;

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
    toast.classList.add("toast", "toast-item", toastClass);
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
                            heading ?
                            `<div class="d-flex gap-3 align-items-center justify-content-between mb-1">
                                <h4>${heading}</h4>
                            </div>` : ''
                        }

                        ${
                            description
                                ? `<p class="fs-12">${description}</p>`
                                : ""
                        }
                    </div>
                </div>
                <div>
                    ${
                        showCloseBtn
                            ? '<button type="button" class="btn-close shadow-none position-absolute top-0 end-0 fs-10" data-bs-dismiss="toast" aria-label="Close"></button>'
                            : ""
                    }
                    ${
                        customBtnText && customBtnLink
                            ? `<a href="${customBtnLink}" class="btn bg-${toastClassBasic} text-dark bg-opacity-10 border-0 fs-12 py-10 px-12 text-nowrap">${customBtnText}</a>`
                            : ""
                    }
                </div>
            </div>
        </div>
    `;

    toastContainer.prepend(toast);
    toast.classList.add("show");

    // Only add the event listener if the close button exists
    // if (showCloseBtn) {
    //     const closeButton = toast.querySelector(".close-btn");
    //     if (closeButton) {
    //         closeButton.addEventListener("click", () => {
    //             closeToast(toast);
    //         });
    //     }
    // }

    // Auto close the toast after 3 seconds
    // setTimeout(() => {
    //     closeToast(toast);
    // }, 3000);

    function closeToast(toast) {
        toast.classList.add("hide");
        setTimeout(() => {
            toast.remove();
        }, 500); // Wait for the fade-out transition to complete
    }

    console.log('Done');

}

// Initialize toast container
document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML(
        "afterbegin",
        `<div><div class="toast-container"></div></div>`
    );

    // Event delegation for dynamic toasts
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

        // Create toast dynamically
        createToast({
            type,
            heading,
            description,
            showCloseBtn,
            customBtnText,
            customBtnLink,
        });
    });
});
