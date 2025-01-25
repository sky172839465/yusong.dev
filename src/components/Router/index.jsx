import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Root from '../Root/index.jsx'
import SkeletonHome from '../SkeletonHome/index.jsx'
import ErrorElement from './ErrorElement.jsx'
import loader from './index.loader'

const LazyMarkdown = lazy(() => import('../Markdown/index.jsx'))

const DefaultLayout = (props) => props.children

const withErrorElement = (routes) => routes.map((item) => {
  const {
    element: Comp,
    isMarkdown,
    layout: Layout = DefaultLayout,
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
            <LazyMarkdown {...item} />
          )}
          {!isMarkdown && (
            <Comp />
          )}
        </Layout>
      </Suspense>
    ),
    errorElement: <ErrorElement />
  }
})


const Router = (props) => {
  const { routes } = props
  const totalRoutes = [
    {
      element: <Root />,
      loader,
      errorElement: <ErrorElement />,
      children: [
        ...withErrorElement(routes),
        {
          path: '/test',
          element: SkeletonHome
        },
        {
          path: '*',
          element: <ErrorElement />
        }
      ]
    }
  ]
  console.log(totalRoutes)
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