import { atom, useAtom } from 'jotai'
import { isEmpty, toString } from 'lodash-es'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'

import useI18N, { LANG } from '@/hooks/useI18N'

import { mainStore } from './main.js'

const i18nMapping = {
  [LANG.EN]: {
    PINNED_HOME: 'Pinned start page',
    UNPINNED_HOME: 'Cancel pin to start page'
  },
  [LANG.ZH_TW]: {
    PINNED_HOME: '已釘為起始頁',
    UNPINNED_HOME: '取消釘為起始頁'
  }
}

const PINNED_KEY = 'PIN_HOME_KEY'
const defaultPinHome = localStorage.getItem(PINNED_KEY)
export const pinHomeAtom = atom(defaultPinHome)
const tmpPinHomeAtom = atom(defaultPinHome)

mainStore.set(pinHomeAtom, defaultPinHome)
mainStore.set(tmpPinHomeAtom, defaultPinHome)

const getStringifyPinHome = (v) => toString(v).replaceAll('"', '')

export const getPinHome = () => {
  const stringifyPinHome = getStringifyPinHome(mainStore.get(pinHomeAtom))
  const stringifyTmpPinHome = getStringifyPinHome(mainStore.get(tmpPinHomeAtom))
  if (stringifyPinHome !== stringifyTmpPinHome) {
    return
  }

  if (!stringifyPinHome.startsWith('/')) {
    return
  }

  // 只有第一次 loader 需要 redirect、之後停留在網站期間 root loader 再次觸發也不要再導向 pin home
  mainStore.set(tmpPinHomeAtom)
  return stringifyPinHome
}

export const usePinHome = () => {
  const { label } = useI18N(i18nMapping)
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
    if (isEmpty(pinHome) || !isPinnedHome) {
      setPinHome(pathname)
      toast.success(label.PINNED_HOME)
      return
    }

    toast.success(label.UNPINNED_HOME)
    setPinHome()
  }

  return { isPinnedHome, setPinHome, togglePinHome }
}
