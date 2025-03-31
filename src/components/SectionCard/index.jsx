import { get, isEmpty } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePathImages } from '@/apis/usePageImages'
import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import getI18N from '@/utils/getI18N'

const DEFAULT_IMAGE_SIZES = `
  (max-width: 640px) calc(100dvw-2rem), 
  (max-width: 768px) 608px, 
  736px
`

const SectionCard = (props) => {
  const { article: { file = '', path = '', data = {} } = {}, isArticle, imageSizes = DEFAULT_IMAGE_SIZES } = props
  const { title, description, tags = [], createdAt, modifiedAt } = data
  const isModified = modifiedAt !== createdAt
  const isTagExist = !isEmpty(tags) && tags[0] !== false
  const { mainPathName, pathname } = getI18N(path)
  const { isLoading, data: pathImages } = usePathImages(isArticle ? mainPathName : null)
  const fileMainPathName = file.replace(pathname, mainPathName)
  const imageData = get(
    pathImages,
    `${fileMainPathName}`.replace('index.md', 'images/index.jpg'),
    get(pathImages, `${fileMainPathName}`.replace('index.md', 'images/index.png'), null)
  )

  return (
    <Link
      to={path}
      className='flex flex-col'
      viewTransition
    >
      <Card key={path} className='flex grow flex-col'>
        {isArticle && (
          <LazyImage
            imageData={imageData}
            className={`w-full rounded-t-lg object-contain ${isEmpty(imageData) ? 'absolute top-0 rounded-b-none' : ''}`}
            alt={title}
            isLoading={isLoading}
            sizes={imageSizes}
            fetchpriority='high'
            loading='eager'
          />
        )}
        <CardHeader className={`${isArticle ? 'grow' : ''} gap-2`}>
          <CardTitle>
            {title}
          </CardTitle>
          <CardDescription className='sr-only'>
            {description}
          </CardDescription>
          <div className={isArticle ? 'flex flex-wrap gap-2' : 'hidden'}>
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
          </div>
        </CardHeader>
        <CardContent>
          {description}
        </CardContent>
      </Card>
    </Link>
  )
}

export default SectionCard
