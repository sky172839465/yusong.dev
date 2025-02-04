import { keyBy } from 'lodash-es'

import routes from './routes.json'

const IMG_HOST = 'https://raw.githubusercontent.com/sky172839465/yusong.tw/refs/heads/main'
const AUTHOR = 'YuSong Hsu'
const ACCOUNT = 'sky172839465'
const BLOG_HOST = 'yusong.tw'
const TITLE = BLOG_HOST.toUpperCase()
const ROUTE_MAP = keyBy(
  routes.map(({ file, ...item }) => {
    const imageFolder = `${IMG_HOST}/${file.replace(/index.jsx|index.md/, 'images')}`
    return {
      ...item,
      image: `${imageFolder}/og.jpg`,
      twitterImage: `${imageFolder}/x.jpg`
    }
  }),
  'path'
)

export default {
  async fetch(request) {
    const requestUrl = request.url
    const url = new URL(requestUrl)

    // 根據路徑識別文章 slug，例如 /article/my-article
    const path = url.pathname
    const isAssetRoute = /\.\D+$/.test(path)
    const convertedPath = path.endsWith('/') ? path : `${path}/`
    const targetRoute = ROUTE_MAP[convertedPath]
    if (isAssetRoute || !targetRoute) {
      return fetch(request)
    }

    // Fetch the original HTML
    const response = await fetch(request)
    const html = await response.text()
    // 如果路徑匹配文章，動態生成 meta tags
    const { type, data, image, twitterImage } = targetRoute
    const { title, description } = data
    const modifiedHtml = html.replace(
      '</head>',
      `
          <meta name="author" content="${AUTHOR}">
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:url" content="${requestUrl}">
          <meta property="og:type" content="${type}">
          <meta property="og:image" content="${image}" />
          <meta property="og:image:alt" content="${description}">
          <meta property="og:site_name" content="${TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="article:author" content="${AUTHOR}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${twitterImage}">
          <meta name="twitter:site" content="@${ACCOUNT}">
          <meta name="twitter:creator" content="@${ACCOUNT}">
          <title>${title} | ${TITLE}</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "${title}",
            "description": "${description}",
            "url": "${requestUrl}",
            "image": "${image}",
            "author": {
              "@type": "Person",
              "name": "${AUTHOR}"
            }
          }
          </script>
        </head>
      `
    )
    return new Response(
      modifiedHtml,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}