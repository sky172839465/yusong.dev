import { filter } from 'lodash-es'
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

  return true
}

export const usePageExistCheck = (options = {}) => {
  const { pathname } = useLocation()
  const { isLoading, isValidating, ...restProps } = useSWR(pathname, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}
