import { useArticles } from '@/apis/useArticles'
import ArticleIndex from '@/components/ArticleIndex'

const Index = () => {
  const { isLoading, data: articles } = useArticles({ data: { series: 'TEST' } })
  return (
    <ArticleIndex
      articles={articles}
      isLoading={isLoading}
    >
      <div>
        testing description
      </div>
    </ArticleIndex>
  )
}

export default Index
