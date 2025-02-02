import { MousePointerClick, X } from 'lucide-react'
import { pwaInfo } from 'virtual:pwa-info'
import { useRegisterSW } from 'virtual:pwa-register/react'

console.log(pwaInfo)

import { Alert, AlertDescription,AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const INTERVAL_MS = 30 * 60 * 1000

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) {
        return
      }

      setInterval(() => {
        console.log('Checking for sw update')
        r.update()
      }, INTERVAL_MS)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    (offlineReady || needRefresh) && (
      <div className='fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2'>
        <Alert className='flex items-center justify-between gap-2 rounded-xl border border-foreground bg-background/50 p-4 text-foreground shadow-xl backdrop-blur-md'>
          <div
            onClick={() => needRefresh && updateServiceWorker(true)}
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
            <Button size='icon' variant='ghost' onClick={close}>
              <X className='size-4' />
            </Button>
          </div>
        </Alert>
      </div>
    )
  )
}

export default ReloadPrompt
