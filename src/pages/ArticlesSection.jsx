import { orderBy, random, times } from 'lodash-es'
import { Link } from 'react-router-dom'

import { useArticles } from '@/apis/useArticles'
import { Skeleton } from '@/components/ui/skeleton'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_DESC: random(1, 5)
}

export default function ArticlesSection() {
  const { isLoading, data: articles } = useArticles({ type: 'article' })

  return (
    <section id='articles' className='my-12'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Latest Articles
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && RANDOM.ARTICLES.map((index) => {
          return (
            <div key={index} className='overflow-hidden rounded-lg bg-card text-transparent shadow-md'>
              <div className='p-6'>
                <h3 className='mb-2 text-lg font-semibold'>
                  <Skeleton>
                    {'skeleton title'}
                  </Skeleton>
                </h3>
                <div className='mb-4'>
                  <Skeleton className='inline'>
                    {'skeleton description'.repeat(RANDOM.ARTICLE_DESC)}
                  </Skeleton>
                </div>
                <span
                  className='cursor-pointer text-primary hover:underline'
                >
                  Read more
                </span>
              </div>
            </div>
          )
        })}
        {!isLoading && orderBy(articles, 'data.modifiedAt', 'desc').slice(0, 6).map(({ data = {}, path }) => {
          const { title, description } = data
          return (
            <div key={path} className='overflow-hidden rounded-lg bg-card text-card-foreground shadow-md'>
              <div className='p-6'>
                <h3 className='mb-2 text-lg font-semibold'>
                  {title}
                </h3>
                <p className='mb-4 text-muted-foreground'>
                  {description}
                </p>
                <Link
                  to={path}
                  className='text-primary hover:underline'
                  viewTransition
                >
                  Read more
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
