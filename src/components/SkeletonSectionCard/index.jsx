import { times } from 'lodash-es'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonSectionCard = (props) => {
  const { article: { data = {} } = {}, isContentExist } = props
  const { title, description } = data
  return (
    <Card className='flex grow flex-col'>
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
      <CardFooter>
        <Skeleton>
          <Button variant='secondary' className='invisible'>
            看更多
          </Button>
        </Skeleton>
      </CardFooter>
    </Card>
  )
}

export default SkeletonSectionCard
