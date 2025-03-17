import { isEmpty, omitBy } from 'lodash-es'

const getOmitObject = (obj) => {
  return omitBy(obj, (value) => {
    return isEmpty(value) || (Array.isArray(value) && value.every(isEmpty))
  })
}

export default getOmitObject
