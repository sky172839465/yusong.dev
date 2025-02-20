const getDataEndpoint = (pathname, suffix = '') => {
  const convertedPathName = pathname.endsWith('/') ? pathname : `${pathname}/`
  const dataEndpoint = `/data/${convertedPathName.replaceAll('/', '_')}${suffix}.json`
  return dataEndpoint
}

export default getDataEndpoint
