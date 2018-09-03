// Set a name for the current cache
let staticCacheName = 'mws-restaurants-project-1-v2';

// Default files to always cache
const cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/register_sw.js',
    './js/restaurant_info.js',
    './sw.js',
    './mws-restaurant-stage-1/img/1-400_1x.jpg',
    './mws-restaurant-stage-1/img/2-400_1x.jpg',
    './mws-restaurant-stage-1/img/3-400_1x.jpg',
    './mws-restaurant-stage-1/img/4-400_1x.jpg',
    './mws-restaurant-stage-1/img/5-400_1x.jpg',
    './mws-restaurant-stage-1/img/6-400_1x.jpg',
    './mws-restaurant-stage-1/img/7-400_1x.jpg',
    './mws-restaurant-stage-1/img/8-400_1x.jpg',
    './mws-restaurant-stage-1/img/9-400_1x.jpg',
    './mws-restaurant-stage-1/img/10-400_1x.jpg',
    './mws-restaurant-stage-1/img/1-800_2x.jpg',
    './mws-restaurant-stage-1/img/2-800_2x.jpg',
    './mws-restaurant-stage-1/img/3-800_2x.jpg',
    './mws-restaurant-stage-1/img/4-800_2x.jpg',
    './mws-restaurant-stage-1/img/5-800_2x.jpg',
    './mws-restaurant-stage-1/img/6-800_2x.jpg',
    './mws-restaurant-stage-1/img/7-800_2x.jpg',
    './mws-restaurant-stage-1/img/8-800_2x.jpg',
    './mws-restaurant-stage-1/img/9-800_2x.jpg',
    './mws-restaurant-stage-1/img/10-800_2x.jpg',
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
                    .map((cacheName) => {console.log(cacheName, 'cache deleted'); return caches.delete(cacheName)})
            )
            )
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(staticCacheName)
            .then((cache) => cache.match(event.request)
                .then((response) => {
                    return response || fetch(event.request); 
                    //TODO handle when the req failed. maybe a 404
                })
            )
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});