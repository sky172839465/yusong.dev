import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'


const DEFAULT_DATA = {
  title: 'YUSONG.TW',
  description: 'This is Yusong\'s blog'
}

const Meta = (props) => {
  const { fetchMetaData } = props
  const { pathname } = useLocation()
  const { isLoading, data = DEFAULT_DATA } = useSWR(pathname, fetchMetaData)
  if (isLoading) {
    return null
  }

  const { title, description } = data
  return (
    <Helmet>
      <title>
        {title}
      </title>
      <meta name='description' content={description} />
      <meta property='og:type' content='article' />
      <meta property='og:url' content={window.location.href} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
    </Helmet>
  )
}

export default Meta