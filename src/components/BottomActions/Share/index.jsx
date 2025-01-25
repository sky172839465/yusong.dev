import { useIsSupported } from '@react-hooks-library/core'
import { FaShare } from 'react-icons/fa6'

const Shared = (props) => {
  const { shareData } = props
  const isShareSupported = useIsSupported(() => !!navigator?.share)

  const sharePost = () => {
    navigator && navigator.share(shareData)
  }

  return (
    <li className={`${isShareSupported ? '' : 'disabled pointer-events-none'}`}>
      <a onClick={sharePost}>
        <FaShare />
        分享
      </a>
    </li>
  )
}

export default Shared