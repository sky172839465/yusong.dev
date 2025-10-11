import { random, times } from 'lodash-es'
import { ArrowRight, CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import SkeletonSectionCard from '../SkeletonSectionCard'

const RANDOM = {
  INDEX_TITLE: random(1, 2),
  INDEX_DESC: random(5, 10),
  ARTICLES: times(random(2, 6)),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(3, 10)
}

const SkeletonArticleIndex = (props) => {
  const { label } = props
  return (
    <div className='m-auto w-full space-y-2 md:max-w-2xl'>
      <div className='prose prose-lg dark:prose-invert max-w-none text-transparent'>
        <h3 className='text-transparent'>
          <Skeleton className='inline'>
            {'This is index title'.repeat(RANDOM.INDEX_TITLE)}
          </Skeleton>
        </h3>
        <div>
          <Skeleton className='inline'>
            {'this is index description'.repeat(RANDOM.INDEX_DESC)}
          </Skeleton>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <Button variant='secondary' className='text-transparent'>
            <CalendarDays />
            {label.OLD}
            <ArrowRight />
            {label.NEW}
          </Button>
          <Button
            variant='secondary'
            className='text-transparent'
          >
            {`${label.TOTAL} 9`}
          </Button>
        </div>
        {RANDOM.ARTICLES.map((index) => {
          const data = {
            title: 'skeleton title'.repeat(RANDOM.ARTICLE_TITLE),
            description: 'skeleton description'.repeat(RANDOM.ARTICLE_DESC)
          }
          return (
            <SkeletonSectionCard
              key={index}
              article={{ data }}
              viewTransition={index === 0}
              isContentExist
              isArticle
            />
          )
        })}
      </div>
    </div>
  )
}

export default SkeletonArticleIndex
