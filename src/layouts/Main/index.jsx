import clx from 'classnames'
import { AnimatePresence } from 'motion/react'

import FadeIn from '@/components/FadeIn'
import { usePageLoading } from '@/stores/pageLoading'

import Footer from'../Footer'
import Header from '../Header'

const Content = (props) => {
  const { children, isFullScreen } = props
  const { loading } = usePageLoading()

  return (
    <FadeIn
      animate={{ opacity: loading ? 0 : 1 }}
      className={clx(
        'container mx-auto grow px-4 py-8',
        {
          'flex items-center': isFullScreen,
          'min-h-dvh': loading
        }
      )}
    >
      {children}
    </FadeIn>
  )
}

const MainLayout = (props) => {
  const { children, isFullScreen } = props
  return (
    <div className='bg-background overscroll-y-contain flex min-h-dvh flex-col'>
      <Header />
      <AnimatePresence>
        <Content isFullScreen={isFullScreen}>
          {children}
        </Content>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default MainLayout
