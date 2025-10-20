import clx from 'classnames'
import { Pin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'
import { usePinHome } from '@/stores/pinHome'

const i18nMapping = {
  [LANG.EN]: {
    PINNED_HOME: 'Pinned start page',
    UNPINNED_HOME: 'Pin to start page'
  },
  [LANG.ZH_TW]: {
    PINNED_HOME: '已釘為起始頁',
    UNPINNED_HOME: '釘為起始頁'
  }
}


const PinHome = () => {
  const { mainPathName, label } = useI18N(i18nMapping)
  const { isPinnedHome, togglePinHome } = usePinHome()
  if (mainPathName === '/') {
    return null
  }

  return (
    <Button
      variant='outline'
      onClick={togglePinHome}
      size='responsive'
    >
      <Pin
        className={clx('transition fill-white dark:fill-black stroke-black dark:stroke-white', {
          'rotate-45': !isPinnedHome
        })}
      />
      <span className='hidden md:inline'>
        {isPinnedHome ? label.PINNED_HOME : label.UNPINNED_HOME}
      </span>
    </Button>
  )
}

export default PinHome
