import { filter, flow, get, isEmpty, map } from 'lodash-es'
import { FilePlus2, Pencil, PencilLine } from 'lucide-react'
import { Fragment, lazy, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { useCounter } from 'usehooks-ts'

import { usePageImages } from '@/apis/usePageImages'
import LazyImagePreview from '@/components/LazyImage/Dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useI18N from '@/hooks/useI18N'

import SkeletonArticle from '../SkeletonArticle'

const LazyArticleActions = lazy(() => import('@/components/ArticleActions'))
const LazyComment = lazy(() => import('@/components/Comments'))

const getSections = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const result = flow(
    () => [...(doc.querySelectorAll('h3 a') || [])],
    (links) => filter(links, (link) => link.href.includes('#')),
    (hashLinks) => map(hashLinks, (hashLink) => ({
      hash: hashLink.getAttribute('href'),
      label: hashLink.textContent
    }))
  )()
  return result
}

const useMainImageData = (mainImageName = 'index') => {
  const { isLoading, data: pageImages } = usePageImages()
  const { mainPathName } = useI18N()
  const imagePathFromSrc = useMemo(() => {
    const imagePathFromSrc = `/src/pages${(mainPathName.endsWith('/') ? mainPathName : `${mainPathName}/`)}images/${mainImageName}`
    return imagePathFromSrc
  }, [mainPathName, mainImageName])
  if (isLoading || !imagePathFromSrc) {
    return null
  }

  const mainImageUrl = imagePathFromSrc.replace('/', '')
  const imageData = pageImages[`${mainImageUrl}.jpg`] || pageImages[`${mainImageUrl}.png`]
  return imageData
}

const useArticleHtml = (html) => {
  const { pathname, mainPathName } = useI18N()
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
      const pageImageData = pageImages[relativeFileUrl.replace(pathname, mainPathName).replace('/', '')]
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
  }, [html, pageImages, isLoading, pathname, mainPathName])
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
  const { title, description, createdAt, modifiedAt, tags, mainImage } = attributes
  const mainImageData = useMainImageData(mainImage)
  const { sections, htmlList, imageList } = useArticleHtml(html)
  const { count, increment } = useCounter(0)
  const displayTitle = `${title}${title === DEFAULT_TITLE ? '' : ` | ${DEFAULT_TITLE}`}`
  
  const shareData = {
    title: displayTitle,
    text: description,
    url: window.location.href
  }

  if (isMarkdownLoading || isEmpty(htmlList)) {
    return (
      <>
        {!isMarkdownLoading && (
          <Helmet key={pathname}>
            <title>
              {displayTitle}
            </title>
            <meta name='description' content={description} />
            <meta property='og:type' content='article' />
            <meta property='og:url' content={shareData.url} />
            <meta property='og:title' content={displayTitle} />
            <meta property='og:description' content={description} />
          </Helmet>
        )}
        <SkeletonArticle />
      </>
    )
  }

  return (
    <>
      <Helmet key={pathname}>
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
        <h1
          ref={topRef}
          className='!mb-4 text-4xl font-bold text-gray-900 dark:text-white'
          onClick={increment}
        >
          {title}
        </h1>
        <div className='flex flex-row items-center justify-between'>
          <div className={`flex flex-wrap gap-2 ${isEmpty(tags) ? 'hidden' : ''}`}>
            <Badge variant='secondary' className='h-9'>
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
            <div className='h-9'>
              <Separator orientation='vertical' />
            </div>
            {tags.map((tag, index) => {
              return (
                <Badge variant='secondary' key={index} className='h-9'>
                  {tag}
                </Badge>
              )
            })}
          </div>
          <a
            href={`https://github.com/sky172839465/yusong.tw/blob/main/${filePath}`}
            target='_blank'
            className={count >= 10 ? 'inline' : 'hidden'}
          >
            <Button variant='outline'>
              <Pencil />
              <span className='hidden md:inline'>
                Edit on GitHub
              </span>
            </Button>
          </a>
        </div>
        <LazyImagePreview
          imageData={mainImageData}
          alt={title}
          className={`w-full rounded-lg object-contain md:object-cover ${isEmpty(mainImageData) ? 'my-8' : ''}`}
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
                    className='w-full rounded-lg object-contain'
                    isLoading={isLoading}
                  />
                )}
              </Fragment>
            )
          })}
        </div>
        <LazyArticleActions
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
