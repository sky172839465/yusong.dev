import { random, times } from 'lodash-es'
import { useLocation } from 'react-router-dom'

import { useSeries } from '@/apis/useSeries'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'

const RANDOM = {
  SERIES: times(6),
  SERIES_TITLE: random(1, 3),
  SERIES_DESC: random(1, 5)
}

const LABEL = {
  en: {
    NEW_SERIES: 'New series'
  },
  'zh-tw': {
    NEW_SERIES: '新系列文章'
  }
}

export default function SeriesSection() {
  const { pathname } = useLocation()
  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'zh-tw'
  const label = LABEL[lang]
  const { isLoading, data } = useSeries()

  return (
    <section id='series'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        {label.NEW_SERIES}
      </h2>
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
            />
          )
        })}
        {!isLoading && data.slice(0, 6).map((article) => {
          const { path } = article
          return (
            <SectionCard
              key={path}
              article={article}
            />
          )
        })}
      </div>
    </section>
  )
}

