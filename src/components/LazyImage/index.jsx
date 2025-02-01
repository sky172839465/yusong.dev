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


const Image = ({ src, alt, className }) => {
  const { src: loadedSrc } = useImage({ srcList: src })
  return (
    <img
      src={loadedSrc}
      alt={alt}
      className={`${className || ''} rounded-lg`}
      loading='lazy'
    />
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
