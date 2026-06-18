if (!window._toastMagicBound) {
    window._toastQueue = [];
    window._toastProcessing = false;

    const processToastQueue = () => {
        if (window._toastQueue.length === 0) {
            window._toastProcessing = false;
            return;
        }

        const toast = window._toastQueue.shift();

        const { status, title, message, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar } = toast;

        if (typeof toastMagic[status] === 'function') {
            toastMagic[status](title, message, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar);
        } else {
            console.warn(`Unknown toast status: ${status}, defaulting to success.`);
            toastMagic.success(title, message);
        }

        setTimeout(processToastQueue, 1000); // Wait 1000ms before processing next
    };

    window.addEventListener('toastMagic', event => {
        const detail = event.detail || {};
        const status = detail.status ?? 'success';
        const title = detail.title ?? 'Success!';
        const message = detail.message ?? 'Your data has been saved!';
        const showCloseBtn = detail?.options?.showCloseBtn ?? detail?.options?.closeButton ?? false;
        const customBtnText = detail?.options?.customBtnText ?? '';
        const customBtnLink = detail?.options?.customBtnLink ?? '';
        const timeOut = detail?.options?.timeOut ?? null;
        const showDuration = detail?.options?.showDuration ?? null;
        const avatar = detail?.options?.avatar ?? '';

        window._toastQueue.push({ status, title, message, showCloseBtn, customBtnText, customBtnLink, timeOut, showDuration, avatar });

        if (!window._toastProcessing) {
            window._toastProcessing = true;
            processToastQueue();
        }
    });

    window._toastMagicBound = true;
}
