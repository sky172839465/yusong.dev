import { get, size } from 'lodash-es'
import { FilePlus2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useSeriesArticles } from '@/apis/useSeriesArticles'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import useI18N, { LANG } from '@/hooks/useI18N'

import SkeletonArticleIndex from '../SkeletonArticleIndex'

const i18nMapping = {
  [LANG.EN]: {
    INDEX: 'Index: '
  },
  [LANG.ZH_TW]: {
    INDEX: '目錄：'
  }
}

const ArticleIndex = (props) => {
  const { children } = props
  const { label } = useI18N(i18nMapping)
  const { isLoading, data: articles = [] } = useSeriesArticles()

  if (isLoading) {
    return <SkeletonArticleIndex />
  }

  return (
    <div className='container prose prose-lg max-w-none text-foreground dark:prose-invert'>
      <h3>
        {get(articles, '0.series', null)}
      </h3>
      {children}
      <p>
        {label.INDEX}
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
              <p className='text-sm'>
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
