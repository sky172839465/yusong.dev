import SearchForm from './Form'
import SearchResult from './Result'

const Demo = () => {
  return (
    <div className='m-auto w-full space-y-2 md:max-w-2xl lg:max-w-3xl'>
      <div className='prose prose-lg max-w-none text-foreground dark:prose-invert'>
        <SearchForm />
        <SearchResult />
      </div>
    </div>
  )
}

export default Demo