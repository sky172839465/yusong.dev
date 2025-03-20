import { delay } from 'lodash-es'

const loader = () => {
  // const { pathname } = new URL(request.url)
  // console.log(pathname)
  return {
    root: () => new Promise((resolve) => {
      delay(resolve, 500)
    })
  }
}

export default loader
