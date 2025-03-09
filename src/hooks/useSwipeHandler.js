import { useEventListener } from '@react-hooks-library/core'
import { min } from 'lodash-es'
import { useRef, useState } from 'react'

const MAXIMUM_TRIGGER_PX = 40
const SCREEN_WIDTH = window.innerWidth

const useSwipeHandler = (setLoading) => {
  const startX = useRef(0)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const [opacityPercent, setOpacityPercent] = useState(0)
  const isSwipeFromLeft = swipeDistance > 0
  const isSwipeFromRight = swipeDistance < 0
  const swiping = swipeDistance !== 0
  const distanceInPercent = swipeDistance / SCREEN_WIDTH

  const resetSwipe = () => {
    startX.current = -1
    setSwipeDistance(0)
    setOpacityPercent(0)
  }

  useEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX
    const sceeenDistance = SCREEN_WIDTH - touchX
    const isStartSwipe = touchX <= MAXIMUM_TRIGGER_PX || sceeenDistance <= MAXIMUM_TRIGGER_PX
    setSwipeDistance(0)
    setOpacityPercent(0)

    // prevent swipe from left & right 20px
    if (min([touchX, Math.abs(sceeenDistance)]) < 20) {
      e.preventDefault()
    }

    if (!isStartSwipe) {
      startX.current = -1
      return
    }

    startX.current = touchX
  }, { passive: false })

  useEventListener('touchmove', (e) => {
    if (startX.current === -1) {
      return
    }

    const touchX = e.touches[0].clientX
    const distance = touchX - startX.current
    const rate = distance > 0 ? 1 : -1
    const limitDistance = min([Math.abs(distance), SCREEN_WIDTH]) * rate
    const convertedOpacityPercent = min([
      Math.abs(limitDistance * 2 / SCREEN_WIDTH),
      1
    ])
    setSwipeDistance(limitDistance)
    setOpacityPercent(convertedOpacityPercent)
    e.preventDefault()
  }, { passive: false })

  useEventListener('touchend', (e) => {
    if (startX.current === -1) {
      return
    }

    // not enought to swipe back / forward
    const touchX = e.changedTouches[0].clientX
    const currentDistanceInPercent = (touchX - startX.current) / SCREEN_WIDTH
    resetSwipe()
    if (Math.abs(currentDistanceInPercent) < 0.4) {
      return
    }

    const isSwipeToRight = currentDistanceInPercent > 0
    setLoading(true)
    history.go(isSwipeToRight ? -1 : 1)
  })

  return {
    opacityPercent,
    distanceInPercent,
    isSwipeFromLeft,
    isSwipeFromRight,
    swiping
  }
}

export default useSwipeHandler
