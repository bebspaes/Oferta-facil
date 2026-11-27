// Oferta Fácil – service worker: guarda o app no celular para abrir sem internet.
// Não guarda nem envia dados de clientes (eles ficam criptografados no próprio app).
const CACHE = 'oferta-facil-20261126-2259';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// abre na hora pela cópia guardada. Quando sai versão nova, este arquivo muda: o celular baixa a versão nova
// uma única vez, troca as cópias e o app recarrega sozinho.
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const chave = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(CACHE).then(async c => (await c.match(chave, {ignoreSearch:true})) || fetch(req).then(r => { if(r && r.ok) c.put(chave, r.clone()); return r; }).catch(() => new Response('Sem conexão', {status:503}))));
});
