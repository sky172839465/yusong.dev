import { tryit } from 'radash'
import { useLocation } from 'react-router-dom'
import useSWR, { preload } from 'swr'

import getDataEndpoint from './utils/getDataEndpoint'

export const fetcher = async (pathname) => {
  const endpoint = getDataEndpoint(pathname, 'articles')
  const [error, response] = await tryit(() => fetch(endpoint).then((res => res.json())))()
  if (error) {
    console.log(error)
    return []
  }

  return response
}

const getConvertedPathname = (isSeries, pathname) => {
  const convertedPathname = isSeries
    ? pathname
    : (pathname.endsWith('/') ? pathname : `${pathname}/`).replace(/\/[^/]+\/$/, '/')
  return convertedPathname
}

export const useSeriesArticles = (isSeries = true, options = {}) => {
  const { pathname } = useLocation()
  const convertedPathname = getConvertedPathname(isSeries, pathname)
  const { isLoading, isValidating, ...restProps } = useSWR(convertedPathname, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

export const preloadSeriesArticles = (isSeries = true, pathname = '') => {
  const convertedPathname = getConvertedPathname(isSeries, pathname)
  return preload(convertedPathname, fetcher)
}

