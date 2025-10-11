import { atom, useAtom } from 'jotai'

import { mainStore } from './main.js'

export const loadingAtom = atom(false)

mainStore.set(loadingAtom, false)

export const updatePageLoading = (nextPageLoading = false) => {
  mainStore.set(loadingAtom, nextPageLoading)
}

export const usePageLoading = () => {
  const [loading, setLoading] = useAtom(loadingAtom)
  return { loading, setLoading }
}
