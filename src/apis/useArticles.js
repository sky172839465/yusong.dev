import { filter, isString } from 'lodash-es'
import useSWR from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/articles.json')).default
  if (isString(query)) {
    return filter(data, (item) => JSON.stringify(item).includes(query))
  }

  return filter(data, query)
}

export const useArticles = (query, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query ? query : null, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

