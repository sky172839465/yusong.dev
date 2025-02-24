import { random, size, times } from 'lodash-es'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const RANDOM = {
  INDEX_TITLE: random(3, 6),
  INDEX_DESC: random(10, 30),
  ARTICLES: times(random(2, 6)),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_TAGS: times(random(1, 3)),
  ARTICLE_DESC: random(3, 10)
}

const SkeletonArticleIndex = () => {
  return (
    <div className='container prose prose-lg max-w-none text-transparent dark:prose-invert'>
      <div>
        <h3 className='text-transparent'>
          <Skeleton className='inline'>
            {'This is index title'.repeat(RANDOM.INDEX_TITLE)}
          </Skeleton>
        </h3>
        <div className='text-sm'>
          <Skeleton className='inline'>
            {'this is index description'.repeat(RANDOM.INDEX_DESC)}
          </Skeleton>
        </div>
      </div>
      <p className='text-white'>
        目錄：
      </p>
      <ul>
        {RANDOM.ARTICLES.map((index) => {
          return (
            <li className='space-y-2' key={index}>
              <div className='space-x-2'>
                <div className='inline cursor-pointer underline'>
                  <Skeleton className='inline'>
                    {'this is article title'.repeat(RANDOM.ARTICLE_TITLE)}
                  </Skeleton>
                </div>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Skeleton className='flex [&_*]:invisible' key={index}>
                  <Badge variant='secondary' className='h-7'>
                    <div className='mr-1 size-4' />
                    {new Date().toLocaleDateString()}
                  </Badge>
                </Skeleton>
                <div className='h-7'>
                  <Separator orientation='vertical' />
                </div>
                {RANDOM.ARTICLE_TAGS.map((tag, index) => {
                  return (
                    <Skeleton className='flex [&_*]:invisible' key={index}>
                      <Badge variant='secondary' className='h-7'>
                        {`tags ${index}`}
                      </Badge>
                    </Skeleton>
                  )
                })}
              </div>
              <div>
                <Skeleton className='inline'>
                  {'this is article description'.repeat(RANDOM.ARTICLE_DESC)}
                </Skeleton>
              </div>
              {index !== size(RANDOM.ARTICLES) - 1 && (
                <Separator />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SkeletonArticleIndex
