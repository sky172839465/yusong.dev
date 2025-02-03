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
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated', event)
  event.waitUntil(self.clients.claim())
})

// Cache GitHub CDN images using StaleWhileRevalidate
registerRoute(
  ({ url }) => url.href.startsWith('https://raw.githubusercontent.com/sky172839465/yusong.tw/'),
  new StaleWhileRevalidate({
    cacheName: 'github-assets'
  })
)
