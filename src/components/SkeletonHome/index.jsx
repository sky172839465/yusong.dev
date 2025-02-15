import FadeIn from '@/components/FadeIn'

const SkeletonHome = () => {
  return (
    <FadeIn className='flex min-h-dvh w-full items-center justify-center bg-background'>
      <div className='text-center'>
        <div className='max-w-md space-y-4'>
          <h1 className='text-5xl font-bold'>
            YUSONG.TW
          </h1>
          <div className='flex items-center justify-center space-x-2 text-xl'>
            {['Loading', '...'].map((word, index) => (
              <span
                key={index}
                className='animate-pulse text-lg font-medium'
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default SkeletonHome