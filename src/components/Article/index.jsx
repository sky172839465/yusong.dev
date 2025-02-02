import { filter, flow, map } from 'lodash-es'
import { lazy, useMemo,useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

import { useArticles } from '@/apis/useArticles'
import { usePageImages } from '@/apis/usePageImages'
import { Button } from '@/components/ui/button'
import getFileUrl from '@/lib/getFileUrl'

import ArticleActions from '../ArticleActions'
import LazyImage from '../LazyImage'

const LazyComment = lazy(() => import('@/components/Comments'))

const getSections = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const result = flow(
    () => [...(doc.querySelectorAll('a') || [])],
    (links) => filter(links, (link) => link.href.includes('#')),
    (hashLinks) => map(hashLinks, (hashLink) => ({
      hash: hashLink.getAttribute('href'),
      label: hashLink.textContent
    }))
  )()
  return result
}

const useMainImage = (attributes = {}) => {
  const { pathname } = useLocation()
  const mainImage = useMemo(() => {
    const { title, tags, image } = attributes
    if (!image) {
      return `https://og-img.sky172839465.workers.dev/og-img?title=${title}&tags=${tags.join(',')}`
    }
  
    const imagePathFromSrc = `/src/pages${pathname.endsWith('/') ? pathname : `${pathname}/`}images/index.png`
    return getFileUrl(imagePathFromSrc)
  }, [attributes, pathname])
  return mainImage
}

const Article = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const { pathname } = useLocation()
  const { data } = useSWR(filePath, markdown, { suspense: true })
  const { data: pageImages } = usePageImages()
  const { html: __html, attributes } = data
  const { title, description, createdAt, modifiedAt, series } = attributes
  const { data: seriesArticles } = useArticles(series ? { data: { series } } : null)
  const mainImage = useMainImage(attributes)
  const sections = useMemo(() => getSections(__html), [__html])
  const shareData = {
    title,
    text: description,
    url: window.location.href
  }
  console.log(pageImages)

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
      <div className='prose prose-lg mx-auto flex flex-col gap-2 dark:prose-invert'>
        <h1 ref={topRef} className='text-4xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h1>
        <LazyImage
          src={mainImage}
          alt={title}
          className='aspect-video w-full rounded-lg'
          loading='lazy'
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
              href={`https://github.com/sky172839465/yusong.tw/blob/main/${filePath}`}
              target='_blank'
            >
              <Button>
                Edit on GitHub
              </Button>
            </a>
          </div>
        </div>
        <div
          key={pathname}
          ref={articleRef}
          className='prose prose-lg max-w-none !bg-background !text-foreground dark:prose-invert [&_[data-table]]:overflow-x-auto'
        >
          <div dangerouslySetInnerHTML={{ __html }} />
        </div>
        <ArticleActions
          topRef={topRef}
          shareData={shareData}
          sections={sections}
          series={seriesArticles}
        />
        <LazyComment />
      </div>
    </>
  )
}

export default Article