import { get, reduce, values } from 'lodash-es'
import { useLocation } from 'react-router-dom'

export const LANG = {
  ZH_TW: 'zh-TW',
  EN: 'en'
}

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
  const lang = LANG[get(pathname.match(/^\/?([^/]+)/), '1')] || LANG.ZH_TW
  const isEN = lang === LANG.EN
  const isZhTw = lang === LANG.ZH_TW
  const mainPathName = isZhTw ? pathname : pathname.replace(`^/${lang}`, '')
  const langPathNames = reduce(values(LANG), (mapping, language) => {
    if (language === LANG.ZH_TW) {
      mapping[language] = mainPathName
      return mapping
    }

    mapping[language] = `/${language}${mainPathName}`
    return mapping
  }, {})
  const label = get(i18nMapping, lang, {})

  return {
    pathname,
    mainPathName,
    langPathNames,
    lang,
    label,
    isEN,
    isZhTw
  }
}

export default useI18N
