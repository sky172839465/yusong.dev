import { flow, get, join, last, map, pick, size, uniqBy } from 'lodash-es'

import getFileUrl from '@/utils/getFileUrl'

// const SIZE_QUERY = [
//   '(max-width: 768px) ',
//   '(max-width: 1024px) ',
//   ''
// ]

// const SIZE_QUERY = [
//  '(max-width: 768px) 100vw',
//  '(max-width: 1024px) 90vw',
//  null
// ]

const getRwdImageAttributes = (imageData) => {
  if (!imageData) {
    const dimensions = { width: 1200, height: 675 }
    return { isSameImageSize: true, ...dimensions }
  }

  const imageSizes = get(imageData, 'sizes', [])
  const isSameImageSize = size(uniqBy(imageSizes, 'width')) === size(imageSizes)
  const largeImage = last(imageSizes)
  const src = getFileUrl(`/${get(imageSizes, '0.path')}`)
  const srcSet = flow(
    () => map(imageSizes, ({ path, width }) => `${getFileUrl(`/${path}`)} ${width}w`),
    srcSetList => join(srcSetList, ', ')
  )()
  const lastIndex = size(imageSizes) - 1
  const sizes = flow(
    // () => map(imageSizes, ({ width }, index) => `${SIZE_QUERY[index]}${width}px`),
    () => map(imageSizes, ({ width }, index) => index !== lastIndex ? `(max-width: ${width}px) ${width}px` : `${width}px`),
    (sizeList) => join(sizeList, ', ')
  )()
  const dimensions = pick(largeImage, ['width', 'height'])
  return { src, srcSet, sizes, isSameImageSize, ...dimensions }
}

export default getRwdImageAttributes
