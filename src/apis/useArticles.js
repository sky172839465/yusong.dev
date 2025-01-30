import { filter } from 'lodash-es'
import useSWR from 'swr'

export const fetcher = async (query) => {
  const data = (await import('../data/articles.json')).default
  return filter(data, item => JSON.stringify(item).includes(query.title))
}

export const useArticles = (query = {}, options = {}) => {
  const result = useSWR(query, fetcher, options)
  return result
}

