import { tryit } from 'radash'
import useSWR from 'swr'

import useI18N from '@/hooks/useI18N'

export const fetcher = async (pathname) => {
  const convertedPathName = pathname.endsWith('/') ? pathname : `${pathname}/`
  const endpoint = `/data/${convertedPathName.replaceAll('/', '_')}images.json`
  const [error, response] = await tryit(() => fetch(endpoint).then((res => res.json())))()
  if (error) {
    console.log(error)
    return []
  }

  return response
}

export const usePageImages = (options = {}) => {
  const { mainPathName } = useI18N()
  const { isLoading, isValidating, ...restProps } = useSWR(mainPathName, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}
