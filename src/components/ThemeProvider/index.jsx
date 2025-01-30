import { createContext, useEffect } from 'react'
import { useDarkMode } from 'usehooks-ts'

export const ThemeProviderContext = createContext()

export function ThemeProvider({ children, ...props }) {
  const { isDarkMode, toggle } = useDarkMode()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const value = {
    theme: isDarkMode ? 'dark' : 'light',
    toggle
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
