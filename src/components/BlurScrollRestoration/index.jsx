import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(true)
  const timer = useRef()

  useEffect(() => {
    if (navigation.state === 'loading') {
      setLoading(true)
      setDone(false)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }, 100)
    }
    
    if (navigation.state !== 'idle') {
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setDone(true), 150)
    }, 200)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, done }
}

const BlurScrollRestoration = () => {
  // const { loading, done } = useScrollRestoration()
  useScrollRestoration()

  return null
}

export default BlurScrollRestoration
