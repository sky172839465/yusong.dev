import FadeIn from '@/components/FadeIn'

import Footer from '../Footer'
import Header from '../Header'

const MainLayout = (props) => {
  const { children, isFullScreen } = props
  return (
    <FadeIn className='flex min-h-dvh flex-col bg-background'>
      <Header />
      <main className={`container mx-auto grow px-4 py-8 ${isFullScreen && 'flex items-center'}`}>
        {children}
      </main>
      <Footer />
    </FadeIn>
  )
}

export default MainLayout
