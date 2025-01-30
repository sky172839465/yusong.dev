import { isUndefined } from 'lodash-es'
import { createContext, useEffect, useMemo } from 'react'
import { useLocalStorage,useMediaQuery } from 'usehooks-ts'

export const ThemeProviderContext = createContext()

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'
const LOCAL_STORAGE_KEY = 'dark-mode'

export function ThemeProvider({ children, ...props }) {
  const [isStorageDarkMode, setIsStorageDarkMode] = useLocalStorage(LOCAL_STORAGE_KEY)
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue: true,
    defaultValue: undefined
  })
  const isDarkMode = useMemo(() => {
    return isUndefined(isStorageDarkMode) ? isDarkOS : isStorageDarkMode
  }, [isStorageDarkMode, isDarkOS])

  const toggle = () => setIsStorageDarkMode(!isDarkMode)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const value = {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light',
    toggle
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
