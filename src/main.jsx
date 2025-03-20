import './index.css'

import { tryit } from 'radash'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Router from '@/components/Router'

const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const registerSW = async () => {
    const [error, result] = await tryit(
      () => navigator.serviceWorker.register('/sw.js')
    )()
    if (error) {
      console.log('Service Worker registration failed:', error)
      return
    }

    result.update()
  }
  registerSW()
}

window.addEventListener('load', registerServiceWorker)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
