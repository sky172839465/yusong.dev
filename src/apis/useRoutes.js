import { filter } from 'lodash-es'
import useSWR from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/routes.json')).default
  return filter(data, query)
}

export const useRoutes = (query, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(query, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

