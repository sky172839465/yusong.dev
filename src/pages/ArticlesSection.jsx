import { orderBy, random, times } from 'lodash-es'

import { useArticles } from '@/apis/useArticles'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

export default function ArticlesSection() {
  const { isLoading, data: articles } = useArticles({ type: 'article' })

  return (
    <section id='articles'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Latest Articles
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && RANDOM.ARTICLES.map((index) => {
          return (
            <SkeletonSectionCard
              key={index}
              title={'skeleton title'.repeat(RANDOM.ARTICLE_TITLE)}
              description={'skeleton description'.repeat(RANDOM.ARTICLE_DESC)}
            />
          )
        })}
        {!isLoading && orderBy(articles, 'data.modifiedAt', 'desc').slice(0, 6).map(({ data = {}, path }) => {
          const { title, description } = data
          return (
            <SectionCard
              key={path}
              path={path}
              title={title}
              description={description}
            />
          )
        })}
      </div>
    </section>
  )
}
