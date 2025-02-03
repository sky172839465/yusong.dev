import { Download,MousePointerClick, X } from 'lucide-react'
import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Alert, AlertDescription,AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const INTERVAL_MS = 10 * 60 * 1000

const ReloadPrompt = () => {
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) {
        return
      }

      r.update()
      setInterval(() => r.update(), INTERVAL_MS)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  const onClose = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  const opUpdate = () => {
    if (!needRefresh) {
      return
    }

    setIsUpdating(true)
    updateServiceWorker(true)
  }

  return (
    (offlineReady || needRefresh) && (
      <div className='fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2'>
        <Alert className='flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-foreground bg-background/50 p-4 text-foreground shadow-xl backdrop-blur-md'>
          {!isUpdating && (
            <>
              <div
                onClick={opUpdate}
              >
                <AlertTitle className='flex items-center gap-2'>
                  {!offlineReady && (
                    <MousePointerClick className='size-5' />
                  )}
                  <span>
                    {offlineReady ? 'Offline Ready' : 'Update Available'}
                  </span>
                </AlertTitle>
                <AlertDescription>
                  {offlineReady
                    ? 'App is ready to work offline.'
                    : 'New content available, click to update.'}
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
                {!offlineReady && (
                  <Download className='size-5' />
                )}
                <span>
                  Downloading
                </span>
              </AlertTitle>
              <AlertDescription>
                {'Please waiting for new content downloaded.'.split(' ').map((word, index) => {
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
