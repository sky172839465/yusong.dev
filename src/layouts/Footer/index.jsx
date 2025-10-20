import clx from 'classnames'

import PinHome from '@/components/PinHome'
import useI18N, { LANG } from '@/hooks/useI18N'
import { usePageLoading } from '@/stores/pageLoading'

const i18nMapping = {
  [LANG.EN]: {
    COPYRIGHT: 'YUSONG All rights reserved.'
  },
  [LANG.ZH_TW]: {
    COPYRIGHT: 'YUSONG 保留所有權利。'
  }
}

const Footer = () => {
  const { label } = useI18N(i18nMapping)
  const { loading } = usePageLoading()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={clx('bg-background flex-none border-t', {
        'text-transparent': loading
      })}
    >
      <div className='container mx-auto px-4 py-6 relative'>
        <div className='flex items-center justify-between'>
          <div />
          <p className='flex-1 text-center'>
            &copy;
            {currentYear}
            {' '}
            {label.COPYRIGHT}
          </p>
          <div className='absolute right-4'>
            <PinHome />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
