import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation, useNavigationType } from 'react-router-dom'

import SkeletonHome from '@/components/SkeletonHome'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const navigationType = useNavigationType()
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  useEffect(() => {
    if (navigationType === 'POP') {
      setLoading(false)
      return
    }

    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => setLoading(false), 150)
    }, 100)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation, navigationType])

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
