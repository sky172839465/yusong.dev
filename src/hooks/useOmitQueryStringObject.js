import { useSearchParams } from 'react-router-dom'

import getOmitQueryStringObject from '@/utils/getOmitQueryStringObject'

const useOmitQueryStringObject = (qsString) => {
  const [searchParams] = useSearchParams()
  return getOmitQueryStringObject(qsString, searchParams)
}

export default useOmitQueryStringObject
