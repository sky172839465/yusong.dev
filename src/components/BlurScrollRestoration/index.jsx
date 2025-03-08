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
    }

    if (navigation.state !== 'idle') {
      return
    }

    clearTimeout(timer.current)
    window.scrollTo(0, 0)
    timer.current = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setDone(true), 150)
    }, 100)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])

  return { loading, done }
}

const BlurScrollRestoration = () => {
  const { loading, done } = useScrollRestoration()

  return (
    <div
      className={`
        ${done ? 'hidden' : 'fixed z-50 h-dvh w-full'}
        bg-transparent ${loading ? 'backdrop-blur-md' : 'backdrop-blur-none'}
        transition-all
      `}
    />
  )
}

export default BlurScrollRestoration
