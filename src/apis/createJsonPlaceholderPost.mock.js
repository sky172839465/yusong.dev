import { random } from 'lodash-es'

const mock = (config) => {
  const { data } = config
  const body = JSON.parse(data)
  return {
    id: random(100, 999),
    type: 'create',
    ...body
  }
}

export default mock
