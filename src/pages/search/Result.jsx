import { filter, get, includes, isEmpty, random, times } from 'lodash-es'
import { useMemo } from 'react'

import { useArticles } from '@/apis/useArticles'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'
import useOmitQueryStringObject from '@/hooks/useOmitQueryStringObject'

import { FIELD } from './Form'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

const getFilterData = (qsObj = {}) => {
  if (isEmpty(qsObj)) {
    return
  }

  const filterData = (articles) => filter(articles, (article) => {
    const isAllMatch = ![FIELD.TITLE, FIELD.DESCRIPTION, FIELD.TAGS].map((field) => {
      const queryValue = get(qsObj, field)
      if (isEmpty(queryValue)) {
        return true
      }

      const articleValue = get(article, `data.${field}`)
      return includes(articleValue, queryValue)
    }).some((match) => !match)
    return isAllMatch
  })

  return filterData
}

const SearchResult = () => {
  const qsObj = useOmitQueryStringObject()
  const filterData = useMemo(() => getFilterData(qsObj), [qsObj])
  const { isLoading, data: articles = [] } = useArticles(null, {}, filterData)
  return (
    <div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
        {!isLoading && articles.map((article) => {
          const { path } = article
          return (
            <SectionCard
              key={path}
              article={article}
              isArticle
            />
          )
        })}
      </div>
    </div>
  )
}

export default SearchResult