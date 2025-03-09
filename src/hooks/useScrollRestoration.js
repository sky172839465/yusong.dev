import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

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
      // window.scrollTo({ top: 0, behavior: 'auto' })
      // setTimeout(() => setLoading(false), 100)
      setLoading(false)
    }, 150)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, setLoading }
}

export default useScrollRestoration
