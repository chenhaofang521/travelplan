/* Service Worker：提供离线缓存，同时保证开发期更新能及时生效。 */

const CACHE_NAME = "korea-trip-v14";

// 预缓存的应用外壳文件。版本号与 index.html 中的引用保持一致。
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260905r",
  "./app.js?v=20260905r",
  "./data/trip-data.js?v=20260905r",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
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
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 地图瓦片：缓存优先，让看过的区域离线也能显示。
  if (url.hostname.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  const isSameOrigin = url.origin === self.location.origin;

  // 页面与同源静态资源：网络优先，保证更新及时；离线时回退缓存。
  if (request.mode === "navigate" || isSameOrigin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 其他跨域资源（Leaflet CDN 等）：缓存优先，失败回退网络。
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});
