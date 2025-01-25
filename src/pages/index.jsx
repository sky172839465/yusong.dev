import { flow, keys } from 'lodash-es'
import { Link } from 'react-router-dom'

const links = flow(
  () => keys(import.meta.glob('./*/index.jsx')),
  (filteredPaths) => filteredPaths.map((path) => {
    return path.replace('index.jsx', '')
  }),
  (endpoints) => endpoints.map((endpoint) => {
    const path = endpoint.replace(/\.\/|\//g, '')
    return { url: `/${path}`, name: path }
  })
)()

const index = () => {
  return (
    <div
      className='hero h-full'
    >
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>
            Homepage
          </h1>
          <br />
          <p className='py-4 font-bold'>
            Links
          </p>
          <div className='mt-2 rounded-box bg-slate-200 p-2 dark:bg-slate-700'>
            <ul className='menu w-full space-y-2 rounded-md p-0'>
              {links.map((link) => {
                return (
                  <li
                    key={link.url}
                    className='rounded-md bg-slate-100 dark:bg-slate-800'
                  >
                    <Link
                      to={link.url}
                      viewTransition
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index