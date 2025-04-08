import parse from 'html-react-parser'
import { get, isEmpty } from 'lodash-es'
import { Check, Copy, FilePlus2, Link as LinkIcon, Pencil, PencilLine } from 'lucide-react'
import { tryit } from 'radash'
import { lazy, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { useCopyToClipboard, useCounter } from 'usehooks-ts'

import { usePageImages } from '@/apis/usePageImages'
import ArticleActions from '@/components/ArticleActions'
import LazyImage from '@/components/LazyImage'
import LazyImagePreview from '@/components/LazyImage/Dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePageLoading } from '@/contexts/pageLoading'
import useI18N, { LANG } from '@/hooks/useI18N'

import FadeIn from '../FadeIn'
import SkeletonArticle from '../SkeletonArticle'

const LazyComment = lazy(() => import('@/components/Comments'))

const i18nMapping = {
  [LANG.EN]: {
    COPY: 'Copy',
    COPIED: 'Copied!',
    COPY_ERROR: 'Error.'
  },
  [LANG.ZH_TW]: {
    COPY: '複製',
    COPIED: '已複製！',
    COPY_ERROR: '錯誤'
  }
}

const useMainImageData = (mainImageName = 'index') => {
  const { isLoading, data: pageImages } = usePageImages()
  const { mainPathName } = useI18N(i18nMapping)
  const imageData = useMemo(() => {
    if (isLoading || isEmpty(pageImages)) {
      return null
    }

    const imagePathFromSrc = `/src/pages${(mainPathName.endsWith('/') ? mainPathName : `${mainPathName}/`)}images/${mainImageName}`
    const mainImageUrl = imagePathFromSrc.replace('/', '')
    const mainImageData = pageImages[`${mainImageUrl}.jpg`] || pageImages[`${mainImageUrl}.png`]
    return mainImageData
  }, [isLoading, mainPathName, mainImageName, pageImages])
  return imageData
}

const useArticleHtml = (html) => {
  const { pathname, mainPathName } = useI18N()
  const { isLoading, data: pageImages = {} } = usePageImages()
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  const [articleHtml, articleSections] = useMemo(() => {
    const tempSections = []

    const onCopy = (code) => async () => {
      const [error] = await tryit(() => copy(code))()
      setCopied(true)
      if (error) {
        setCopied(false)
        return
      }
  
      setTimeout(() => setCopied(false), 1200)
    }

    const convertedHtml = parse(html, {
      replace: (domNode) => {
        const dataComponent = get(domNode, 'attribs["data-component"]')
        if (domNode.type === 'tag' && domNode.name === 'button' && dataComponent === 'copy-to-clipboard') {
          const code = get(domNode, 'attribs.data-code', '')
          return (
            <Button
              variant='outline'
              size='icon'
              className='absolute right-2 top-2 rounded-md border bg-background p-2 text-foreground [&[disabled]]:pointer-events-none [&[disabled]]:opacity-50'
              onClick={onCopy(code)}
              disabled={copied}
            >
              <FadeIn>
                {!copied && <Copy />}
                {copied && <Check />}
              </FadeIn>
            </Button>
          )
        }

        if (domNode.type === 'tag' && domNode.name === 'img') {
          const { src, alt } = domNode.attribs
          const pageImageData = pageImages[src.replace(pathname, mainPathName).replace('/', '')]
          return (
            <LazyImagePreview
              imageData={pageImageData}
              alt={alt}
              className='w-full rounded-lg object-contain'
            >
              <LazyImage
                imageData={pageImageData}
                alt={alt}
                className='w-full rounded-lg object-contain transition md:hover:scale-105'
                isLoading={isLoading}
                fetchpriority='high'
                sizes='(max-width: 640px) calc(100vw-2rem), (max-width: 768px) 608px, 736px'
              />
            </LazyImagePreview>
          )
        }

        if (domNode.type === 'tag' && domNode.name === 'a' && domNode.attribs.href.startsWith('/')) {
          const text = domNode.children.map((child) => child.type === 'text' ? child.data : '').join('')
          return (
            <Link
              to={domNode.attribs.href}
              viewTransition
            >
              {text}
            </Link>
          )
        }

        if (domNode.type === 'tag' && domNode.name === 'a' && domNode.attribs.href.startsWith('#')) {
          const text = domNode.children.map((child) => child.type === 'text' ? child.data : '').join('')
          tempSections.push({ hash: domNode.attribs.href, label: text })
          const hashValue = domNode.attribs.href.replace('#', '')
          return (
            <a
              id={hashValue}
              href={domNode.attribs.href}
              onClick={(e) => {
                e.preventDefault()
                const header = document.querySelector('header')            
                const offset = (header ? get(header.getBoundingClientRect(), 'height', 70) : 70) + 30
                const top = e.target.getBoundingClientRect().top + window.scrollY - offset
                history.replaceState(null, '', domNode.attribs.href)
                window.scrollTo({ top, behavior: 'smooth' })
              }}
              className='flex items-center gap-2'
            >
              <LinkIcon />
              {text}
            </a>
          )
        }
      }
    })
    return [convertedHtml, tempSections]
  }, [html, pageImages, isLoading, pathname, mainPathName, copied, copy])
  return { sections: articleSections, articleHtml }
}

const DEFAULT_TITLE = 'YUSONG.TW'

const Article = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const { pathname } = useLocation()
  const { isZhTw, lang } = useI18N()
  const {
    data: { html = '', attributes = {} } = {},
    isValidating: isMarkdownLoading
  } = useSWR(filePath, markdown)
  const { loading: isPageLoading } = usePageLoading()
  const { isLoading } = usePageImages()
  const { title, description, createdAt, modifiedAt, tags, mainImage } = attributes
  const mainImageData = useMainImageData(mainImage)
  const { sections, articleHtml } = useArticleHtml(html)
  const { count, increment } = useCounter(0)
  const displayTitle = `${title}${title === DEFAULT_TITLE ? '' : ` | ${DEFAULT_TITLE}`}`
  
  const shareData = {
    title: displayTitle,
    url: window.location.href
  }

  if (isMarkdownLoading || isEmpty(articleHtml)) {
    return (
      <div className='w-full'>
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
      </div>
    )
  }

  return (
    <div className='w-full'>
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
        <h2
          ref={topRef}
          className='!mb-4 select-text text-4xl font-bold text-gray-900 dark:text-white'
          onClick={increment}
        >
          {title}
        </h2>
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
                <Link
                  key={index}
                  to={`/${isZhTw ? '' : `${lang}/`}search?tags=${tag}`}
                  viewTransition
                >
                  <Badge variant='secondary' className='h-9'>
                    {tag}
                  </Badge>
                </Link>
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
        >
          <LazyImage
            key={pathname}
            imageData={mainImageData}
            alt={title}
            className={`w-full rounded-lg object-contain transition md:object-cover md:hover:scale-105 ${isEmpty(mainImageData) ? 'my-8' : ''}`}
            isLoading={isLoading}
            fetchpriority='high'
            loading='eager'
            sizes='(max-width: 640px) calc(100vw-2rem), (max-width: 768px) 608px, 736px'
            style={{ viewTransitionName: isPageLoading ? '' : 'test' }}
          />
        </LazyImagePreview>
        <div
          key={pathname}
          ref={articleRef}
          className='max-w-none !bg-background !text-foreground [&_*]:select-text'
        >
          {articleHtml}
        </div>
        <ArticleActions
          topRef={topRef}
          shareData={shareData}
          sections={sections}
        />
        <LazyComment />
      </div>
    </div>
  )
}

export default Article
