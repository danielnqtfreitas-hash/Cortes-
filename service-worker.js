const CACHE_NAME = 'corte-plan-v3';
const urlsToCache = [
    './', // Caches o arquivo index.html (este arquivo)
    'https://cdn.tailwindcss.com',
    // Outras dependências estáticas podem ser adicionadas aqui
];

self.addEventListener('install', (event) => {
    console.log('[SW] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache aberto, pré-armazenando recursos.');
            return cache.addAll(urlsToCache); 
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Estratégia: Cache, depois fallback para Network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Ativado.');
    // Limpa caches antigos (importante para atualizações de versão)
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                            .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});
