import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import useSwipeHandler from '../../hooks/useSwipeHandler'

const ICONS = [FaArrowLeft, FaArrowRight]
const DEFAULT_X_POSITION = [-8, 10]

const CustomSwipe = () => {
  const {
    swiping,
    isSwipeFromLeft,
    isSwipeFromRight,
    opacityPercent,
    distanceInPercent
  } = useSwipeHandler()

  return (
    <div
      className={`
        fixed left-0 top-0
        flex h-dvh w-dvw
        flex-row items-center justify-between px-6
        transition-all duration-0
        ${swiping ? 'z-50' : '-z-50'}
      `}
    >
      {ICONS.map((Icon, index) => {
        const isLeftArrow = isSwipeFromLeft && swiping && index === 0
        const isRightArrow = isSwipeFromRight && swiping && index === 1
        const defaultXPosition = DEFAULT_X_POSITION[index]
        return (
          <div
            key={index}
            className='btn btn-circle border-none bg-black p-4'
            style={{
              opacity: (
                (isLeftArrow && opacityPercent) ||
                (isRightArrow && opacityPercent) ||
                0
              ),
              transform: `translateX(${(
                isLeftArrow && (defaultXPosition + distanceInPercent * defaultXPosition * -1) ||
                isRightArrow && (defaultXPosition + distanceInPercent * defaultXPosition) ||
                0
              )}dvw)`
            }}
          >
            <Icon className='!fill-white' />
          </div>
        )
      })}
    </div>
  )
}

export default CustomSwipe
