import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigation } from 'react-router-dom'

import FadeIn from '@/components/FadeIn'
import { PageLoadingProvider } from '@/contexts/pageLoading'
import useI18N, { LANG } from '@/hooks/useI18N'

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
  const loadingState = useRef()

  useEffect(() => {
    setLoading(true)
    
    if (navigation.state === 'loading') {
      loadingState.current = true
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const showContent = (count = 0) => {
        if (window.scrollY !== 0 && count !== -1 && count < 10) {
          window.scrollTo({ top: 0, behavior: 'auto' })
          setTimeout(() => showContent(count + 1), 100)
          return
        }
        
        loadingState.current = false
        setLoading(false)
      }

      const defaultCount = loadingState.current ? 0 : -1
      showContent(defaultCount)
    }, 120)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, setLoading }
}

const BlurScrollRestoration = (props) => {
  const { children } = props
  const { loading } = useScrollRestoration()
  const { label } = useI18N(i18nMapping)

  return (
    <PageLoadingProvider loading={loading}>
      {loading && (
        <Helmet>
          <title>
            {label.TITLE}
          </title>
        </Helmet>
      )}
      <FadeIn className={`contents ${loading ? '[&_main]:invisible' : ''}`}>
        {children}
      </FadeIn>
    </PageLoadingProvider>
  )
}

export default BlurScrollRestoration
