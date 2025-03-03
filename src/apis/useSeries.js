import { filter } from 'lodash-es'
import useSWR, { preload } from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/series.json')).default
  return filter(data, query)
}

export const useSeries = (query, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const preloadSeries = (query) => {
  return preload(query, fetcher)
}

