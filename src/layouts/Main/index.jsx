import { lazy } from 'react'

import FadeIn from '@/components/FadeIn'

const LazyHeader = lazy(() => import('../Header'))
const LazyFooter = lazy(() => import('../Footer'))

const MainLayout = (props) => {
  const { children, isFullScreen } = props
  return (
    <FadeIn className='flex min-h-dvh flex-col bg-background'>
      <LazyHeader />
      <main className={`container mx-auto grow px-4 py-8 ${isFullScreen && 'flex items-center'}`}>
        {children}
      </main>
      <LazyFooter />
    </FadeIn>
  )
}

export default MainLayout
