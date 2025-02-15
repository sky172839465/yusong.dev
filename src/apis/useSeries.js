import { filter } from 'lodash-es'
import useSWR from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/series.json')).default
  return filter(data, query)
}

const DEFAULT_QUERY = {
  type: 'website'
}
export const useSeries = (query = DEFAULT_QUERY, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

