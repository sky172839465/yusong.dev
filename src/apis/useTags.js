import { filter } from 'lodash-es'
import useSWR from 'swr'

const SEARCH_ALL = '__SEARCH_ALL_TAGS__'

export const fetcher = async (tag) => {
  const data = (await import('../data/tags.json')).default
  if (tag === SEARCH_ALL) {
    return data
  }

  return filter(data, (item) => item === tag)
}

export const useTags = (tag, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(tag || SEARCH_ALL, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

