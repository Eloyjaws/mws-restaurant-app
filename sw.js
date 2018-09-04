const scope = '/';

// Set a name for the current cache
let staticCacheName = 'mws-restaurant-stage-1-v4';

// Default files to always cache
const cacheFiles = [
    './',
    './index.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/register_sw.js',
    './js/restaurant_info.js',
    `.${scope}img/1-400_1x.jpg`,
    `.${scope}img/2-400_1x.jpg`,
    `.${scope}img/3-400_1x.jpg`,
    `.${scope}img/4-400_1x.jpg`,
    `.${scope}img/5-400_1x.jpg`,
    `.${scope}img/6-400_1x.jpg`,
    `.${scope}img/7-400_1x.jpg`,
    `.${scope}img/8-400_1x.jpg`,
    `.${scope}img/9-400_1x.jpg`,
    `.${scope}img/10-400_1x.jpg`,
    `.${scope}img/1-800_2x.jpg`,
    `.${scope}img/2-800_2x.jpg`,
    `.${scope}img/3-800_2x.jpg`,
    `.${scope}img/4-800_2x.jpg`,
    `.${scope}img/5-800_2x.jpg`,
    `.${scope}img/6-800_2x.jpg`,
    `.${scope}img/7-800_2x.jpg`,
    `.${scope}img/8-800_2x.jpg`,
    `.${scope}img/9-800_2x.jpg`,
    `.${scope}img/10-800_2x.jpg`,
    './data/restaurants.json',
    'https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2',
    'https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UNirkOX-hpOqc.woff2'

]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => cache.addAll(cacheFiles))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames.filter((cacheName) => cacheName.startsWith('mws-restaurants-project-1-') && cacheName != staticCacheName)
                    .map((cacheName) => { console.log(cacheName, 'cache deleted'); return caches.delete(cacheName) })
            )
            )
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(staticCacheName)
            .then((cache) => cache.match(event.request)
                .then((response) => {
                    return response || fetch(event.request)
                        // .then(response => {
                        //     if(!response || response.status !== 200 || response.type !== 'basic') {
                        //         return response;
                        //         }
                        // })
                        .then(response => {
                            return caches.open(staticCacheName)
                                .then(cache => {
                                    cache.put(event.request, response.clone())
                                    return response;
                                })
                        });
                })
                .catch(() => {
                    return caches.match('/index.html')
                })
            )
    );
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});