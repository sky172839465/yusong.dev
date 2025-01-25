import useSWRMutation from 'swr/mutation'

import getCustomAxios from './utils/axios'

export const endpoint = 'https://jsonplaceholder.typicode.com/posts'

export const method = 'put'

export const fetcher = (query) => async (key, { arg = {} }) => {
  const { id } = query
  const { title, content, userId } = arg
  const data = {
    title,
    content,
    userId
  }
  const axios = await getCustomAxios()
  return axios({
    url: `${endpoint}/${id}`,
    method,
    data
  })
}

export const useUpdateJsonPlaceholderPost = (query = {}, options = {}) => {
  const result = useSWRMutation('useUpdateJsonPlaceholderPost', fetcher(query), options)
  return result
}

