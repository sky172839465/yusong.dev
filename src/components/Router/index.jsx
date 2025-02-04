import * as m from 'motion/react-m'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Root from '@/components/Root/index.jsx'
import SkeletonHome from '@/components/SkeletonHome/index.jsx'

import ErrorElement from './ErrorElement.jsx'
import getRoutes from './getRoutes.js'
import loader from './index.loader'

const LazyArticle = lazy(() => import('@/components/Article/index.jsx'))
const LazyMeta = lazy(() => import('@/components/Meta'))
const LazyAnimatePresence = lazy(() => import('./AnimatePresence.jsx'))

const DefaultLayout = (props) => props.children

const withErrorElement = (routes) => routes.map((item) => {
  const {
    element: Comp,
    isMarkdown,
    layout: Layout = DefaultLayout,
    meta,
    ...route
  } = item
  return {
    ...route,
    element: (
      <LazyAnimatePresence>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense
            fallback={(
              <SkeletonHome className='fixed top-0 z-0' />
            )}
          >
            <Layout>
              {isMarkdown && (
                <LazyArticle {...item} />
              )}
              {!isMarkdown && (
                <>
                  <Comp />
                  <LazyMeta fetchMetaData={meta} />
                </>
              )}
            </Layout>
          </Suspense>
        </m.div>
      </LazyAnimatePresence>
    ),
    errorElement: <ErrorElement />
  }
})

const routes = getRoutes()

const Router = () => {
  const totalRoutes = [
    {
      element: <Root />,
      loader,
      errorElement: <ErrorElement />,
      children: [
        ...withErrorElement(routes),
        {
          path: '/test',
          element: <SkeletonHome />
        },
        {
          path: '*',
          element: <ErrorElement />
        }
      ]
    }
  ]

  const router = createBrowserRouter(totalRoutes)
  return (
    <RouterProvider
      router={router}
      fallbackElement={(
        <SkeletonHome className='fixed top-0 z-0' />
      )}
    />
  )
}

export default Router