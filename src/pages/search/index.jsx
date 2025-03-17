import { useLocation } from 'react-router-dom'

import SearchForm from './Form'
import SearchResult from './Result'

const Demo = () => {
  const { search } = useLocation()
  return (
    <div className='m-auto w-full space-y-2 md:max-w-2xl lg:max-w-3xl'>
      <div className='space-y-6'>
        <SearchForm />
        <SearchResult key={search} />
      </div>
    </div>
  )
}

export default Demo