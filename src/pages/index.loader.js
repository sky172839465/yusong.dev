import { preloadArticles } from '@/apis/useArticles'
import { preloadSeries } from '@/apis/useSeries'
import getI18N from '@/utils/getI18N'

const loader = ({ request }) => {
  const { pathname } = new URL(request.url)
  const { lang } = getI18N(pathname)
  const series = preloadSeries({ type: 'website', lang })
  const articles = preloadArticles({ type: 'article', lang })
  return {
    series,
    articles
  }
}

export default loader
