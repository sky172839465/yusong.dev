import { get } from 'lodash-es'
import { AnimatePresence, LazyMotion } from 'motion/react'
import { lazy, useRef } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import toast, { Toaster } from 'react-hot-toast'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { SWRConfig } from 'swr'

import CustomSwipe from '@/components/CustomSwipe'
import Footer from '@/layouts/Footer'
import Header from '@/layouts/Header'
import fetcher from '@/utils/fetcher'

const LazyReloadPrompt = lazy(() => import('@/components/ReloadPrompt'))
const loadFeatures = () => import('@/components/Root/motionFeatures.js').then(res => res.default)

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
    <div className='bg-background overscroll-y-contain flex min-h-dvh flex-col'>
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
          <LazyMotion
            features={loadFeatures}
            strict
          >
            <Header />
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
            <Footer />
          </LazyMotion>
        </HelmetProvider>
      </SWRConfig>
      <Toaster
        toastOptions={{
          className: 'bg-background/50! text-foreground! border-border! border! backdrop-blur-md!'
        }}
      />
      <CustomSwipe />
      <LazyReloadPrompt />
      <ScrollRestoration />
    </div>
  )
}

export default Root
