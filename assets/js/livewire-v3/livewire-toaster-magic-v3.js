if (!window._toastMagicBound) {
    window._toastQueue = [];
    window._toastProcessing = false;

    const processToastQueue = () => {
        if (window._toastQueue.length === 0) {
            window._toastProcessing = false;
            return;
        }

        const { status, title, message } = window._toastQueue.shift();

        if (typeof toastMagic[status] === 'function') {
            toastMagic[status](title, message);
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

        window._toastQueue.push({ status, title, message });

        if (!window._toastProcessing) {
            window._toastProcessing = true;
            processToastQueue();
        }
    });

    window._toastMagicBound = true;
}
