import { get, isString, keys, reduce } from 'lodash-es'

import { DEFAULT_VALUES, FIELD } from './constants'

const getConvertedDefaultValues = (qsObj) => {
  const obj = { ...DEFAULT_VALUES, ...qsObj }
  const convertedDefaultValues = reduce(keys(obj), (collect, key) => {
    const value = get(obj, key)
    switch (true) {
    case (key === FIELD.TAGS && isString(value)): {
      collect[key] = [value]
      break
    }
    case (key === FIELD.TYPE): {
      const isValid = [
        'all',
        'article',
        'series',
        'website'
      ].includes(value)
      if (!isValid) {
        collect[key] = 'article'
        break
      }

      collect[key] = value
      break    
    }
    default: {
      collect[key] = value
      break
    }
    }
    return collect
  }, {})
  return convertedDefaultValues
}

export default getConvertedDefaultValues
