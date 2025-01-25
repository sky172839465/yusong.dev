import { keys, last } from 'lodash-es'
import { Link } from 'react-router-dom'

const posts = import.meta.glob(['./**/*.md', '!./**/*.draft.md'])

const Posts = () => {
  return (
    <div
      className='hero h-full'
    >
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <p className='py-4 font-bold'>
            Links
          </p>
          <div className='mt-2 rounded-box bg-slate-200 p-2 dark:bg-slate-700'>
            <ul className='menu w-full space-y-2 rounded-md p-0'>
              {keys(posts).map((post) => {
                const postInfo = post.replace('./', '').replace('/index.md', '').split('/')
                const type = postInfo[0]
                const name = last(postInfo)
                return (
                  <li
                    key={name}
                    className='rounded-md bg-slate-100 dark:bg-slate-800'
                  >
                    <Link
                      to={`./${type}/${name}`}
                      viewTransition
                    >
                      {`[${type}] ${name}`}
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

export default Posts