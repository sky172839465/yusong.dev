import { flow, get, join, last, map, pick } from 'lodash-es'

import getFileUrl from '@/lib/getFileUrl'

const getRwdImageAttributes = (imageData) => {
  if (!imageData) {
    const dimensions = { width: 1200, height: 675 }
    return dimensions
  }

  const imageSizes = get(imageData, 'sizes', [])
  const largeImage = last(imageSizes)
  const src = getFileUrl(`/${get(largeImage, 'path')}`)
  const srcSet = flow(
    () => map(imageSizes, ({ path, width }) => `${getFileUrl(`/${path}`)} ${width}w`),
    srcSetList => join(srcSetList, ', ')
  )()
  const dimensions = pick(largeImage, ['width', 'height'])
  return { src, srcSet, ...dimensions }
}

export default getRwdImageAttributes
