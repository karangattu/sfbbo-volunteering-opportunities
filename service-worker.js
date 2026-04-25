const CACHE_NAME = "sfbbo-volunteer-explorer-v18";
const BASE_PATH = self.location.pathname.replace(/service-worker\.js$/, "");
const PROGRAM_SLUGS = [
  "colonial-waterbird-nest-monitoring",
  "bird-banding",
  "outreach",
  "habitat-restoration",
  "least-tern-monitoring",
  "california-gull-nest-surveys",
  "avian-disease-prevention-program",
  "phalarope-surveys",
  "snowy-plover"
];
const PROGRAM_PAGES = PROGRAM_SLUGS.map((slug) => `${slug}.html`);
const PROGRAM_ASSET_STEMS = PROGRAM_SLUGS.map((slug) => slug.toUpperCase().replace(/-/g, "_"));
const PROGRAM_ASSETS = PROGRAM_ASSET_STEMS.flatMap((stem) => [
  `${BASE_PATH}assets/${stem}.png`,
  `${BASE_PATH}assets/${stem}_WHAT.png`,
  `${BASE_PATH}assets/${stem}_HOW.png`,
  `${BASE_PATH}assets/${stem}_WHEN.png`
]);
const CORE_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}styles.css`,
  `${BASE_PATH}program-data.js`,
  `${BASE_PATH}program-page.js`,
  `${BASE_PATH}app.js`,
  `${BASE_PATH}favicon.svg`,
  `${BASE_PATH}SFBBO_Logo_Rounded.png`,
  `${BASE_PATH}icon-192.png`,
  `${BASE_PATH}icon-512.png`,
  `${BASE_PATH}site.webmanifest`,
  ...PROGRAM_PAGES.map((page) => `${BASE_PATH}${page}`),
  ...PROGRAM_ASSETS
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));

          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cachedResponse) => cachedResponse || caches.match(`${BASE_PATH}index.html`))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      });
    })
  );
});
