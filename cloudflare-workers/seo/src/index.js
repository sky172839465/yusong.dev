import { get, keyBy } from 'lodash-es'

import routes from './routes.json'

const CDN_HOST = 'https://cdn.yusong.tw'
const AUTHOR = 'YuSong Hsu'
const ACCOUNT = 'sky172839465'
const BLOG_HOST = 'yusong.tw'
const TITLE = BLOG_HOST.toUpperCase()
const ROUTE_MAP = keyBy(
  routes.map(({ file, ...item }) => {
    const imageFolder = `${CDN_HOST}/${file.replace(/index.jsx|index.md/, 'images')}`
    return {
      ...item,
      imageFolder,
      image: `${imageFolder}/og.jpg`,
      twitterImage: `${imageFolder}/x.jpg`
    }
  }),
  'path'
)
const NO_JS_PATH = '/nojs'

export default {
  async fetch(request) {
    const requestUrl = request.url
    const url = new URL(requestUrl)

    // 根據路徑識別文章 slug，例如 /article/my-article
    const path = url.pathname
    const lang = !path.startsWith('/en') ? 'zh-TW' : 'en'
    const isAssetRoute = /\.\D+$/.test(path) && !path.endsWith('.html')
    const isNoJsRoute = path.startsWith(`${NO_JS_PATH}/`)
    const convertedPath = (path.endsWith('/') ? path : `${path}/`).replace(NO_JS_PATH, '').replace('index.html/', '')
    const targetRoute = ROUTE_MAP[convertedPath] || {
      type: 'website',
      data: {
        title: '404',
        description: 'Not found.'
      }
    }
    const isArticle = get(targetRoute, 'type') === 'article'

    if (isAssetRoute) {
      return fetch(request)
    }

    // Fetch the original HTML
    let [html, jsHtml] = await Promise.all([
      fetch(request).then((response) => response.text()),
      isNoJsRoute ? await fetch(`https://${BLOG_HOST}${convertedPath}`).then((response) => response.text()) : Promise.resolve()
    ])

    // Dynamic generate meta tags
    const { type, data, image, imageFolder, twitterImage } = targetRoute
    const convertedImageFolder = imageFolder.replace('/en/', '/')
    const { title, description } = data
    if (isNoJsRoute) {
      const theme = url.search.includes('theme=dark') ? 'dark' : 'light'
      html = jsHtml
        .replace('__NO_JS_THEME_FROM_WORKER__', theme)
        .replace(
          /<body[^>]*>([\s\S]*)<\/body>/,
          html
            .replaceAll('images', convertedImageFolder)
            .replace('<!-- __WORKER_INSERT__ -->', `
              <h1 class="!mb-4 text-4xl font-bold text-gray-900 dark:text-white">${title}</h1>
              <img
                src="${convertedImageFolder}/index-large.gen.webp?v=${new Date().toISOString().split('T')[0]}"
                alt="${title}"
              />
            `)
        )
    }

    const displayTitle = `${title}${title === TITLE ? '' : ` | ${TITLE}`}`
    const modifiedHtml = html
    // apply !block
      .replace(`__NO_JS_LANG__${lang}`, '')
      .replace(
        '</head>',
        `   ${(isArticle && !isNoJsRoute) ? `<noscript><meta http-equiv="refresh" content="0;url=${NO_JS_PATH}${path}"></noscript>` : ''}
            <link rel="preconnect" href="${CDN_HOST}" crossorigin />
            <link rel="dns-prefetch" href="${CDN_HOST.replace('https:', '')}" />
            <link rel="canonical" href="${requestUrl}"/>
            <meta name="description" content="${description}" />
            <meta name="author" content="${AUTHOR}">
            <meta property="og:title" content="${displayTitle}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:url" content="${requestUrl}">
            <meta property="og:type" content="${type}">
            <meta property="og:image" content="${image}" />
            <meta property="og:image:alt" content="${description}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            <meta property="og:site_name" content="${TITLE}">
            <meta property="og:locale" content="zh_TW">
            <meta property="article:author" content="${AUTHOR}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${displayTitle}">
            <meta name="twitter:description" content="${description}">
            <meta name="twitter:image" content="${twitterImage}">
            <meta name="twitter:site" content="@${ACCOUNT}">
            <meta name="twitter:creator" content="@${ACCOUNT}">
            <title>${displayTitle}</title>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "${displayTitle}",
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
