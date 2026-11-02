const CACHE="app-v4";
const CARD_RE=/\/(love|joy|peace|patience|kindness|goodness|faith|gentleness|selfcontrol|early)\.webp$/;
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// نخزّن على التليفون: صور الكروت + مكتبات Firebase والـ Excel والماسح (نسخها ثابتة برقم الإصدار)، فالفتح بعد أول مرة بيبقى أسرع
function cacheable(u){
  if(u.origin===location.origin)return CARD_RE.test(u.pathname);
  return (u.hostname==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/"))||u.hostname==="cdnjs.cloudflare.com";
}
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||!cacheable(u))return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok)c.put(e.request,res.clone());   // ما بنخزّنش أي رد فاشل أو مبهم
    return res;
  }))));
});
