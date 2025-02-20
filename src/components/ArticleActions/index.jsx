import { useIsSupported } from '@react-hooks-library/core'
import { get, isEmpty, map, orderBy } from 'lodash-es'
import { ArrowUpToLine, BookText, Hash, List, Share, SquareLibrary } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useI18N, { LANG } from '@/hooks/useI18N'

const i18nMapping = {
  [LANG.EN]: {
    SERIES_TITLE: 'Series',
    SERIES_PREFIX: 'Series: ',
    PHASE: 'Phase',
    SHARE: 'Share',
    TO_TOP: 'To top'
  },
  [LANG.ZH_TW]: {
    SERIES_TITLE: '系列',
    SERIES_PREFIX: '系列：',
    PHASE: '段落',
    SHARE: '分享',
    TO_TOP: '置頂'
  }
}

const ArticleActions = (props) => {
  const { shareData, topRef, sections = [], series = [] } = props
  const isShareSupported = useIsSupported(() => !!navigator?.share)
  const { pathname } = useLocation()
  const { label } = useI18N(i18nMapping)
  const { seriesName, sortedSeries } = useMemo(() => {
    return {
      seriesName: get(series, '0.data.series'),
      sortedSeries: orderBy(series, 'data.index', 'asc')
    }
  }, [series])
  const seriesPathname = useMemo(() => {
    const convertedPathName = pathname.endsWith('/') ? pathname : `${pathname}/`
    return convertedPathName.split('/').slice(0, -2).join('/')
  }, [pathname])

  const scrollToSection = (e) => {
    const target = document.querySelector(`a[href="${e.target.dataset.hash}"]`)
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sharePost = () => {
    navigator && navigator.share(shareData)
  }

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className='sticky bottom-10 left-0 flex w-full justify-center transition-all'>
      <div
        className={`
          inline-flex
          [&_button:first-child]:rounded-l-lg
          [&_button:last-child]:rounded-r-lg
          [&_button:not(:last-child)]:border-r-background
          [&_button]:rounded-none
        `}
      >
        {!isEmpty(series) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <SquareLibrary className='size-[1.2rem]' />
                {label.SERIES_TITLE}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  to={seriesPathname}
                  viewTransition
                >
                  {label.SERIES_PREFIX}
                  {seriesName}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {map(sortedSeries, (article, index) => {
                const {
                  path,
                  data: {
                    title
                  } = {}
                } = article
                return (
                  <DropdownMenuItem
                    key={index}
                    disabled={pathname === path}
                    asChild
                  >
                    <Link to={path} viewTransition>
                      <BookText className='size-[1.2rem]' />
                      {title}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isEmpty(sections) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <List className='size-[1.2rem]' />
                {label.PHASE}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {map(sections, (section, index) => {
                return (
                  <DropdownMenuItem key={index} asChild>
                    <a
                      data-hash={section.hash}
                      onClick={scrollToSection}
                    >
                      <Hash className='size-[1.2rem]' />
                      {section.label}
                    </a>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isShareSupported && (
          <Button variant='outline' onClick={sharePost} disabled={!isShareSupported}>
            <Share className='size-[1.2rem]' />
            {label.SHARE}
          </Button>
        )}
        <Button variant='outline' onClick={scrollToTop}>
          <ArrowUpToLine className='size-[1.2rem]' />
          {label.TO_TOP}
        </Button>
      </div>
    </div>
  )
}

export default ArticleActions
