import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  useEffect(() => {
    if (navigation.state === 'loading') {
      return
    }

    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLoading(false)
    }, 150)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading }
}

const BlurScrollRestoration = (props) => {
  const { children } = props
  const { loading } = useScrollRestoration()

  if (loading) {
    return null
  }

  return children
}

export default BlurScrollRestoration
