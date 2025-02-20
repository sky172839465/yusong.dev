import { useSeriesArticles } from '@/apis/useSeriesArticles'
import ArticleIndex from '@/components/ArticleIndex'

import { html } from './content.md'

const PwaIndex = () => {
  const { isLoading, data: articles } = useSeriesArticles()
  return (
    <ArticleIndex
      articles={articles}
      isLoading={isLoading}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ArticleIndex>
  )
}

export default PwaIndex
