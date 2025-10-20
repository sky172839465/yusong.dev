import { delay, isEmpty } from 'lodash-es'
import { redirect } from 'react-router-dom'

import { getPinHome } from '@/stores/pinHome'

const pinHome = getPinHome()

const loader = ({ request }) => {
  const { pathname } = new URL(request.url)
  if (!isEmpty(pinHome) && (pathname !== pinHome)) {
    return redirect(pinHome)
  }

  return {
    root: () => new Promise((resolve) => {
      delay(resolve, 100)
    })
  }
}

export default loader
