/* Mishaps - offline cache.
   The page and the scenario file are fetched network-first, so edits land the next
   time the phone has signal; with no signal they come from this cache.
   Everything else (icons, manifest) is served cache-first.
   Her people, notes and photos are not in this cache: they live in localStorage and
   IndexedDB on the phone and are never touched here. */
var CACHE = 'mishaps-v1';
var ASSETS = ['./', 'index.html', 'scenarios.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function networkFirst(req, key){
  return fetch(req).then(function(res){
    if (res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(key, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(key).then(function(r){ return r || caches.match('./'); });
  });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate'){ e.respondWith(networkFirst(req, 'index.html')); return; }
  if (/\/scenarios\.js(\?|$)/.test(new URL(req.url).pathname + new URL(req.url).search)){ e.respondWith(networkFirst(req, 'scenarios.js')); return; }
  e.respondWith(caches.match(req).then(function(hit){ return hit || fetch(req); }));
});
