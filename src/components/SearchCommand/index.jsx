import { get, groupBy, isEmpty, keyBy, keys, random, times, values } from 'lodash-es'
import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'

import { useRoutes } from '@/apis/useRoutes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useI18N, { LANG } from '@/hooks/useI18N'

import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import TriggerButton from './TriggerButton'

const PAGE_TYPE = {
  WEBSITE: 'website',
  ARTICLE: 'article',
  OTHER: 'other'
}

const PAGE_TYPE_CODE_MAP = keyBy(values(PAGE_TYPE))

const i18nMapping = {
  [LANG.EN]: {
    SEARCH_WEB: 'Search website',
    SEARCH_COMMAND_DESC: 'Search webite by title, description or tags',
    SEARCH_PLACEHOLDER: 'Type title, description or tag search...',
    EMPTY_RESULT: 'No results found.',
    LOADING_SECTION: 'Loading',
    [PAGE_TYPE.WEBSITE]: 'Pages',
    [PAGE_TYPE.ARTICLE]: 'Articles',
    [PAGE_TYPE.OTHER]: 'Others'
  },
  [LANG.ZH_TW]: {
    SEARCH_WEB: '查詢網站',
    SEARCH_COMMAND_DESC: '以標題、描述或標籤查詢網站',
    SEARCH_PLACEHOLDER: '輸入標題、描述或標籤查詢⋯',
    EMPTY_RESULT: '查無結果。',
    LOADING_SECTION: '載入中',
    [PAGE_TYPE.WEBSITE]: '頁面',
    [PAGE_TYPE.ARTICLE]: '文章',
    [PAGE_TYPE.OTHER]: '其他'
  }
}

const RANDOM = {
  COMMAND_ITEM: times(random(3, 5))
}

const CommandItemContent = (props) => {
  const { data: { title = '', description = '', tags = [] } = {} } = props
  const filtedTags = tags.filter(Boolean)

  return (
    <div>
      <div className='flex items-center gap-2'>
        <span>
          {title}
        </span>
        {!isEmpty(filtedTags) && (
          <div className='h-5'>
            <Separator orientation='vertical' />
          </div>
        )}
        {tags.filter(Boolean).map((tag, index) => {
          return (
            <Badge key={index} className='h-5'>
              {tag}
            </Badge>
          )
        })}
      </div>
      <p className='max-w-80 truncate text-sm md:max-w-96'>
        {description}
      </p>
    </div>
  )
}

const SearchResult = (props) => {
  const { isOpen, onSelect } = props
  const { lang, label, isZhTw } = useI18N(i18nMapping)
  const { isLoading: isRoutesLoading, data: routes = [] } = useRoutes(isOpen ? { lang } : null)
  const navigate = useNavigate()
  const defaultNavPath = isZhTw ? '/' : `/${lang}`
  const routesGroup = groupBy(routes, (route) => route.type || PAGE_TYPE.OTHER)

  const onNavigate = (path = defaultNavPath) => () => {
    onSelect()
    navigate(path, { viewTransition: true })
  }

  if (isRoutesLoading) {
    return (
      <CommandGroup heading={label.LOADING_SECTION}>
        {RANDOM.COMMAND_ITEM.map((index) => {
          return (
            <CommandItem key={index} disabled>
              <Skeleton className='w-full'>
                <div className='invisible'>
                  {`Loading item ${index}`}
                </div>
              </Skeleton>
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  }

  return keys(routesGroup).map((pageType, index) => {
    const heading = label[get(PAGE_TYPE_CODE_MAP, pageType) || PAGE_TYPE.OTHER]
    const routes = routesGroup[pageType]
    return (
      <Fragment key={index}>
        <CommandGroup heading={heading}>
          {routes.map((route) => {
            const data = get(route, 'data', {})
            
            return (
              <Link
                to={route.path}
                key={route.file}
                viewTransition
              >
                <CommandItem onSelect={onNavigate(route.path)}>
                  <CommandItemContent data={data} />
                </CommandItem>
              </Link>
            )
          })}
        </CommandGroup>
        <CommandSeparator />
      </Fragment>
    )
  })
}

const SearchCommand = () => {
  const { label, lang } = useI18N(i18nMapping)
  const { value: isOpen, setValue: setIsOpen, setTrue: setOpen, setFalse: setClose } = useBoolean(false)
  const { isLoading: isRoutesLoading } = useRoutes(isOpen ? { lang } : null)

  return (
    <>
      <TriggerButton
        onClick={setOpen}
        disabled={isRoutesLoading}
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
        <CommandInput placeholder={label.SEARCH_PLACEHOLDER} className='text-base' />
        <CommandList>
          <CommandEmpty>
            {label.EMPTY_RESULT}
          </CommandEmpty>
          <SearchResult isOpen={isOpen} onSelect={setClose} />
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default SearchCommand
