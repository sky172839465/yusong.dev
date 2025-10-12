import { orderBy, random, times } from 'lodash-es'
import { Link } from 'react-router-dom'

import { useArticles } from '@/apis/useArticles'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'
import { Button } from '@/components/ui/button'
import useI18N, { LANG } from '@/hooks/useI18N'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

const i18nMapping = {
  [LANG.EN]: {
    NEW_ARTICLES: 'New articles',
    MORE: 'Read more'
  },
  [LANG.ZH_TW]: {
    NEW_ARTICLES: '新文章',
    MORE: '看更多'
  }
}

export default function ArticlesSection() {
  const { label, lang, isZhTw } = useI18N(i18nMapping)
  const { isLoading, data: articles } = useArticles({ type: 'article', lang }, { keepPreviousData: false })

  return (
    <section id='articles'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-foreground text-3xl font-bold'>
          {label.NEW_ARTICLES}
        </h2>
        <Link
          to={`/${isZhTw ? '' : `${lang}/`}search?type=article`}
          viewTransition
        >
          <Button type='button'>
            {label.MORE}
          </Button>
        </Link>
      </div>
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
              isArticle
            />
          )
        })}
      </div>
    </section>
  )
}
