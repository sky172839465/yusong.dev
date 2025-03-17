import { filter, isString } from 'lodash-es'
import useSWR, { preload } from 'swr'

const SEARCH_ALL = '__SEARCH_ALL_ARTICLE__'

export const fetcher = async (query) => {
  const data = (await import('../data/articles.json')).default
  if (query === SEARCH_ALL) {
    return data
  }

  if (isString(query)) {
    return filter(data, (item) => JSON.stringify(item).includes(query))
  }

  return filter(data, query)
}

const defaultFilter = v => v

export const useArticles = (query, options = {}, filterData = defaultFilter) => {
  const { isLoading, isValidating, data, ...restProps } = useSWR(query || SEARCH_ALL, fetcher, options)
  return { ...restProps, data: filterData(data), isLoading: isLoading || isValidating }
}

export const preloadArticles = (query = null) => {
  return preload(query, fetcher)
}

