import { filter } from 'lodash-es'
import useSWR, { preload } from 'swr'

import useI18N from '@/hooks/useI18N'

const SEARCH_ALL = '__SEARCH_ALL_ROUTE__'

export const fetcher = async ({ query, lang }) => {
  const data = (await import('../data/routes.json')).default
  if (query === SEARCH_ALL) {
    return filter(data, { lang })
  }

  return filter(data, { lang, ...query })
}

const defaultFilter = v => v

export const useRoutes = (query, options = {}, filterData = defaultFilter) => {
  const { lang } = useI18N()
  const key = { query: query || SEARCH_ALL, lang }
  const { isLoading, isValidating, data, ...restProps } = useSWR(key, fetcher, options)
  return {
    ...restProps,
    isLoading: isLoading || isValidating,
    data: filterData(data)
  }
}

export const preloadRoutes = (query) => {
  return preload(query || SEARCH_ALL, fetcher)
}

