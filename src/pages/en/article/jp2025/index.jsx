import ArticleIndex from '@/components/ArticleIndex'

import { html } from './content.md'

const Page = () => {
  return (
    <ArticleIndex>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ArticleIndex>
  )
}

export default Page
