import Giscus from '@giscus/react'

import useTheme from '@/hooks/useTheme'

const Comments = () => {
  const { isDarkMode } = useTheme()
  return (
    <Giscus
      id='comments'
      repo='sky172839465/yusong.tw'
      repoId='R_kgDONva8Tw'
      category='Announcements'
      categoryId='DIC_kwDONva8T84Cmdvk'
      mapping='pathname'
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='top'
      theme={isDarkMode ? 'dark' : 'light'}
      lang='zh-TW'
      loading='lazy'
    />
  )
}

export default Comments
