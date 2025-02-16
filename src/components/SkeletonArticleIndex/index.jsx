import { random, times } from 'lodash-es'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonArticleIndex = () => {
  return (
    <div className='container prose prose-lg max-w-none text-transparent dark:prose-invert'>
      <div>
        <h3 className='text-transparent'>
          <Skeleton className='inline'>
            {'This is index title'.repeat(random(3, 6))}
          </Skeleton>
        </h3>
        <div>
          <Skeleton className='inline'>
            {'this is index description'.repeat(random(10, 30))}
          </Skeleton>
        </div>
      </div>
      <p className='text-white'>
        目錄：
      </p>
      <ul>
        {times(random(2, 6)).map((index) => {
          return (
            <li className='space-y-2' key={index}>
              <div className='space-x-2'>
                <div className='inline cursor-pointer underline'>
                  <Skeleton className='inline'>
                    {'this is article title'.repeat(random(1, 3))}
                  </Skeleton>
                </div>
                <Skeleton className='inline text-sm'>
                  {`建立時間：${new Date().toLocaleDateString()}`}
                </Skeleton>
              </div>
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
              <div>
                <Skeleton className='inline'>
                  {'this is article description'.repeat(random(5, 20))}
                </Skeleton>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SkeletonArticleIndex
