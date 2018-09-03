function main() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js', { updateViaCache: 'none', scope: '/mws-restaurant-stage-1/' })
            .then((reg) => {
                if (!navigator.serviceWorker.controller) return;
                if (reg.waiting) {
                    //trigger user notification;
                    //return;
                    console.log('waiting');
                }
                if (reg.installing) {
                    //track installing. add event listener on statechange. if reg.state == 'installed'
                    //trigger user notification
                    //return;
                    console.log('installing');
                }
                reg.addEventListener('updatefound', () => {
                    //track installing. add event listener on statechange. if reg.state == 'installed'
                    //trigger user notification
                    //return;
                    console.log('update found');
                });
                console.log('SW Registered')
            })
            .catch(() => { throw new Error('Something went wrong while registering the service worker') });

        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
    }
}

function isReady() {
    if (document.readyState === "complete") main()
}

document.addEventListener("readystatechange", isReady)