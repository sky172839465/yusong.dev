import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'

const ArticleIndex = (props) => {
  const {
    children,
    articles,
    isLoading
  } = props
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
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {`${
                    modifiedAt === createdAt
                      ? `建立時間：${new Date(createdAt).toLocaleDateString()}`
                      : `修改時間：${new Date(modifiedAt).toLocaleDateString()}`}
                  `}
                </span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag, index) => {
                  return (
                    <Badge ariant='secondary' key={index}>
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