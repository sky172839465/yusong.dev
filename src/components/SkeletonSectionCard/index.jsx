import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonSectionCard = (props) => {
  const {
    title, description
  } = props
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
