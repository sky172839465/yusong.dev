import { get, isEmpty, unescape } from 'lodash-es'
import { codeToHtml } from 'shiki'

const getCodeHighlightWithClickToClipboard = (highlightResult = {}) => {
  const { lang = '', code = '', highlight = '' } = highlightResult
  const codeHighlightWithClickToClipboard = `
    <div data-component='code-area'>
      <div data-component='lang' style='display:${isEmpty(lang) ? 'none' : 'block'};'>
        ${lang.toUpperCase()}
      </div>
      <button
        class='hidden'
        data-component='copy-to-clipboard'
        data-code='${code}'
      >
        copy
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
      // Outside links need to open new tab
      .replace(/<a([^>]*\shref="https:\/\/[^"]*")/g, '<a$1 target="_blank" referrerpolicy="no-referrer"')
      // Same folder image
      .replace(/<img src="([^"]+)"/g, (originElement, imageFileName) => {
        if (isEmpty(fileFolder)) {
          return originElement
        }

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
