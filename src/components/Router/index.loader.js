import { isEmpty } from 'lodash-es'
import { redirect } from 'react-router-dom'

import { getPinHome } from '@/stores/pinHome'

const loader = ({ request }) => {
  const pinHome = getPinHome()
  const { pathname } = new URL(request.url)
  if (!isEmpty(pinHome) && (pathname === '/')) {
    return redirect(pinHome)
  }

  return {
    root: () => Promise.resolve({})
  }
}

export default loader
