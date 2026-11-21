const CACHE="ekko-v6";
const FILES=["./","index.html","srodki.html","usterki.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
// Najpierw sieć (żeby po aktualizacji była nowa wersja), bez sieci kopia z telefonu
self.addEventListener("fetch",e=>{ if(e.request.method!=="GET") return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); if(r.ok && new URL(e.request.url).origin===location.origin) caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html")))); });
