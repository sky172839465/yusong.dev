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
    url.href.startsWith('https://cdn.yusong.dev') ||
    url.href.startsWith('https://github.githubassets.com/images')
  ),
  new StaleWhileRevalidate({
    cacheName: GITHUB_ASSETS_CACHE_NAME
  })
)

// self.addEventListener('activate', async (event) => {
//   const cacheDeleteList = [GITHUB_ASSETS_CACHE_NAME]
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheDeleteList.includes(cacheName)) {
//             console.log(`Deleting old cache: ${cacheName}`)
//             return caches.delete(cacheName)
//           }
//         })
//       )
//     )
//   )
// })
