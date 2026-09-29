/**
 * Service Worker for PPD-ICT / PTIS PWA
 * Strategy: Stale-While-Revalidate & Network-First with Offline Fallback
 */

const CACHE_NAME = 'portal-ict-white-label-v2-__BUILD_VERSION__';

const PRECACHE_RESOURCES = [
  "/",
  "/dashboard",
  "/pwa",
  "/ptis",
  "/auth-gate.js",
  "/admin",
  "/map",
  "/radar",
  "/qrcode",
  "/manifest.webmanifest?v=10",
  "/icons/icon-192.png?v=10",
  "/icons/icon-512.png?v=10",
  "/a1/a1-admin-queue.js?v=__BUILD_VERSION__",
  "/a1/a1-categories.js?v=__BUILD_VERSION__",
  "/a1/a1-components.css?v=__BUILD_VERSION__",
  "/a1/a1-geo-data.js?v=__BUILD_VERSION__",
  "/a1/a1-home-data.js?v=__BUILD_VERSION__",
  "/a1/a1-icons.js?v=__BUILD_VERSION__",
  "/a1/a1-production-data.js?v=__BUILD_VERSION__",
  "/a1/public-config.js?v=__BUILD_VERSION__",
  "/a1/generic-ui.css?v=__BUILD_VERSION__",
  "/a1/a1-shell.js?v=__BUILD_VERSION__",
  "/a1/a1-theme.js?v=__BUILD_VERSION__",
  "/a1/a1-tokens.css?v=__BUILD_VERSION__",
  "/a1/admin-a1.css?v=__BUILD_VERSION__",
  "/a1/dashboard-a1.css?v=__BUILD_VERSION__",
  "/a1/home-a1.css?v=__BUILD_VERSION__",
  "/a1/officer-positions.js?v=__BUILD_VERSION__",
  "/a1/overview-swiss.js?v=__BUILD_VERSION__",
  "/a1/peta-a1.css?v=__BUILD_VERSION__",
  "/a1/ptis-a1.css?v=__BUILD_VERSION__",
  "/a1/pwa-a1.css?v=__BUILD_VERSION__",
  "/a1/pwa/icon-512.png?v=__BUILD_VERSION__",
  "/a1/qr-a1.css?v=__BUILD_VERSION__",
  "/a1/tuntutan-core.js?v=__BUILD_VERSION__",
  "/a1/tuntutan-print.css?v=__BUILD_VERSION__",
  "/a1/tuntutan-ui.js?v=__BUILD_VERSION__"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_RESOURCES.map((resource) =>
          cache.add(resource).catch((err) => {
            console.warn('PWA Precache warning (non-fatal):', resource, err);
            return null;
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('PWA Service Worker: Memadam cache lapuk', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Jangan pintas / ubah permintaan bukan GET (cth: POST simpan laporan)
  if (req.method !== 'GET') {
    return;
  }

  // Permintaan API Awam: Network-First dengan cache fallback sah
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname.includes('/public/') || url.pathname.includes('/health') || url.pathname.includes('/sekolah')) {
      event.respondWith(
        fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.ok) {
              const ct = networkRes.headers.get('content-type') || '';
              if (ct.includes('application/json')) {
                const clone = networkRes.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
              }
            }
            return networkRes;
          })
          .catch(() => caches.match(req))
      );
      return;
    }
    return;
  }

  // Aset Statik & Halaman Web (Network First, Cache Fallback)
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;

          // Jika halaman HTML gagal dimuatkan kerana tiada internet, fallback ke halaman bersesuaian
          if (req.headers.get('accept')?.includes('text/html')) {
            if (url.pathname.includes('admin')) return caches.match('/AdminApp.html');
            if (url.pathname.includes('radar')) return caches.match('/radar.html');
            if (url.pathname.includes('map')) return caches.match('/map.html');
            if (url.pathname.includes('dashboard') || url.pathname.includes('index')) return caches.match('/index.html');
            if (url.pathname.includes('ptis') || url.pathname.includes('laporan')) return caches.match('/ptis.html');
            return caches.match('/').then((cachedRoot) => {
              if (cachedRoot) return cachedRoot;
              return caches.match('/index.html');
            }).then((cachedPage) => {
              if (cachedPage) return cachedPage;
              return caches.match('/ptis.html');
            });
          }
        });
      })
  );
});
