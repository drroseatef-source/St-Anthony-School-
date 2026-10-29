const CARDS_CACHE="cards-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
// صور الكروت: تتحمّل مرة واحدة وتتخزن على تليفون المخدوم (مفيش تحميل متكرر)
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin||!u.pathname.includes("/cards/"))return;
  e.respondWith(caches.open(CARDS_CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res}))));
});
