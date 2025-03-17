import queryString from 'query-string'
import { useSearchParams } from 'react-router-dom'

import getOmitObject from '@/utils/getOmitObject'

const useOmitQueryStringObject = (qsString) => {
  const [searchParams] = useSearchParams()
  const qsObj = queryString.parse(qsString || searchParams.toString(), { arrayFormat: 'repeat' })
  return getOmitObject(qsObj)
}

export default useOmitQueryStringObject
