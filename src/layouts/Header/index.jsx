import { Languages, Moon, Search, Sun } from 'lucide-react'
import * as m from 'motion/react-m'
import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

import LazyImage from '@/components/LazyImage'
import TriggerButton from '@/components/SearchCommand/TriggerButton'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useI18N, { LANG } from '@/hooks/useI18N'
import { useTheme } from '@/stores/theme'

const LazySearchCommand = lazy(() => import('@/components/SearchCommand'))

const i18nMapping = {
  [LANG.EN]: {
    CHANGE_LANG: 'Change language',
    LANG_EN: 'English',
    LANG_ZH_TW: 'Traditional Chinese',
    SEARCH: 'Search',
    CHANGE_DARK_MODE: 'Change dark mode'
  },
  [LANG.ZH_TW]: {
    CHANGE_LANG: '切換語言',
    LANG_EN: '英文',
    LANG_ZH_TW: '繁體中文',
    SEARCH: '查詢',
    CHANGE_DARK_MODE: '切換黑暗模式'
  }
}

const Header = () => {
  const { toggle } = useTheme()
  const { label, lang, langPathNames, isEN, isZhTw, pathname } = useI18N(i18nMapping)
  const isRoot = pathname.replace(lang, '') === '/'
  const isSearch = pathname.replace(`/${lang}`, '') === '/search'

  return (
    <m.header
      className='bg-background/50 sticky top-0 z-10 flex-none border-b backdrop-blur-md'
      layout
    >
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Link
          to={`/${isZhTw ? '' : lang}`}
          className='flex items-center gap-2'
          viewTransition
        >
          <div className='rounded-md border-black bg-white p-[2px]'>
            <LazyImage
              src='/favicon.svg'
              alt='Site Logo'
              className='h-8 w-auto rounded-sm'
              width={32}
              height={32}
              isIcon
            />
          </div>
          <span className='font-bold'>
            YUSONG.DEV
          </span>
        </Link>
        <div className='flex items-center space-x-4'>
          {isRoot && (
            <Link
              to={`/${isZhTw ? '' : `${lang}/`}search`}
              viewTransition
            >
              <Button variant='outline' size='icon'>
                <Search className='size-[1.2rem]' />
                <span className='sr-only'>
                  {label.SEARCH}
                </span>
              </Button>
            </Link>
          )}
          {!isRoot && (
            <Suspense
              fallback={(
                <TriggerButton disabled />
              )}
            >
              <LazySearchCommand disabled={isSearch} />
            </Suspense>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Languages className='size-[1.2rem]' />
                <span className='sr-only'>
                  {label.CHANGE_LANG}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <Link
                to={langPathNames[LANG.EN]}
                className={isEN ? 'pointer-events-none' : ''}
                viewTransition
              >
                <DropdownMenuItem disabled={isEN}>
                  {label.LANG_EN}
                </DropdownMenuItem>
              </Link>
              <Link
                to={langPathNames[LANG.ZH_TW]}
                className={isZhTw ? 'pointer-events-none' : ''}
                viewTransition
              >
                <DropdownMenuItem disabled={isZhTw}>
                  {label.LANG_ZH_TW}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='icon' onClick={toggle}>
            <Sun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            <span className='sr-only'>
              {label.CHANGE_DARK_MODE}
            </span>
          </Button>
        </div>
      </div>
    </m.header>
  )
}

export default Header
