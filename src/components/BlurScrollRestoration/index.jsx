import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigation } from 'react-router-dom'

import FadeIn from '@/components/FadeIn'
import SkeletonHome from '@/components/SkeletonHome'
import useI18N, { LANG } from '@/hooks/useI18N'

const LazyMainLayout = lazy(() => import('@/layouts/Main'))

const i18nMapping = {
  [LANG.EN]: {
    TITLE: 'Loading'
  },
  [LANG.ZH_TW]: {
    TITLE: '載入中'
  }
}

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  useEffect(() => {
    setLoading(true)
    // force Repaint After Navigation
    // mobile sometimes show blank page when navigate
    if (navigation.state === 'idle') {
      window.scrollBy(0, 1)
      window.scrollBy(0, -1)
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => setLoading(false), 50)
    }, 50)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, setLoading }
}

const BlurScrollRestoration = (props) => {
  const { children } = props
  const { loading } = useScrollRestoration()
  const { label } = useI18N(i18nMapping)

  if (loading) {
    return (
      <>
        <Helmet>
          <title>
            {label.TITLE}
          </title>
        </Helmet>
        <FadeIn>
          <Suspense fallback={<SkeletonHome />}>
            <LazyMainLayout />
          </Suspense>
        </FadeIn>
      </>
    )
  }

  return children
}

export default BlurScrollRestoration
