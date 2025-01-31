import { usePwaArticles } from '@/apis/usePwaArticles'
import ArticleIndex from '@/components/ArticleIndex'

import { html } from './content.md'

const PwaIndex = () => {
  const { isLoading, data: articles } = usePwaArticles()
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
