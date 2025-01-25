import qs from 'query-string'
import useSWR from 'swr'

import getCustomAxios from './utils/axios'

export const endpoint = 'https://jsonplaceholder.typicode.com/users'

export const fetcher = async (query) => {
  const axios = await getCustomAxios()
  return axios(`${endpoint}?${qs.stringify(query)}`)
}

export const useJsonPlaceholderUser = (query = {}, options = {}) => {
  const result = useSWR(query, fetcher, options)
  return result
}

