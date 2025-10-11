import { atom, useAtom } from 'jotai'

import { mainStore } from './main.js'

export const loadingAtom = atom(true)

mainStore.set(loadingAtom, true)

export const useRootLoading = () => {
  const [loading, setLoading] = useAtom(loadingAtom)
  return { loading, setLoading }
}
