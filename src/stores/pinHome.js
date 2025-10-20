import { atom, useAtom } from 'jotai'
import { isEmpty, toString } from 'lodash-es'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'

import { mainStore } from './main.js'

const PINNED_KEY = 'PIN_HOME_KEY'
const defaultPinHome = localStorage.getItem(PINNED_KEY)
export const pinHomeAtom = atom(defaultPinHome)

mainStore.set(pinHomeAtom, defaultPinHome)

const getStringifyPinHome = v => toString(v).replaceAll('"', '')

export const getPinHome = () => {
  const stringifyPinHome = getStringifyPinHome(mainStore.get(pinHomeAtom))
  if (!stringifyPinHome.startsWith('/')) {
    return
  }

  return stringifyPinHome
}

export const usePinHome = () => {
  const { pathname } = useLocation()
  const [pinHome, updatePinHome] = useAtom(pinHomeAtom)
  const [, updateStoragePinHome, removeStoragePinHome] = useLocalStorage(PINNED_KEY, pinHome)
  const isPinnedHome = getStringifyPinHome(pinHome) === pathname

  const setPinHome = (nextPinHome) => {
    updatePinHome(nextPinHome)
    if (isEmpty(nextPinHome)) {
      removeStoragePinHome()
      return
    }

    updateStoragePinHome(nextPinHome)
  }
  
  const togglePinHome = () => {
    toast.dismiss()
    if (isEmpty(pinHome)) {
      setPinHome(pathname)
      toast.success('釘為首頁')
      return
    }

    toast.success('取消釘為首頁')
    setPinHome()
  }

  return { isPinnedHome, setPinHome, togglePinHome }
}
