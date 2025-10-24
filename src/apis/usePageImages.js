import { tryit } from 'radash'
import useSWR, { preload } from 'swr'

import useI18N from '@/hooks/useI18N'

import getDataEndpoint from './utils/getDataEndpoint'

export const fetcher = async (pathname) => {
  const endpoint = getDataEndpoint(pathname, 'images')
  const [error, response] = await tryit(() => fetch(endpoint).then((res => res.json())))()
  if (error) {
    return {}
  }

  return response
}

export const usePathImages = (pathname = null, options = {}) => {
  const { isLoading, isValidating, ...restProps } = useSWR(pathname, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const usePageImages = (customPathname, options = {}) => {
  const { pathname } = useI18N()
  const result = usePathImages(customPathname || pathname, options)
  return result
}

export const preloadPageImages = (mainPathName) => {
  return preload(mainPathName, fetcher)
}
