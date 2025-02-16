import { random, times } from 'lodash-es'
import { Pencil } from 'lucide-react'

import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonArticle = () => {
  return (
    <div className='prose prose-lg mx-auto flex flex-col gap-2 dark:prose-invert'>
      <h1 className='!mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
        <Skeleton className='h-10 w-full text-transparent'>
          This is a skeleton title
        </Skeleton>
      </h1>
      <div className='flex flex-wrap gap-2'>
        {times(random(2, 5)).map((tag, index) => {
          return (
            <Skeleton key={index}>
              <Badge className='bg-transparent text-transparent'>
                {`tags ${index}`}
              </Badge>
            </Skeleton>
          )
        })}
      </div>
      <div className='flex flex-row items-center justify-between'>
        <div className='my-2 text-transparent'>
          <Skeleton>
            {`Created: ${new Date().toLocaleDateString()}`}
          </Skeleton>
        </div>
        <div>
          <Button disabled>
            <Pencil className='size-4' />
            Edit on GitHub
          </Button>
        </div>
      </div>
      <LazyImage
        className='my-8 aspect-video w-full rounded-lg'
        isLoading
      />
      <div
        className='prose prose-lg max-w-none !bg-background !text-transparent dark:prose-invert'
      >
        {times(random(2, 5)).map((index => {
          return (
            <p key={index}>
              <Skeleton className='inline w-auto'>
                {'This is skeleton content'.repeat(random(5, 15))}
              </Skeleton>
            </p>
          )
        }))}
      </div>
    </div>
  )
}

export default SkeletonArticle