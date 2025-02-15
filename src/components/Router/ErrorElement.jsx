import { RouteOff } from 'lucide-react'
import { lazy } from 'react'
import { Link, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const LazyMainLayout = lazy(() => import('@/layouts/Main'))

const ErrorElement = () => {
  const error = useRouteError() || {}
  const {
    statusText,
    message = 'page not found'
  } = error
  console.error(error)

  return (
    <LazyMainLayout isFullScreen>
      <div className='flex w-full justify-center text-center text-foreground'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>
            <RouteOff
              className='mx-auto size-12'
            />
            Oops!
          </h1>
          <p className='py-3'>
            Sorry, an unexpected error has occurred.
          </p>
          <p className='py-3'>
            {statusText || message}
          </p>
          <div className='mt-4'>
            <Link
              to='../'
              viewTransition
            >
              <Button>
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LazyMainLayout>
  )
}

export default ErrorElement