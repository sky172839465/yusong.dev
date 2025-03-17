import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import SearchForm from './Form'
import SearchResult from './Result'

const updateQueryString = (qsObj) => {
  const params = new URLSearchParams(window.location.search)
  const search = params.toString()
  const newUrl = `${window.location.pathname}${qsObj ? `?${search}` : ''}`
  window.history.pushState({}, '', newUrl)
  return search
}

const Demo = () => {
  const { search } = useLocation()
  const [searchParams, setSearchParams] = useState(search)
  
  const onChange = (qsObj) => {
    const nextSearch = updateQueryString(qsObj)
    setSearchParams(nextSearch)
  }
  
  return (
    <div className='m-auto w-full space-y-2 md:max-w-2xl lg:max-w-3xl'>
      <div className='space-y-6'>
        <SearchForm onChange={onChange} />
        <SearchResult searchParams={searchParams} />
      </div>
    </div>
  )
}

export default Demo