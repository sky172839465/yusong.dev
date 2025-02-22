import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

// periodic check new service worker available
// after prompt click send `SKIP_WAITING` message to reload page & install new sw
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

// Activate new service worker immediately
// self.addEventListener('install', (event) => {
//   console.log('[SW] Installed', event)
//   self.skipWaiting()
// })

// Claim clients immediately after activation
// self.addEventListener('activate', (event) => {
//   console.log('[SW] Activated', event)
//   event.waitUntil(self.clients.claim())
// })

// Cache GitHub CDN images using StaleWhileRevalidate
const GITHUB_ASSETS_CACHE_NAME = 'github-assets'
registerRoute(
  ({ url }) => (
    url.href.startsWith('https://cdn.yusong.tw') ||
    url.href.startsWith('https://github.githubassets.com/images')
  ),
  new StaleWhileRevalidate({
    cacheName: GITHUB_ASSETS_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200] // Cache only successful responses
      }),
      {
        // force updates by checking the ETag or Last-Modified headers
        fetchDidSucceed: async ({ request, response }) => {
          const cache = await caches.open(GITHUB_ASSETS_CACHE_NAME)
          const cachedResponse = await cache.match(request)
          console.log('request.url', request.url)
          if (cachedResponse) {
            const cachedETag = cachedResponse.headers.get('ETag')
            const newETag = response.headers.get('ETag')
            console.log({ cachedETag, newETag })
            if (cachedETag && newETag && cachedETag !== newETag) {
              console.log(`Updating image cache: ${request.url}`)
              await cache.delete(request);
              await cache.put(request, response.clone())
            }
          }
          return response
        }
      }
    ]
  })
)
