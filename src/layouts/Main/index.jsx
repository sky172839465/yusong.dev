import { lazy } from 'react'

import { usePageLoading } from '@/stores/pageLoading'

const LazyHeader = lazy(() => import('../Header'))
const LazyFooter = lazy(() => import('../Footer'))

const MainLayout = (props) => {
  const { children, isFullScreen } = props
  const { loading } = usePageLoading()

  return (
    <div className='bg-background flex min-h-dvh flex-col'>
      <LazyHeader />
      <main className={`container mx-auto grow px-4 py-8 ${isFullScreen ? 'flex items-center' : ''} opacity-100 transition-opacity ${loading ? 'invisible opacity-0' : ''}`}>
        {children}
      </main>
      <LazyFooter />
    </div>
  )
}

export default MainLayout
