import { get, isEmpty, keyBy, reduce, values } from 'lodash-es'

export const LANG = {
  ZH_TW: 'zh-TW',
  EN: 'en'
}

const LANG_CODE_MAP = keyBy(values(LANG))

// i18nMapping example
// const i18nMapping = {
//   [LANG.EN]: {
//     TITLE: 'BLOG'
//   },
//   [LANG.ZH_TW]: {
//     TITLE: '部落格'
//   }
// }

const getI18N = (pathname = window.location.pathname, i18nMapping = {}) => {
  const lang = LANG_CODE_MAP[get(pathname.match(/^\/?([^/]+)/), '1')] || LANG.ZH_TW
  const isEN = lang === LANG.EN
  const isZhTw = lang === LANG.ZH_TW
  const mainPathName = pathname.replace(new RegExp(`^/${lang}`), '')
  const langPathNames = reduce(values(LANG), (mapping, language) => {
    if (language === LANG.ZH_TW) {
      mapping[language] = isEmpty(mainPathName) ? '/' : mainPathName
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

export default getI18N
