import clx from 'classnames'

import FadeIn from '@/components/FadeIn'
import { usePageLoading } from '@/stores/pageLoading'

const MainLayout = (props) => {
  const { children, isFullScreen } = props
  const { loading } = usePageLoading()

  return (
    <FadeIn
      animate={{ opacity: loading ? 0 : 1 }}
      className={clx(
        'container mx-auto grow px-4 py-8',
        {
          'flex items-center': isFullScreen,
          'invisible opacity-0 min-h-dvh': loading
        }
      )}
    >
      {children}
    </FadeIn>
  )
}

export default MainLayout
