import { Download,MousePointerClick, X } from 'lucide-react'
import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Alert, AlertDescription,AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const INTERVAL_MS = 10 * 60 * 1000

const ReloadPrompt = () => {
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) {
        return
      }

      // on page load check new sw, if exist trigger upload & refresh flow
      r.update().then(() => updateServiceWorker(true))
      setInterval(() => r.update(), INTERVAL_MS)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  const onClose = () => {
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
    needRefresh && (
      <div className='fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 standalone:bottom-8'>
        <Alert
          className={`
            flex items-center justify-between gap-2
            rounded-xl border border-foreground bg-background/50 p-4 text-foreground shadow-xl backdrop-blur-md
            ${needRefresh && 'cursor-pointer'}
          `}
        >
          {!isUpdating && (
            <>
              <div onClick={opUpdate}>
                <AlertTitle className='flex items-center gap-2'>
                  <MousePointerClick className='size-5' />
                  <span>
                    Update Available
                  </span>
                </AlertTitle>
                <AlertDescription>
                  New content available, click to update.
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
