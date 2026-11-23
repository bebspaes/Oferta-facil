// Oferta Fácil – service worker: guarda o app no celular para abrir sem internet.
// Não guarda nem envia dados de clientes (eles ficam criptografados no próprio app).
const CACHE = 'oferta-facil-2026-11-23-1';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // abre na hora a versão guardada; se houver internet, baixa a versão nova para a próxima abertura
  e.respondWith(caches.open(CACHE).then(async c => {
    const chave = req.mode === 'navigate' ? './index.html' : req;
    const guardado = await c.match(chave, {ignoreSearch:true});
    const rede = fetch(req).then(r => { if(r && r.ok) c.put(chave, r.clone()); return r; }).catch(() => null);
    return guardado || (await rede) || new Response('Sem conexão', {status:503});
  }));
});
