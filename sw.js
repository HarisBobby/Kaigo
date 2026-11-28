/* Service worker 介護の扉. Naikkan VERSI setiap kali index.html diperbarui. */
const VERSI='kgtb-v1';
const INTI=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSI).then(c=>c.addAll(INTI)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('kgtb-')&&x!==VERSI).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(VERSI).then(c=>c.put('index.html',cp))}return res})
      .catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));
    return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(VERSI).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
    return hit||net}))
});
