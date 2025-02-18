import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const SectionCard = (props) => {
  const {
    path, title, description
  } = props
  return (
    <Card key={path} className='flex grow flex-col'>
      <CardHeader className='grow'>
        <CardTitle>
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          to={path}
          viewTransition
        >
          <Button variant='secondary'>
            看更多
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SectionCard
