import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const timer = useRef()
  
  const triggerLoading = () => {
    setLoading(true)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, 100)
  }

  useEffect(() => {
    setLoading(true)
    if (navigation.state === 'loading') {
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, setLoading: triggerLoading }
}

export default useScrollRestoration
