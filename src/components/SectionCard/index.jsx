import { Link } from 'react-router-dom'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const SectionCard = (props) => {
  const {
    path, title, description
  } = props
  return (
    <Card key={path}>
      <CardHeader>
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
          className='text-primary hover:underline'
          viewTransition
        >
          看更多
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SectionCard
