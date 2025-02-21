import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User } from 'lucide-react'
import { useBoolean } from 'usehooks-ts'

import { useArticles } from '@/apis/useArticles'
import { useRoutes } from '@/apis/useRoutes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useI18N, { LANG } from '@/hooks/useI18N'

import TriggerButton from './TriggerButton'

const i18nMapping = {
  [LANG.EN]: {
    SEARCH_WEB: 'Search website',
    SEARCH_COMMAND_DESC: 'Search webite by title, description or tags',
    SEARCH_PLACEHOLDER: 'Type title or description search...',
    EMPTY_RESULT: 'No results found.'
  },
  [LANG.ZH_TW]: {
    SEARCH_WEB: '查詢網站',
    SEARCH_COMMAND_DESC: '以標題、描述或標籤查詢網站',
    SEARCH_PLACEHOLDER: '輸入標題或描述查詢⋯',
    EMPTY_RESULT: '查無結果。'
  }
}

const SearchCommand = () => {
  const { label, lang } = useI18N(i18nMapping)
  const { value: isOpen, setValue: setIsOpen, setTrue: setOpen } = useBoolean(false)
  const { isLoading: isArticlesLoading, data: articles } = useArticles({ type: 'article', lang })
  const { isLoading: isRoutesLoading, data: routes } = useRoutes({ lang })
  console.log({ articles, routes })
  return (
    <>
      <TriggerButton
        onClick={setOpen}
        disabled={isArticlesLoading || isRoutesLoading}
      />
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader className='sr-only'>
          <DialogTitle>
            {label.SEARCH_WEB}
          </DialogTitle>
          <DialogDescription>
            {label.SEARCH_COMMAND_DESC}
          </DialogDescription>
        </DialogHeader>
        <CommandInput placeholder={label.SEARCH_PLACEHOLDER} />
        <CommandList>
          <CommandEmpty>
            {label.EMPTY_RESULT}
          </CommandEmpty>
          <CommandGroup heading='Suggestions'>
            <CommandItem>
              <Calendar />
              <span>
                Calendar
              </span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>
                Search Emoji
              </span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>
                Calculator
              </span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Settings'>
            <CommandItem>
              <User />
              <span>
                Profile
              </span>
              <CommandShortcut>
                ⌘P
              </CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>
                Billing
              </span>
              <CommandShortcut>
                ⌘B
              </CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>
                Settings
              </span>
              <CommandShortcut>
                ⌘S
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default SearchCommand