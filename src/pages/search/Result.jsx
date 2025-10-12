import { every, filter, get, includes, isEmpty, random, split, times } from 'lodash-es'
import { useMemo } from 'react'

import { useRoutes } from '@/apis/useRoutes'
import SectionCard from '@/components/SectionCard'
import SkeletonSectionCard from '@/components/SkeletonSectionCard'
import getOmitQueryStringObject from '@/utils/getOmitQueryStringObject'

import { FIELD } from './constants'

const RANDOM = {
  ARTICLES: times(6),
  ARTICLE_TITLE: random(1, 3),
  ARTICLE_DESC: random(1, 5)
}

const getFilterData = (qsObj = {}) => {
  if (isEmpty(qsObj)) {
    return
  }

  const filterData = (articles) => {
    return filter(articles, (article) => {
      const isAllMatch = ![FIELD.TITLE, FIELD.DESCRIPTION, FIELD.TAGS].map((field) => {
        const queryValue = get(qsObj, field, '')
        if (isEmpty(queryValue)) {
          return true
        }
  
        const articleValue = get(article, `data.${field}`)
        if (field === FIELD.TAGS) {
          const tags = split(queryValue, ',')
          return every(tags, (tag) => {
            return includes(articleValue, tag)
          })
        }
        return includes(articleValue, queryValue)
      }).some((match) => !match)
      return isAllMatch
    })
  }

  return filterData
}

const ALL_PAGE_TYPE = 'all'
const ARTICLE_PAGE_TYPE = 'article'

const getValidType = (type) => {
  const isValid = [
    'all',
    'article',
    'series',
    'website'
  ].includes(type)
  if (!isValid) {
    return 'article'
  }

  return type
}

const SearchResult = (props) => {
  const { searchParams = '' } = props
  const { [FIELD.TYPE]: type = ARTICLE_PAGE_TYPE, ...qsObj } = getOmitQueryStringObject(searchParams)
  const filterData = useMemo(() => getFilterData(qsObj), [qsObj])
  const validType = getValidType(type)
  const isAllPageType = validType === ALL_PAGE_TYPE
  const { isLoading, data: routes = [] } = useRoutes(isAllPageType ? null : { type: validType }, {}, filterData)
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
        {!isLoading && routes.map((route, index) => {
          const { path, type } = route
          return (
            <SectionCard
              key={path}
              article={route}
              viewTransition={index === 0}
              isArticle={type === 'article'}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SearchResult
