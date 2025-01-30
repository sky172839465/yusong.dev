import 'github-markdown-css/github-markdown.css'

import { flow, map } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import useSWR from 'swr'

import BottomActions from '../BottomActions'
import Dropdown from '../BottomActions/Dropdown'
import ScrollToTop from '../BottomActions/ScrollToTop'
import Shared from '../BottomActions/Share'

const Markdown = (props) => {
  const { filePath, markdown } = props
  const articleRef = useRef()
  const topRef = useRef()
  const [sections, setSections] = useState([])
  const { data } = useSWR(filePath, markdown, { suspense: true })
  const { html: __html, attributes } = data
  const { title, description } = attributes
  const shareData = {
    title,
    text: description,
    url: window.location.href
  }
  // console.log(props, attributes)

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
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@sky172839465' />
        <meta name='twitter:creator' content='@sky172839465' />
      </Helmet>
      <div className='space-y-2'>
        <div className='flex flex-row items-center justify-between'>
          <h2 ref={topRef} className='text-xl'>
            {title}
          </h2>
          <div>
            <a
              href={`https://github.com/sky172839465/vite-spa-starter/blob/main/src/${filePath.replace('./', '')}`}
              target='_blank'
              className='btn btn-primary'
            >
              Edit this page on GitHub
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <article ref={articleRef} className='markdown-body !bg-background !text-foreground [&_a[href^="#"]]:text-inherit'>
          <div
            dangerouslySetInnerHTML={{ __html }}
          />
        </article>
      </div>
      <BottomActions>
        <Dropdown
          title='章節'
          sections={sections}
        />
        <Shared shareData={shareData} />
        <ScrollToTop topRef={topRef} />
      </BottomActions>
    </>
  )
}

export default Markdown