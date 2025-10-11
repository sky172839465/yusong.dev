import { Provider } from 'jotai'
import { tryit } from 'radash'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import SkeletonHome from '@/components/SkeletonHome/index.jsx'

import { mainStore } from './stores/main.js'
import { useRootLoading } from './stores/rootLoading.js'

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

// eslint-disable-next-line react-refresh/only-export-components
const RootLoadingScreen = () => {
  const { loading } = useRootLoading()
  if (!loading) {
    return null
  }

  return (
    <SkeletonHome className='fixed top-0 opacity-100!' />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={mainStore}>
      <Suspense fallback={null}>
        <LazyRouter />
      </Suspense>
      <RootLoadingScreen />
    </Provider>
  </StrictMode>
)
