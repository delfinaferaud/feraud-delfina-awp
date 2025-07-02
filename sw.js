const cacheName = 'recipes-cache';
const assets = [
    "/pwa-parcial-2-dwn3ap-feraud-delfina",
    "/",
    "index.html",
    "js/script.js",
    "style.css",
    "favoritos.html",
    "js/app.js",
    "js/receta.js",
    "js/utils.js",
    "categoria-recetas.html",
    "favoritos.html",
    "receta.html"
]

self.addEventListener('install', (event)=> {
    console.log('sw instalado')
    event.waitUntil(
        caches.open(cacheName)
        .then(cache =>{
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', (event) => {
    console.log('sw activado')
})

self.addEventListener('fetch',(event)=> {
      event.respondWith(

        caches.match(event.request)
        .then((res) => {
            if (res) {
                return res;
            } 
            let requestToCache = event.request.clone();
            return fetch(requestToCache)
            .then((res) =>{
                if(!res || res.status !== 200){
                    return res;
                }
                let responseToCache = res.clone();
                caches.open(cacheName)
                .then(cache =>{
                    cache.put(requestToCache, responseToCache)
                })
                return res;
            })

        })
      )
})