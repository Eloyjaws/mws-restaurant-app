// Set a name for the current cache
let staticCacheName = 'mws-restaurants-project-1-v1';

// Default files to always cache
const cacheFiles = [
    './',
    './index.html',
    './main.js',
    './style.css',
    './normalize.css',
    // './sw.js',
    './img/WAVECLAN.png',
    './img/pattern.png',
    './img/vex1.jpeg',
    './img/amb.svg',
    './img/ig.svg',
    './img/twitter.svg',
    './img/itunes.svg',
    './img/deezer.png',
    './img/Spotify_Badge_Lg.png',
    './img/amazon-Music-Badge.png',
    './img/google-play-badge.png',
    'https://fonts.googleapis.com/css?family=Barlow:200,500i,800i',
    'https://fonts.gstatic.com/s/barlow/v1/7cHsv4kjgoGqM7E_CfPI42ouvTo.woff2',
    'https://fonts.gstatic.com/s/barlow/v1/7cHsv4kjgoGqM7E_CfOc5mouvTo.woff2',
    'https://fonts.gstatic.com/s/barlow/v1/7cHqv4kjgoGqM7E3w-os51os.woff2'

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
                    .map((cacheName) => {console.log(cacheName); return caches.delete(cacheName)})
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
                })
            )
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});