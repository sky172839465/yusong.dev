import { delay } from 'lodash-es'
import { Download, MousePointerClick, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const SEC = 1000
const INTERVAL_MS = 10 * 60 * SEC

const i18nMapping = {
  [LANG.EN]: {
    UPDATE_AVAILABLE: 'Update Available',
    CLICK_TO_UPDATE: 'New content available, click to update.',
    DOWNING: 'Downloading',
    PLZ_WAIT_DOWNLOAD: 'Please waiting for new content downloaded.'
  },
  [LANG.ZH_TW]: {
    UPDATE_AVAILABLE: '發現可用更新',
    CLICK_TO_UPDATE: '網站有更新內容，點我更新網站的內容。',
    DOWNING: '下載中',
    PLZ_WAIT_DOWNLOAD: '更新內容中請稍等一下。'
  }
}

const useCheckUpdate = (registration, reloadIfUpdateExist) => {
  useSWR(
    registration || null,
    r => r.update().then(reloadIfUpdateExist),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: INTERVAL_MS
    }
  )
}

let tmpRegistration = null
const ReloadPrompt = () => {
  const { label } = useI18N(i18nMapping)
  const isMounted = useRef(false)
  const [registration, setRegistration] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) {
        return
      }

      tmpRegistration = r
      r.update().then(() => updateServiceWorker(true))
      if (!isMounted.current) {
        return
      }

      setRegistration(r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  const onClose = () => {
    setNeedRefresh(false)
  }

  const onUpdate = () => {
    if (!needRefresh) {
      return
    }

    setIsUpdating(true)
    updateServiceWorker(true)
    delay(() => window.location.reload(), SEC * 10)
  }

  useCheckUpdate(registration, onUpdate)

  useEffect(() => {
    isMounted.current = true
    setRegistration(tmpRegistration)
    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    needRefresh && (
      <div className='pwa:bottom-8 fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2'>
        <Alert
          className={`
            border-foreground bg-background/50 text-foreground flex
            items-center justify-between gap-2 rounded-xl border p-4 shadow-xl backdrop-blur-md
            ${needRefresh && 'cursor-pointer'}
          `}
        >
          {!isUpdating && (
            <>
              <div onClick={onUpdate}>
                <AlertTitle className='flex items-center gap-2'>
                  <MousePointerClick className='size-5' />
                  <span>
                    {label.UPDATE_AVAILABLE}
                  </span>
                </AlertTitle>
                <AlertDescription>
                  {label.CLICK_TO_UPDATE}
                </AlertDescription>
              </div>
              <div className='flex'>
                <Button size='icon' variant='ghost' onClick={onClose}>
                  <X className='size-4' />
                </Button>
              </div>
            </>
          )}
          {isUpdating && (
            <div>
              <AlertTitle className='flex items-center gap-2'>
                <Download className='size-5' />
                <span>
                  {label.DOWNING}
                </span>
              </AlertTitle>
              <AlertDescription>
                {label.PLZ_WAIT_DOWNLOAD.split(' ').map((word, index) => {
                  return (
                    <span
                      key={index}
                      className='animate-pulse font-medium'
                    >
                      {`${word} `}
                    </span>
                  )
                })}
              </AlertDescription>
            </div>
          )}
        </Alert>
      </div>
    )
  )
}

export default ReloadPrompt
