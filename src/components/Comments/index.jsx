import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useTheme from '@/hooks/useTheme'

import FadeIn from '../FadeIn'

const COMMENTS_VISIBLE_KEY = 'COMMENTS_VISIBLE_KEY'

const LazyGiscus = lazy(() => import('@giscus/react'))

const GiscusSkeleton = () => {
  return (
    <Skeleton className='h-[30dvh] w-full' />
  )
}

const LABEL = {
  en: {
    HIDE_COMMENTS: 'Hide comments',
    SHOW_COMMENTS: 'Show comments'
  },
  'zh-tw': {
    HIDE_COMMENTS: '隱藏留言',
    SHOW_COMMENTS: '顯示留言'
  }
}

const Comments = () => {
  const { isDarkMode } = useTheme()
  const [visible, setVisible] = useLocalStorage(COMMENTS_VISIBLE_KEY, false)
  const toggleVisible = () => setVisible(!visible)
  const { pathname } = useLocation()
  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'zh-tw'
  const label = LABEL[lang]

  return (
    <>
      <Button className='my-4 p-6' variant='outline' onClick={toggleVisible}>
        {visible && (
          <>
            <ChevronsDownUp className='size-4' />
            {label.HIDE_COMMENTS}
          </>
        )}
        {!visible && (
          <>
            <ChevronsUpDown className='size-4' />
            {label.SHOW_COMMENTS}
          </>
        )}
        
      </Button>
      {visible && (
        <Suspense fallback={<GiscusSkeleton />}>
          <FadeIn>
            <LazyGiscus
              id='comments'
              repo='sky172839465/yusong.tw'
              repoId='R_kgDONva8Tw'
              category='Announcements'
              categoryId='DIC_kwDONva8T84Cmdvk'
              mapping='pathname'
              reactionsEnabled='1'
              emitMetadata='0'
              inputPosition='top'
              theme={isDarkMode ? 'dark' : 'light'}
              lang={isEN ? 'en' : 'zh-TW'}
              loading='lazy'
            />
          </FadeIn>
        </Suspense>
      )}
    </>
  )
}

export default Comments
