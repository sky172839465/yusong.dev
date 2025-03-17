import { filter } from 'lodash-es'
import useSWR, { preload } from 'swr'

const SEARCH_ALL = '__SEARCH_ALL_SERIES__'

export const fetcher = async (query) => {
  const data = (await import('../data/series.json')).default
  if (query === SEARCH_ALL) {
    return data
  }

  return filter(data, query)
}

export const useSeries = (query, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query || SEARCH_ALL, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const preloadSeries = (query) => {
  return preload(query || SEARCH_ALL, fetcher)
}

