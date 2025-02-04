import { isEmpty } from 'lodash-es'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { useImage } from 'react-image'

import FadeIn from '@/components/FadeIn'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const Fallback = () => {
  return (
    <FadeIn className='flex aspect-video w-full items-center'>
      <Alert variant='destructive'>
        <AlertCircle className='size-4' />
        <AlertTitle>
          錯誤
        </AlertTitle>
        <AlertDescription>
          載入圖片失敗
        </AlertDescription>
      </Alert>
    </FadeIn>
  )
}

const Image = ({ srcList, className, ...props }) => {
  const { src: loadedSrc } = useImage({ srcList })
  return (
    <FadeIn>
      <img
        src={loadedSrc}
        className={`${className || ''} rounded-lg`}
        loading='lazy'
        {...props}
      />
    </FadeIn>
  )
}

const ImageWithSkeleton = (props) => {
  const { className, srcList } = props
  if (isEmpty(srcList)) {
    return (
      <FadeIn>
        <Skeleton className={`${className || ''} flex items-center justify-center rounded-lg text-4xl text-foreground`}>
          <p>
            NO IMAGE
          </p>
        </Skeleton>
      </FadeIn>
    )
  }

  return (
    <Suspense
      fallback={(
        <FadeIn>
          <Skeleton className={`${className || ''} rounded-lg`} />
        </FadeIn>
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
