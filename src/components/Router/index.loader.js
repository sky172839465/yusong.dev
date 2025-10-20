import { isEmpty } from 'lodash-es'
import { redirect } from 'react-router-dom'

import { getPinHome } from '@/stores/pinHome'

const pinHome = getPinHome()

const loader = ({ request }) => {
  const { pathname } = new URL(request.url)
  if (!isEmpty(pinHome) && (pathname === '/')) {
    return redirect(pinHome)
  }

  return {
    root: () => Promise.resolve({})
  }
}

export default loader
