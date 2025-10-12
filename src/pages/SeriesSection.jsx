import { random, times } from 'lodash-es'
import { Link } from 'react-router-dom'

import { useSeries } from '@/apis/useSeries'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'
import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const RANDOM = {
  SERIES: times(6),
  SERIES_TITLE: random(1, 3),
  SERIES_DESC: random(1, 5)
}

const i18nMapping = {
  [LANG.EN]: {
    NEW_SERIES: 'New series',
    MORE: 'more...'
  },
  [LANG.ZH_TW]: {
    NEW_SERIES: '新系列文章',
    MORE: '看更多'
  }
}

export default function SeriesSection() {
  const { label, lang, isZhTw } = useI18N(i18nMapping)
  const { isLoading, data } = useSeries({ type: 'website', lang }, { keepPreviousData: false })

  return (
    <section id='series'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-foreground text-3xl font-bold'>
          {label.NEW_SERIES}
        </h2>
        <Link
          to={`/${isZhTw ? '' : `${lang}/`}search?type=series`}
          viewTransition
        >
          <Button type='button'>
            {label.MORE}
          </Button>
        </Link>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && RANDOM.SERIES.map((index) => {
          const data = {
            title: 'skeleton title'.repeat(RANDOM.SERIES_TITLE),
            description: 'skeleton description'.repeat(RANDOM.SERIES_DESC)
          }
          return (
            <SkeletonSectionCard
              key={index}
              article={{ data }}
              isArticle={false}
            />
          )
        })}
        {!isLoading && data.slice(0, 6).map((article) => {
          const { path } = article
          return (
            <SectionCard
              key={path}
              article={article}
              isArticle={false}
            />
          )
        })}
      </div>
    </section>
  )
}

