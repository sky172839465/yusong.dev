import { filter, flow, get, isEmpty, map } from 'lodash-es'
import { Pencil } from 'lucide-react'
import { Fragment, lazy, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

import { useArticles } from '@/apis/useArticles'
import { usePageImages } from '@/apis/usePageImages'
import ArticleActions from '@/components/ArticleActions'
import LazyImagePreview from '@/components/LazyImage/Dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import SkeletonArticle from '../SkeletonArticle'

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

const useMainImageData = () => {
  const { isLoading, data: pageImages } = usePageImages()
  const { pathname } = useLocation()
  const imagePathFromSrc = useMemo(() => {
    const imagePathFromSrc = `/src/pages${pathname.endsWith('/') ? pathname : `${pathname}/`}images/index.png`
    return imagePathFromSrc
  }, [pathname])
  if (isLoading || !imagePathFromSrc) {
    return null
  }

  const imageData = pageImages[imagePathFromSrc.replace('/', '')]
  return imageData
}

const useArticleHtml = (html) => {
  const { isLoading, data: pageImages } = usePageImages()
  const sections = useMemo(() => getSections(html), [html])
  const { htmlList, imageList } = useMemo(() => {
    if (isLoading) {
      return {
        htmlList: [],
        imageList: []
      }
    }

    if (isEmpty(pageImages)) {
      return {
        htmlList: [html],
        imageList: []
      }
    }

    const splitElements = []
    const imageList = []
    // find images in html
    const convertedHtml = html.replace(/<p>\s*?<img[^>]*src=["']([^"']+)["'][^>]*>\s*<\/p>?/g, (element, relativeFileUrl) => {
      const pageImageData = pageImages[relativeFileUrl.replace('/', '')]
      // find image alt in image html
      const altMatch = element.match(/<img[^>]*\balt=["']([^"']+)["'][^>]*>/)
      const alt = altMatch ? altMatch[1] : 'Article image'
      splitElements.push(element)
      imageList.push({ alt, imageData: pageImageData })
      return element
    })
    if (isEmpty(splitElements)) {
      return {
        htmlList: [html],
        imageList: []
      }
    }

    const splitHtmlAndImagesRegexp = new RegExp(`(${splitElements.join('|')})`, 'g')
    const htmlList = convertedHtml.split(splitHtmlAndImagesRegexp).filter((_, i) => i % 2 === 0)
    return { htmlList, imageList }
  }, [html, pageImages, isLoading])
  return { sections, htmlList, imageList }
}

const DEFAULT_TITLE = 'YUSONG.TW'

const Article = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const { pathname } = useLocation()
  const { data, isValidating: isMarkdownLoading } = useSWR(filePath, markdown, { suspense: true })
  const { isLoading } = usePageImages()
  const { html, attributes } = data
  const { title, description, createdAt, modifiedAt, series, tags } = attributes
  const { data: seriesArticles } = useArticles(series ? { data: { series } } : null)
  const mainImageData = useMainImageData()
  const { sections, htmlList, imageList } = useArticleHtml(html)
  const displayTitle = `${title}${title === DEFAULT_TITLE ? '' : ` | ${DEFAULT_TITLE}`}`
  
  const shareData = {
    title: displayTitle,
    text: description,
    url: window.location.href
  }

  if (isMarkdownLoading || isEmpty(htmlList)) {
    return <SkeletonArticle />
  }

  return (
    <>
      <Helmet>
        <title>
          {displayTitle}
        </title>
        <meta name='description' content={description} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={shareData.url} />
        <meta property='og:title' content={displayTitle} />
        <meta property='og:description' content={description} />
      </Helmet>
      <div className='prose prose-lg mx-auto flex flex-col gap-2 dark:prose-invert'>
        <h1 ref={topRef} className='!mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h1>
        <div className={`flex flex-wrap gap-2 ${isEmpty(tags) ? 'hidden' : ''}`}>
          {tags.map((tag, index) => {
            return (
              <Badge variant='secondary' key={index}>
                {tag}
              </Badge>
            )
          })}
        </div>
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
              <Button variant='outline'>
                <Pencil className='size-4' />
                Edit on GitHub
              </Button>
            </a>
          </div>
        </div>
        <LazyImagePreview
          imageData={mainImageData}
          alt={title}
          className={`aspect-video w-full rounded-lg ${isEmpty(mainImageData) ? 'my-8' : ''}`}
          isLoading={isLoading}
          loading='eager'
        />
        <div
          key={pathname}
          ref={articleRef}
          className='prose prose-lg max-w-none !bg-background !text-foreground dark:prose-invert'
        >
          {map(htmlList, (__html, index) => {
            const { imageData, alt } = get(imageList, index, {})
            // split html string by image tags
            // image tags will replace to react lazy image with preview
            return (
              <Fragment key={index}>
                <div dangerouslySetInnerHTML={{ __html }} />
                {!isEmpty(imageData) && (
                  <LazyImagePreview
                    imageData={imageData}
                    alt={alt}
                    className='aspect-video w-full rounded-lg'
                    isLoading={isLoading}
                  />
                )}
              </Fragment>
            )
          })}
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
