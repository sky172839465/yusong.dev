import queryString from 'query-string'

import getOmitObject from '@/utils/getOmitObject'

const getOmitQueryStringObject = (qsString, searchParams = '') => {
  const qsObj = queryString.parse(qsString || searchParams.toString(), { arrayFormat: 'repeat' })
  return getOmitObject(qsObj)
}

export default getOmitQueryStringObject
