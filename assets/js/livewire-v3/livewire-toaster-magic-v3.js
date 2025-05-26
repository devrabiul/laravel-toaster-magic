if (!window._toastMagicBound) {
    window._toastQueue = [];
    window._toastProcessing = false;

    const processToastQueue = () => {
        if (window._toastQueue.length === 0) {
            window._toastProcessing = false;
            return;
        }

        const toast = window._toastQueue.shift();

        const { status, title, message, showCloseBtn, customBtnText, customBtnLink } = toast;

        if (typeof toastMagic[status] === 'function') {
            toastMagic[status](title, message, showCloseBtn, customBtnText, customBtnLink);
        } else {
            console.warn(`Unknown toast status: ${status}, defaulting to success.`);
            toastMagic.success(title, message);
        }

        setTimeout(processToastQueue, 1000); // Wait 500ms before processing next
    };

    window.addEventListener('toastMagic', event => {
        const detail = event.detail || {};
        const status = detail.status ?? 'success';
        const title = detail.title ?? 'Success!';
        const message = detail.message ?? 'Your data has been saved!';
        const showCloseBtn = detail?.options?.showCloseBtn ?? false;
        const customBtnText = detail?.options?.customBtnText ?? '';
        const customBtnLink = detail?.options?.customBtnLink ?? 'javascript:';

        window._toastQueue.push({ status, title, message, showCloseBtn, customBtnText, customBtnLink });

        if (!window._toastProcessing) {
            window._toastProcessing = true;
            processToastQueue();
        }
    });

    window._toastMagicBound = true;
}
