import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration, useNavigation } from 'react-router-dom'

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
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [blur, setBlur] = useState(false)
  const timer = useRef()

  useEffect(() => {
    setLoading(true)
    setBlur(true)
    if (navigation.state === 'loading') {
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setBlur(false), 80)
    }, 260)
  }, [navigation])

  return { loading, blur }
}

const BlurScrollRestoration = (props) => {
  const { children } = props
  const { loading, blur } = useScrollRestoration()
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
      <FadeIn
        className={`contents ${blur ? '[&_main]:blur-md' : '[&_main]:blur-none'} ${loading ? '[&_main]:invisible' : ''}`}
      >
        {children}
      </FadeIn>
      <ScrollRestoration />
    </PageLoadingProvider>
  )
}

export default BlurScrollRestoration
