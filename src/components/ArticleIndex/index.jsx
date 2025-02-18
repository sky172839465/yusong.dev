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
              <div className='space-x-2'>
                <Link to={path}>
                  {title}
                </Link>
              </div>
              <div className='flex h-7 flex-wrap gap-2'>
                <Badge variant='secondary'>
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
                <Separator orientation='vertical' />
                {tags.map((tag, index) => {
                  return (
                    <Badge variant='secondary' key={index}>
                      {tag}
                    </Badge>
                  )
                })}
              </div>
              <p>
                {description}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ArticleIndex