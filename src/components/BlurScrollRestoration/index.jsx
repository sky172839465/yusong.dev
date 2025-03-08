import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(true)
  const timer = useRef()

  useEffect(() => {
    if (navigation.state !== 'idle') {
      return
    }

    setLoading(true)
    setDone(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => setDone(true), 150)
    }, 200)
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
