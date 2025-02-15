import { isEmpty, isUndefined } from 'lodash-es'
import { AlertCircle } from 'lucide-react'
import { sleep } from 'radash'
import { useEffect, useMemo, useState } from 'react'

import FadeIn from '@/components/FadeIn'
import getRwdImageAttributes from '@/components/LazyImage/getRwdImageAttributes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const ImageStatus = (props) => {
  const { isLoading, isLoaded, isIcon, src, className, error } = props
  if (isLoading || (!isLoaded && !isEmpty(src))) {
    return (
      <Skeleton className={className ? className : ''} />
    )
  }

  if (error) {
    if (isIcon) {
      return (
        <p className='text-destructive'>
          錯誤
        </p>
      )
    }

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

  if (isEmpty(src)) {
    return (
      <Skeleton className={`${className ? className : ''} flex items-center justify-center text-4xl text-foreground`}>
        <p>
          NO IMAGE
        </p>
      </Skeleton>
    )
  }

  return null
}


const LazyImage = (props) => {
  const { isLoading, isIcon, imageData, ...imageProps } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imageAttributes = useMemo(() => {
    return {
      ...getRwdImageAttributes(imageData),
      ...imageProps
    }
  }, [imageData, imageProps])
  const { src, className } = imageAttributes

  const onLoad = () => {
    window.requestAnimationFrame(async () => {
      await sleep(1000)
      setIsLoaded(true)
    })
  }

  const onError = (e) => {
    setError(e)
    setIsLoaded(true)
  }

  useEffect(() => {
    setIsLoaded(false)
    setError(false)
  }, [src])

  return (
    <FadeIn className='relative size-full'>
      {((isLoading|| !isLoaded || error)) && (
        <div className='absolute flex size-full grow items-center'>
          <ImageStatus
            src={src}
            className={className}
            isLoading={isLoading}
            isLoaded={isLoaded}
            isIcon={isIcon}
            error={error}
          />
        </div>
      )}
      {isUndefined(src) && (
        <div className='my-8 aspect-video w-full' />
      )}
      {!isUndefined(src) && (
        <img
          loading='lazy'
          onLoad={onLoad}
          onError={onError}
          className={`${(isLoading|| !isLoaded || error) && 'invisible'} ${className}`}
          {...imageAttributes}
        />
      )}
    </FadeIn>
  )
}

export default LazyImage
