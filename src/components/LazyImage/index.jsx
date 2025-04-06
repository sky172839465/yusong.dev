import { isEmpty, isUndefined, omit } from 'lodash-es'
import { AlertCircle } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useMemo, useState } from 'react'

import FadeIn from '@/components/FadeIn'
import getRwdImageAttributes from '@/components/LazyImage/getRwdImageAttributes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import useI18N, { LANG } from '@/hooks/useI18N'

const i18nMapping = {
  [LANG.EN]: {
    ICON_ERROR: 'ERR',
    ERROR_TITLE: 'Error',
    ERROR_DESC: 'Load image failed',
    NO_IMAGE: 'NO IMAGE'
  },
  [LANG.ZH_TW]: {
    ICON_ERROR: '錯誤',
    ERROR_TITLE: '錯誤',
    ERROR_DESC: '載入圖片失敗',
    NO_IMAGE: '沒有圖片'
  }
}

const ImageStatus = (props) => {
  const { isLoading, isLoaded, isIcon, src, className, error } = props
  const { label } = useI18N(i18nMapping)
  if (isLoading || (!isLoaded && !isEmpty(src))) {
    return (
      <Skeleton className={`${className ? className : ''} flex aspect-video`} />
    )
  }

  if (error) {
    if (isIcon) {
      return (
        <p className='text-destructive'>
          {label.ICON_ERROR}
        </p>
      )
    }

    return (
      <div className='flex aspect-video w-full items-center'>
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertTitle>
            {label.ERROR_TITLE}
          </AlertTitle>
          <AlertDescription>
            {label.ERROR_DESC}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isEmpty(src)) {
    return (
      <Skeleton className={`${className ? className : ''} flex aspect-video items-center justify-center text-4xl text-foreground`}>
        <p>
          {label.NO_IMAGE}
        </p>
      </Skeleton>
    )
  }

  return null
}


const LazyImage = (props) => {
  const { isLoading, isIcon, imageData, loading = 'lazy', ...imageProps } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imageAttributes = useMemo(() => {
    const { isSameImageSize, ...rwdAttrs } = getRwdImageAttributes(imageData)
    const mergedAttrs = {
      ...rwdAttrs,
      ...imageProps
    }
    if (isSameImageSize) {
      return mergedAttrs
    }

    return omit(mergedAttrs, ['sizes', 'srcSet'])
  }, [imageData, imageProps])
  const { src, className } = imageAttributes

  const onLoad = (event) => {
    const img = event.currentTarget
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsLoaded(true)
      return
    }

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    // make sure image rendered
    ctx.drawImage(img, 0, 0)
    setIsLoaded(true)
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
    <AnimatePresence>
      {(isLoading || !isLoaded || error) && (
        <FadeIn className='relative size-full'>
          <m.div
            className='absolute flex size-full grow items-center'
          >
            <ImageStatus
              src={src}
              className={`${className ? className : ''} absolute top-0`}
              isLoading={isLoading}
              isLoaded={isLoaded}
              isIcon={isIcon}
              error={error}
            />
          </m.div>
        </FadeIn>
      )}
      {isUndefined(src) && (
        <FadeIn className='relative size-full'>
          <m.div className='my-8 aspect-video w-full' />
        </FadeIn>
      )}
      {!isUndefined(src) && (
        <FadeIn className='relative size-full'>
          <m.img
            onLoad={onLoad}
            onError={onError}
            className={`${(isLoading|| !isLoaded || error) && 'invisible'} ${className}`}
            loading={loading}
            {...imageAttributes}
          />
        </FadeIn>
      )}
    </AnimatePresence>
  )
}

export default LazyImage
