import { flow, map } from 'lodash-es'
import { lazy } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'

import ArticleActions from '../ArticleActions'

const LazyComment = lazy(() => import('@/components/Comments'))

const Article = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const [sections, setSections] = useState([])
  const { data } = useSWR(filePath, markdown, { suspense: true })
  const { html: __html, attributes } = data
  const { title, description, createdAt, modifiedAt, tags } = attributes
  const shareData = {
    title,
    text: description,
    url: window.location.href
  }

  useEffect(() => {
    if (!articleRef.current) {
      return
    }

    const articleSections = flow(
      () => [...articleRef.current.querySelectorAll('a[href^="#"]')],
      (titleLinkElements) => map(titleLinkElements, (titleLinkElement) => {
        const hash = (new URL(titleLinkElement.href)).hash
        const label = titleLinkElement.innerText
        return { hash, label }
      })
    )()
    setSections(articleSections)
  }, [])

  return (
    <>
      <Helmet>
        <title>
          {title}
        </title>
        <meta name='description' content={description} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={shareData.url} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </Helmet>
      <div className='flex flex-col gap-2'>
        <h1 ref={topRef} className='text-4xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h1>
        <img
          src={`https://og-img.sky172839465.workers.dev/og-img?title=${title}&tags=${tags.join(',')}`}
          alt={title}
          className='w-full rounded-lg'
        />
        <div className='flex flex-row items-center justify-between'>
          <div className='my-2 text-gray-600 dark:text-gray-400'>
            {createdAt === modifiedAt && (
              `Created: ${new Date(createdAt).toLocaleDateString()}`
            )}
            {createdAt !== modifiedAt && (
              `Modified: ${new Date(modifiedAt).toLocaleDateString()}`
            )}
          </div>
          <div>
            <a
              href={`https://github.com/sky172839465/yusong.tw/blob/main/src/${filePath.replace('./', '')}`}
              target='_blank'
              // className='btn btn-primary'
            >
              <Button>
                Edit on GitHub
              </Button>
            </a>
          </div>
        </div>
        <div
          ref={articleRef}
          className='prose prose-lg max-w-none !bg-background !text-foreground dark:prose-invert'
        >
          <div dangerouslySetInnerHTML={{ __html }} />
        </div>
        <ArticleActions
          topRef={topRef}
          shareData={shareData}
          sections={sections}
        />
        <LazyComment />
      </div>
    </>
  )
}

export default Article