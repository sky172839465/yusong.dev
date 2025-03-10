import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

import SkeletonHome from '@/components/SkeletonHome'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  // force Repaint After Navigation
  // mobile sometimes show blank page when navigate
  useEffect(() => {
    if (navigation.state === 'loading') {
      return
    }

    window.scrollBy(0, 1)
    window.scrollBy(0, -1)
  }, [pathname])

  useEffect(() => {
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
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
