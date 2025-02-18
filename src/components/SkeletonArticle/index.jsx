import { random, times } from 'lodash-es'

import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const RANDOM = {
  TAGS: times(random(1, 3)),
  PARAGRAPHS: times(random(2, 5)),
  LINES: random(5, 15)
}

const SkeletonArticle = () => {
  return (
    <div className='prose prose-lg mx-auto flex flex-col gap-2 dark:prose-invert'>
      <h1 className='!mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
        <Skeleton className='h-10 w-full text-transparent'>
          This is a skeleton title
        </Skeleton>
      </h1>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='flex [&_*]:invisible'>
            <Badge variant='secondary' className='h-9'>
              <div className='mr-1 size-4' />
              {new Date().toLocaleDateString()}
            </Badge>
          </Skeleton>
          <Separator orientation='vertical' />
          {RANDOM.TAGS.map((tag, index) => {
            return (
              <Skeleton className='flex [&_*]:invisible' key={index}>
                <Badge className='h-9'>
                  {`tags ${index}`}
                </Badge>
              </Skeleton>
            )
          })}
        </div>
        <div />
      </div>
      <LazyImage
        className='my-8 aspect-video w-full rounded-lg'
        isLoading
      />
      <div
        className='prose prose-lg max-w-none !bg-background !text-transparent dark:prose-invert'
      >
        {RANDOM.PARAGRAPHS.map((index => {
          return (
            <div key={index}>
              <Skeleton className='inline w-auto'>
                {'This is skeleton content'.repeat(RANDOM.LINES)}
              </Skeleton>
            </div>
          )
        }))}
      </div>
    </div>
  )
}

export default SkeletonArticle
