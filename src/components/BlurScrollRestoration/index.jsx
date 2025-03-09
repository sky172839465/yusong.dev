import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

import SkeletonHome from '@/components/SkeletonHome'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  useEffect(() => {
    setLoading(true)
    if (navigation.state === 'loading') {
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => setLoading(false), 150)
      // setLoading(false)
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
