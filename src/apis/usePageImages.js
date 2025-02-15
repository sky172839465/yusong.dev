import { tryit } from 'radash'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

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
  const { pathname } = useLocation()
  const { isLoading, isValidating, ...restProps } = useSWR(pathname, fetcher, options)
  return { ...restProps, isLoading: isLoading || isValidating }
}
