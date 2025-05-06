import { RouteOff } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useRouteError } from 'react-router-dom'

import { usePageExistCheck } from '@/apis/usePageExistCheck'
import SkeletonHome from '@/components/SkeletonHome'
import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const LazyMainLayout = lazy(() => import('@/layouts/Main'))

const i18nMapping = {
  [LANG.EN]: {
    TITLE: 'Error',
    WAH: 'Oops!',
    MESSAGE: 'Sorry, an unexpected error has occurred.',
    PAGE_NOT_FOUND: 'Page not found.',
    BACK_TO_HOME: 'Back to home'
  },
  [LANG.ZH_TW]: {
    TITLE: '錯誤',
    WAH: '啊⋯',
    MESSAGE: '不好意思，出現預期外的錯誤。',
    PAGE_NOT_FOUND: '頁面不存在。',
    BACK_TO_HOME: '返回首頁'
  }
}

const DEFAULT_TITLE = 'YUSONG.TW'

const ErrorElement = () => {
  const { label, isZhTw, lang } = useI18N(i18nMapping)
  const error = useRouteError() || {}
  const {
    statusText,
    message = label.PAGE_NOT_FOUND
  } = error
  const { isLoading, data: isPageExist } = usePageExistCheck(message === label.PAGE_NOT_FOUND)
  console.error(error)

  if (isLoading || isPageExist) {
    return (
      <SkeletonHome />
    )
  }

  return (
    <Suspense fallback={<SkeletonHome />}>
      <Helmet>
        <title>
          {`${label.TITLE} | ${DEFAULT_TITLE}`}
        </title>
      </Helmet>
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
    </Suspense>
  )
}

export default ErrorElement
