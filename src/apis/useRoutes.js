import { filter, get, omit } from 'lodash-es'
import useSWR, { preload } from 'swr'

const SEARCH_ALL = '__SEARCH_ALL_ROUTE__'

export const fetcher = async (query) => {
  const data = (await import('../data/routes.json')).default
  if (query === SEARCH_ALL) {
    return data
  }

  let queryData = [...data]
  let omitQuery = query
  if (get(query, 'type') === 'series') {
    queryData = filter(data, (item) => {
      return (
        item.path.startsWith('/article') &&
        item.file.endsWith('index.jsx')
      )
    })
    omitQuery = omit(query, ['type'])
  }
  return filter(queryData, omitQuery)
}

const defaultFilter = v => v

export const useRoutes = (query, options = {}, filterData = defaultFilter) => {
  const { isLoading, isValidating, data, ...restProps } = useSWR(query || SEARCH_ALL, fetcher, options)
  return {
    ...restProps,
    isLoading: isLoading || isValidating,
    data: filterData(data)
  }
}

export const preloadRoutes = (query) => {
  return preload(query || SEARCH_ALL, fetcher)
}

