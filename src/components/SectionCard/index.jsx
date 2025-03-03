import { get, isEmpty } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePathImages } from '@/apis/usePageImages'
import LazyImage from '@/components/LazyImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useI18N, { LANG } from '@/hooks/useI18N'
import getI18N from '@/utils/getI18N'

const i18nMapping = {
  [LANG.EN]: {
    MORE: 'Read more'
  },
  [LANG.ZH_TW]: {
    MORE: '看更多'
  }
}

const SectionCard = (props) => {
  const { article: { file, type, path, data = {} } = {} } = props
  const { label } = useI18N(i18nMapping)
  const { title, description, tags = [], createdAt, modifiedAt } = data
  const isModified = modifiedAt !== createdAt
  const isTagExist = !isEmpty(tags) && tags[0] !== false
  const isArticle = type === 'article'
  const pathname = isArticle ? getI18N(path).mainPathName : null
  const { isLoading, data: pathImages } = usePathImages(pathname)
  const imageData = get(
    pathImages,
    `${file}`.replace('index.md', 'images/index.jpg'),
    get(pathImages, `${file}`.replace('index.md', 'images/index.png'), null)
  )

  return (
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
