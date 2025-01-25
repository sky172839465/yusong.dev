import { random, times } from 'lodash-es'

const mock = () => {
  const users = times(random(5, 10)).map(index => {
    return {
      'id': 1,
      'name': `mock name ${index}`,
      'username': `user name ${index}`,
      'email': `index-${index}@gmail.com`,
      'website': `mock.web${index}.com`
    }
  })
  return users
}

export default mock
