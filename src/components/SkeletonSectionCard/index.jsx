import { times } from 'lodash-es'

import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonSectionCard = (props) => {
  const { article: { data = {} } = {}, isContentExist, isArticle } = props
  const { title, description } = data
  return (
    <Card className='flex grow flex-col'>
      {isArticle && (
        <LazyImage
          className='absolute top-0 h-56 w-full rounded-b-none rounded-t-lg md:h-96'
          isLoading
        />
      )}
      <CardHeader className='grow [&_*]:text-transparent'>
        <CardTitle>
          <Skeleton>
            {title}
          </Skeleton>
        </CardTitle>
        <CardDescription>
          <Skeleton className='inline'>
            {description}
          </Skeleton>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-2 [&_*]:!text-transparent'>
        {isContentExist && (
          <>
            <Skeleton className='flex'>
              <Badge variant='secondary' className='h-7'>
                {new Date().toLocaleDateString()}
              </Badge>
            </Skeleton>
            <div className='h-7'>
              <Separator orientation='vertical' />
            </div>
            {times(3).map((tag, index) => {
              return (
                <Skeleton key={index} className='flex'>
                  <Badge variant='secondary' className='h-7'>
                    {`tag ${tag}`}
                  </Badge>
                </Skeleton>
              )
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default SkeletonSectionCard
