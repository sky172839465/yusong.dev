import { MousePointerClick, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Alert, AlertDescription,AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
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
