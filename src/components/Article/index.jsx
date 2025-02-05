import { filter, flow, isEmpty, map } from 'lodash-es'
import { lazy, useMemo,useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

import { useArticles } from '@/apis/useArticles'
import { usePageImages } from '@/apis/usePageImages'
import ArticleActions from '@/components/ArticleActions'
import LazyImage from '@/components/LazyImage'
import getRwdImageAttributes from '@/components/LazyImage/getRwdImageAttributes'
import { Button } from '@/components/ui/button'

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

const useMainImageData = (attributes = {}, pageImages = {}) => {
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
    return null
  }

  const imageData = pageImages[imagePathFromSrc.replace('/', '')]
  return imageData
}

const useArticleHtml = (html, pageImages) => {
  const sections = useMemo(() => getSections(html), [html])
  const articleHtml = useMemo(() => {
    if (!pageImages) {
      return html.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/g, '')
    }

    const convertedHtml = html.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/g, (element, relativeFileUrl) => {
      const pageImageData = pageImages[relativeFileUrl.replace('/', '')]
      const { src, srcSet, width, height } = getRwdImageAttributes(pageImageData)
      return `
        <div
          class="relative w-full block"
          width="${width}"
          height="${height}"
        >
          <div
            class="absolute h-full w-full block rounded-lg animate-pulse bg-foreground/10 [&[data-visible='false']]:hidden"
            data-visible="true"
          ></div>
          ${element.replace(`src="${relativeFileUrl}"`, `        
            src="${src}"
            srcset="${srcSet}"
            width="${width}"
            height="${height}"
            data-loaded="false"
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px'
            onload="this.setAttribute('data-loaded', 'true'); this.previousElementSibling.setAttribute('data-visible', 'false');"
            class="w-full rounded-lg relative [&[data-loaded='false']]:invisible"
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
  const { isLoading, data: pageImages } = usePageImages()
  const { html, attributes } = data
  const { title, description, createdAt, modifiedAt, series } = attributes
  const { data: seriesArticles } = useArticles(series ? { data: { series } } : null)
  const mainImageData = useMainImageData(attributes, pageImages)
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
          key={pathname}
          imageData={mainImageData}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px'
          alt={title}
          className={`aspect-video w-full rounded-lg ${isEmpty(mainImageData) && 'my-8'}`}
          isLoading={isLoading}
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
          className='prose prose-lg max-w-none !bg-background !text-foreground dark:prose-invert'
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
