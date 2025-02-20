import { RouteOff } from 'lucide-react'
import { lazy } from 'react'
import { Link, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const LazyMainLayout = lazy(() => import('@/layouts/Main'))

const i18nMapping = {
  [LANG.EN]: {
    WAH: 'Oops!',
    MESSAGE: 'Sorry, an unexpected error has occurred.',
    PAGE_NOT_FOUND: 'Page not found.',
    BACK_TO_HOME: 'Back to home'
  },
  [LANG.ZH_TW]: {
    WAH: '啊⋯',
    MESSAGE: '不好意思，出現預期外的錯誤。',
    PAGE_NOT_FOUND: '頁面不存在。',
    BACK_TO_HOME: '返回首頁'
  }
}

const ErrorElement = () => {
  const { label, isZhTw, lang } = useI18N(i18nMapping)
  const error = useRouteError() || {}
  const {
    statusText,
    message = label.PAGE_NOT_FOUND
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
            {label.WAH}
          </h1>
          <p className='py-3'>
            {label.MESSAGE}
          </p>
          <p className='py-3'>
            {statusText || message}
          </p>
          <div className='mt-4'>
            <Link
              to={isZhTw ? '/' : `/${lang}`}
              viewTransition
            >
              <Button>
                {label.BACK_TO_HOME}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LazyMainLayout>
  )
}

export default ErrorElement
