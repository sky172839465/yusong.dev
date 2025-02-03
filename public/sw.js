import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

// Activate new service worker immediately
self.addEventListener('install', () => {
  console.log('[SW] Installed')
  self.skipWaiting()
})

// Claim clients immediately after activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated', event)
  // event.waitUntil(self.clients.claim())
})

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
)

