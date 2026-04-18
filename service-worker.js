const CACHE_NAME = "sfbbo-volunteer-explorer-v6";
const BASE_PATH = self.location.pathname.replace(/service-worker\.js$/, "");
const PROGRAM_PAGES = [
  "colonial-waterbird-nest-monitoring.html",
  "bird-banding.html",
  "outreach.html",
  "habitat-restoration.html",
  "least-tern-monitoring.html",
  "california-gull-nest-surveys.html",
  "avian-disease-prevention-program.html",
  "phalarope-surveys.html",
  "snowy-plover.html"
];
const CORE_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}styles.css`,
  `${BASE_PATH}program-data.js`,
  `${BASE_PATH}program-page.js`,
  `${BASE_PATH}app.js`,
  `${BASE_PATH}favicon.svg`,
  `${BASE_PATH}SFBBO_Logo_Rounded.png`,
  `${BASE_PATH}site.webmanifest`,
  ...PROGRAM_PAGES.map((page) => `${BASE_PATH}${page}`),
  `${BASE_PATH}assets/AVIAN_DISEASE_PREVENTION_PROGRAM.png`,
  `${BASE_PATH}assets/BIRD_BANDING.png`,
  `${BASE_PATH}assets/CALIFORNIA_GULL_NEST_SURVEYS.png`,
  `${BASE_PATH}assets/COLONIAL_WATERBIRD_NEST_MONITORING.png`,
  `${BASE_PATH}assets/HABITAT_RESTORATION.png`,
  `${BASE_PATH}assets/LEAST_TERN_MONITORING.png`,
  `${BASE_PATH}assets/OUTREACH.png`,
  `${BASE_PATH}assets/PHALAROPE_SURVEYS.png`,
  `${BASE_PATH}assets/SNOWY_PLOVER.png`
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
