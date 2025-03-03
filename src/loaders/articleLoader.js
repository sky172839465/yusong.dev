import { isEmpty } from 'lodash-es'
import { preload } from 'swr'

import { preloadPageImages } from '@/apis/usePageImages'
import { preloadSeriesArticles } from '@/apis/useSeriesArticles'
import getI18N from '@/utils/getI18N'

const articleLoader = (article = {}) => ({ request }) => {
  const { pathname } = new URL(request.url)
  const { mainPathName } = getI18N(pathname)
  const pageImages = preloadPageImages(mainPathName)
  const seriesArticles = preloadSeriesArticles(false, pathname)
  const content = isEmpty(article)
    ? Promise.resolve({ html: '', attributes: {} })
    : preload(article.filePath, article.markdown)
  return {
    pageImages,
    content,
    seriesArticles
  }
}

export default articleLoader
