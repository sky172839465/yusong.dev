import { tryit } from 'radash'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

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

export const useSeriesArticles = (isSeries = true, options = {}) => {
  const { pathname } = useLocation()
  const convertedPathname = isSeries
    ? pathname
    : (pathname.endsWith('/') ? pathname : `${pathname}/`).replace(/\/[^/]+\/$/, '/')
  const { isLoading, isValidating, ...restProps } = useSWR(convertedPathname, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}

