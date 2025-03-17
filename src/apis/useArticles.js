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

export const useArticles = (query, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query || SEARCH_ALL, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const preloadArticles = (query = null) => {
  return preload(query, fetcher)
}

