import { precacheAndRoute } from 'workbox-precaching'

// Precache assets (Workbox will replace __WB_MANIFEST at build time)
precacheAndRoute(self.__WB_MANIFEST || [])

self.addEventListener('install', () => {
  console.log('[SW] Installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (!response) {
          // If the requested resource is not cached and fails to fetch, force a page refresh
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ action: 'refresh' })
            })
          })
        }
        return response
      })
    })
  )
})