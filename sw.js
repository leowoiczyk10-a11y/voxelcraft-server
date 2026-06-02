const CACHE = 'voxelcraft-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
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
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached)
    )
  );
});
