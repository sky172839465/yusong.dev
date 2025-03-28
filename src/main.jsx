import './index.css'

import { tryit } from 'radash'
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

import SkeletonHome from '@/components/SkeletonHome/index.jsx'

const LazyRouter = lazy(() => import('@/components/Router'))

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

  setTimeout(() => registerSW(), 1500)
}

window.addEventListener('load', registerServiceWorker)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense
      fallback={(
        <SkeletonHome className='fixed top-0 z-0' />
      )}
    >
      <LazyRouter />
    </Suspense>
  </StrictMode>
)
