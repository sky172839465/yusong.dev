import { Link } from 'react-router-dom'

const PortalLink = (props) => {
  const { link = {} } = props

  return (
    <Link
      key={link.url}
      to={link.url}
      className='btn btn-outline btn-lg my-2'
      viewTransition
    >
      {link.name}
    </Link>
  )
}

export default PortalLink