import { get } from 'lodash-es'
import { lazy, useRef } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import toast, { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import { SWRConfig } from 'swr'

import fetcher from '../../utils/fetcher'
import CustomSwipe from '../CustomSwipe'
import { ThemeProvider } from '../ThemeProvider'

const LazyReloadPrompt = lazy(() => import('@/components/ReloadPrompt'))

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
    <ThemeProvider>
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
      <LazyReloadPrompt />
    </ThemeProvider>
  )
}

export default Root