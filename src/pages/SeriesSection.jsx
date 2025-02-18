import { random, times } from 'lodash-es'

import { useSeries } from '@/apis/useSeries'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'

const RANDOM = {
  SERIES: times(6),
  SERIES_TITLE: random(1, 3),
  SERIES_DESC: random(1, 5)
}

export default function SeriesSection() {
  const { isLoading, data } = useSeries()

  return (
    <section id='series'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        新系列文章
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && RANDOM.SERIES.map((index) => {
          return (
            <SkeletonSectionCard
              key={index}
              title={'skeleton title'.repeat(RANDOM.SERIES_TITLE)}
              description={'skeleton description'.repeat(RANDOM.SERIES_DESC)}
            />
          )
        })}
        {!isLoading && data.slice(0, 6).map(({ data = {}, path }) => {
          const { title, description } = data
          return (
            <SectionCard
              key={path}
              path={path}
              title={title}
              description={description}
            />
          )
        })}
      </div>
    </section>
  )
}

