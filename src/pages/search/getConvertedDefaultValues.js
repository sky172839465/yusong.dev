import { get, isString, keys, reduce } from 'lodash-es'

import { DEFAULT_VALUES, FIELD } from './constants'

const getConvertedDefaultValues = (qsObj) => {
  const obj = { ...DEFAULT_VALUES, ...qsObj }
  const convertedDefaultValues = reduce(keys(obj), (collect, key) => {
    const value = get(obj, key)
    if (key === FIELD.TAGS && isString(value)) {
      collect[key] = [value]
    } else {
      collect[key] = value
    }
    return collect
  }, {})
  return convertedDefaultValues
}

export default getConvertedDefaultValues
