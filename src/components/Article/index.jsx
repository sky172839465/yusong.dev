import { filter, flow, get, join, last, map, orderBy,pick } from 'lodash-es'
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

const getPageImageAttr = (pageImage) => {
  if (!pageImage) {
    const dimensions = { width: '1200', height: '720' }
    return { srcSet: null, dimensions }
  }

  const sizes = get(pageImage, 'sizes', [])
  const srcSet = flow(
    () => map(sizes, ({ path, width }) => `${getFileUrl(`/${path}`)} ${width}w`),
    srcSetList => join(srcSetList, ', ')
  )()
  const srcList = flow(
    () => orderBy(sizes, 'width', 'desc'),
    (reverseSizes) => map(reverseSizes, ({ path }) => getFileUrl(`/${path}`))
  )()
  const dimensions = pick(last(sizes, '2'), ['width', 'height'])
  return { srcList, srcSet, dimensions }
}

const useMainImage = (attributes = {}, pageImages = {}) => {
  const { pathname } = useLocation()
  const imagePathFromSrc = useMemo(() => {
    const { image } = attributes
    if (!image) {
      return null
    }
  
    const imagePathFromSrc = `/src/pages${pathname.endsWith('/') ? pathname : `${pathname}/`}images/index.png`
    return imagePathFromSrc
  }, [attributes, pathname])
  if (!imagePathFromSrc) {
    return { srcList: [], srcSet: null, dimensions: {} }
  }

  const pageImage = pageImages[imagePathFromSrc.replace('/', '')]
  const { srcList, srcSet, dimensions } = getPageImageAttr(pageImage)
  return { srcList, srcSet, dimensions }
}

const useArticleHtml = (html, pageImages) => {
  const sections = useMemo(() => getSections(html), [html])
  const articleHtml = useMemo(() => {
    if (!pageImages) {
      return html.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/g, '')
    }

    const convertedHtml = html.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/g, (element, relativeFileUrl) => {
      const pageImage = pageImages[relativeFileUrl.replace('/', '')]
      const { srcList, srcSet, dimensions } = getPageImageAttr(pageImage)
      if (!pageImage || !srcSet) {
        return ''
      }

      const { width, height } = dimensions
      return `
        <div
          class="relative w-full block [&_div[data-visible='false']]:hidden [&_img[data-loaded='false']]:invisible"
          width="${width}"
          height="${height}"
        >
          <div
            class="absolute h-auto w-full aspect-video rounded-lg animate-pulse bg-foreground/30"
            data-visible="true"
            width="${width}"
          ></div>
          ${element.replace(`src="${relativeFileUrl}"`, `        
            src="${srcList[0]}"
            srcset="${srcSet}"
            width="${width}"
            height="${height}"
            data-loaded="false"
            onload="this.setAttribute('data-loaded', 'true'); this.previousElementSibling.setAttribute('data-visible', 'false');"
            class="aspect-video w-full rounded-lg relative"
            loading="lazy"
          `)}
        </div>
      `
    })
    return convertedHtml
  }, [html, pageImages])
  return { sections, html: articleHtml }
}

const Article = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const { pathname } = useLocation()
  const { data } = useSWR(filePath, markdown, { suspense: true })
  const { data: pageImages } = usePageImages()
  const { html, attributes } = data
  const { title, description, createdAt, modifiedAt, series } = attributes
  const { data: seriesArticles } = useArticles(series ? { data: { series } } : null)
  const { srcList, srcSet, dimensions } = useMainImage(attributes, pageImages)
  const { sections, html: __html } = useArticleHtml(html, pageImages)
  
  const shareData = {
    title,
    text: description,
    url: window.location.href
  }

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
          srcSet={srcSet}
          srcList={srcList}
          sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px'
          alt={title}
          className='aspect-video w-full rounded-lg'
          {...dimensions}
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
          className={`
            prose prose-lg max-w-none !bg-background !text-foreground dark:prose-invert
            [&_[data-table]]:overflow-x-auto
          `}
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