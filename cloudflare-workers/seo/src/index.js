import { keyBy } from 'lodash-es'

const OG_IMG_URL = 'https://og-img.sky172839465.workers.dev/og-img'
const AUTHOR = 'YuSong Hsu'
const ACCOUNT = 'sky172839465'
const BLOG_HOST = 'yusong.tw'
const TITLE = BLOG_HOST.toUpperCase()
const DEFAULT_META = {
  type: 'website',
  title: TITLE,
  description: 'This is Yusong\'s blog',
  image: `${OG_IMG_URL}?title=${encodeURIComponent(TITLE)}`,
  twitterImage: `${OG_IMG_URL}?title=${encodeURIComponent(TITLE)}&width=1200&height=628`
}
const META = keyBy(
  [
    {
      title: 'Lazy Article',
      description: 'This is an awesome article about lazy things.',
      key: 'lazy'
    },
    {
      title: 'Hello World Article',
      description: 'This is an awesome article about hello world things.',
      key: 'hello-world'
    }
  ].map(({ title, ...item }) => {
    return {
      ...item,
      title,
      type: 'article',
      image: `${OG_IMG_URL}?title=${encodeURIComponent(title)}`,
      twitterImage: `${OG_IMG_URL}?title=${encodeURIComponent(title)}&width=1200&height=628`
    }
  }),
  'key'
)

export default {
  async fetch(request) {
    const requestUrl = request.url
    const url = new URL(requestUrl)

    // 根據路徑識別文章 slug，例如 /article/my-article
    const path = url.pathname
    const isAssetRoute = /\.\D+$/.test(path)
    if (isAssetRoute) {
      return fetch(request)
    }

    const articleSlug = path.split('/').filter(Boolean).pop()

    // Fetch the original HTML
    const response = await fetch(request)
    const html = await response.text()
    // 如果路徑匹配文章，動態生成 meta tags
    const { type, title, description, image, twitterImage } = META[articleSlug] || DEFAULT_META
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
          <title>${title}</title>
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