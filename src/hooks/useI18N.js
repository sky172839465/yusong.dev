import { useLocation } from 'react-router-dom'

import getI18N, { LANG as LANG_FROM_UTIL } from '@/utils/getI18N'

export const LANG = LANG_FROM_UTIL

// i18nMapping example
// const i18nMapping = {
//   [LANG.EN]: {
//     TITLE: 'BLOG'
//   },
//   [LANG.ZH_TW]: {
//     TITLE: '部落格'
//   }
// }

const useI18N = (i18nMapping = {}) => {
  const { pathname } = useLocation()
  const i18n = getI18N(pathname, i18nMapping)

  return i18n
}

export default useI18N
