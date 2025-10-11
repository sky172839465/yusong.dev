import { atom, useAtom } from 'jotai'

import { mainStore } from './main.js'

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
}

const LOCAL_STORAGE_KEY = window.THEME_KEY
const DEFAULT_THEME = THEME.LIGHT
const initialTheme = localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_THEME

export const themeAtom = atom(initialTheme)

mainStore.set(themeAtom, initialTheme)

export const updateTheme = (nextTheme = DEFAULT_THEME) => {
  mainStore.set(themeAtom, nextTheme)
}

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)
  const isDarkMode = theme === THEME.DARK
  const isLightMode = theme === THEME.LIGHT

  const toggle = () => {
    const nextTheme = isDarkMode ? THEME.LIGHT : THEME.DARK
    setTheme(nextTheme)
    localStorage.setItem(LOCAL_STORAGE_KEY, nextTheme)
    changeTheme()
  }

  return {
    isDarkMode,
    isLightMode,
    theme,
    setTheme,
    toggle
  }
}

export const changeTheme = () => {
  const isDarkMode = localStorage.getItem(window.THEME_KEY) === 'dark'
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(isDarkMode ? 'dark' : 'light')
  const theme = window.document.querySelector('meta[name="theme-color"]')
  theme.setAttribute('content', isDarkMode ? '#09090b' : '#fff')
}
