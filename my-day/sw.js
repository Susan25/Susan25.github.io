/* My Day - offline cache.
   Navigations try the network first so updates land, then fall back to cache
   when there is no signal. Other files from this site are served cache-first.
   Google sign-in and calendar requests are left alone so they're never stale. */
var CACHE = 'my-day-v1';
var ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put('index.html', copy); });
        return res;
      }).catch(function(){
        return caches.match('index.html').then(function(r){ return r || caches.match('./'); });
      })
    );
    return;
  }
  e.respondWith(caches.match(req).then(function(hit){ return hit || fetch(req); }));
});
