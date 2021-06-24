function ActivateNetworkFirst() {
    // ** Network First (Network Falling Back to Cache) **
    // Calling this function will activate network-first strategy. Whenever user makes a request,
    // browser will try to make a web request. If web request was successfull, it will store the
    // asset to the cache and return it to browser. If web request fails, it will look at the cache
    // which has the latest asset (it last obtained), and return it to the user.
    self.addEventListener('fetch', (fetch_event) => {
        // On fetch event
        fetch_event.respondWith((async () => {
            try {
                // Try to make a normal web request
                const response = await fetch(fetch_event.request);
                if (response.ok) {
                    const cache = await caches.open(cacheName);
                    cache.put(fetch_event.request, response.clone());
                    return response;
                }
            }
            catch {
                // If web request failed, fall back to cache
                console.log(`Asset unreachable, falling back to cache for: ${fetch_event.request.url}`);
                const cache_response = await caches.match(fetch_event.request);
                if (cache_response)
                    return cache_response;
            }
        })());
    });
}
async function ClearAllCache() {
    const all_cache_names = await caches.keys();
    all_cache_names.forEach(cache_name => {
        caches.delete(cache_name);
    });
}
ActivateNetworkFirst();