import { isEmpty } from 'lodash-es'
import { AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

import FadeIn from '@/components/FadeIn'
import getRwdImageAttributes from '@/components/LazyImage/getRwdImageAttributes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const ImageStatus = (props) => {
  const { isLoading, isLoaded, isIcon, isSrcEmpty, className, error } = props
  if (isLoading || (!isLoaded && !isSrcEmpty)) {
    return (
      <Skeleton className={className} />
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

  if (isSrcEmpty) {
    return (
      <Skeleton className={`${className || ''} flex items-center justify-center text-4xl text-foreground`}>
        <p>
          NO IMAGE
        </p>
      </Skeleton>
    )
  }

  return null
}


const LazyImage = (props) => {
  const { isLoading, isIcon, ...restProps } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imageAttributes = useMemo(() => {
    const { imageData, ...imageProps } = restProps
    const rwdImageAttributes = getRwdImageAttributes(imageData)
    return { ...rwdImageAttributes, ...imageProps }
  }, [restProps])
  const { src, className } = imageAttributes
  const isSrcEmpty = isEmpty(src)

  const onLoad = () => setIsLoaded(true)

  const onError = (e) => {
    onLoad()
    setError(e)
  }

  return (
    <FadeIn className='relative size-full'>
      {((isSrcEmpty || isLoading|| !isLoaded || error)) && (
        <div className='absolute flex size-full grow items-center'>
          <ImageStatus
            className={className}
            isSrcEmpty={isSrcEmpty}
            isLoading={isLoading}
            isLoaded={isLoaded}
            isIcon={isIcon}
            error={error}
          />
        </div>
      )}
      {isSrcEmpty && (
        <div className='my-8 aspect-video w-full' />
      )}
      {!isSrcEmpty && (
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
