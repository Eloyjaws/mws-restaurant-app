// let scopePrefix = ``;
// let scope = "/dist/";

let scopePrefix = `.`;
let scope = "/";

// Set a name for the current cache
let staticCacheName = "mws-restaurants-project-v7";

// Default files to always cache
const cacheFiles = [
  `${scopePrefix}/`,
  `${scopePrefix}/index.html`,
  `${scopePrefix}/manifest.json`,
  `${scopePrefix}/css/styles.css`,
  `${scopePrefix}/js/dbhelper.js`,
  `${scopePrefix}/js/main.js`,
  `${scopePrefix}/js/register_sw.js`,
  `${scopePrefix}/js/restaurant_info.js`,
  `${scopePrefix}${scope}img/1-800_1x.jpg`,
  `${scopePrefix}${scope}img/2-800_1x.jpg`,
  `${scopePrefix}${scope}img/3-800_1x.jpg`,
  `${scopePrefix}${scope}img/4-800_1x.jpg`,
  `${scopePrefix}${scope}img/5-800_1x.jpg`,
  `${scopePrefix}${scope}img/6-800_1x.jpg`,
  `${scopePrefix}${scope}img/7-800_1x.jpg`,
  `${scopePrefix}${scope}img/8-800_1x.jpg`,
  `${scopePrefix}${scope}img/9-800_1x.jpg`,
  `${scopePrefix}${scope}img/10-800_1x.jpg`,
  `${scopePrefix}${scope}img/undefined-800_1x.jpg`,
  `${scopePrefix}${scope}img/1-800_2x.jpg`,
  `${scopePrefix}${scope}img/2-800_2x.jpg`,
  `${scopePrefix}${scope}img/3-800_2x.jpg`,
  `${scopePrefix}${scope}img/4-800_2x.jpg`,
  `${scopePrefix}${scope}img/5-800_2x.jpg`,
  `${scopePrefix}${scope}img/6-800_2x.jpg`,
  `${scopePrefix}${scope}img/7-800_2x.jpg`,
  `${scopePrefix}${scope}img/8-800_2x.jpg`,
  `${scopePrefix}${scope}img/9-800_2x.jpg`,
  `${scopePrefix}${scope}img/10-800_2x.jpg`,
  `${scopePrefix}${scope}img/undefined-800_2x.jpg`,
  "https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2",
  "https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UNirkOX-hpOqc.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => cache.addAll(cacheFiles))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(
            cacheName =>
              cacheName.startsWith("mws-restaurants-project-") &&
              cacheName != staticCacheName
          )
          .map(cacheName => {
            console.log(cacheName, "cache deleted");
            return caches.delete(cacheName);
          })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.open(staticCacheName).then(cache =>
        cache
          .match(event.request)
          .then(response => {
            return (
              response ||
              fetch(event.request).then(response => {
                // if (response && response.status == 200){
                return caches.open(staticCacheName).then(cache => {
                  cache.put(event.request, response.clone());
                  return response;
                });
                // }
              })
            );
          })
          .catch(() => {
            return caches.match("/index.html");
          })
      )
    );
  }
});

self.addEventListener("message", function(event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
