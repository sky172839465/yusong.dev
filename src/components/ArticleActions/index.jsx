import { useIsSupported } from '@react-hooks-library/core'
import { isEmpty, map } from 'lodash-es'
import { ArrowUpToLine,Hash,List, Share } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const ArticleActions = (props) => {
  const { shareData, topRef, sections = [] } = props
  const isShareSupported = useIsSupported(() => !!navigator?.share)

  const scrollToSection = (e) => {
    const target = document.querySelector(`a[href="${e.target.dataset.hash}"]`)
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sharePost = () => {
    navigator && navigator.share(shareData)
  }

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className='sticky bottom-10 left-0 flex w-full justify-center transition-all'>
      <div className='inline-flex'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='rounded-l-lg rounded-r-none' disabled={isEmpty(sections)}>
              <List className='size-[1.2rem]' />
              章節
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {map(sections, (section, index) => {
              return (
                <DropdownMenuItem key={index} asChild>
                  <a
                    data-hash={section.hash}
                    onClick={scrollToSection}
                  >
                    <Hash className='size-[1.2rem]' />
                    {section.label}
                  </a>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant='outline' className='rounded-none border-x-background' onClick={sharePost} disabled={!isShareSupported}>
          <Share className='size-[1.2rem]' />
          分享
        </Button>
        <Button variant='outline' className='rounded-l-none rounded-r-lg' onClick={scrollToTop}>
          <ArrowUpToLine className='size-[1.2rem]' />
          置頂
        </Button>
      </div>
    </div>
  )
}

export default ArticleActions
