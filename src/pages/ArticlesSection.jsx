import { orderBy, random, times } from 'lodash-es'

import { useArticles } from '@/apis/useArticles'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'
import useI18N, { LANG } from '@/hooks/useI18N'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

const i18nMapping = {
  [LANG.EN]: {
    NEW_ARTICLES: 'New articles'
  },
  [LANG.ZH_TW]: {
    NEW_ARTICLES: '新文章'
  }
}

export default function ArticlesSection() {
  const { label, lang } = useI18N(i18nMapping)
  const { isLoading, data: articles } = useArticles({ type: 'article', lang }, { keepPreviousData: false })

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
              viewTransition={index === 0}
              isContentExist
              isArticle
            />
          )
        })}
        {!isLoading && orderBy(articles, 'data.modifiedAt', 'desc').slice(0, 6).map((article) => {
          const { path } = article
          return (
            <SectionCard
              key={path}
              article={article}
              imageSizes='
                (max-width: 640px) calc(100dvw-2rem),
                (max-width: 768px) 608px,
                (max-width: 1024px) 354px,
                (max-width: 1280px) 313px,
                (max-width: 1536px) 398px,
                484px
              '
               viewTransition={index === 0}
              isArticle
            />
          )
        })}
      </div>
    </section>
  )
}
