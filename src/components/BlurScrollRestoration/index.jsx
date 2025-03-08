import { useEffect, useRef } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const useScrollRestoration = () => {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const timer = useRef()

  useEffect(() => {
    if (navigation.state === 'loading') {
      clearTimeout(timer.current)
        timer.current = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 150)
      return
    }
    
    return () => clearTimeout(timer.current)
  }, [pathname, navigation])
}

const BlurScrollRestoration = () => {
  useScrollRestoration()

  return null
}

export default BlurScrollRestoration
