import { useEffect, useRef } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const timer = useRef()

  useEffect(() => {
    if (navigation.state === 'loading') {
      return
    }
    
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, 150)
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])
}

const BlurScrollRestoration = () => {
  useScrollRestoration()

  return null
}

export default BlurScrollRestoration
