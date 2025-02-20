import ArticleIndex from '@/components/ArticleIndex'

import { html } from './content.md'

const PwaIndex = () => {
  return (
    <ArticleIndex>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ArticleIndex>
  )
}

export default PwaIndex
