function main() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js', { updateViaCache: 'none', scope: './' })
            .then(() => console.log('SW Registered'))
            .catch(() => { throw new Error('Something went wrong while registering the service worker') })
    }
}

function isReady() {
    if (document.readyState === "complete") main()
}

document.addEventListener("readystatechange", isReady)
