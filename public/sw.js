import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

cleanupOutdatedCaches()

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  console.log('[SW] Installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // only intercept bundle files
  if (event.request.destination !== 'script' && event.request.destination !== 'style') {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response and return it
        if (response.status === 404) {
          // Optionally log or handle the 404 error differently
          console.log('Asset not found:', event.request.url)

          // Trigger a refresh in the client
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ action: 'refresh' })
            })
          })

          return response // Or you could return a fallback if needed
        }
        return response
      })
      .catch((error) => {
        // Handle fetch errors, like network issues
        console.error('Fetch failed:', error)
        return fetch(event.request).catch(() => new Response('Network and cache both failed.', { status: 503 }))
      })
  )
})