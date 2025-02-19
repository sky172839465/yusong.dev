import { orderBy, random, times } from 'lodash-es'
import { useLocation } from 'react-router-dom'

import { useArticles } from '@/apis/useArticles'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

const LABEL = {
  en: {
    NEW_ARTICLES: 'New articles'
  },
  'zh-tw': {
    NEW_ARTICLES: '新文章'
  }
}

export default function ArticlesSection() {
  const { pathname } = useLocation()
  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'zh-tw'
  const label = LABEL[lang]
  const { isLoading, data: articles } = useArticles({ type: 'article' })

  return (
    <section id='articles'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        {label.NEW_ARTICLES}
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && RANDOM.ARTICLES.map((index) => {
          const data = {
            title: 'skeleton title'.repeat(RANDOM.ARTICLE_TITLE),
            description: 'skeleton description'.repeat(RANDOM.ARTICLE_DESC)
          }
          return (
            <SkeletonSectionCard
              key={index}
              article={{ data }}
              isContentExist
            />
          )
        })}
        {!isLoading && orderBy(articles, 'data.modifiedAt', 'desc').slice(0, 6).map((article) => {
          const { path } = article
          return (
            <SectionCard
              key={path}
              article={article}
            />
          )
        })}
      </div>
    </section>
  )
}
