import { preloadSeriesArticles } from '@/apis/useSeriesArticles'

const articleIndexLoader = ({ request }) => {
  const { pathname } = new URL(request.url)
  const seriesArticles = preloadSeriesArticles(true, pathname)
  return {
    seriesArticles
  }
}

export default articleIndexLoader
