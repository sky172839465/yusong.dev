import { FaRoadCircleXmark } from 'react-icons/fa6'
import { Link, useRouteError } from 'react-router-dom'

const ErrorElement = () => {
  const error = useRouteError() || {}
  const {
    statusText,
    message = 'page not found'
  } = error
  console.error(error)

  return (
    <div className='hero h-dvh w-full'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>
            <FaRoadCircleXmark
              size='2em'
              className='mx-auto'
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
              <button
                type='button'
                className='btn btn-primary'
              >
                Back to home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorElement