import { motion } from 'motion/react'
import { sleep } from 'radash'
import { lazy, Suspense, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useLocation
} from 'react-router-dom'

import SkeletonHome from '@/components/SkeletonHome/index.jsx'
import { usePageLoading } from '@/stores/pageLoading.js'
import { useRootLoading } from '@/stores/rootLoading.js'

import ErrorElement from './ErrorElement.jsx'
import getRoutes, { loaderHandler } from './getRoutes.js'

const LazyArticle = lazy(() => import('@/components/Article/index.jsx'))
const LazyRoot = lazy(() => import('@/components/Root/index.jsx'))
const LazySkeletonArticle = lazy(() => import('@/components/SkeletonArticle/index.jsx'))
const LazyMeta = lazy(() => import('@/components/Meta'))

const ChildMounted = () => {
  const { loading: rootLoading, setLoading: setRootLoading } = useRootLoading()
  const { loading: pageLoading, setLoading: setPageLoading } = usePageLoading()
  useEffect(() => {
    const resetPageLoading = async () => {
      if (rootLoading) {
        setPageLoading(false)
        await sleep(150)
        setRootLoading(false)
        return
      }

      if (!pageLoading) {
        return
      }

      await sleep(150)
      setPageLoading(false)
    }

    resetPageLoading()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

const DefaultLayout = (props) => {
  return props.children
}

const ChildRouteMounted = () => {
  const { pathname } = useLocation()
  return (
    <ChildMounted key={pathname} />
  )
}

const getChildRoutes = (routes) => routes.map((item) => {
  const {
    layout: Layout = DefaultLayout,
    element: Comp,
    isMarkdown,
    meta,
    ...route
  } = item
  return {
    ...route,
    element: (
      <Suspense fallback={null}>
        <Layout>
          {isMarkdown && (
            <Suspense fallback={<LazySkeletonArticle />}>
              <LazyArticle {...route} />
              <ChildRouteMounted />
            </Suspense>
          )}
          {!isMarkdown && (
            <>
              <Comp />
              <LazyMeta fetchMetaData={meta} />
              <ChildRouteMounted />
            </>
          )}
        </Layout>
      </Suspense>
    ),
    errorElement: <ErrorElement />
  }
})

const FadeInRouterContent = (props) => {
  const { children } = props
  const { loading: rootLoading } = useRootLoading()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: rootLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

const routes = getRoutes()

const Router = () => {
  const totalRoutes = [
    {
      element: (
        <Suspense fallback={null}>
          <LazyRoot />
        </Suspense>
      ),
      loader: loaderHandler(),
      errorElement: (
        <>
          <ErrorElement />
          <ChildRouteMounted />
        </>
      ),
      children: [
        ...getChildRoutes(routes),
        {
          path: '/test',
          element: (
            <>
              <SkeletonHome />
              <ChildRouteMounted />
            </>
          )
        },
        {
          path: '*',
          element: (
            <>
              <ErrorElement />
              <ChildRouteMounted />
            </>
          )
        }
      ]
    }
  ]

  const router = createBrowserRouter(totalRoutes)
  return (
    <FadeInRouterContent>
      <RouterProvider
        router={router}
      />
    </FadeInRouterContent>
  )
}

export default Router
