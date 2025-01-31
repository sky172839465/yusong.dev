import { Link } from 'react-router-dom'

import { useSeries } from '@/apis/useSeries'

export default function SeriesSection() {
  const { isLoading, data } = useSeries()

  return (
    <section id='series' className='my-12'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Latest Series
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && (
          <p>
            loading
          </p>
        )}
        {!isLoading && data.map(({ data = {}, path }) => {
          const { title, description } = data
          return (
            <div key={path} className='overflow-hidden rounded-lg bg-card text-card-foreground shadow-md'>
              <div className='p-6'>
                <h3 className='mb-2 text-lg font-semibold'>
                  {title}
                </h3>
                <p className='mb-4 text-muted-foreground'>
                  {description}
                </p>
                <Link
                  to={path}
                  className='text-primary hover:underline'
                  viewTransition
                >
                  Read more
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

