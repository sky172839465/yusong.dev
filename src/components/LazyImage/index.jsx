import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { useImage } from 'react-image'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const Fallback = () => {
  return (
    <div className='flex aspect-video w-full items-center'>
      <Alert variant='destructive'>
        <AlertCircle className='size-4' />
        <AlertTitle>
          錯誤
        </AlertTitle>
        <AlertDescription>
          載入圖片失敗
        </AlertDescription>
      </Alert>
    </div>
  )
}

const getSrcSet = src => {
  const lastDotIndex = src.lastIndexOf('.')
  const fileWithoutExt = src.slice(0, lastDotIndex)
  const ext = src.slice(lastDotIndex + 1)
  // image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w
  const srcSet = [['small', 320], ['medium', 768], ['large', 1200]]
    .map(([srcSize, width]) => {
      return `${fileWithoutExt}-${srcSize}.gen.${ext} ${width}w`
    })
    .join(', ')
  return srcSet
}


const Image = ({ src, alt, className }) => {
  const { src: loadedSrc } = useImage({ srcList: src })
  return (
    <div>
      <img
        srcSet={getSrcSet(loadedSrc)}
        sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px'
        src={loadedSrc}
        alt={alt}
        className={`${className || ''} rounded-lg`}
        loading='lazy'
      />
    </div>
  )
}

const ImageWithSkeleton = (props) => {
  const { className } = props
  return (
    <Suspense
      fallback={(
        <Skeleton className={`${className || ''} rounded-lg`} />
      )}
    >
      <Image {...props} />
    </Suspense>
  )
}

const LazyImage = withErrorBoundary(ImageWithSkeleton, {
  FallbackComponent: Fallback,
  onError: console.log
})

export default LazyImage
