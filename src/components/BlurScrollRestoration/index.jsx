import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

import SkeletonHome from '@/components/SkeletonHome'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()
  const currentPathname = useRef()

  useEffect(() => {
    if (currentPathname.current === pathname) {
      return
    }

    setLoading(true)
    // force Repaint After Navigation
    // mobile sometimes show blank page when navigate
    if (navigation.state === 'idle') {
      window.scrollBy(0, 1)
      window.scrollBy(0, -1)
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      currentPathname.current = pathname
      window.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => setLoading(false), 150)
    }, 100)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, setLoading }
}

const BlurScrollRestoration = (props) => {
  const { children } = props
  const { loading } = useScrollRestoration()

  if (loading) {
    return <SkeletonHome />
  }

  return children
}

export default BlurScrollRestoration
