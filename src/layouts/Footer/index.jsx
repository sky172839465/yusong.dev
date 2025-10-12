import clx from 'classnames'

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
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-center md:flex-row'>
          <p>
            &copy;
            {currentYear}
            {' '}
            {label.COPYRIGHT}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
