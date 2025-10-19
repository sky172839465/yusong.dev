import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocalStorage } from 'usehooks-ts'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useI18N, { LANG } from '@/hooks/useI18N'
import { useTheme } from '@/stores/theme'

import FadeIn from '../FadeIn'

const COMMENTS_VISIBLE_KEY = 'COMMENTS_VISIBLE_KEY'

const LazyGiscus = lazy(() => import('@giscus/react'))

const GiscusSkeleton = () => {
  return (
    <Skeleton className='block h-[30dvh] w-full' />
  )
}

const i18nMapping = {
  [LANG.EN]: {
    HIDE_COMMENTS: 'Hide comments',
    SHOW_COMMENTS: 'Show comments'
  },
  [LANG.ZH_TW]: {
    HIDE_COMMENTS: '隱藏留言',
    SHOW_COMMENTS: '顯示留言'
  }
}

const Comments = () => {
  const { isDarkMode } = useTheme()
  const [visible, setVisible] = useLocalStorage(COMMENTS_VISIBLE_KEY, true)
  const toggleVisible = () => setVisible(!visible)
  const { label, lang } = useI18N(i18nMapping)

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
      <AnimatePresence>
      {visible && (
        <Suspense fallback={<GiscusSkeleton />}>
          <FadeIn className='**:select-text'>
            <LazyGiscus
              id='comments'
              repo='sky172839465/yusong.dev'
              repoId='R_kgDONva8Tw'
              category='Announcements'
              categoryId='DIC_kwDONva8T84Cmdvk'
              mapping='pathname'
              reactionsEnabled='1'
              emitMetadata='0'
              inputPosition='top'
              theme={isDarkMode ? 'dark' : 'light'}
              lang={lang}
            />
          </FadeIn>
        </Suspense>
      )}
      </AnimatePresence>
    </>
  )
}

export default Comments
