import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const i18nMapping = {
  [LANG.EN]: {
    SEARCH_WEB: 'Search website'
  },
  [LANG.ZH_TW]: {
    SEARCH_WEB: '查詢網站'
  }
}

const TriggerButton = (props) => {
  const { label } = useI18N(i18nMapping)
  return (
    <Button variant='outline' size='icon' {...props}>
      <Search className='size-[1.2rem]' />
      <span className='sr-only'>
        {label.SEARCH_WEB}
      </span>
    </Button>
  )
}

export default TriggerButton
