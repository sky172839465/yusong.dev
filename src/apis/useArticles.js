import { filter, isString } from 'lodash-es'
import useSWR, { preload } from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/articles.json')).default
  if (isString(query)) {
    return filter(data, (item) => JSON.stringify(item).includes(query))
  }

  return filter(data, query)
}

export const useArticles = (query = null, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const preloadArticles = (query = null) => {
  return preload(query, fetcher)
}

