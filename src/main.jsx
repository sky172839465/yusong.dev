import { Provider } from 'jotai'
import { tryit } from 'radash'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import SkeletonHome from '@/components/SkeletonHome/index.jsx'
import { mainStore } from '@/stores/main.js'
import { usePageLoading } from '@/stores/pageLoading.js'
import { useRootLoading } from '@/stores/rootLoading.js'
import { changeTheme } from '@/stores/theme.js'


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
changeTheme()

// eslint-disable-next-line react-refresh/only-export-components
const RootLoadingScreen = () => {
  const { loading: rootLoading } = useRootLoading()
  const { loading: pageLoading } = usePageLoading()
  const loading = rootLoading || pageLoading
  if (!loading) {
    return null
  }

  return (
    <SkeletonHome className='opacity-100!' />
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
