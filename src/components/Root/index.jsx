import { get } from 'lodash-es'
import { useRef } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import toast, { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import { SWRConfig } from 'swr'

import fetcher from '../../utils/fetcher'
import CustomSwipe from '../CustomSwipe'

const Root = () => {
  const errorToastIdRef = useRef()
  const errorToastKeyRef = useRef()

  const onError = (error, key) => {
    errorToastIdRef.current = key
    console.log(error)
    errorToastKeyRef.current = toast.error(get(error, 'message', 'error'))
  }

  const onSuccess = (data, key) => {
    if (key !== errorToastKeyRef.current) {
      return
    }
    toast.dismiss(errorToastIdRef.current)
  }

  return (
    <div className='bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'>
      <SWRConfig
        value={{
          // https://swr.vercel.app/docs/api
          revalidateOnFocus: false,
          keepPreviousData: true,
          errorRetryCount: 3,
          suspense: false,
          fetcher,
          onError,
          onSuccess
        }}
      >
        <HelmetProvider>
          <Outlet />
        </HelmetProvider>
      </SWRConfig>
      <Toaster />
      <CustomSwipe />
    </div>
  )
}

export default Root