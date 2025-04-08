import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ScrollRestoration, useNavigation } from 'react-router-dom'

// import FadeIn from '@/components/FadeIn'
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
  const timer = useRef()

  useEffect(() => {
    setLoading(true)
    if (navigation.state === 'loading') {
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLoading(false), 160)
  }, [navigation])

  return { loading }
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
      <div
        // key={pathname}
        className={`contents [&_main]:opacity-100 ${loading ? '[&_main]:opacity-0' : '[&_main]:delay-150 [&_main]:transition-opacity'}`}
      >
        {children}
      </div>
      <ScrollRestoration />
    </PageLoadingProvider>
  )
}

export default BlurScrollRestoration
