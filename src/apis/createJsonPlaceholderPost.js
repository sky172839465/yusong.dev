import useSWRMutation from 'swr/mutation'

import getCustomAxios from './utils/axios'

export const endpoint = 'https://jsonplaceholder.typicode.com/posts'

export const method = 'post'

export const fetcher = () => async (key, { arg = {} }) => {
  const { title, content, userId } = arg
  const data = {
    title,
    content,
    userId
  }
  const axios = await getCustomAxios()
  return axios({
    url: endpoint,
    method,
    data
  })
}

export const useCreateJsonPlaceholderPost = (query = {}, options = {}) => {
  const result = useSWRMutation('useCreateJsonPlaceholderPost', fetcher(query), options)
  return result
}

