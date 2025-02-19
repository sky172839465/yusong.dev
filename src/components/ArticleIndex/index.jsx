import { size } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import SkeletonArticleIndex from '../SkeletonArticleIndex'


const ArticleIndex = (props) => {
  const {
    children,
    articles,
    isLoading
  } = props
  if (isLoading) {
    return <SkeletonArticleIndex />
  }

  return (
    <div className='container prose prose-lg max-w-none text-foreground dark:prose-invert'>
      {children}
      <p>
        目錄：
      </p>
      <ul>
        {!isLoading && articles.map((article, index) => {
          const {
            path,
            data: {
              title,
              description,
              tags = [],
              createdAt,
              modifiedAt
            } = {}
          } = article
          return (
            <li className='space-y-2' key={index}>
              <Link to={path}>
                {title}
              </Link>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='secondary' className='h-7'>
                  {createdAt === modifiedAt && (
                    <>
                      <FilePlus2 className='mr-1 size-4' />
                      {new Date(createdAt).toLocaleDateString()}
                    </>
                  )}
                  {createdAt !== modifiedAt && (
                    <>
                      <PencilLine className='mr-1 size-4' />
                      {new Date(modifiedAt).toLocaleDateString()}
                    </>
                  )}
                </Badge>
                <div className='h-7'>
                  <Separator orientation='vertical' />
                </div>
                {tags.map((tag, index) => {
                  return (
                    <Badge variant='secondary' key={index} className='h-7'>
                      {tag}
                    </Badge>
                  )
                })}
              </div>
              <p>
                {description}
              </p>
              {index !== size(articles) - 1 && (
                <Separator />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ArticleIndex