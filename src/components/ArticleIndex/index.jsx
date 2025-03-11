import { get, orderBy, size } from 'lodash-es'
import { ArrowRight, CalendarDays, SquareLibrary } from 'lucide-react'
import { useState } from 'react'

import { useSeriesArticles } from '@/apis/useSeriesArticles'
import FadeIn from '@/components/FadeIn'
import SectionCard from '@/components/SectionCard'
import SkeletonArticleIndex from '@/components/SkeletonArticleIndex'
import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const TOTAL_REPLCAMENT = '__TOTAL__'
const i18nMapping = {
  [LANG.EN]: {
    SORTING: 'Sorting ',
    OLD: 'Old',
    NEW: 'New',
    TOTAL: `${TOTAL_REPLCAMENT} articles`
  },
  [LANG.ZH_TW]: {
    SORTING: '排序 ',
    OLD: '舊',
    NEW: '新',
    TOTAL: `共 ${TOTAL_REPLCAMENT} 篇`
  }
}

const ArticleIndex = (props) => {
  const { children } = props
  const { label } = useI18N(i18nMapping)
  const { isLoading, data: articles = [] } = useSeriesArticles()
  const [sorting, setSorting] = useState(true)
  const order = sorting ? 'desc' : 'asc'

  if (isLoading) {
    return <SkeletonArticleIndex label={label} />
  }

  return (
    <div className='m-auto w-full space-y-2 md:max-w-2xl lg:max-w-3xl'>
      <div className='prose prose-lg max-w-none text-foreground dark:prose-invert'>
        <h3 className='flex items-center gap-2'>
          <SquareLibrary />
          {get(articles, '0.series', null)}
        </h3>
        {children}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <Button
            variant='secondary'
            onClick={() => setSorting(!sorting)}
          >
            <CalendarDays />
            {sorting && (
              <FadeIn className='flex items-center gap-1'>   
                {label.NEW}
                <ArrowRight />
                {label.OLD}
              </FadeIn>
            )}
            {!sorting && (
              <FadeIn className='flex items-center gap-1'>
                {label.OLD}
                <ArrowRight />
                {label.NEW}
              </FadeIn>
            )}
          </Button>
          <Button
            variant='secondary'
          >
            {label.TOTAL.replace(TOTAL_REPLCAMENT, size(articles))}
          </Button>
        </div>
        {orderBy(articles, 'data.index', order).map((article, index) => {
          return (
            <SectionCard
              key={index}
              article={article}
              isArticle
            />
          )
        })}
      </div>
    </div>
  )
}

export default ArticleIndex
