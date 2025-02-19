import { isEmpty } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const LABEL = {
  en: {
    MORE: 'Read more'
  },
  'zh-tw': {
    MORE: '看更多'
  }
}

const SectionCard = (props) => {
  const { article: { path, data = {} } = {} } = props
  const { pathname } = useLocation()
  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'zh-tw'
  const label = LABEL[lang]
  const { title, description, tags = [], createdAt, modifiedAt } = data
  const isModified = modifiedAt !== createdAt
  const isTagExist = !isEmpty(tags) && tags[0] !== false

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
      <CardContent className='flex flex-wrap gap-2'>
        {(createdAt || modifiedAt) && (
          <>
            <Badge variant='secondary' className='h-7'>
              {isModified ? <PencilLine className='mr-2 size-4' /> : <FilePlus2 className='mr-2 size-4' />}
              {new Date(modifiedAt).toLocaleDateString()}
            </Badge>
            <div className='h-7'>
              <Separator orientation='vertical' />
            </div>
          </>
        )}
        {isTagExist && tags.map((tag, index) => {
          return (
            <Badge key={index} variant='secondary' className='h-7'>
              {tag}
            </Badge>
          )
        })}
      </CardContent>
      <CardFooter>
        <Link
          to={path}
          viewTransition
        >
          <Button variant='outline'>
            {label.MORE}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SectionCard
