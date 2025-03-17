import { useSearchParams } from 'react-router-dom'

import { useArticles } from '@/apis/useArticles'

import { FIELD } from './Form'

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const { isLoading, data } = useArticles(searchParams.get(FIELD.TITLE))
  console.log(isLoading, data)
  return (
    <div>
      SearchResult
    </div>
  )
}

export default SearchResult