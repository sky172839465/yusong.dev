import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

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

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
)

