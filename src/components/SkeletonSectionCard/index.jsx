import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonSectionCard = (props) => {
  const {
    title, description
  } = props
  return (
    <Card>
      <CardHeader className='[&_*]:text-transparent'>
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
        <span
          className='cursor-pointer text-primary hover:underline'
        >
          Read more
        </span>
      </CardFooter>
    </Card>
  )
}

export default SkeletonSectionCard
