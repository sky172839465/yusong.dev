import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import FadeIn from '@/components/FadeIn/index.jsx'
import Root from '@/components/Root/index.jsx'
import SkeletonHome from '@/components/SkeletonHome/index.jsx'

import ErrorElement from './ErrorElement.jsx'
import getRoutes from './getRoutes.js'
import loader from './index.loader'

const LazyArticle = lazy(() => import('@/components/Article/index.jsx'))
const LazySkeletonArticle = lazy(() => import('@/components/SkeletonArticle/index.jsx'))
const LazyMeta = lazy(() => import('@/components/Meta'))

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
      <Suspense
        fallback={(
          <SkeletonHome className='fixed top-0 z-0' />
        )}
      >
        <Layout>
            {isMarkdown && (
              <Suspense fallback={<LazySkeletonArticle />}>
                <FadeIn exit={{ opacity: 0 }}>
                <LazyArticle {...item} />
                </FadeIn>
              </Suspense>
            )}
            {!isMarkdown && (
              <FadeIn exit={{ opacity: 0 }}>
                <Comp />
                <LazyMeta fetchMetaData={meta} />
              </FadeIn>
            )}
        </Layout>
      </Suspense>
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
