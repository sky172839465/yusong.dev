import { tryit } from 'radash'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

import getFileUrl from '@/utils/getFileUrl'

export const fetcher = async (pathname) => {
  const formatedPathName = (pathname.endsWith('/') ? pathname : `${pathname}/`)
  const endpoint = getFileUrl(`/src/pages${formatedPathName}images/og.jpg`)
  const [error] = await tryit(() => fetch(endpoint).then((res) => res.ok))()
  if (error) {
    return false
  }

  setTimeout(() => window.location.reload(), 1000 * 10)
  return true
}

export const usePageExistCheck = (is404, options = {}) => {
  const { pathname } = useLocation()
  const { isLoading, isValidating, ...restProps } = useSWR(is404 ? pathname : null, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}
