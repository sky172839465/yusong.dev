import ArticleIndex from '@/components/ArticleIndex'

import { html } from './content.md'

const Index = () => {
  return (
    <ArticleIndex>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ArticleIndex>
  )
}

export default Index
