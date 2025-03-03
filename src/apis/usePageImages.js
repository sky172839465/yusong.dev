import { tryit } from 'radash'
import useSWR from 'swr'

import useI18N from '@/hooks/useI18N'

import getDataEndpoint from './utils/getDataEndpoint'

export const fetcher = async (pathname) => {
  const endpoint = getDataEndpoint(pathname, 'images')
  const [error, response] = await tryit(() => fetch(endpoint).then((res => res.json())))()
  if (error) {
    console.log(error)
    return []
  }

  return response
}

export const usePathImages = (pathname, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(() => pathname || null, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const usePageImages = (options = {}) => {
  const { mainPathName } = useI18N()
  const result = usePathImages(mainPathName, options)
  return result
}
