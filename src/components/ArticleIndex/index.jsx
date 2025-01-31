import { Link } from 'react-router-dom'

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
            <li key={index}>
              <div className='flex items-center space-x-2'>
                <Link to={path}>
                  {title}
                </Link>
                {tags.map((tag, index) => {
                  return (
                    <div className='badge badge-outline' key={index}>
                      {tag}
                    </div>
                  )
                })}
              </div>
              <div className='my-2 text-gray-600 dark:text-gray-400'>
                {`${
                  modifiedAt === createdAt
                    ? `建立時間：${new Date(createdAt).toLocaleDateString()}`
                    : `修改時間：${new Date(modifiedAt).toLocaleDateString()}`}
                `}
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