import { get, isEmpty } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePathImages } from '@/apis/usePageImages'
import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import getI18N from '@/utils/getI18N'

const SectionCard = (props) => {
  const { article: { file, path = '', data = {} } = {}, isArticle } = props
  const { title, description, tags = [], createdAt, modifiedAt } = data
  const isModified = modifiedAt !== createdAt
  const isTagExist = !isEmpty(tags) && tags[0] !== false
  const pathname = isArticle ? getI18N(path).mainPathName : null
  const { isLoading, data: pathImages } = usePathImages(pathname)
  const imageData = get(
    pathImages,
    `${file}`.replace('index.md', 'images/index.jpg'),
    get(pathImages, `${file}`.replace('index.md', 'images/index.png'), null)
  )

  return (
    <Link
      to={path}
      className='flex flex-col'
      viewTransition
    >
      <Card key={path} className='flex grow flex-col'>
        {pathname && (
          <LazyImage
            imageData={imageData}
            className={`w-full rounded-t-lg object-contain ${isEmpty(imageData) ? 'absolute top-0 rounded-b-none' : ''}`}
            isLoading={isLoading}
          />
        )}
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
      </Card>
    </Link>
  )
}

export default SectionCard
