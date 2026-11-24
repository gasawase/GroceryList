const CACHE = "grocery-list";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const late = new Promise((_ok, no) => setTimeout(no, 4000));
  e.respondWith(Promise.race([fetch(e.request), late]).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })
    .then((r) => r || caches.match("./")).then((r) => r || Response.error())));
});
