// Cache offline: la app y las preguntas se guardan en el movil; la nube (otro dominio) nunca se cachea.
const V = 'cap-v11';
const BASE = ['./', 'index.html', 'preguntas.json', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(r, {ignoreSearch: true});
    const red = fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; }).catch(() => hit);
    return hit || red;
  }));
});
