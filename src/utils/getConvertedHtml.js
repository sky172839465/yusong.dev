import { get, isEmpty, unescape } from 'lodash-es'
import { codeToHtml } from 'shiki'

import getI18N, { LANG } from './getI18N'

const i18nMapping = {
  [LANG.EN]: {
    COPY: 'Copy',
    COPIED: 'Copied!',
    COPY_ERROR: 'Error.'
  },
  [LANG.ZH_TW]: {
    COPY: '複製',
    COPIED: '已複製！',
    COPY_ERROR: '錯誤'
  }
}

const getCodeHighlightWithClickToClipboard = (highlightResult = {}) => {
  const { label } = getI18N(window.location.pathname, i18nMapping)
  const { lang = '', code = '', highlight = '' } = highlightResult
  const codeHighlightWithClickToClipboard = `
    <div data-component='code-area'>
      <div data-component='lang' style='display:${isEmpty(lang) ? 'none' : 'block'};'>
        ${lang.toUpperCase()}
      </div>
      <button
        data-component='copy-to-clipboard'
        data-status='init'
        data-code='${code}'
        onclick='(function(element){
          const copyToClipboard = navigator && navigator.clipboard && navigator.clipboard.writeText;
          if (!copyToClipboard) {
            element.dataset.status = "error";
            return false;
          }
          element.dataset.status = "success"
          navigator.clipboard.writeText(element.dataset.code);
          setTimeout(function(ele){ element.dataset.status = "init"; }, 1200, element);
        })(this)'
      >
        <span data-label='init'>
          ${label.COPY}
        </span>
        <span data-label='success'>
          ${label.COPIED}
        </span>
        <span data-label='error'>
          ${label.COPY_ERROR}
        </span>
      </button>
      ${highlight}
    </div>
  `
  return codeHighlightWithClickToClipboard
}

const getConvertedHtml = async (originHtml, fileFolder) => {
  const html = unescape(
    originHtml
      // RWD table
      .replace(/<table[\s\S]*?<\/table>/g, (match) => {
        return `<div data-component='table-area'>${match}</div>`
      })
      // Format links
      .replace(/<a href="\/+.*">/g, (match) => {
        return match.replace(
          '>',
          `
            onclick="(function(e, element){
              e.preventDefault();
              if (document.startViewTransition) {
                document.startViewTransition(() => {
                  window.history.pushState({}, '', element.href);
                  window.dispatchEvent(new Event('popstate'));
                })
              } else {
                window.history.pushState({}, '', element.href);
                window.dispatchEvent(new Event('popstate'));
              }
            })(event, this)">
          `
        )
      })
      // Outside links need to open new tab
      .replace(/<a([^>]*\shref="https:\/\/[^"]*")/g, '<a$1 target="_blank" referrerpolicy="no-referrer"')
      // Same folder image
      .replace(/<img src="([^"]+)"/g, (_, imageFileName) => {
        const fileUrl = `${fileFolder}/${imageFileName}`
        return `<img src="${fileUrl}"`
      })
  )

  const matches = [...html.matchAll(/<pre><code class="language-(.*)">([\s\S]*?)<\/code><\/pre>/g)].map((matches) => {
    const [replacement, lang, code] = matches
    return { replacement, lang, code }
  })
  const results = await Promise.all(
    matches.map((match) => {
      const { lang, code } = match
      return codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false
      }).then((highlight) => ({ lang, code, highlight }))
    })
  )
  let highlightHtml = html
  for (const [index, match] of matches.entries()) {
    const { replacement } = match
    const highlightResult = get(results, index, {})
    highlightHtml = highlightHtml.replace(
      replacement,
      getCodeHighlightWithClickToClipboard(highlightResult)
    )
  }
  return highlightHtml
}

export default getConvertedHtml
