import { size } from 'lodash-es'
import { Link, useLocation } from 'react-router-dom'

const MainLayout = (props) => {
  const { children } = props
  const { pathname } = useLocation()
  const splitPaths = pathname.replace('/', '').split('/')
  const isBreadcrumbsVisible = size(splitPaths) > 1

  return (
    <div className='flex h-dvh flex-col'>
      <div className='navbar sticky top-0 bg-slate-200 shadow-sm shadow-slate-300 dark:bg-slate-900 dark:shadow-black'>
        <Link
          className='btn btn-ghost text-xl'
          to='/'
          viewTransition
        >
          Home
        </Link>
      </div>
      <div className='h-full w-dvw grow overflow-y-auto overflow-x-hidden p-4'>
        <div
          className={`
            breadcrumbs max-w-[calc(100dvw-2rem)] py-2 text-sm ${isBreadcrumbsVisible ? '' : 'hidden'}
          `}
        >
          <ul>
            {splitPaths.map((splitPath, index) => {
              return (
                <li key={index}>
                  <Link
                    to={`/${splitPaths.slice(0, index + 1).join('/')}`}
                    viewTransition
                  >
                    {splitPath}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        {children}
      </div>
    </div>
  )
}

export default MainLayout
