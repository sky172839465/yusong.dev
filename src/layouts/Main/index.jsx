import clx from 'classnames'

import FadeIn from '@/components/FadeIn'
import { usePageLoading } from '@/stores/pageLoading'

import Footer from'../Footer'
import Header from '../Header'

const Content = (props) => {
  const { children, isFullScreen } = props
  const { loading } = usePageLoading()
  return (
    <FadeIn
      className={clx(
        'container mx-auto grow px-4 py-8 opacity-100 transition-opacity',
        {
          'flex items-center': isFullScreen,
          invisible: loading
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
      <Content isFullScreen={isFullScreen}>
        {children}
      </Content>
      <Footer />
    </div>
  )
}

export default MainLayout
