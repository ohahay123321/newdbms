/* Basic service worker to cache shell assets for offline use */
const CACHE_NAME = 'taskmaster-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  // fonts and google fonts are network-hosted; fallback handled
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // navigation requests: network-first then cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => { caches.open(CACHE_NAME).then(c=>c.put(req, resp.clone())); return resp; }).catch(()=> caches.match('/index.html'))
    );
    return;
  }
  // static asset: cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r=>{ if (r && r.status===200) { caches.open(CACHE_NAME).then(c=>c.put(req, r.clone())); } return r; }).catch(()=>{}))
  );
});