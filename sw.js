// VoxelCraft Service Worker - network-first fuer index.html (immer aktuell),
// cache-first nur fuer grosse statische Dateien (three.js, Icons).
const CACHE = 'voxelcraft-v2';
const STATIC = [
  './three.module.js',
  './icon-192.png',
  './icon-512.png',
  './addons/postprocessing/Pass.js',
  './addons/postprocessing/UnrealBloomPass.js',
  './addons/postprocessing/RenderPass.js',
  './addons/postprocessing/EffectComposer.js',
  './addons/postprocessing/ShaderPass.js',
  './addons/postprocessing/MaskPass.js',
  './addons/shaders/LuminosityHighPassShader.js',
  './addons/shaders/CopyShader.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // alte Caches loeschen -> zwingt frische Inhalte
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isPage = e.request.mode === 'navigate'
    || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  // grosse statische Assets: cache-first (schnell, aendern sich kaum)
  const isStatic = STATIC.some(s => url.pathname.endsWith(s.replace('./','')));
  if (isStatic) {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
    return;
  }
  // index.html und alles andere: NETWORK-FIRST (immer aktuell), Cache nur offline
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
